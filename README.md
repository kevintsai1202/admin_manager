## admin
##前言
[java后端部分](https://gitee.com/Explore_Mr_Pei/admin_api_master)

此项目是我接私活进行的项目开发，项目预览拥有全部功能，开源代码禁止全部商用，给客户开发的正式项目并没有权限系统，由于网上基本没有react的权限系统，因此我决定开发出来并且前后端开源（此权限系统并不像网上vue的管理系统模版那么复杂且完善，但是一般也满足小中型公司的业务需求了）。

此项目也是我在业余时间学习react后开发的第一个react管理项目，使用了他人的开源基本模版，我在此开源模版上进行的项目开发。

[基础模版地址《zzh1918》](https://blog.csdn.net/qq_37860930/article/details/81327320)

### `react前端部分`
前端使用的技术栈：react、react-router、redux、canvas、fetch、ant design、dataV、es6 等

### `项目介绍`
基于 ant design 开发的react前端系统，项目采用前后端分离实现权限管理系统，管理员登录后，动态加载菜单栏，超级管理员可以操作所有权限
- 演示账号：admin
- 演示秘密：admin
    ##### 线上体验
    [体验地址](http://www.xypsp.com/admin/)

未避免演示出现大量脏数据，演示账号只分配了查询权限，没有任何操作权限

### `项目功能`
+ web用户端相关
    + 首页数据统计
    + banner管理
    + 订单查询
    + 行业分类管理
    + 店铺信息管理
+ admin管理权限相关
    + 账号管理 新增，修改，删除，禁用/启用，给账号分配角色或者具体权限
    + 角色管理 主要关联权限
    + 权限管理 
    + 菜单管理 关联父级菜单，关联权限，icon图标选择器的封装

### `项目准备`
下载源码，由于此项目是前后端分离，请先把后端项目跑起来。
下载前端源码后
- npm install   
下载环境依赖包
### `本地部署`
1. 修改根目录下 .env 全局文件
    ```
    # 本地后端api访问地址
    REACT_APP_BASE_URL = http://localhost:3000/xypsp_admin
    # 生产服api访问地址
    #REACT_APP_BASE_URL = http://www.xypsp.com/xypsp_admin
    # 本地启动配置
    NODE_ENV = dev
    # 生产服配置
    #NODE_ENV = pro
    ```
2. 修改 src 目录下 setupProxy.js 代理文件
    ```
    const proxy = require('http-proxy-middleware');
    module.exports = function (app) {
        app.use(
            //后端项目访问名称
            proxy('/xypsp_admin', {
                //生产服访问地址
                // target: 'http://www.xypsp.com',
                //本地访问地址
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        ))
    };
    ```
    target 后端API的访问地址，前端的请求接口会自动解析为 http://localhost:8080/xypsp_admin 根据本地和线上环境自行修改
- yarn start

    本地运行项目，一般会自动打开游览器直接访问

### `线上部署`
1. 修改根目录下 .env 全局文件
    ```
    # 本地后端api访问地址
    #REACT_APP_BASE_URL = http://localhost:3000/xypsp_admin
    # 生产服api访问地址
    REACT_APP_BASE_URL = http://www.xypsp.com/xypsp_admin
    # 本地启动配置
    #NODE_ENV = dev
    # 生产服配置
    NODE_ENV = pro
2. 修改 src 目录下 setupProxy.js 代理文件
    ```
    const proxy = require('http-proxy-middleware');
    module.exports = function (app) {
        app.use(
            //后端项目访问名称
            proxy('/xypsp_admin', {
                //生产服访问地址
                target: 'http://www.xypsp.com',
                //本地访问地址
                //target: 'http://localhost:8080',
                changeOrigin: true
            }
        ))
    };
    ```
    target 后端API的访问地址，前端的请求接口会自动解析为 http://www.xypsp.com/admin_client 根据本地和线上环境自行修改
3. src/utils 目录下 history.js 文件
    ```
    import { createBrowserHistory } from 'history'
    const env = process.env.NODE_ENV;  // 环境参数
    let options = {};
    if (env === 'dev') {
        options.basename = '/xypsp_admin'
    }else{
        // 生产服
        options.basename = '/admin'
    }
    export default createBrowserHistory(options)

    ```
    options.basename react项目访问的项目名，与yarn build 生成的文件夹名称保持一致
- yarn build    
打包，会在根目录下生成 build 文件夹，可重命名，将打包出来的文件夹放服务器即可通过nginx或者其它应用服务器直接访问
具体如何部署，我会在后端项目文档详细说明

[也可参考我这边文章](https://www.jianshu.com/p/7542d76f1ba5)
