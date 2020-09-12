<template>
<transition name="fade" appear>
  <div class="search-wrapper">
    <div class="search">
      <transition name="logo">
        <div v-if="!showList" class="logo" @click="showAll">
          <img :src="require('../../public/memes/' + path)">
          <div>×{{length}}</div>
        </div>
      </transition>
      <div class="input">
        <input type="text" v-model="value" @keyup.enter="search">
        <div class="clear">
          <transition name="fade">
            <svg @click="clear" style="cursor: pointer" t="1599129457149" v-if="value || showList" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7557" width="15" height="30"><path d="M510.4 67.2c-246.6 0-446.5 199.9-446.5 446.5s199.9 446.5 446.5 446.5 446.5-199.9 446.5-446.5S757 67.2 510.4 67.2z m223.9 670.5c-24.1 24.1-63.5 24.1-87.6 0L510.4 601.4 374 737.7c-24.1 24.1-63.5 24.1-87.6 0-24.1-24.1-24.1-63.5 0-87.6l136.3-136.3-136.3-136.4c-24.1-24.1-24.1-63.5 0-87.6 24.1-24.1 63.5-24.1 87.6 0l136.3 136.3 136.3-136.3c24.1-24.1 63.5-24.1 87.6 0 24.1 24.1 24.1 63.5 0 87.6L598 513.7 734.3 650c24.1 24.1 24.1 63.6 0 87.7z" p-id="7558" fill="#dddddd"></path></svg>
          </transition>
        </div>
        <button class="search-btn" @click="search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>
    <div>
      <transition name="fade">
        <div v-if="showList">
          <hr>
          <div style="text-align: center">结果数：{{searchList.length}}</div>
          <hr>
          <waterfall :data="searchList">
            <template v-slot:item="props">
              <img style="width: 200px;margin: 2px" :src="require('../../public/memes/' + props.item.path)">
            </template>
          </waterfall>
        </div>
      </transition>
    </div>
  </div>
</transition>
</template>

<script lang="ts">
import { reactive, ref, Ref } from 'vue'
import MemesData from '@/../public/memes/data.json'
import Waterfall from '@/components/common/Waterfall.vue'

export default {
  components: {
    Waterfall
  },
  setup () {
    // 搜索文字
    const value = ref('')
    // 结果列表
    const searchList = reactive([])

    // 是否显示结果
    const showList = ref(false)

    const search = () => {
      searchList.length = 0
      if (value.value.length < 1) {
        showList.value = false
        return
      }
      MemesData.forEach(item => {
        const reg = new RegExp(value.value, 'i')
        if (item.name && reg.test(item.name)) {
          (searchList as any[]).push(item)
        }
      })
      showList.value = true
    }

    const clear = () => {
      value.value = ''
      searchList.length = 0
      showList.value = false
    }

    const showAll = () => {
      showList.value = true
      MemesData.forEach(item => {
        (searchList as any[]).push(item)
      })
    }

    // 随机标题图片
    const path: Ref<string> = ref(MemesData[Math.floor(Math.random() * Math.floor(MemesData.length - 1))].path)
    // 总图片数
    const length: number = MemesData.length

    return {
      value,
      searchList,
      search,
      showList,
      clear,
      showAll,
      path,
      length
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/base.styl'

.search-wrapper
  background-color #eee
  .search
    display flex
    flex-direction column
    align-items center
    justify-content center
    .logo
      overflow hidden
      display flex
      align-items center
      justify-content center
      height 100px
      max-width 50%
      margin-top 150px
      cursor pointer
      img
        height 100%
        margin auto
    .input
      display flex
      align-items center
      justify-content center
      margin 50px 0
      width 100%
      input
        box-sizing border-box
        font-size 20px
        height 50px
        width 60%
        border-radius 20px 0 0 20px
        padding 0 15px
        border 1px solid #ddd
        border-right none
        &:focus
          outline none
      .clear
        overflow hidden
        display flex
        align-items center
        justify-content center
        box-sizing border-box
        width 30px
        height 50px
        background #fff
        border 1px solid #ddd
        border-left none
        border-right none
        svg
          width 20px
      button
        background-color $main-color
        height 50px
        width 50px
        border-radius 0 20px 20px 0
        border-width 5px
        border $main-color
        border-left none
        cursor pointer
        &:focus
          outline none
        &:active
          background $active-color

.logo-enter-active
  animation logo 0.5s
.logo-leave-active
  animation logo-leave 0.5s

@keyframes logo
  0%
    height 0
    margin-top 0
    opacity 0
  100%
    height 100px
    margin-top 150px
    opacity 1

@keyframes logo-leave
  0%
    height 100px
    margin-top 150px
    opacity 1
  100%
    height 0
    margin-top 0
    opacity 0
</style>
