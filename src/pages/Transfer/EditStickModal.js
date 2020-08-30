import React from 'react'
import {Modal, Form, message, List, Card, InputNumber, Tag} from 'antd'
import {put} from "../../utils/ajax";
import moment from 'moment'

@Form.create()
class EditStickModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.editStick(values)
            }
        })
    };
    onCancel = () => {
        this.props.onCancel();
    };
    editStick = async (values) => {
        const res = await put('/transfers/updateStickDate', {
            ...values,
            transferId: this.props.transfer.id
        });
        if (res.code === 0) {
            message.success('修改成功');
        }
        this.props.onCancel()
    };
    render() {
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 15
            },
        };
        const transfer = this.props.transfer;
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                width={550}
                centered
                onOk={this.handleOk}
                title='新增置顶时间'
            >
                <div style={{ height: '30vh', overflow: 'auto' }}>
                    <Form {...formItemLayout}>
                        <List.Item>
                            <Card title={'目前是否置顶'}>
                                <Tag color="cyan">{transfer.isStick ? '已置顶':'未置顶'}</Tag>
                            </Card>
                            <Card title={'目前置顶天数'}>
                                <Tag color="cyan">{transfer.isStick ? transfer.order ? transfer.order.stickDay : '平台赠送' :'未置顶'}</Tag>
                            </Card>
                            <Card title={'置顶到期时间'}>
                                <Tag color="cyan">{transfer.isStick ? moment(transfer.stickEndTime).format('YYYY-MM-DD HH:mm:ss'):'未置顶'}</Tag>
                            </Card>
                        </List.Item>
                        <Form.Item label="置顶天数">
                            {getFieldDecorator('stickDay', {
                                validateFirst: true,
                                rules: [
                                    { required: true, message: '置顶天数不能为空' }
                                ],
                                initialValue: 0
                            })
                            (
                                <InputNumber style={{width:'150px'}} min={0}/>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default EditStickModal
