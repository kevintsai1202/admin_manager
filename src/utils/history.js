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
