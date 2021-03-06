import React from 'react';
import {Flex, Modal, Toast} from 'antd-mobile';
import "./cartmodal.less";
import proApi from "../../api/product.jsx";
import {getServerIp} from "../../config.jsx";
import {NumStepper} from "../num_stepper/numStepper.jsx";


let temp = [];


export default class CartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const data = this.props.modalData;
        let active = {};

        console.log('this.props.modalData', data)
        console.log('this.props.productData', this.props.productData)
        console.log('isWebusiness', localStorage.getItem('isWebusiness'))


        for (let i in data)
            Object.assign(active, data[0]);


        if (this.props.hasSpecification)
            return {
                active,
                val: 1,

                salePrice: this.props.productData[0].pPrice,
                mPrice: this.props.productData[0].mPrice,
                inbound: parseInt(this.props.stock),
                specificationId: this.props.modalData[0].id,
                //divideRatio: this.props.productData[0].divideRatio,
                divideMoney: this.props.productData[0].divideMoney,

                isWebusiness: localStorage.getItem('isWebusiness'),
                myoptions: "",
                ischange: -1
            };

        // 无规格数据时，如sales_group页面
        return {
            active,
            val: 1,
            isWebusiness: localStorage.getItem('isWebusiness'),
            myoptions: "",
            inbound: parseInt(this.props.stock),
            ischange: -1
        };
    }

    componentWillMount() {

        if (this.props.hasSpecification)
            this.props.modalData.map((option, key) => {
                let tempID = option.id;

                proApi.getSpecialtySpecificationDetailBySpecificationID(tempID, (rs) => {
                    console.log("test", key, rs);
                    if (rs.obj.length === 0) {
                        temp[key] = false;
                        console.log("temp", key, temp[key]);
                        return
                    }
                    if (!rs.success) {
                        temp[key] = false;
                        console.log("temp", key, temp[key]);
                        return
                    }
                    if (rs && rs.success) {
                        temp[key] = true;
                        console.log("temp", key, temp[key]);
                    }

                });
                // temp[key]=option.show
            });
        console.log("temp", temp);
    }

    addNum = (val) => {
        if (val >= this.state.inbound)
            Toast.info("库存只有这么多了！", 0.5);
        this.setState({val: (this.state.val + 1 > this.state.inbound ? this.state.val : this.state.val + 1)});
    };
    minusNum = (val) => {
        this.setState({val: (this.state.val - 1) > 1 ? this.state.val - 1 : 1});
    };


    onChange = (val) => {
        this.setState({val});
    };


    clickSelector(option) {
        let tempID = option.id;

        console.log('option', option);
        console.log('tempID', tempID);

        proApi.getSpecialtySpecificationDetailBySpecificationID(tempID, (rs) => {
            console.log('llrs', rs);

            if (rs.obj.length === 0) {
                Toast.fail('暂无库存', 0.7);
                console.log('暂无库存');
                return
            }
            if (!rs.success) {
                console.log('error');
                return
            }
            if (rs && rs.success) {
                const salePrice = rs.obj[0].pPrice;
                const mPrice = rs.obj[0].mPrice;
                const inboud = rs.obj[0].inbound;
                this.setState({
                    active: Object.assign(this.state.active, option),
                    salePrice: salePrice,
                    mPrice: mPrice,
                    inbound: inboud,
                    specificationId: option.id,
                    divideMoney: rs.obj[0].divideMoney,
                    myoptions: option.specification
                });
            }

        });

    }


    generateDataSet() {
        const optionsData = this.props.modalData.map((option, key) => {
            let className = "select_item";

            if (JSON.stringify(this.state.active) === JSON.stringify(option))
                className += " select_active";

            if (this.props.limit && this.state.ischange == -1) {
                console.log("asdasdfaf");
                this.clickSelector(option)
                this.state.ischange = 0;
            }

            console.log("asdf", key, option.show);
            console.log("sfdas", temp[key]);

            return temp[key] ? <div className={className} style={{float:'left'}}
                                    key={key}
                                    onClick={() => {
                                        this.clickSelector(option)
                                    }}
            >
                {option.specification === this.props.guige ?
                    <font color="red">{option.specification}（优惠）</font> : option.specification}
            </div> : <div key={key}/>
        });

        return <div wrap="wrap" className="content_sec">
            {/* <Flex.Item   style={{overflow: 'scroll'}}> */}
            <div   style={{overflow: 'scroll'}}>
                {optionsData}
            </div>
            {/* </Flex.Item> */}
        </div>
    }

    render() {
        // console.log("active", this.state.active);

        const title = this.props.hasSpecification && <div className="popup_modal_header">
            <Flex justify="end">

                <Flex.Item style={{flex: '0 0 30%'}}>
                    <img src={"http://" + getServerIp() + this.props.productData[0].iconURL.sourcePath}
                         style={{width: '100%', height: '3rem'}} alt=""/>
                </Flex.Item>

                <Flex.Item style={{flex: '0 0 70%'}}>
                    <Flex justify="start" direction="column" align="start">
                        <div className="title">
                            {this.props.productData[0].specialty.name}
                        </div>
                        <div className="salePrice_inbound">
                            价格：￥{this.state.salePrice} 库存：{this.state.inbound}
                        </div>
                        <div className="extractPrice"
                             style={{display: (this.state.isWebusiness === '1') ? 'inline' : "none"}}>
                            提成金额：{(this.state.isWebusiness === '1') ? (parseFloat(this.state.divideMoney).toFixed(2)>0?parseInt(this.state.divideMoney).toFixed(2):0) : 0}
                        </div>
                    </Flex>
                    {/* <h3>{this.props.productData[0].specialty.name}</h3>
                    <p>价格：￥{this.state.salePrice}  库存：{this.state.inbound}</p> */}
                </Flex.Item>

            </Flex>
        </div>;

        const footer = [{
            text: '确定',
            onPress: () => {
                console.log("asdasd", this.state.val, this.props.limit, this.state.myoptions, this.props.guige);

                if (this.state.inbound <= 0) {
                    Toast.info("抱歉，此商品无库存了！不能购买，换个商品看看吧");
                    this.props.hideModal();
                    return;
                }

                if (this.state.val > this.props.limit) {
                    if (this.props.hasSpecification) {
                        if (this.state.myoptions === this.props.guige)
                            Toast.info("超出限购数量！", 0.5);
                    } else
                        Toast.info("超出限购数量！", 0.5);
                } else {
                    this.props.hideModal && this.props.hideModal('success');
                    this.props.selectorText && this.props.selectorText(this.state.active, this.state.val,
                        this.state.specificationId, this.state.mPrice, this.state.salePrice, 'success');
                }

            }
        }];

        const dataSet = this.props.hasSpecification && this.generateDataSet();

        return <Modal
            visible={this.props.visible}
            popup
            animationType="slide-up"
            closable
            onClose={() => {
                this.props.hideModal && this.props.hideModal('close');
            }}
            title={title}
            footer={footer}
            className="popup_modal"
        >   {console.log("购物车数量",this.state.val)}
            <div className="popup_modal_content">
                {this.props.hasSpecification ?
                    <div style={{float: 'left', marginLeft: '1rem', marginRight: '1rem'}}>规格</div> : ""}
                {dataSet}
                <div style={{float: 'left', marginLeft: '1rem'}}>数量</div>
                <NumStepper isProduct={true}
                            numVal={this.state.val}
                            minusNumAction={this.minusNum.bind(this, this.state.val)}
                            addNumAction={this.addNum.bind(this, this.state.val)}/>
            </div>
        </Modal>
    }
}