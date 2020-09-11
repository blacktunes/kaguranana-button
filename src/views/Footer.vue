<template>
<transition name="fade" appear>
  <div class="footer">
    <div>
      <div class="author">
        <div>©2020</div>
        <a href="https://github.com/blacktunes" target="_blank">Blacktunes</a>
        <a> & 辣辣七奈军</a>
      </div>
      <div class="info">
        <div>对于按钮有什么建议欢迎加入按钮反馈群:<a href="https://jq.qq.com/?_wv=1027&k=HIjrzGAJ">589314972</a></div>
        <div>适合语音按钮的表情包募集中！</div>
      </div>
    </div>
    <div class="text-right">
      <div class="git">
        <i-btn class="btn" :url="githubUrl" :img="require('../assets/image/github-fill.png')" />
        <a :href="githubUrl" target="_blank">
          {{t("info.toGithub")}}
        </a>
      </div>
      <div>{{t("info.notOfficial")}}</div>
    </div>
  </div>
</transition>
</template>

<script>
import { useI18n } from 'vue-i18n'
import IBtn from '../components/common/IconBtn'

export default {
  components: {
    IBtn
  },
  setup () {
    const { t } = useI18n()
    const githubUrl = 'https://github.com/blacktunes/kaguranana-button'

    return {
      t,
      githubUrl
    }
  }
}
</script>

<style lang="stylus" scoped>
.footer
  display flex
  justify-content space-between
  flex-wrap wrap
  padding 5px
  background-color #ebebeb
  font-size 12px
  color #333
  .author
    display flex
    align-items center
  .info
    margin-top 5px
    line-height 18px
  .text-right
    text-align right
    .git
      display flex
      align-items center
      a
        margin 0
      .btn
        margin 0 5px

@media only screen and (max-width: 600px)
  .footer
    flex-direction column
    .text-right
      text-align left
      .git
        display flex
        align-items center
        .btn
          order 10
</style>
