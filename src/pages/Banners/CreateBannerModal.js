import React, { Component } from 'react';
import {Modal, Form, Input, message, Upload, Icon, Switch, InputNumber} from 'antd'
import {del, post} from '../../utils/ajax'
import {isAuthenticated} from "../../utils/session";

@Form.create()
class CreateUserModal extends Component {
    state = {
        uploading: false,
        img:{}
    };
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
        //删除图片
        if (this.state.img.key && this.state.img.key.indexOf('http') === -1 ){
            del('/upload', {key: this.state.img.key});
        }
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createBanners(values)
            }
        })
    };
    createBanners = async (values) => {
        const res = await post('/banners', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
            this.setState({
                img:{}
                }
            );
            this.onCancel()
        }
    };
    /**
     * 转换上传组件表单的值
     */
    _normFile = (e) => {
        if (e.file.response && e.file.response.data) {
            return e.file.response.data.url
        } else {
            return ''
        }
    };
    render() {
        const uploadProps = {
            name: "file",
            listType: "picture-card",
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=0`,
            showUploadList: false,
            accept: "image/*",
            onChange: (info) => {
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: true
                    })
                }
                if (info.file.status === 'done') {
                    this.setState({
                        uploading: false,
                        img: info.file.response.data
                    });
                    message.success('上传图片成功')
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    });
                    message.error(info.file.response.message || '上传图片失败')
                }
            }
        };
        const { uploading } = this.state;
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const  url = getFieldValue('url');
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='创建banner'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'图片'}>
                        {getFieldDecorator('url', {
                            rules: [{ required: true, message: '请上传图片' }],
                            getValueFromEvent: this._normFile,
                        })(
                            <Upload {...uploadProps} style={styles.urlUploader}>
                                {url ?
                                    <img src={url} alt="url" style={styles.url} />
                                    :
                                    <div>
                                        <div style={styles.hint}>
                                            最佳像素 750 x 420
                                        </div>
                                        <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />
                                    </div>
                                }
                            </Upload>
                        )}
                    </Form.Item>

                    <Form.Item label={'是否展示'}>
                        {getFieldDecorator('isShow',{
                            initialValue: 1
                        })(
                            <Switch checkedChildren="展示" unCheckedChildren="隐藏" defaultChecked/>
                        )}
                    </Form.Item>
                    <Form.Item label={'是否链接'}>
                        {getFieldDecorator('isLink',{
                            initialValue: 0
                        })(
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={false}/>
                        )}
                    </Form.Item>
                    <Form.Item label={'链接'}>
                        {getFieldDecorator('linkUrl',{
                            validateFirst: getFieldValue('isLink'),
                            rules: [
                                { required: getFieldValue('isLink'), message: '链接不能为空' },
                                { pattern: '^[^ ]+$', message: '链接不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={255}
                                placeholder="请输入链接"
                               />
                        )}
                    </Form.Item>
                    <Form.Item label={'排序'}>
                        {getFieldDecorator('sort', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '排序不能为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber min={0}/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const styles = {
    urlUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
        backgroundColor: '#fff'
    },
    hint:{
        fontSize: 10,
        color: '#999'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    url: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
};


export default CreateUserModal;
