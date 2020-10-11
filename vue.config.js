let pwa = {}
try {
  pwa = require('./public/setting/pwa')
} catch {
  console.log('没有找到PWA设置')
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  pwa: pwa,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        import: [path.join(__dirname, './public/setting/color.styl')]
      }
    }
  }
}
