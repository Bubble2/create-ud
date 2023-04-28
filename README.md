## create-ud

> 支持web3 app和普通app项目的脚手架


## 技术栈

- react
- react-router
- redux
- css modules
- wagmi
- token approve、token list、token balance、transaction notification、wallet connect... etc.
- 按需加载
- 热加载

## 使用


> `create-ud`脚手架使用方法

```
npx create-ud [应用名称]
```

### 启动项目开发环境

```
npm run dev
```


## 测试环境与生产环境打包

```bash
npm run build:test //测试环境打包，会打出zip包（与生产环境的环境变量不一样）
npm run build //生产环境打包
``` 


## `package.json`文件配置

`webpackConfig`配置相关：

- `port`: 开发环境服务端口（`webpack-dev-server`端口）
- `devApiPath`: `npm run dev` 模式下请求的接口基础路径，如果希望通过mock平台调试直接把这个url换成mock平台的接口即可
- `assetsPath`: 静态资源在的基础路径
- `distApiPath`: npm run build 模式下请求的接口基础路径