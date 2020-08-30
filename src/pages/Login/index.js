import React from 'react'
import './style.less'
import {authenticateSuccess, isAuthenticated} from '../../utils/session'
import { withRouter } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import {get} from "../../utils/ajax";
// import {message} from "antd";

// const RegisterForm = LoadableComponent(import('./RegisterForm'));
// const WxQrCodeLogin = LoadableComponent(import('./WxQrCodeLogin'));
const LoginForm = LoadableComponent(import('./LoginForm'));
const BandingForm = LoadableComponent(import('./BindingForm'));
const Background = LoadableComponent(import('../../components/Background'));

@withRouter
class Login extends React.Component {
    state = {
        show: 'login',    //当前展示的是登录框还是注册框
        binding: false,
        openId: null
    };

    componentDidMount() {
        //接收扫码登录传递参数
        const query = this.props.location.search;
        const param = query.split('=')[1];
        if (param){
            this.qrCodeLogin(param);
        }
        // 防止用户通过浏览器的前进后退按钮来进行路由跳转
        // 当用户登陆后再通过浏览器的后退按钮回到登录页时，再点击前进按钮可以直接回到首页
        if (!!isAuthenticated()) {
            this.props.history.go(1)   //不然他后退或者后退了直接登出
        }
    }
    qrCodeLogin = async (code)=>{
        const res = await get('/wxOpen/authQrCode', {
            code: code
        });
        if (res.code === 0) {
            authenticateSuccess('Bearer '+res.data);
            this.props.history.push('/');
        }else if (res.code === 408){
            this.setState({
                binding: true,
                openId: res.msg
            });
        }else{
            this.props.history.push('/login');
        }
    };
    /**
     * 切换登录和注册的面板
     */
    toggleShow = () => {
        this.setState({
            show: this.state.show === 'login' ? 'register' : 'login'
        })
    };
    closeBind = ()=>{
        this.setState({
            binding: false,
            code: null
        })
    };
    render() {
        const { show } = this.state;
        return (
            <Background url={require('../../assets/images/bg.jpg')}>
                {this.state.binding ?
                    <div className="login-container">
                        <div className={`box active`}>
                            <BandingForm toggleShow={this.closeBind} openId={this.state.openId}/>
                        </div>
                    </div>
                    :
                    <div className="login-container">
                        <div className={`box ${show === 'login' ? 'active' : ''}`}>
                            <LoginForm toggleShow={this.toggleShow} />
                        </div>
                        {/* <div className={`box ${show === 'register' ? 'active' : ''}`}>
                        <RegisterForm toggleShow={this.toggleShow} />
                    </div>*/}
                        {/*<div className={`box ${show === 'register' ? 'active' : ''}`}>
                            <WxQrCodeLogin toggleShow={this.toggleShow} />
                        </div>*/}
                    </div>
                }
            </Background>
        )
    }
}

export default Login
