import React from 'react'
import {Modal, Form, message, InputNumber, Switch} from 'antd'
import {createFormField} from "../../../utils/util";
import {put} from "../../../utils/ajax";

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.systemInfo)
    }
});

@form
class EditSystemModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editSystemInfo(values)
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editSystemInfo = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/system', {
            ...values,
            id: id
        });
        if (res.code === 0) {
            message.success('修改成功');
        }
        this.props.onCancel()
    };
    render() {
        const { getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={500}
                centered
                onOk={this.handleOk}
                title='修改设置信息'
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
                            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={getFieldValue('isChargePublish')}/>
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

export default EditSystemModal
