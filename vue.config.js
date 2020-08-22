module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/nanakagura-button/' : '/',
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  productionSourceMap: false
}
