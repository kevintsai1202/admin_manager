import React from "react";
import {del, get} from "../../utils/ajax";
import {
    Table,
    Card,
    Button,
    Icon,
    Modal,
    Popconfirm,
    notification,
    Switch
} from 'antd'
import EditBannerModal from "./EditBannerModal";
import CreateBannerModal from "./CreateBannerModal";

class Banners extends React.Component{
    state = {
        banners: [],
        bannersLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        banner: {},
        selectedRowKeys: [],
        isShowCreateModal: false
    };

    componentDidMount() {
        this.getBanners()
    }
    getBanners = async (page = 1) => {
        const { pagination } = this.state;
        this.setState({
            usersLoading: true,
        });
        const res = await get('/banners', {
            page: page,
            pageSize: this.state.pagination.pageSize
        });
        if (res.code !== 0) {
            this.setState({
                usersLoading: false,
            });
            return
        }
        this.setState({
            usersLoading: false,
            banners: res.data.list,
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
        this.getBanners(page.current)
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/banners/deletes', {
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
                    this.getBanners()
                }
            }
        })
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del(`/banners/${record.id}`);
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.setState({
                selectedRowKeys: []
            });
            this.getBanners()
        }
    };
    /**
     * 开关
     * */
    switch = async (record) =>{
        const res = await get('/banners/updateShow/'+record.id);
        if (res.code === 0) {
            notification.success({
                message: '修改成功',
                description: res.msg,
            });
            this.getBanners()
        }
    };
    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getBanners();
    };
    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            banner: visible
        })
    };
    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            banner: {}
        });
        this.getBanners()
    };
    render() {
        const { banners, usersLoading, pagination, banner, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '序号',
                key: 'id',
                align: 'center',
                render: (text, record, index) => {
                    let num = (pagination.current - 1) * pagination.pageSize + index + 1;
                    if (num < pagination.pageSize) {
                        num = '0' + num
                    }
                    return num
                }
            },
            {
                title: '图片',
                dataIndex: 'url',
                align: 'center',
                render: (text) => <img style={{height:'100px',width:'200px'}} src={text} alt={''}/>,
            },
            {
                title: '是否展示',
                dataIndex: 'isShow',
                align: 'center',
                render:(text, record) => (
                    <Switch onClick = {()=>this.switch(record)} checkedChildren="展示" unCheckedChildren="隐藏" defaultChecked={text}/>
                )
            },
            {
                title: '是否是链接',
                dataIndex: 'isLink',
                align: 'center',
                render: (text) => <Button disabled={true}>{text ? '是' : '否'}</Button>
            },
            {
                title: '链接地址',
                dataIndex: 'linkUrl',
                align: 'center',
                render: (text) => text ? text : '未设置',
            },
            {
                title: '排序',
                dataIndex: 'sort',
                align: 'center'
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前图片吗？' onConfirm={() => this.singleDelete(record)}>
                            <Button type="danger">
                                <Icon type='delete' />
                                删除
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
        ];

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
        };

        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                        <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>新增</Button>&emsp;
                        <Button type='danger' icon='delete' disabled={!selectedRowKeys.length} onClick={this.batchDelete}>批量删除</Button>
                    </div>
                    <Table
                    bordered
                    rowKey='id'
                    columns={columns}
                    dataSource={banners}
                    loading={usersLoading}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    onChange={this.onTableChange}
                    />
                </Card>
                <EditBannerModal onCancel={this.closeEditModal} visible={isShowEditModal}  banner={banner}/>
                <CreateBannerModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }
}

export default Banners;
