import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Form, Tag
} from 'antd'
import moment from 'moment'
import ExportJsonExcel from "js-export-excel"
import {get} from "../../utils/ajax";

@Form.create()
class Order extends React.Component{
    state = {
        orders: [],
        ordersLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        order: {},
    };
    componentDidMount() {
        this.getOrders()
    }
    getOrders = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            ordersLoading: true,
        });
        const res = await get('/orders', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            search: fields.search || ''
        });
        if (res.code !== 0) {
            this.setState({
                ordersLoading: false,
            });
            return
        }
        this.setState({
            ordersLoading: false,
            orders: res.data.list,
            pagination: {
                ...pagination,
                total: res.data.total,
                current: page
            }
        })
    };
    /**
     * table分页
     */
    onTableChange = async (page) => {
        await this.setState({
            pagination: page
        });
        this.getOrders(page.current)
    };
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getOrders()
    };
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getOrders();
        message.success('重置成功')
    };
    /**
     * 订单导出
     * */
    handleExport = () => {
        const { orders } = this.state;
        const option = {};
        const columns = [
            {
                title: '订单类型',
                dataIndex: 'orderType',
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
            },
            {
                title: '订单金额(/元)',
                dataIndex: 'orderAmount',
            },
            {
                title: '置顶天数(/天)',
                dataIndex: 'stickDay',
            },
            {
                title: '支付时间',
                dataIndex: 'payedAt',
            },
            {
                title: '付款用户',
                dataIndex: 'nickname',
            }
            ];
        option.fileName = 'orders';
        option.datas = [
            {
                sheetData: orders.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        if (c.dataIndex === 'orderType'){
                            result[c.dataIndex] = item[c.dataIndex] ? '置顶':'推广';
                        }else if (c.dataIndex === 'orderStatus'){
                            result[c.dataIndex] = item[c.dataIndex] ? '支付成功':'等待支付';
                        } else if (c.dataIndex === 'payedAt'){
                            result[c.dataIndex] = moment(item[c.dataIndex]).format('YYYY-MM-DD HH:mm:ss');
                        } else{
                            result[c.dataIndex] = item[c.dataIndex];
                        }
                    });
                    return result;
                }),
                sheetName: 'orders',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => 10),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };
    render() {
        const { orders,ordersLoading, pagination} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '订单类型',
                dataIndex: 'orderType',
                align: 'center',
                render: (text) => {
                    if (text === 1) {
                        return <Tag color="#2db7f5">置顶</Tag>
                    } else if (text === 0) {
                        return <Tag color="#87d068">推广</Tag>
                    }else if (text === 2){
                        return <Tag color="#108ee9">发布缴费</Tag>
                    }
                }
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
                align: 'center',
                render: (text) => {if (text) {
                    return <Tag color="#2db7f5">支付成功</Tag>
                } else {
                    return <Tag color="#87d068">等待支付</Tag>
                }}
            },
            {
                title: '订单金额(/元)',
                dataIndex: 'orderAmount',
                align: 'center',
                sorter: (a, b) => a.orderAmount - b.orderAmount
            },
            {
                title: '置顶天数(/天)',
                dataIndex: 'stickDay',
                align: 'center',
                sorter: (a, b) => a.stickDay - b.stickDay,
                render: (text, record) =>{
                    if (record.orderType === 1) {
                        return text
                    } else if (record.orderType === 0) {
                        return <Tag color="#87d068">推广订单</Tag>
                    }else if (record.orderType === 2){
                        return <Tag color="#108ee9">发布缴费订单</Tag>
                    }
                }
            },
            {
                title: '支付时间',
                dataIndex: 'payedAt',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
                sorter: (a, b) => a.payedAt - b.payedAt
            },
            {
                title: '付款用户',
                dataIndex: 'nickname',
                align: 'center',
            },
            {
                title: '用户头像',
                dataIndex: 'avatar',
                align: 'center',
                render: (text) => <img style={{height:'50px',width:'50px'}} src={text} alt={''}/>,
            }
        ];
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <Form layout='inline' style={{ marginBottom: 16 }}>
                        <Col span={6}>
                            <Form.Item label="综合搜索">
                                {getFieldDecorator('search')(
                                    <Input
                                        onPressEnter={this.onSearch}
                                        style={{ width: 200 }}
                                        placeholder="综合搜索"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item style={{ marginRight: 0, width: '100%'}} wrapperCol={{ span: 24 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <Button type="primary" icon='search' onClick={this.onSearch}>搜索</Button>&emsp;
                                    <Button icon="reload" onClick={this.onReset}>重置</Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </Form>
                    {/*<div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type="primary" icon='export' onClick={this.handleExport}>导出</Button>
                    </div>*/}
                    <Table
                        style={{marginTop: '50px'}}
                        rowKey='orderNo'
                        bordered
                        columns={columns}
                        dataSource={orders}
                        loading={ordersLoading}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
            </div>
        )
    }
}

export default Order;
