<template>
  <transition name="fade" appear>
    <div class="waterfall">
      <div v-for="(col, index) in list" :key="index" class="col" :ref="el => { if (el) refList[index] = el }">
        <transition-group name="fade">
          <div class="item" v-for="(item, key) in col" :key="'item' + key">
            <slot :item="item" name="item"></slot>
          </div>
        </transition-group>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { ref, reactive, watch, nextTick, computed, onUnmounted } from 'vue'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 200
    }
  },
  setup (props) {
    const refList: any[] = reactive([])
    const list: any[] = reactive([])
    const line = ref(0)

    const waterfallInit = () => {
      line.value = Math.floor(document.documentElement.clientWidth / props.width) || 1
      list.length = 0
      for (let i = 0; i < line.value; i++) {
        list.push([])
      }
      let temp = 0
      props.data.forEach(item => {
        list[temp].push(item)
        temp++
        if (temp === line.value) {
          temp = 0
        }
      })
      nextTick(() => {
        refList.forEach(item => {
          item.style.flex = `0 0 ${1 / line.value * 100}%`
        })
      })
    }

    const dataTemp = computed(() => JSON.parse(JSON.stringify(props.data)))

    watch(dataTemp, () => {
      waterfallInit()
    })

    waterfallInit()
    window.addEventListener('resize', waterfallInit)

    onUnmounted(() => {
      window.removeEventListener('resize', waterfallInit)
    })

    return {
      refList,
      list,
      line
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.waterfall
  display flex
  flex-wrap wrap
  .col
    overflow hidden
    .item
      overflow hidden
      margin 0
</style>
