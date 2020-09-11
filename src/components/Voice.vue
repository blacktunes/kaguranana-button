/* eslint-disable no-labels */
<template>
  <transition name="fade" appear>
    <div>
      <card class="search-wrapper" :class="{'show-search': isShowSearch}">
        <search class="search" />
      </card>
      <div v-for="item in voices" :key="item.categoryName">
        <card v-if="_needToShow(item.translate)">
          <template v-slot:header>
            <div class="category">{{ t('voicecategory.' + item.name) }}</div>
          </template>
          <div class="content">
            <div v-for="voice in item.voiceList" :key="voice.name">
              <div v-if="_needToShow(voice.translate)" class="btn-wrapper">
                <v-btn :text="t('voice.' + voice.name)"
                       class="v-btn"
                       :class="{ 'search-list': searchList.length > 0 && !searchList.includes(voice.name), 'highlight': highlight === voice.name }"
                       :name="voice.name"
                       @click="play(voice, item.name)"
                       :ref="el => { if (el) btnList[voice.name] = el }" />
                <img class="pic" v-if="_needUsePicture(voice.usePicture)" :src="usePicture(item.name, voice.usePicture)">
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, reactive, provide, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gtag } from '../assets/js/gtag'
import mitt from '../assets/js/mitt'
import VoiceList from '../../public/translate/voices.json'
import MediaData from '../../public/other/data.json'
import Card from './common/Card'
import VBtn from './common/VoiveBtn'
import Search from '../components/Search'

