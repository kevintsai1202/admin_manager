import React, { Component } from 'react';
import {Modal, Form, message, InputNumber} from 'antd'
import {post} from "../../../utils/ajax";

@Form.create()
class CreateStickModal extends Component {
    onCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false);
    };
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.createSystemInfo(values)
            }
        })
    };
    createSystemInfo = async (values) => {
        const res = await post('/sticks', {
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
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={500}
                title='设置置顶信息'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'置顶天数'}>
                        {getFieldDecorator('stickDay', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '不能为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'150px'}} min={0}/>
                        )}
                    </Form.Item>
                    <Form.Item label={'置顶价格'}>
                        {getFieldDecorator('stickPrice', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '不能为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'150px'}} min={0}/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default CreateStickModal;
