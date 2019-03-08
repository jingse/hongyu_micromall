import React from 'react';
import { WingBlank, Flex, Modal, Toast, LocaleProvider } from 'antd-mobile';
import "./index.less";
import proApi from "../../../api/product.jsx";
import {getServerIp} from "../../../config.jsx";
var temp=new Array()
export default class CartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const data = this.props.modalData;
        console.log('this.props.modalData',data)
        console.log('this.props.productData',this.props.productData)

        console.log('isWebusiness',localStorage.getItem('isWebusiness'))
        let active = {};
        for (let i in data) {
            // Object.assign(active, data[i].options[0]);
            Object.assign(active, data[0]);
        }
        return {
            active,
            val: 1,
            salePrice: this.props.productData[0].pPrice,
            mPrice: this.props.productData[0].mPrice,
            inbound: this.props.productData[0].inbound,
            specificationId: this.props.modalData[0].id,
            //divideRatio: this.props.productData[0].divideRatio,
            divideMoney: this.props.productData[0].divideMoney,
            isWebusiness : localStorage.getItem('isWebusiness'),
        };
    }

    componentWillMount(){

            this.props.modalData.map((option, key) => {
            let tempID = option.id;
            proApi.getSpecialtySpecificationDetailBySpecificationID(tempID, (rs) => {
                console.log("test",key,rs);
                if (rs.obj.length == 0) {
                    temp[key]=false;
                    console.log("temp",key,temp[key]);
                    return
                }
                if (!rs.success) {
                    temp[key]=false;
                    console.log("temp",key,temp[key]);
                    return
                }
                if(rs && rs.success) {
                    temp[key]=true;
                    console.log("temp",key,temp[key]);
                    return
                }
                
            });
            // temp[key]=option.show
        })
        console.log("temp",temp);
    }

    onChange = (val) => {
        // console.log(val);
        this.setState({ val });
    };

    findOptionIndex(option) {
        var index = 0;
        const length = this.props.productData.length;
        for (var i= 0; i < length; i++) {
            if (JSON.stringify(this.props.productData[i].specification) === JSON.stringify(option)) {
                index = i;
            }
        }
        return index;
        // return this.props.productData && this.props.productData.map((item, index) => {
        //     if (JSON.stringify(item.specification) === JSON.stringify(option)) {
        //         console.log("option", option);
        //         console.log("item.specification", item.specification);
        //         return index
        //     }
        // });
    }

    clickSelector(option) {
        console.log('option',option);
        let tempID = option.id;
        console.log('tempID',tempID);
        proApi.getSpecialtySpecificationDetailBySpecificationID(tempID, (rs) => {
            console.log('llrs',rs)
            if (rs.obj.length == 0) {
                Toast.fail('暂无库存', 0.7);
                console.log('暂无库存');
                return
            }
            if (!rs.success) {
                console.log('error');
                return
            }
            if(rs && rs.success) {
                const salePrice = rs.obj[0].pPrice;
                const mPrice = rs.obj[0].mPrice;
                const inboud = rs.obj[0].inbound;
                this.setState({
                    active: Object.assign(this.state.active, option),
                    salePrice: salePrice,
                    mPrice: mPrice,
                    inbound: inboud,
                    specificationId: option.id,
                    divideMoney: rs.obj[0].divideMoney
                });
            }
            
        });
        // const index = this.findOptionIndex(option);
        // const salePrice = this.props.productData[index].pPrice;
        // const mPrice = this.props.productData[index].mPrice;
        // const inboud = this.props.productData[index].inbound;

        // this.setState({
        //     active: Object.assign(this.state.active, option),
        //     salePrice: salePrice,
        //     mPrice: mPrice,
        //     inbound: inboud,
        //     specificationId: option.id,
        // });
    }

    // myclickSelector(option) {
    //     let tempID = option.id;
    //     proApi.getSpecialtySpecificationDetailBySpecificationID(tempID, (rs) => {
    //         console.log("LCC",rs);
    //         if (rs.obj.length == 0) {
    //             option.show=false;
    //             return
    //         }
    //         if (!rs.success) {
    //             option.show=false;
    //             return
    //         }
    //         if(rs && rs.success) {
    //             option.show=true;
    //             return
    //         }
            
    //     });
    // }

    generateDataSet() {
        const optionsData = this.props.modalData.map((option, key) => {
            let className = "select_item";
            if (JSON.stringify(this.state.active) === JSON.stringify(option)) {
                className +=" select_active";
            }
            // this.myclickSelector(option)
            console.log("asdf",key,option.show);
            console.log("sfdas",temp[key]);
            return temp[key]?<div className={className}
                        key={key}
                        onClick={() => {this.clickSelector(option)}}
                    >
                {option.specification}
            </div>:<div key={key}></div>});

        return <Flex wrap="wrap" className="content_sec">
            <Flex.Item>
                {optionsData}
            </Flex.Item>
        </Flex>
    }

    render() {
        // console.log("active", this.state.active);
        const title = <div className="popup_modal_header">
            <Flex justify="end">
                <Flex.Item style={{flex:'0 0 30%'}}>
                    <img src={"http://" + getServerIp() + this.props.productData[0].iconURL.sourcePath}
                         style={{width:'100%', height:'3rem'}}/>
                </Flex.Item>
                <Flex.Item style={{flex:'0 0 70%'}}>
                    <Flex justify="start" direction="column" align="start">
                    <div className="title">
                        {this.props.productData[0].specialty.name}
                    </div>
                    <div className="salePrice_inbound">
                    价格：￥{this.state.salePrice}  库存：{this.state.inbound}
                    </div>
                    <div className="extractPrice" style={{display:(this.state.isWebusiness === '1')?'inline':"none"}}>
                    提成金额：{(this.state.isWebusiness === '1')?(this.state.divideMoney).toFixed(2):0}
                    </div>
                    </Flex>
                    {/* <h3>{this.props.productData[0].specialty.name}</h3>
                    <p>价格：￥{this.state.salePrice}  库存：{this.state.inbound}</p> */}
                    
                </Flex.Item>
            </Flex>
        </div>;

        const footer = [{
            text: '确定',
            onPress: ()=>{
                this.props.hideModal && this.props.hideModal('success');
                this.props.selectorText && this.props.selectorText(this.state.active, this.state.val, this.state.specificationId, this.state.mPrice, this.state.salePrice,'success');
            }
        }];

        const dataSet = this.generateDataSet();

        return <Modal
            visible={this.props.modal}
            popup
            animationType="slide-up"
            closable
            onClose = {()=>{
                this.props.hideModal && this.props.hideModal('close');
                //this.props.selectorText && this.props.selectorText(this.state.active, this.state.val, this.state.specificationId);
            }}
            title = {title}
            footer = {footer}
            className = "popup_modal"
        >
            <div className="popup_modal_content">
                <div style={{float:'left', marginLeft:'1rem', marginRight:'1rem'}}>规格</div>
                {dataSet}
                <div style={{float:'left', marginLeft:'1rem'}}>数量</div>
                <div className="step">  
                        <div className="add_minus"onClick={() => {this.setState({val:(this.state.val-1)>1?this.state.val-1:1})}}
                            style={{backgroundImage:'url(./images/icons/minus.png)', backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
                        </div>
                        <div className="value">
                        {this.state.val}
                        </div>
                        <div className="add_minus" onClick={() => {this.setState({val:(this.state.val+1 >this.state.inbound?this.state.val:this.state.val+1)})}}
                            style={{backgroundImage:'url(./images/icons/add.png)',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
                        </div>
                </div>
                {/* <div>
                    <Stepper
                        style={{ width: '30%', minWidth: '100px', touchAction: 'none' }}
                        showNumber
                        //max={10}
                        min={1}
                        value={this.state.val}
                        onChange={this.onChange}/>
                </div> */}
            </div>
        </Modal>
    }
}
