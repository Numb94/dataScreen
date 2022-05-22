const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 反向代理配置
    proxy: {
      '/api': {
        target: 'http://139.224.189.26:8844/',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/api': '' },
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process',
        Buffer: ['buffer', 'Buffer']
      })
    ]
  }
})
