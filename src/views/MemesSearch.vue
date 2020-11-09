<template>
  <transition name="fade" appear>
    <div class="search-wrapper">
      <search type="memes" />
      <transition name="fade">
        <card v-if="searchList.length > 0">
          <waterfall :data="searchList">
            <template v-slot:item="props">
              <img
                style="width: 100%;margin: 2px"
                :src="'/memes/' + props.item.path"
              />
            </template>
          </waterfall>
        </card>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { inject, onMounted, reactive } from 'vue'
import MemesData from '@/setting/memes.json'
import Waterfall from '@/components/common/Waterfall.vue'
import Search from '@/components/SearchCard.vue'
import Card from '@/components/common/Card.vue'
import mitt from '@/assets/script/mitt'
import { EVENT, MemeItem, SearchData } from '@/assets/script/option'
import router from '@/router'

export default {
  components: {
    Waterfall,
    Search,
    Card
  },
  setup() {
    if (MemesData.length < 1) {
      router.push('/')
    }
    // 结果列表
    const searchList: MemeItem[] = reactive([])

    const searchData: SearchData = inject('searchData') as SearchData

    mitt.on(EVENT.memesSearch, () => {
      if (searchData.value.length < 1) {
        getRandomMemes()
      } else {
        search()
      }
    })

    /**
     * 首次打开随机选择50张表情包显示，数据量增加后再启用
     */
    const getRandomMemes = () => {
      // const temp = MemesData
      // temp.sort(() => {
      //   return 0.5 - Math.random()
      // })
      // for (let i = 0; i < 50 && i < temp.length; i++) {
      //   (searchList as any[]).push(temp[i])
      // }
      search()
    }

    onMounted(() => {
      getRandomMemes()
    })

    const search = () => {
      searchList.length = 0
      MemesData.forEach(item => {
        const reg = new RegExp(searchData.value, 'i')
        if (item.name && reg.test(item.name)) {
          searchList.push(item)
        }
      })
    }

    return {
      searchList
    }
  }

}
</script>

<style lang="stylus" scoped>
.search-wrapper
  // background-color rgba(255, 255, 255, 0.5)
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
