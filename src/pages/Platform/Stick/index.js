import React from "react";
import {Table, Card,Button, Icon, Modal, Popconfirm, notification} from 'antd'
import {del, get} from "../../../utils/ajax";
import CreateStickInfoModal from "./CreateStickModal";
import EditStickInfoModal from "./EditStickModal";

class Stick extends React.Component{
    state = {
        sticks: [],
        sticksLoading: false,
        pagination: {
            total: 0,
            current: 1,
            pageSize: 10,
            showQuickJumper: true
        },
        isShowEditModal: false,
        stick: {},
        selectedRowKeys: [],
        isShowCreateModal: false,
        //筛选
        searchText: '',
        searchedColumn: '',
    };
    componentDidMount() {
        this.getSticks()
    }
    getSticks = async (page = 1) => {
        const { pagination } = this.state;
        this.setState({
            sticksLoading: true,
        });
        const res = await get('/sticks', {
            page: page,
            pageSize: this.state.pagination.pageSize
        });
        if (res.code !== 0) {
            this.setState({
                sticksLoading: false,
            });
            return
        }
        this.setState({
            sticksLoading: false,
            sticks: res.data.list,
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
        this.getSticks(page.current)
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del('/sticks',{
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
            this.getSticks()
        }
    };
    /**
     * 批量删除
     */
    batchDelete = () => {
        Modal.confirm({
            title: '提示',
            content: '您确定批量删除勾选内容吗？',
            onOk: async () => {
                const res = await del('/sticks', {
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
                    this.getSticks()
                }
            }
        })
    };
    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getSticks();
    };
    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            stick: visible
        })
    };
    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            stick: {}
        });
        this.getSticks()
    };

    render() {
        const { sticks, sticksLoading, pagination, stick, selectedRowKeys,isShowEditModal, isShowCreateModal } = this.state;
        const columns = [
            {
                title: '序号',
                key: 'id',
                width:'10%',
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
                title: '置顶天数',
                dataIndex: 'stickDay',
                key: 'stickDay',
                width:'30%',
                align: 'center',
                sorter: (a, b) => a.stickDay - b.stickDay,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '置顶价格(/元)',
                dataIndex: 'stickPrice',
                key: 'stickPrice',
                width:'30%',
                align: 'center',
                sorter: (a, b) => a.stickPrice - b.stickPrice,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                        &emsp;
                        <Popconfirm title='您确定删除当前数据吗？' onConfirm={() => this.singleDelete(record)}>
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
                        dataSource={sticks}
                        loading={sticksLoading}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                </Card>
                <EditStickInfoModal onCancel={this.closeEditModal} visible={isShowEditModal}  stick={stick}/>
                <CreateStickInfoModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }

}

export default Stick;
