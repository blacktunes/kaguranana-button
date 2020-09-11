<template>
  <div id="app">
    <v-header />
    <router-view />
    <control v-if="showControl"/>
    <v-footer />
  </div>
</template>

<script>
import { provide, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ConsoleData from '../public/other/data.json'
import VHeader from './views/Header'
import Control from './views/Control'
import VFooter from './views/Footer'

export default {
  components: {
    VHeader,
    Control,
    VFooter
  },
  setup () {
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

    // 搜索状态
    const searchData = reactive({
      value: '',
      list: [],
      index: 0
    })
    provide('searchData', searchData)

    // 窄屏状态下是否显示搜索栏
    const isShowSearch = ref(false)
    provide('isShowSearch', isShowSearch)

    // 是否显示控制栏
    const route = useRoute()
    const showControl = ref(false)
    watch(route, () => {
      if (route.path === '/') {
        showControl.value = true
      } else {
        showControl.value = false
      }
    })

    console.log(`%c${ConsoleData.consoleTip}%c `, `font-size:20px;color:${ConsoleData.consoleTipColor}`, `padding-right:${ConsoleData.consoleImgWidth};padding-top:${ConsoleData.consoleImgHeight};background:url('${location.origin}/other/${ConsoleData.consoleImg}') no-repeat;background-size:100% 100%`)

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
