module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/scapi/' : '/',
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    https: true
  }
}