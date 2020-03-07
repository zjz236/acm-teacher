module.exports = {
  devServer: {
    proxy: {
      '/oj': {
        target: 'http://127.0.0.1:7001/',
        changeOrigin: true,
        pathRewrite: {'/oj/': '/' }
      }
    }
  }
}
