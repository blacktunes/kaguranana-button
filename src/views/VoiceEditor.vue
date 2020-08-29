<template>
  <div style="margin: 0 10px">
    <div class="header">
      <button @click="changeShow">切换至{{ !showCategory ? '分类' : '语音'}}</button>
      <button @click="add">增加{{ showCategory ? '分类' : '语音'}}</button>
      <button @click="dlJson">下载</button>
    </div>
    <div v-show="showCategory">
      <template v-for="item in data.category" :key="item.name">
        <div class="input">
          <div>name: </div>
          <input type="text" v-model="item.name">
        </div>
        <div class="input">
          <div>zh-CN: </div>
          <input type="text" v-model="item.translate['zh-CN']">
        </div>
        <div class="input">
          <div>ja-JP: </div>
          <input type="text" v-model="item.translate['ja-JP']">
        </div>
        <hr>
      </template>
    </div>
    <div v-show="!showCategory">
      <template v-for="item in data.voices" :key="item.name">
        <div class="input">
          <div>name: </div>
          <input type="text" v-model="item.name">
        </div>
        <div class="input">
          <div>path: </div>
          <input type="text" v-model="item.path">
        </div>
        <div class="input">
          <div>category: </div>
          <edit-select :name="item.name" :category="item.category"/>
        </div>
        <div class="input">
          <div>zh-CN: </div>
          <input type="text" v-model="item.translate['zh-CN']">
        </div>
        <div class="input">
          <div>ja-JP: </div>
          <input type="text" v-model="item.translate['ja-JP']">
        </div>
        <hr>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, provide } from 'vue'
import VoiceList from '../../public/translate/voices.json'
import EditSelect from '../components/EditSelect'

export default {
  components: {
    EditSelect
  },
  setup () {
    const data = ref(VoiceList)
    const showCategory = ref(true)

    provide('data', data)

    const changeShow = () => {
      showCategory.value = !showCategory.value
    }

    const add = () => {
      if (showCategory.value) {
        data.value.category.push({
          name: null,
          translate: {
            'zh-CN': null,
            'ja-JP': null
          }
        })
      } else {
        data.value.voices.push({
          name: null,
          path: null,
          translate: {
            'zh-CN': null,
            'ja-JP': null
          },
          category: null
        })
      }
    }

    const dlJson = () => {
      const jsonData = JSON.stringify(data.value)

      var eleLink = document.createElement('a')
      eleLink.download = 'voices.json'
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      var blob = new Blob([jsonData])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    }

    // setInterval(() => {
    //   console.log(data.value.voices[0])
    // }, 5000)

    return {
      data,
      showCategory,
      changeShow,
      add,
      dlJson
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  position fixed
  top 48px
  right 10px
  margin 10px 0
.input
  display flex
  align-items center
  height 30px
  line-height 30px
  div
    width 100px
    text-align center
</style>
