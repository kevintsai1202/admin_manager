import React from "react";
import {Table, Card, Button, notification, Tag} from 'antd';
import {del, get} from "../../../utils/ajax";
import CreateSystemInfoModal from "./CreateStstemModal";
import EditSystemInfoModal from "./EditSystemModal";
import {withRouter} from "react-router-dom";

@withRouter
class Generalize extends React.Component{
    state = {
        systemInfos:[],
        systemInfosLoading: false,
        systemInfo: {},
        isShowEditModal: false,
        isShowCreateModal: false
    };
    componentDidMount() {
        this.getSystemInfos()
    }
    getSystemInfos = async () => {
        const res = await get('/system');
        if (res.code !== 0) {
            this.setState({
                systemInfosLoading: false,
            });
            return
        }
        this.setState({
            systemInfosLoading: false,
            systemInfos: res.data,
        })
    };
    /**
     * 单条删除
     */
    singleDelete = async (record) => {
        const res = await del(`/system/${record.id}`);
        if (res.code === 0) {
            notification.success({
                message: '删除成功',
                description: res.msg,
            });
            this.getSystemInfos()
        }
    };
    /**
     * 创建modal
     * */
    toggleShowCreateModal = (visible) => {
        this.setState({
            isShowCreateModal: visible
        });
        this.getSystemInfos();
    };
    /**
     * 修改modal
     * */
    showEditModal = (visible) =>{
        this.setState({
            isShowEditModal: true,
            systemInfo: visible
        })
    };
    /**
     * 关闭修改模态框
     */
    closeEditModal = () => {
        this.setState({
            isShowEditModal: false,
            systemInfo: {}
        });
        this.getSystemInfos()
    };
    render() {
        const { systemInfos,systemInfo, systemInfosLoading,isShowCreateModal,isShowEditModal} = this.state;
        const columns = [
            {
                title: '今日游览人数',
                dataIndex: 'seekAmount',
                width:'40%',
                align: 'center'
            },
            {
                title: '推广价格(/元)',
                dataIndex: 'generalizePrice',
                width:'40%',
                align: 'center'
            },
            /*{
                title: '发布是否收费',
                dataIndex: 'isChargePublish',
                width:'20%',
                align: 'center',
                render: (text) => {if (text) {
                    return <Tag color="#2db7f5">收费</Tag>
                } else {
                    return <Tag color="#87d068">免费</Tag>
                }}
            },
            {
                title: '发布费用(/元)',
                dataIndex: 'publishMoney',
                width:'20%',
                align: 'center',
                render: (text, record) =>{
                    if (record.isChargePublish) {
                        return text;
                    }else{
                        return "免费";
                    }
                }
            },*/
            {
                title: '操作',
                key: 'active',
                align: 'center',
                render: (text, record) => (
                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={() => this.showEditModal(record)}>编辑</Button>
                    </div>
                )
            },
        ];
        return(
            <div style={{ padding: 5 }}>
                <Card bordered={false}>
                    {!this.state.systemInfos.length ?
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Button type='primary' icon='plus' onClick={() => this.toggleShowCreateModal(true)}>新增</Button>
                        </div>
                        :null
                    }
                    <Table
                        bordered
                        rowKey='id'
                        columns={columns}
                        dataSource={systemInfos}
                        loading={systemInfosLoading}
                    />
                </Card>
                <EditSystemInfoModal onCancel={this.closeEditModal} visible={isShowEditModal}  systemInfo={systemInfo}/>
                <CreateSystemInfoModal visible={isShowCreateModal} toggleVisible={this.toggleShowCreateModal} />
            </div>
        )
    }
}


export default Generalize;
