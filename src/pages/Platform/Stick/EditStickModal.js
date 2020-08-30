import React from 'react'
import {Modal, Form, message, InputNumber} from 'antd'
import {createFormField} from "../../../utils/util";
import {put} from "../../../utils/ajax";

const form = Form.create({
    //表单回显
    mapPropsToFields(props) {
        return createFormField(props.stick)
    }
});

@form
class EditStickModal extends React.Component {
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
        const res = await put('/sticks', {
            ...values,
            id: id
        });
        if (res.code === 0) {
            message.success('修改成功');
        }
        this.props.onCancel()
    };
    render() {
        const { getFieldDecorator} = this.props.form;
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
                title='修改置顶信息'
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

export default EditStickModal
