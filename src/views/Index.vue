<template>
  <div class="index">
    <voice />
    <card>
      <div style="text-align: center">{{ t('voiceTotalTip') }}: {{ t('voiceTotal') }}</div>
    </card>
    <card style="display: flex;justify-content: center">
      <a href="https://vtbbtn.org/" target="_blank">{{ t('vtbbtn') }}</a>/<router-link to="/search">表情包搜索</router-link>
    </card>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

import Voice from '../components/Voice'
import Card from '../components/common/Card'

export default {
  components: {
    Voice,
    Card
  },
  setup () {
    const { t } = useI18n()

    return {
      t
    }
  }
}
</script>

<style lang="stylus" scoped>
a
  margin 0 5px

.index
  margin 0 auto
  width 90%

@media only screen and (max-width: 600px)
  .index
    width 95%
</style>
