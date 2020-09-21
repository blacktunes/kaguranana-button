/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const setting = require('./public/setting/setting.json')

module.exports = {
  pwa: setting.pwa || {},
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        import: [path.join(__dirname, './public/setting/color.styl')]
      }
    }
  }
}
