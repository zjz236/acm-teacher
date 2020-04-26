module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/admin/'
    : '/',
  devServer: {
    proxy: {
      '/oj': {
        target: 'https://zjz236.xyz:443/',
        changeOrigin: true,
        pathRewrite: {'/oj/': '/oj/'}
      }
    }
  }
}
