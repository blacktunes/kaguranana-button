/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')

let pwa = {}
try {
  pwa = require('./src/setting/pwa')
} catch {
  console.warn('没有找到PWA设置')
}

let style = []
const styleURL = path.join(__dirname, './src/setting/color.styl')
if (fs.existsSync(styleURL)) {
  style = [styleURL]
} else {
  console.warn('没有找到stylus全局变量')
}

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

module.exports = {
  pwa: pwa,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        import: style
      }
    }
  },
  configureWebpack: () => {
    return {
      performance: {
        hints: false
      },
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode: process.env.NODE_ENV === 'production'
            ? 'static'
            : 'server',
          openAnalyzer: process.env.NODE_ENV !== 'production',
          generateStatsFile: false
        }),
        new SimpleProgressWebpackPlugin()
      ],
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
