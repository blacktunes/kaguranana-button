<template>
  <div id="app">
    <v-header />
    <router-view style="min-height: calc(100vh - 67px - 48px)"/>
    <control v-if="showControl"/>
    <v-footer />
  </div>
</template>

<script>
import VHeader from './views/Header'
import Control from './views/Control'
import VFooter from './views/Footer'
import { other } from '../public/translate/locales'
import { provide, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  components: {
    VHeader,
    Control,
    VFooter
  },
  setup () {
    const route = useRoute()

    // 播放状态
    const setting = reactive({
      loading: true,
      error: false,
      nowPlay: null,
      overlap: false,
      autoRandom: false,
      loop: false
    })

    provide('setting', setting)

    const searchData = reactive({
      value: '',
      list: [],
      index: 0
    })
    provide('searchData', searchData)

    const isShowSearch = ref(false)
    provide('isShowSearch', isShowSearch)

    console.log(`%c${other.consoleTip}%c `, `font-size:20px;color:${other.consoleTipColor}`, `padding-right:${other.consoleImgWidth};padding-top:${other.consoleImgHeight};background:url('${location.origin}/image/${other.consoleImg}') no-repeat;background-size:100% 100%`)

    const showControl = ref(false)

    watch(route, () => {
      if (route.path === '/') {
        showControl.value = true
      } else {
        showControl.value = false
      }
    })

    return {
      showControl
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/base.styl'

body
  margin 0
  -webkit-tap-highlight-color rgba(0, 0, 0, 0)

a
  margin-left 5px
  color #888
  text-decoration none

::-webkit-scrollbar
  width 7px
  height 7px

::-webkit-scrollbar-track
  box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)
  -webkit-box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)
  background-color $main-color

::-webkit-scrollbar-thumb
  box-shadow inset 0 0 6px rgba(0, 0, 0, .1)
  -webkit-box-shadow inset 0 0 6px rgba(0, 0, 0, .1)
  background-color $sub-color

::-webkit-scrollbar-thumb:active
  background-color $main-color
</style>
