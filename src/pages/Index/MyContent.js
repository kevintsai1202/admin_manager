import React from 'react'
import { Tabs, Layout, Icon } from 'antd'
import './style.less'
import {tabs} from "../tabs";
import {connect} from "react-redux";
const Footer = Layout.Footer;
const TabPane = Tabs.TabPane;

@connect(
    state => state
)
class MyContent extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { panes } = this.props;
        if (!panes.length){
            this.initTabs();
        }
    }
    initTabs = () =>{
        const { panes,menus } = this.props;
        if (!panes.length){
            panes.push({
                name: menus[0].name,
                key: menus[0].key,
                content: tabs[menus[0].key] || menus[0].name
            })
        }
        this.props.onChangeState({
            panes,
            activeMenu: menus[0].key
        });
    };
    /**
     * 标签页的改变触发的函数
     */
    onChange = (activeKey) => {
        this.props.onChangeState({
            activeMenu: activeKey
        });
    };
    onEdit = (targetKey, action) => {
        if (action === 'remove') {
            this.remove(targetKey)
        }
    };
    /**
    * 关闭标签页
    */
    remove = (targetKey) => {
        let activeMenu = this.props.activeMenu;
        let panes = this.props.panes.slice();
        let preIndex = panes.findIndex(item => item.key === targetKey) - 1;
        preIndex = Math.max(preIndex, 0);
        panes = panes.filter(item => item.key !== targetKey);
        if (targetKey === activeMenu) {
            activeMenu = panes[preIndex] ? panes[preIndex].key : ''
        }
        this.props.onChangeState({
            activeMenu,
            panes
        })
    };
    render() {
        const { panes, activeMenu } = this.props;
        return (
            <div className='content-container'>
                <Tabs
                    style={{ height: '100%' }}
                    tabBarStyle={{ background: '#f0f2f5', marginBottom: 0 }}
                    onEdit={this.onEdit}
                    onChange={this.onChange}
                    activeKey={activeMenu}
                    type={'editable-card'}
                    hideAdd
                >
                    {
                        panes.map(item => (
                                <TabPane key={item.key}
                                         tab={item.name}
                                         closable={item.key !== 'Home'}
                                         style={item.key === 'Home' ? {backgroundColor:'#2c3e50'}:null}
                                >
                                    <div className='tabpane-box'>
                                        {item.content}
                                    </div>
                                    <Footer style={{ textAlign: 'center', background: '#fff' }}>
                                        Mr培 ©2019 Created by 798274881@qq.com <a target='_blank' href='https://www.jianshu.com/u/f45233827cc6' rel="noopener noreferrer"><Icon type="github" /></a>
                                    </Footer>
                                </TabPane>
                            )
                        )
                    }
                </Tabs>
            </div>
        )
    }
}

export default MyContent
