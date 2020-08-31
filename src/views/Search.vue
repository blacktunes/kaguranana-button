<template>
  <div class="search">
    <div>
      <input type="text" v-model="value" @keyup.enter="search"><button @click="search">DD一下</button>
    </div>
    <div>
      <div v-if="searchList.length > 0">
        <hr>
        <div>结果数：{{searchList.length}}</div>
      </div>
      <template v-for="(item, key) in searchList" :key="key">
        <hr>
        <div style="display: flex">
          <div class="item">author: {{item.author}}</div>
          <div class="item">title: {{item.title}}</div>
        </div>
          <button @click="dlVoice(item.name, item.url)">下载</button>
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import VoiceList from '../../public/translate/voices.json'

export default {
  setup () {
    const data = []

    VoiceList.voices.forEach(item => {
      data.push({
        author: '神乐七奈',
        title: item.name,
        name: item.path,
        url: `${location.origin}/voices/${item.category}/${item.path}`
      })
    })

    const value = ref('')
    const searchList = reactive([])

    const search = () => {
      searchList.length = 0
      data.forEach(item => {
        const reg = new RegExp(value.value, 'gi')
        if (reg.test(item.author) || reg.test(item.title)) {
          searchList.push(item)
        }
      })
    }

    const dlVoice = (name, url) => {
      var eleLink = document.createElement('a')
      eleLink.download = name
      eleLink.style.display = 'none'
      eleLink.href = url
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    }

    return {
      value,
      searchList,
      search,
      dlVoice
    }
  }

}
</script>

<style lang="stylus" scoped>
.search
  min-height calc(100vh - 67px - 48px - 10px)
  margin 5px 10px
  .item
    margin 2px 10px 5px 0
</style>
