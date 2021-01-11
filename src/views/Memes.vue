<template>
  <Waterfall :data="MemesData">
    <template #item="props">
      <img
        style="width: 100%; margin: 2px"
        src="@/assets/image/lazyload.png"
        v-lazy="getUrl(props.item.path)"
      />
    </template>
  </Waterfall>
</template>

<script lang="ts">
import Setting from '@/../setting/setting.json'
import Memes from '@/../setting/memes.json'
import Waterfall from '@/components/common/Waterfall.vue'

const MEMES_CDN = Setting['memesCDN']

export default {
  components: {
    Waterfall
  },
  setup() {
    const getUrl = (path: string) => {
      return process.env.NODE_ENV === 'production' && MEMES_CDN
        ? `${MEMES_CDN}/${path}`
        : `/memes/${path}`
    }

    const MemesData = Memes
    MemesData.sort(() => {
      return 0.5 - Math.random()
    })
    return {
      MemesData,
      getUrl
    }
  }
}
</script>

<style lang="stylus" scoped></style>
