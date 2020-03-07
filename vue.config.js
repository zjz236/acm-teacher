module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    proxy: {
      '/oj': {
        target: 'http://127.0.0.1:7001/',
        changeOrigin: true,
        pathRewrite: {'/oj/': '/'}
      }
    }
  }
}