export default {
  components: {
    Card,
    VBtn,
    Search
  },
  setup () {
    const { t, locale } = useI18n()

    // 判断浏览器是否为夸克从而停用部分功能
    const isQuark = navigator.userAgent.toLowerCase().includes('quark')

    const setting = inject('setting')

    const isShowSearch = inject('isShowSearch')

    // 所有按钮的引用
    const btnList = ref({})

    const searchData = inject('searchData')
    const highlight = ref('')

    mitt.on('autoScroll', () => {
      if (searchData.list && searchData.list.length > 0) {
        for (const i in btnList.value) {
          if (searchData.index + 1 > searchData.list.length) searchData.index = 0
          if (i === searchData.list[searchData.index]) {
            searchData.index++
            const scrollPos = document.documentElement.scrollTop + btnList.value[i].$el.getBoundingClientRect().top - 200
            highlight.value = i
            window.scrollTo({ top: scrollPos, behavior: 'smooth' })
            break
          }
        }
      }
    })

    watch(() => {
      return searchData.value
    }, () => {
      highlight.value = ''
    })

    const voices = reactive([])
    VoiceList.category.forEach(category => {
      const temp = { ...category, voiceList: [] }
      VoiceList.voices.forEach(voice => {
        if (voice.category === category.name) {
          temp.voiceList.push(voice)
        }
      })
      voices.push(temp)
    })
    provide('data', voices)

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        randomPlay()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        randomPlay()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        if (playerList.has('once')) playerList.get('once').audio.pause()
        navigator.mediaSession.playbackState = 'paused'
      })
    }

    let timer = null

    const reset = () => {
      setting.loading = true
      setting.nowPlay = null
      setting.error = false
    }

    const playerList = new Map()

    const play = (data, category) => {
      // GA的事件上报
      if (process.env.NODE_ENV === 'production') {
        gtag('event', '播放语音', {
          event_category: data.name,
          event_label: category,
          value: 1
        })
      }
      if (!setting.overlap) {
        if (playerList.has('once')) playerList.get('once').audio.pause()
        if (setting.nowPlay && setting.nowPlay.name === data.name) {
          clearTimeout(timer)
          playerList.get('once').audio.currentTime = 0
          playerList.get('once').audio.pause()
          timer = setTimeout(() => {
            playerList.get('once').audio.play()
          }, 250)
        } else {
          addPlayer(data, category, 'once')

          if ('mediaSession' in navigator) {
            const meta = {
              title: t('voice.' + data.name),
              artist: t('info.fullName'),
              album: t('info.title'),
              artwork: [{ src: `/other/${MediaData.artwork}`, sizes: '128x128' }]
            }
            navigator.mediaSession.metadata = new window.MediaMetadata(meta)
            navigator.mediaSession.playbackState = 'playing'
          }
        }
      } else {
        const key = new Date().getTime()
        addPlayer(data, category, key)
      }
    }

    const addPlayer = (data, category, key) => {
      reset()
      playerList.set(key, {
        name: data.name,
        audio: new Audio(`voices/${category}/${data.path}`)
      })
      if (!setting.overlap) setting.nowPlay = data
      playerList.get(key).audio.play()
      playerList.get(key).audio.onerror = () => {
        setting.loading = false
        setting.error = true
      }
      playerList.get(key).audio.oncanplay = () => {
        if (setting.overlap) {
          for (const i of playerList.keys()) {
            if (playerList.get(i).name === data.name) {
              playerList.get(i).audio.ontimeupdate = null
              playerList.get(i).audio.onended = () => {
                playerList.get(i).audio = null
                playerList.delete(i)
              }
            }
          }
        }
        setting.loading = false
        // eslint-disable-next-line no-labels
        voices:
        for (const i in voices) {
          for (const j in voices[i].voiceList) {
            if (voices[i].voiceList[j].name === data.name) {
              playerList.get(key).voicesKey = [i, j]
              const duration = playerList.get(key).audio.duration
              let currentTime = 0
              playerList.get(key).audio.ontimeupdate = () => {
                currentTime = Number(((playerList.get(key).audio.currentTime / duration) * 100).toFixed(0))
                if (isQuark) {
                  if (currentTime !== 0) {
                    voices[i].voiceList[j].progress = 100
                  } else {
                    voices[i].voiceList[j].progress = 0
                  }
                } else {
                  voices[i].voiceList[j].progress = currentTime
                }
              }
              playerList.get(key).audio.onended = () => {
                voices[i].voiceList[j].progress = 0
                if (setting.loop) {
                  play(data, category)
                } else {
                  reset()
                  playerList.delete(key)
                }
                if (setting.autoRandom) {
                  randomPlay()
                }
              }
              // eslint-disable-next-line no-labels
              break voices
            }
          }
        }
      }
    }

    mitt.on('randomPlay', () => {
      randomPlay()
    })

    let errTimes = 0

    const randomPlay = () => {
      const randomList = voices[_getrRandomInt(voices.length - 1)]
      const randomVoice = randomList.voiceList[_getrRandomInt(randomList.voiceList.length - 1)]
      if (_needToShow(randomList.translate) && _needToShow(randomVoice.translate)) {
        errTimes = 0
        play(randomVoice, randomList.name)
      } else if (errTimes >= 5) {
        // 连续五次不存在停止随机
      } else {
        ++errTimes
        randomPlay()
      }
    }

    mitt.on('stopPlay', () => {
      clearTimeout(timer)
      for (const key of playerList.keys()) {
        playerList.get(key).audio.pause()
        playerList.get(key).audio.onerror = null
        playerList.get(key).audio.oncanplay = null
        playerList.get(key).audio.ontimeupdate = null
        playerList.get(key).audio.onended = null
        const voicesKey = playerList.get(key).voicesKey
        voices[voicesKey[0]].voiceList[voicesKey[1]].progress = 0
      }
      playerList.clear()
      reset()
    })

    const usePicture = (categoryName, name) => {
      const lang = locale.value
      return `/voices/${categoryName}/${name[lang]}`
    }

    const _needUsePicture = (usePicture) => {
      if (usePicture) {
        const lang = locale.value
        return lang in usePicture
      } else {
        return false
      }
    }

    const _getrRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max))
    }

    const _needToShow = (description) => {
      const lang = locale.value
      return lang in description
    }

    return {
      t,
      isShowSearch,
      btnList,
      searchList: searchData.list,
      highlight,
      voices,
      play,
      usePicture,
      _needUsePicture,
      _needToShow
    }
  }
}

</script>
<style lang="stylus" scoped>
@import '~@/assets/style/base.styl'

.search-wrapper
    // box-sizing border-box
    z-index 1
    position sticky
    top 58px
    height 0
    opacity 0
    margin-top 0
    margin-bottom 0
    transition all 0.3s
    background #fff
    .search
      width 90%
      margin auto

.show-search
  height 60px
  opacity 1
  margin-top 10px

.search-list
  background #ccc
.highlight
  background $active-color

.category
  font-size 24px
  padding 14px 10px
  user-select none
.content
  display flex
  flex-wrap wrap
  .btn-wrapper
    position relative
    margin 5px
    .v-btn
      transition background 0.2s
    .pic
      position absolute
      bottom calc(100% + 10px)
      left 50%
      width 120%
      min-width 100px
      max-width 200px
      opacity 0
      transform translateX(-50%)
      pointer-events none

@media only screen and (min-width: 600px)
  .btn-wrapper
    .pic
      transition opacity 0.5s
    &:hover
      .pic
        opacity 1
        box-shadow 0px 5px 10px 0px $main-color

@media only screen and (max-width: 600px)
  .btn-wrapper
    .pic
      transition opacity 0.5s
      transition-delay 1.5s
    &:active
      .pic
        opacity 1
        transition opacity 0s
        transition-delay 0s

@media only screen and (min-width: 550px)
  .search-wrapper
    height 0
    opacity 0
    margin-top 0
    margin-bottom 0
</style>
