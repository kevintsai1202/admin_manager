import React, { Component } from 'react';
import {Modal, Form, Input, message, Switch, InputNumber} from 'antd'
import {post} from '../../utils/ajax'

@Form.create()
class CreateTradeModal extends Component {
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createTrade(values)
            }
        })
    };
    createTrade = async (values) => {
        const res = await post('/trades', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
        }
        this.onCancel()
    };
    render() {
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={550}
                title='创建类目'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'行业名称'}>
                        {getFieldDecorator('tradeName',{
                            validateFirst: true,
                            rules: [
                                { required: true, message: '行业不能为空' },
                                { pattern: '^[^ ]+$', message: '行业不能有空格' }
                            ]
                        })(
                            <Input
                                maxLength={32}
                                placeholder="请输入行业"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'是否启用'}>
                        {getFieldDecorator('isActive',{
                            initialValue: 1
                        })(
                            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked/>
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

export default CreateTradeModal;
