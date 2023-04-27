# UnionDefi

### 项目开发

1.`npm run dev`启动开发

### 发布`QA`环境

1.执行`npm run build:test`

2.登录`https://itjump.tongfudun.com/ui/#/`,进入`172.16.12.112`主机命令行和文件目录，把根目录下的`app-uniondefi-net.zip`拖到文件目录下

3.让测试发布下

4.浏览器访问`https://uniondefi-qa.tongfudun.com/`

### 发布正式环境

1.执行`npm run build`

2.把根目录下的`app-uniondefi-net.zip`通过邮件发送给发布人员


### 前端dsa resolver合约地址余额后端对应合约名称

|        前端resolverAddress         |                [后端合约名称](http://git.tongfudun.com/UnionDefi/dsa-resolvers#polygon-mainnet)                   |
| :-----------------------: | :----------------------------------------: |
|     lendhub      | instaLendhubResolver--dsa-resolvers |
|    accounts     | instaDSAResolver--dsa-resolvers |
|   balance    | instaERC20Resolver--dsa-resolvers |
|   trade   | unionDefiMdexResolver--dsa-resolvers |

