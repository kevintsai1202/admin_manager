import 'uxcore/assets/iconfont.css';
import 'uxcore/assets/orange.css';
import React, { Component } from 'react';
import {Modal, Form,message, notification} from 'antd'
import {post} from "../../utils/ajax";
import options from './cities'
import { CascadeMultiSelect } from 'uxcore';
const { CascadeMultiModal } = CascadeMultiSelect;

function getTreeNodeData(dataList, keys) {
    let back = [];
    if (!keys ||!dataList.length) {
        return null;
    }
    if (dataList && dataList.length) {
        for (let k = 0;k < keys.length; k += 1) {
            let key = keys[k];
            //城市
            for (let i = 0;i < dataList.length; i += 1) {
                let value = ''+dataList[i].value;
                let prince = dataList[i].children;
                if (prince && prince.length) {
                    for (let c = 0;c < prince.length; c += 1) {
                        let city = prince[c].value;
                        let area = prince[c].children;
                        if (dataList[i].value === key){
                            if (area && area.length) {
                                for (let q = 0;q < area.length; q += 1) {
                                    back.push(value + '-' + city + '-' + area[q].value);
                                }
                            }else{
                                back.push(value + '-' + value + '-' + city);
                            }
                        }else if (city === key){
                            if (area && area.length) {
                                for (let q = 0;q < area.length; q += 1) {
                                    back.push(value + '-' + city + '-' + area[q].value);
                                }
                            }else{
                                back.push(value + '-' + value + '-' + city);
                            }
                        }else{
                            if (area && area.length) {
                                for (let q = 0;q < area.length; q += 1) {
                                    if (area[q].value === key){
                                        back.push(value + '-' + city + '-' + area[q].value);
                                    }
                                }
                            }
                        }
                    }
               }
            }
        }
    }
    return back;
}

@Form.create()
class SynDataModal extends Component {
    state={
        synData:[]
    };
    /**
     * 确认
     * */
    handleOk = async () => {
        const values = getTreeNodeData(options,this.state.synData);
        if (!values && !values.length) {
            notification.error({
                message: '请选择城市',
                description: '请选择城市',
            });
        }else{
            const res = await post('/transfers/synData', {
                synData:values,ids:this.props.ids
            });
            if (res.code === 0) {
                message.success('同步成功');
                this.setState({
                    synData:[]
                })
            }
            this.onCancel()
        }
    };
    /**
     * 关闭
     */
    onCancel = () => {
        this.props.form.resetFields();
        this.props.onCancel();
    };
    render() {
        const { visible } = this.props;
        return (
            <Modal
                onCancel={this.onCancel}
                visible={visible}
                width={600}
                title='选择同步城市'
                centered
                onOk={this.handleOk}
            >
                <div style={{ margin: 15 }}>
                    <CascadeMultiModal
                        className={'ucms-modal'}
                        options={options}
                        value={this.state.synData}
                        onOk={(valueList, labelList, leafList) => {
                            this.setState({ synData: valueList });
                        }}
                    />
                </div>
            </Modal>
        );
    }
}

export default SynDataModal;
