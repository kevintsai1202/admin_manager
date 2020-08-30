import React from 'react'
import {Form, Input, Row, Col, message} from 'antd'
import { randomNum } from '../../utils/util'
import Promptbox from '../../components/PromptBox/index'
import { authenticateSuccess } from '../../utils/session'
import { withRouter } from 'react-router-dom'
import { post, get } from '../../utils/ajax'


@withRouter @Form.create()
class BandingForm extends React.Component {
    state = {
        focusItem: -1,   //当前焦点聚焦在哪一项上
    };
    onSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onLogin(values)
            }
        });
    };
    /**
     * 返回登录面板
     */
    backLogin = () => {
        this.props.form.resetFields();
        this.props.toggleShow()
    };
    /**
     * 表单验证成功后的绑定函数
     */
    onLogin = async (values) => {
        console.log(this.props);
        console.log(this.props.openId);
        const res = await get(`/session/findByUsername?username=${values.username}`);
        if (res.code !== 0) {
            this.props.form.setFields({
                username: {
                    value: values.username,
                    errors: [new Error('用户名不存在')]
                }
            });
            return
        }
        //绑定接口
        const res2 = await post('/wxOpen/BindingWx', {
            username: values.username,
            password: values.password,
            openId: this.props.openId
        });
        if (res2.code !== 0) {
            this.props.form.setFields({
                password:{
                    value: '',
                    errors: [new Error(res2.msg)]
                }
            });
            return
        }
        authenticateSuccess('Bearer '+res2.data);
        message.loading('加载中...', 0.5, ()=>this.props.history.push('/'));
        // this.props.history.push('/');
    };
    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
        const { focusItem} = this.state;
        return (
            <div>
                <h3 className="title">管理员账号绑定</h3>
                <Form hideRequiredMark>
                    <Form.Item
                        help={<Promptbox info={getFieldError('username') && getFieldError('username')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 0 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 0 ? 1 : 0 }}
                        label={<span className='iconfont icon-User' style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('username', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请输入用户名' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                            ]
                        })(
                            <Input
                                className="myInput"
                                onFocus={() => this.setState({ focusItem: 0 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="用户名"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<Promptbox info={getFieldError('password') && getFieldError('password')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 1 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 1 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }]
                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 1 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn" onClick={this.onSubmit}>绑定</div>
                            <div className="registerBtn" onClick={this.backLogin}>返回登录</div>
                        </div>
                    </Form.Item>
                </Form>

                <div className="footer">欢迎登陆后台管理系统</div>
            </div>
        )
    }
}


export default BandingForm
