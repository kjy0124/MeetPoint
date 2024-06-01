const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // outputDir: "../src/main/resource/static",
  devServer: {
    proxy: {
      '/map': {
        // /map로 들어오면 포트 8080(스프링 서버)로 보냄
        target: 'https://port-0-meetpoint-backend-1272llwvu36eh.sel5.cloudtype.app/',
        // pathRewrite:{'^/':''},
        changeOrigin: true // cross origin 허용
      },
      '/choice': {
        // /choice로 들어오면 포트 8080(스프링 서버)로 보냄
        target: 'https://port-0-meetpoint-backend-1272llwvu36eh.sel5.cloudtype.app/',
        changeOrigin: true // cross origin 허용
      }
    }
  },
  transpileDependencies: true,

})
