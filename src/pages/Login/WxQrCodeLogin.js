import React from 'react'

class WxQrCodeLogin extends React.Component{
    /**
     * 返回登录面板
     */
    backLogin = () => {
        this.props.toggleShow()
    };
    componentWillMount(){
        //引入“微信内嵌二维码”脚本
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
        document.head.appendChild(script);
    }

    componentDidMount(){
        //加载微信二维码
        setTimeout(function() {
            /**
             * 微信内嵌二维码自定义样式有两种方式实现
             * 第一种是把自定义样式写在一个css文件里面，部署到一个https链接上
             * 第二种是把自定义样式通过base64加密后设置在href上
             * */
            let customStyle = "data:text/css;base64,Lnd4X3FyY29kZSBpZnJhbWUgeyB3aWR0aDogMjMwcHg7IGhlaWdodDogMjMwcHg7IG1hcmdpbjogMDsgcGFkZGluZzogMDsgfQ0KLmxvZ2luUGFuZWwgeyBtYXJnaW46MDsgcGFkZGluZzogMDsgfQ0KLmxvZ2luUGFuZWwgLnRpdGxlLCAubG9naW5QYW5lbCAuaW5mbyB7IGRpc3BsYXk6IG5vbmU7IH0NCi5pbXBvd2VyQm94IC5xcmNvZGUgeyBtYXJnaW46IDA7IHdpZHRoOiAyMzBweDsgYm9yZGVyOiBub25lOyB9";
            //测试二维码
            new window.WxLogin({
                self_redirect: false,
                id: "wx_login_container",
                appid: "wx6d6126cb8224b42e",
                response_type: "code",
                scope: "snsapi_login",
                // redirect_uri: encodeURI(this.location.origin),
                //redirect_uri 应填写此项目正是环境的登录地址  https://xxxxx.com/login
                redirect_uri: encodeURI("https://www.xuehuilema.com/wechat/wechat/qrUserInfo"),
                // state: "" + (new Date()).getTime(),
                style: "black",
                href: customStyle,
            });
            //设置iframe标签可以进行跨域跳转
            let qrCodeBox = document.getElementById("wx_login_container");
            let iFrames = qrCodeBox.getElementsByTagName("iframe");

            if (iFrames.length){
                let ifr = iFrames[0];
                ifr.setAttribute("sandbox", "allow-scripts allow-top-navigation allow-same-origin");
            }
        }, 1000)
    }

    render() {
        return (
            <div>
                <h3 className="title">管理员微信扫码登录</h3>
                <div className={'login-tab-wx'} style={{height:'250px'}}>
                    <div id={'wx_login_container'} className={'wx_qrcode'}/>
                    {/*<div className={'wx_qrcode_dess'}>打开微信扫一扫｜登录旁边后台</div>*/}
                    {/*<div className={'wx_qrcode_tip'}>新用户首次扫码需要绑定管理账号</div>*/}
                </div>
                <div className="btn-box">
                    <div style={
                                    {
                                        padding: '5px 25px', border:' 2px solid #4FA1D9',
                                        borderRadius: '50px',cursor: 'pointer', color: '#4FA1D9',
                                        zIndex:'10'
                                    }
                                }
                         onClick={this.backLogin}>
                        返回登录
                    </div>
                </div>
                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}

export default WxQrCodeLogin;
