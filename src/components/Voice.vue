<template>
  <div>
    <div v-for="item in voices" :key="item.categoryName">
      <card v-if="_needToShow(item.categoryDescription)">
        <template v-slot:header>
          <div class="category">{{ $t("voicecategory." + item.categoryName) }}</div>
        </template>
        <div class="content">
          <div v-for="voice in item.voiceList" :key="voice.name">
            <v-btn v-if="_needToShow(voice.description)" :text="$t('voice.' + voice.name)" :playing="overlapShowList.includes(voice.name)" :duration="setting && setting.nowPlay && setting.nowPlay.name === voice.name ? duration : 0" @click="play(voice, item.categoryName)" />
          </div>
        </div>
      </card>
    </div>
    <audio ref="player" @ended="voiceEnd" @canplaythrough="canplaythrough" @error="error"></audio>
  </div>
</template>

<script>
import { reactive, inject, ref, getCurrentInstance } from 'vue'
import VoiceList from '../../public/translate/voices.json'
import Card from './common/Card'
import VBtn from './common/VoiveBtn'
import mitt from '../assets/js/mitt'

export default {
  components: {
    Card,
    VBtn
  },
  setup () {
    const { ctx } = getCurrentInstance()

    const setting = inject('setting')

    const voices = VoiceList.voices
    const overlapPlayList = {}
    const overlapShowList = reactive([])

    const player = ref(null)

    let timer = null

    const reset = () => {
      setting.loading = true
      setting.nowPlay = null
      duration.value = 0
      setting.error = false
    }

    const play = (data, category) => {
      if (!setting.overlap) {
        player.value.pause()
        if (setting.nowPlay && setting.nowPlay.name === data.name) {
          duration.value = 0
          timer = setTimeout(() => {
            player.value.currentTime = 0
          }, 300)
        } else {
          reset()
          player.value.src = `voices/${category}/${data.path}`
          setting.nowPlay = data
        }
      } else {
        const key = new Date().getTime()
        overlapShowList.push(data.name)
        overlapPlayList[key] = new Audio('voices/' + data.path)
        overlapPlayList[key].addEventListener('ended', () => {
          delete overlapPlayList[key]
          if (overlapShowList.includes(data.name)) {
            overlapShowList.splice(overlapShowList.indexOf(data.name), 1)
          }
        }, {
          capture: false,
          passive: false,
          once: true
        })
        overlapPlayList[key].play()
      }
    }

    const duration = ref(0)

    const canplaythrough = (e) => {
      duration.value = e.target.duration
      setting.loading = false
      player.value.play()
    }

    const error = () => {
      setting.loading = false
      setting.error = true
    }

    const voiceEnd = () => {
      if (setting.loop) {
        play(setting.nowPlay)
        return
      }
      reset()
      if (setting.autoRandom) {
        randomPlay()
      }
    }

    mitt.on('randomPlay', () => {
      randomPlay()
    })

    const randomPlay = () => {
      const tempList = voices[_getrRandomInt(voices.length - 1)]
      play(tempList.voiceList[_getrRandomInt(tempList.voiceList.length - 1)], tempList.categoryName)
    }

    mitt.on('stopPlay', () => {
      for (const key in overlapPlayList) {
        overlapPlayList[key].pause()
        delete overlapPlayList[key]
      }
      overlapShowList.length = 0
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      reset()
      player.value.pause()
    })

    const _getrRandomInt = (max) => {
      return Math.floor(Math.random() * Math.floor(max))
    }

    const _needToShow = (description) => {
      const locale = ctx.$i18n.locale
      return description[locale] !== undefined
    }

    return {
      setting,
      player,
      overlapShowList,
      voices,
      play,
      canplaythrough,
      error,
      duration,
      voiceEnd,
      _needToShow
    }
  }
}

</script>
<style lang="stylus" scoped>
.category
  font-size 24px
  padding 14px 10px
.content
  display flex
  flex-wrap wrap
</style>
