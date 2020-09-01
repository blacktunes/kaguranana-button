<template>
  <div class="search-wrapper">
    <div class="search">
      <img v-show="searchList.length === 0" src="../assets/image/logo.jpg">
      <div class="input">
        <input type="text" v-model="value" @keyup.enter="search">
        <button @click="search">DD一下</button>
      </div>
    </div>
    <div>
      <div v-if="searchList.length > 0">
        <hr>
        <div style="text-align: center">结果数：{{searchList.length}}</div>
        <hr>
        <table>
          <tr>
            <th>author</th>
            <th>zh-CN</th>
            <th>ja-JP</th>
            <th></th>
          </tr>
          <template v-for="(item, key) in searchList" :key="key">
            <tr>
              <td>{{item.author}}</td>
              <td>{{item.name['zh-CN'] ? item.name['zh-CN'] : '-'}}</td>
              <td>{{item.name['ja-JP'] ? item.name['ja-JP'] : '-'}}</td>
              <td>
                <button @click="dlVoice(item.url)">下载</button>
              </td>
            </tr>
          </template>
        </table>
      </div>
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
        name: {
          'zh-CN': item.translate['zh-CN'],
          'ja-JP': item.translate['ja-JP']
        },
        url: `${location.origin}/voices/${item.category}/${item.path}`
      })
    })

    const value = ref('')
    const searchList = reactive([])

    const search = () => {
      searchList.length = 0
      if (value.value.length < 1) return
      data.forEach(item => {
        const reg = new RegExp(value.value, 'gi')
        if (reg.test(item.author) || reg.test(item.name['zh-CN']) || reg.test(item.name['ja-JP'])) {
          searchList.push(item)
        }
      })
    }

    const dlVoice = (url) => {
      var eleLink = document.createElement('a')
      eleLink.download = ''
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
.search-wrapper
  min-height calc(100vh - 67px - 48px - 10px)
  margin 5px 10px
  .search
    display flex
    flex-direction column
    align-items center
    justify-content center
    img
      margin-top 10px
      width 15%
      min-width 100px
    .input
      display flex
      align-items center
      justify-content center
      margin 20px 0
      width 100%
      input
        box-sizing border-box
        height 30px
        width 50%
        border-radius 10px 0 0 10px
        padding 0 15px
        border-width 1px
        &:focus
          outline none
      button
        height 30px
        border-radius 0 10px 10px 0
        border-width 1px
        border-left none
        &:focus
          outline none
  table
    width 100%
    th
      padding 5px
    td
      text-align center
</style>
