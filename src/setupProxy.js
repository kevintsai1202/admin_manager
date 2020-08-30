const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        //后端项目访问名称
        proxy('/xypsp_admin', {
            //生产服访问地址
            target: 'http://www.xypsp.com',
            //本地访问地址
            // target: 'http://localhost:8080',
            changeOrigin: true
        }
    ))
};
