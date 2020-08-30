import React, { Component } from 'react';
import {Modal, Form, message, InputNumber, Switch} from 'antd'
import {post} from "../../../utils/ajax";

@Form.create()
class CreateSystemModal extends Component {
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
        const res = await post('/system', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
        }
        this.onCancel()
    };

    render() {
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={500}
                title='设置推广信息'
                centered
                onOk={this.handleOk}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={'今日找店人数'}>
                        {getFieldDecorator('seekAmount', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '不能为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'150px'}} min={0}/>
                        )}
                    </Form.Item>
                    <Form.Item label={'推广价格'}>
                        {getFieldDecorator('generalizePrice', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '不能为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'150px'}} min={0}/>
                        )}
                    </Form.Item>
{/*                    <Form.Item label={'发布是否收费'}>
                        {getFieldDecorator('isChargePublish',{
                            initialValue: 1
                        })(
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={true}/>
                        )}
                    </Form.Item>
                    <Form.Item label={'发布费用'}>
                        {getFieldDecorator('publishMoney', {
                            validateFirst: getFieldValue('isChargePublish'),
                            rules: [
                                { required: getFieldValue('isChargePublish'), message: '发布费用为空' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'150px'}} min={0}/>
                        )}
                    </Form.Item>*/}
                </Form>
            </Modal>
        );
    }
}

export default CreateSystemModal;
