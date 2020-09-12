declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

interface Window {
  dataLayer: any
  MediaMetadata: any
}

interface Navigator {
  mediaSession: any
}
