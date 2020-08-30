import React from 'react'
import {Modal, Form, Upload, Icon, message, Input, Switch, InputNumber} from 'antd'
import {put} from "../../utils/ajax";
import {createFormField} from '../../utils/util'


const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.trade)
    }
});

@form
class EditTradeModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editTrade(values)
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editTrade = async (values) => {
        const id = this.props.form.getFieldValue('id');
        const res = await put('/trades', {
            ...values,
            id: id
        });
        if (res.code === 0) {
            message.success('修改成功');
        }
        this.props.onCancel()
    };
    render() {
        const { getFieldDecorator,getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 15
            },
        };
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={550}
                centered
                onOk={this.handleOk}
                title='修改行业'
            >
                <div style={{ height: '25vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <Form.Item label="行业名称">
                            {getFieldDecorator('tradeName', {
                                validateFirst:true,
                                rules: [
                                    { required: true, message: '行业不能为空' }
                                ],
                            })
                            (
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="是否启用">
                            {getFieldDecorator('isActive', {
                                initialValue: getFieldValue('isActive'),
                                valuePropName: 'checked',
                            })
                            (
                                <Switch checkedChildren="启用" unCheckedChildren="禁用"/>
                            )}
                        </Form.Item>
                        <Form.Item label="排序">
                            {getFieldDecorator('sort', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '排序不能为空' }
                                ],
                                initialValue: 0
                            })
                            (
                                <InputNumber min={0}/>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default EditTradeModal
