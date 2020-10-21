module.exports = {
  themeColor: '#c4afd0',
  manifestOptions: {
    name: 'NANA BUTTON',
    // eslint-disable-next-line @typescript-eslint/camelcase
    short_name: 'NANA BUTTON',
    icons: [
      {
        src: '/img/icon.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ]
  },
  workboxOptions: {
    skipWaiting: true,
    exclude: [/\.(?:mp3|jpg|png|gif)$/],
    // include: [/\.(?:js|css|html|json|ico)$/],
    runtimeCaching: [
      {
        urlPattern: /\.(?:mp3)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'voice-cache',
          expiration: {
            // maxEntries: 10, // 缓存数量
            maxAgeSeconds: 60 * 60 * 24 * 7 // 缓存有效时长
          }
        }
      },
      {
        urlPattern: /\.(?:jpg|png|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            // maxEntries: 10, // 缓存数量
            maxAgeSeconds: 60 * 60 * 24 * 7 // 缓存有效时长
          }
        }
      }
    ]
  },
  iconPaths: {
    favicon32: null,
    favicon16: null,
    appleTouchIcon: null,
    maskIcon: null,
    msTileImage: null
  }
}
