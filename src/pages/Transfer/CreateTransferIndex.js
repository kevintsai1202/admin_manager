import React from "react";
import {Button, Cascader, Form,Select, Icon, Input, InputNumber, message, Modal, Upload} from "antd";
import {del, get, post} from "../../utils/ajax";
import {isAuthenticated} from "../../utils/session";
import options from './cities'
const { TextArea } = Input;
const { Option } = Select;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

@Form.create()
class CreateTransferIndex extends React.Component{
    state = {
        uploading: false,
        img:{},
        //多图上传
        imgs:[],
        storeImgs:[],
        previewVisible: false,
        previewImage: '',
        fileList: [],
        tradeList:[]
    };
    componentDidMount() {
        this.findAllTradeInfos();
    }
    findAllTradeInfos = async ()=>{
        const res = await get('/trades/findAllTradeInfos');
        if (res.code === 0){
            this.setState({
                tradeList: res.data
            })
        }else{
            message.error(res.msg || '没有行业信息，无法新增')
        }
    };
    /**
     * 表单提交
     * */
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.createTransfer(values)
            }
        });
    };
    createTransfer = async (values) => {
        values.storeImgS = this.state.storeImgs;
        const res = await post('/transfers', {
            ...values
        });
        if (res.code === 0) {
            message.success('新增成功');
            this.setState({
                    img:{},
                    imgs:{},
                storeImgs:[],
                fileList:[],
                tradeList:[]
                }
            );
            this.props.transferList();
        }
    };
    /**
     * 表单取消
     * */
    handleCancel= ()=>{
        //删除已经上传的所有图片
        if (JSON.stringify(this.state.img) !== '{}'){
            this.removeImg(this.state.img.key);
        }
        const imgs = this.state.imgs;
        if (imgs.length !== 0){
            const keys = [];
            for(let i = 0; i < imgs.length; i++){
                keys.push(imgs[i].key);
            }
            del('/upload/deletes', {keys: keys});
        }
        this.props.transferList();
    };
    /**
     * 单图上传 转换上传组件表单的值
     */
    _normFile = (e) => {
        if (e.file.response && e.file.response.data) {
            return e.file.response.data.url
        } else {
            return ''
        }
    };
    /**
     * 单图删除
     * */
    removeImg = (key)=>{
        del('/upload', {key: key});
    };
    /**
     * 多图上传相关
     * */
    handleModalCancel = () => this.setState({ previewVisible: false });
    /**
     * 点击文件链接或预览图标时的回调
     * */
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /**
     * 上传文件改变时的状态
     * */
    handleChange = ({ fileList }) =>{
        const imgs = [];
        for(let i = 0; i < fileList.length; i++){
            if (fileList[i].response !== undefined) {
                imgs.push(fileList[i].response.data);
            }
        }
        const storeImgs = [];
        if (imgs !== undefined){
            for(let i = 0; i < imgs.length; i++){
                storeImgs.push(imgs[i].url)
            }
        }
        this.setState(
            {
                    fileList ,
                    imgs,
                    storeImgs
                }
            );
    };
    /**
     * 删除图片
     * */
    onRemove = (e) => {
        del('/upload', {key: e.response.data.key});
    };
    render() {
        /**
         * 单图上传
         * */
        const uploadProps = {
            name: "file",
            listType: "picture-card",
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=0`,
            showUploadList: false,
            accept: "image/*",
            onChange: (info) => {
                if (info.file.status !== 'uploading') {
                    this.setState({
                        uploading: true
                    })
                }
                if (info.file.status === 'done') {
                    if (info.file.response.code === 0){
                        if (JSON.stringify(this.state.img) !== '{}'){
                            this.removeImg(this.state.img.key);
                        }
                        this.setState({
                            uploading: false,
                            img: info.file.response.data
                        });
                        message.success('上传图片成功')
                    } else{
                        this.setState({
                            uploading: false
                        });
                        message.error(info.file.response.msg)
                    }
                } else if (info.file.status === 'error') {
                    this.setState({
                        uploading: false
                    });
                    message.error(info.file.response.message || '上传图片失败')
                }
            }
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 7,
                },
            },
        };

        const { previewVisible, previewImage, fileList } = this.state;
        const { uploading } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const  icon = getFieldValue('icon');
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        /**
         * 多图上传
         * */
        const uploadImgs = {
            name: "file",
            listType: "picture-card",
            fileList: fileList,
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
            action: `${process.env.REACT_APP_BASE_URL}/upload?type=2`,
            accept: "image/*",
            onChange: this.handleChange,
            onPreview: this.handlePreview,
            onRemove: this.onRemove
        };
        return(
            <div style={{marginTop:'10px'}}>
                <Form {...formItemLayout}>
                    <Form.Item label={'图标'}>
                        {getFieldDecorator('icon', {
                            rules: [{ required: true, message: '请上传图片' }],
                            getValueFromEvent: this._normFile,
                        })(
                            <Upload {...uploadProps} style={styles.urlUploader}>
                                {icon ? <img src={icon} alt="icon" style={styles.url} /> : <Icon style={styles.icon} type={uploading ? 'loading' : 'plus'} />}
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item label="详情图片">
                        {getFieldDecorator('storeImgS', {
                            rules: [{ required: true, message: '请上传图片' }]
                        })(
                            <div className="clearfix">
                                <Upload {...uploadImgs}>
                                    {fileList.length >= 12 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible}
                                       onCancel={this.handleModalCancel}
                                       closable={false}
                                       onOk={this.handleModalCancel}
                                >
                                    <img alt="example" style={{width:'100%'}} src={previewImage} />
                                </Modal>
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item label={'标题'}>
                        {getFieldDecorator('title', {
                            rules: [
                                { required: true, message: '请输入标题!', whitespace: true}
                                ],
                        })(
                            <Input style={{width:'300px'}} placeholder="请输入标题" />
                            )
                        }
                    </Form.Item>
                    <Form.Item label={'所属行业'}>
                        {getFieldDecorator('tradeName', {
                            rules: [
                                { required: true, message: '请选择!', whitespace: true}
                            ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请选择!"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.state.tradeList.map(item =>{
                                    return <Option key={item.id} value={item.tradeName}>{item.tradeName}</Option>
                                })}
                            </Select>,
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'面积(/m²)'}>
                        {getFieldDecorator('area', {
                            rules: [
                                { required: true, message: '请输入面积!'}
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'200px'}} min={0} />
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'转让费(/元)'}>
                        {getFieldDecorator('transferPrice', {
                            rules: [
                                { required: true, message: '请输入转让费' }
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'200px'}} min={0} disabled={getFieldValue('tradeName') ? JSON.stringify(getFieldValue('tradeName')).indexOf("出租") > 0 : false}/>
                        )}
                    </Form.Item>
                    <Form.Item label={'租金(/元/月)'}>
                        {getFieldDecorator('rent', {
                            rules: [
                                { required: true, message: '请输入租金'}
                            ],
                            initialValue : 0,
                        })(
                            <InputNumber style={{width:'200px'}} min={0} disabled={getFieldValue('tradeName') ? JSON.stringify(getFieldValue('tradeName')).indexOf("转让") > 0 ? true:JSON.stringify(getFieldValue('tradeName')).indexOf("出售") > 0 : false} />
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'联系人'}>
                        {getFieldDecorator('linkman', {
                            rules: [
                                { required: true, message: '请输入联系人', whitespace: true }
                            ],
                        })(
                            <Input placeholder="请输入联系人" style={{width:'200px'}} />
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'联系电话'}>
                        {getFieldDecorator('phone', {
                            rules: [
                                { required: true,
                                    pattern:'^1(3|4|5|7|8)\\d{9}$',
                                  message: '请正确输入联系电话', whitespace: true }
                            ],
                        })(
                            <Input placeholder="请输入联系电话" style={{width:'200px'}} />
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'省市区'}>
                        {getFieldDecorator('cityDistrict', {
                            rules: [
                                { required: true, message: '请选择'}
                            ],
                        })(
                            <Cascader
                                options={options}
                                placeholder={'请选择'}
                                expandTrigger="hover"
                                style={{width:'250px'}}
                                // changeOnSelect
                            />
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'地址'}>
                        {getFieldDecorator('address', {
                            rules: [
                                { required: true, message: '请输入地址'}
                            ],
                        })(
                            <Input style={{width:'400px'}} size="large" placeholder="请输入门店地址" />
                        )
                        }
                    </Form.Item>
                    <Form.Item label={'描述'}>
                        {getFieldDecorator('description', {})
                        (
                            <TextArea
                                placeholder="请输入描述"
                                autosize={{ minRows: 5, maxRows: 30 }}
                            />
                        )
                        }
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="default" onClick={this.handleCancel}>
                            取消
                        </Button>
                        &emsp;
                        <Button type="primary" onClick={this.handleSubmit}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
const styles = {
    urlUploader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 150,
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 28,
        color: '#999'
    },
    url: {
        maxWidth: '100%',
        maxHeight: '100%',
    }
};


export default CreateTransferIndex;
