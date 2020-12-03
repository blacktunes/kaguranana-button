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
import Memes from '@/setting/memes.json'
import Waterfall from '@/components/common/Waterfall.vue'

export default {
  components: {
    Waterfall
  },
  setup() {
    const getUrl = (path: string) => {
      return process.env.NODE_ENV === 'production'
        ? `https://cdn.jsdelivr.net/gh/blacktunes/kaguranana-button@master/public/memes/${path}`
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
