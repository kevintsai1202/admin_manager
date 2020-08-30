import React from "react";
import {
    Table,
    Card,
    Button,
    message, Col, Input, Empty, Form, Carousel, Descriptions, Tag, Modal, notification, Popconfirm, Icon, Switch
} from 'antd'
import ExportJsonExcel from "js-export-excel"
import {del, get} from "../../utils/ajax";
import './style.css'
import CreateTransferIndex from "./CreateTransferIndex";
import EditTransferModal from "./EditTransferModal";
import moment from 'moment'
import SynDataModal from "./SynDataModal";
import EditStickModal from "./EditStickModal";

@Form.create()
class Index extends React.Component{
    state = {
        transfers: [],
        transfersLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        selectedRowKeys: [],
        transfer: {},
        isAddAndUpdate: false,
        isAdd: false,
        synDataModel: false,
        isShowStickModal: false
    };
    componentDidMount() {
        if (!this.state.isAddAndUpdate){
            this.getTransfers()
        }
    }
    getTransfers = async (page = 1) => {
        const { pagination } = this.state;
        const fields = this.props.form.getFieldsValue();
        this.setState({
            transfersLoading: true,
        });
        const res = await get('/transfers', {
            page: page,
            pageSize: this.state.pagination.pageSize,
            search: fields.search || ''
        });
        if (res.code !== 0) {
            this.setState({
                transfersLoading: false,
            });
            return
        }
        this.setState({
            transfersLoading: false,
            transfers: res.data.list,
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
        this.getTransfers(page.current)
    };
    /**
     * 搜索函数
     */
    onSearch = () => {
        this.getTransfers()
    };
    /**
     * 重置函数
     */
    onReset = () => {
        this.props.form.resetFields();
        this.getTransfers();
        this.setState({
            selectedRowKeys: []
        });
        message.success('重置成功')
    };
    /**
     * 显示发布信息
     * */
    transferList = ()=>{
       this.setState({
           isAddAndUpdate: false,
           isAdd: false
       });
        this.getTransfers();
    };
    /**
     * 新增发布信息页面
     * */
    pushTransferInfo = () =>{
        this.setState({
            isAddAndUpdate: true,
            isAdd: true
        })
    };
    /**
     * 编辑发布信息页面
     * */
    editTransferInfo = (record)=>{
        this.setState({
            isAddAndUpdate: true,
            isAdd: false,
            transfer: record
        })
    };
    /**
     * 编辑置顶时间
     * */
    editStick = (record) =>{
        this.setState({
            isShowStickModal: true,
            transfer: record
        })
    };
    /**
     * 关闭编辑置顶框
     * */
    closeEditStickModal = () => {
        this.setState({
            isShowStickModal: false
        });
        this.getTransfers()
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/transfers', {
                    ids: this.state.selectedRowKeys
                });
                if (res.code === 0) {
                    notification.success({
                        message: '删除成功',
                        description: res.msg,
                    });
                    this.setState({
                        selectedRowKeys: []
                    });
                    this.getTransfers()
                }
            }
        })
    };
    /**
     * 同步数据
     * */
    synData = () =>{
        this.setState({
            synDataModel: true
        })
    };
    /**
     * 关闭修改模态框
     */
    closeSynDataModal = () => {
        this.setState({
            synDataModel: false
        });
        this.setState({
            selectedRowKeys: []
        });
        this.getTransfers()
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del('/transfers',{
            ids: record.id
        });
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getTransfers()
        }
    };
    /**
     * 推广开关
     * */
    switch = async (record) =>{
        const res = await get('/transfers/switchIsGeneralize/',{id:record.id});
        if (res.code === 0) {
            notification.success({
                message: '修改成功',
                description: res.msg,
            });
            this.getTransfers()
        }
    };
    handleExport = async () => {
        const fields = this.props.form.getFieldsValue();
        const res = await get('/transfers/findAll', {
            search: fields.search || ''
        });
        if (res.code !== 0){
            message.error(res.msg);
            return;
        }
        const excelTransfers = res.data;
        const option = {};
        const columns = [
            {
                title: '标题',
                dataIndex: 'title',
            },
            {
                title: '行业名称',
                dataIndex: 'tradeName',
            },
            {
                title: '面积',
                dataIndex: 'area',
            },
            {
                title: '发布人',
                dataIndex: 'nickname',
            },
            {
                title: '联系人',
                dataIndex: 'linkman',
            },
            {
                title: '联系电话',
                dataIndex: 'phone',
            }
        ];
        option.fileName = 'transfers';
        option.datas = [
            {
                sheetData: excelTransfers.map(item => {
                    const result = {};
                    columns.forEach(c => {
                        switch (c.dataIndex) {
                            default:
                                result[c.dataIndex] = item[c.dataIndex];
                        }
                    });
                    return result;
                }),
                sheetName: 'transfers',     // Excel文件名称
                sheetFilter: columns.map(item => item.dataIndex),
                sheetHeader: columns.map(item => item.title),
                columnWidths: columns.map(() => excelTransfers.length),
            },
        ];
        const toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    };
    render() {
        const {isAddAndUpdate,isAdd} = this.state;
        const {transfers,transfer,transfersLoading, pagination,selectedRowKeys,synDataModel,isShowStickModal} = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '店铺详情',
                dataIndex: 'storeImgS',
                align: 'center',
                render: storeImgS =>
                storeImgS.length ?
                    <div>
                        <Carousel
                            autoplay={true}
                        >
                            {storeImgS.map(storeImg =>{
                                return <img key={storeImg.id} style={{height:'100px',width:'200px'}} src={storeImg.imgUrl} alt={''}/>
                            })}
                        </Carousel>
                    </div>
                    :
                    <Empty/>
            },
            {
                title: '图标',
                dataIndex: 'icon',
                align: 'center',
                render: (text) => <img style={{height:'100px',width:'200px'}} src={text} alt={''}/>,
            },
            {
                title: '行业名称',
                dataIndex: 'tradeName',
                align: 'center'
            },
            {
                title: '标题',
                dataIndex: 'title',
                align: 'center'
            },
            {
                title: '面积',
                dataIndex: 'area',
                align: 'center',
                sorter: (a, b) => a.area - b.area
            },
            {
                title: '租金',
                dataIndex: 'rent',
                align: 'center',
                sorter: (a, b) => a.rent - b.rent
            },
            {
                title: '转让费',
                dataIndex: 'transferPrice',
                align: 'center',
                sorter: (a, b) => a.transferPrice - b.transferPrice
            },
            {
                title: '是否推广',
                dataIndex: 'isGeneralize',
                align: 'center',
                width: '8%',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="推广中" unCheckedChildren="未推广" defaultChecked={text}/>
                )
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                width: '25%',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.editTransferInfo(record)}>编辑</Button>
                        &emsp;
                        <Button type="default" onClick={() => this.editStick(record)}>编辑置顶</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前数据吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            }
        ];
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };
        return isAddAndUpdate ?
            isAdd ?
                <CreateTransferIndex transferList = {this.transferList}/>
                :
                <EditTransferModal transferList ={this.transferList} transfer={transfer}/>
            :
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
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={this.pushTransferInfo}>新增</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>&emsp;
                        <Button type='default' icon='copy' disabled={!selectedRowKeys.length} onClick={this.synData}>同步数据</Button>&emsp;
                        <Button type="primary" icon='export' onClick={this.handleExport}>导出</Button>
                    </div>
                    <Table
                        rowKey='id'
                        bordered
                        expandedRowRender={record =>
                            <div>
                                <Descriptions
                                    bordered
                                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                >
                                    <Descriptions.Item label="发布人"><Tag color="cyan">{record.nickname ? record.nickname:'平台发布'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="发布人头像">
                                        {
                                            record.avatar ?
                                                <img style={{height:'50px',width:'50px'}} src={record.avatar} alt={''}/>
                                                :
                                                <Tag color="cyan">平台发布</Tag>
                                        }
                                    </Descriptions.Item>
                                    <Descriptions.Item label="城市"><Tag color="cyan">{record.city}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="街道"><Tag color="cyan">{record.district}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="地址"><Tag color="cyan">{record.address}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="是否置顶"><Tag color="cyan">{record.isStick ? '已置顶':'未置顶'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="置顶天数"><Tag color="cyan">{record.isStick ? record.order ? record.order.stickDay:'平台赠送' :'未置顶'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="置顶到期时间"><Tag color="cyan">{record.isStick ? moment(record.stickEndTime).format('YYYY-MM-DD HH:mm:ss'):'未置顶'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="是否推广"><Tag color="cyan">{record.isGeneralize ? '已推广':'未推广'}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="推广结束时间"><Tag color="cyan">{record.isGeneralize ? moment(record.generalizeEndTime).format('YYYY-MM-DD HH:mm:ss'):'未推广'}</Tag></Descriptions.Item>
                                    {/*<Descriptions.Item label="是否缴费"><Tag color="cyan">{record.isChargePublish ? '已缴费':'未缴费'}</Tag></Descriptions.Item>*/}
                                    <Descriptions.Item label="联系人"><Tag color="cyan">{record.linkman}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="联系电话"><Tag color="cyan">{record.phone}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="发布时间"><Tag color="cyan">{moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Tag></Descriptions.Item>
                                    <Descriptions.Item label="描述">{record.description}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        }
                        columns={columns}
                        dataSource={transfers}
                        loading={transfersLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditStickModal onCancel={this.closeEditStickModal} visible={isShowStickModal}  transfer={transfer}/>
                <SynDataModal onCancel={this.closeSynDataModal} visible={synDataModel}  ids={this.state.selectedRowKeys}/>
            </div>
    }
}

export default Index;
