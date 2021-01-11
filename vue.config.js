/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

module.exports = {
  pwa: {
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
      exclude: [/\.(?:*)$/]
    },
    iconPaths: {
      favicon32: null,
      favicon16: null,
      appleTouchIcon: null,
      maskIcon: null,
      msTileImage: null
    }
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        import: [path.join(__dirname, './src/setting/color.styl')]
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.info']
    }
    return {
      plugins: process.env.NODE_ENV === 'production' ? [] : [
        new BundleAnalyzerPlugin({
          generateStatsFile: false
        }),
        new SimpleProgressWebpackPlugin()
      ],
      performance: {
        hints: false
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial' // 只打包初始时依赖的第三方
            },
            corejs: {
              name: 'chunk-corejs', // 单独将 core-js 拆包
              priority: 15,
              test: /[\\/]node_modules[\\/]core-js[\\/]/
            }
          }
        }
      }
    }
  }
}
