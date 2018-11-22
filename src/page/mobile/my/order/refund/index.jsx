import React from "react";
// import {Link} from "react-router-dom";
import { WhiteSpace, Flex, WingBlank, InputItem, ImagePicker, Checkbox, Stepper, Picker, List, Toast } from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Card from "../../../../../components/card/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import LoadingHoc from "../../../../../common/loading/loading-hoc.jsx";
import { createForm } from 'rc-form';
import {getServerIp} from "../../../../../config.jsx";
import myApi from  "../../../../../api/my.jsx";
import PropTypes from "prop-types";
import "./index.less";

const CheckboxItem = Checkbox.CheckboxItem;

var editId = 0;

const shipStateOption = [
    { value: 0, checked: false, label: '未收货' },
    { value: 1, checked: false, label: '已收货' },
];

const refundReasonOption = [
    { value: 0, checked: false, label: '拍错/多拍/不想要' },
    { value: 1, checked: false, label: '商品有问题' },
    { value: 2, checked: false, label: '未按时间发货' },
    { value: 3, checked: false, label: '未按时间发货' },
    { value: 4, checked: false, label: '其他' },
];

const refundType = [
    { value: 0, label: "仅退款" },
    { value: 1, label: "退货退款" },
];


class RefundApply extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.location.state,
            modal: false,

            option:[],
            files: [],

            // maxRefundMoney: 0,
            checkRefund: [],
            refundItems: [],
            refundQuantity:[],
            refNum: 0,

            chooseShipState: [true, false],
            chooseRefundReason: [true, false, false, false, false],

            finalState: 0,
            finalReason: 0,
            finalType: 0,

            style: { width : 0 },

            isLoading: false
        };
    }

    componentWillMount() {
        // this.setState({
        //     product: this.props.location.state,
        // });

        const proNum = this.state.product.orderItems.length;
        if (proNum === 1) {
            const refundItem = {
                "id": this.state.product.orderItems[0].id,                          // 订单明细id     int
                "quantity": this.state.product.orderItems[0].quantity,              // 购买数量	    int
                "refundQuantity": this.state.product.orderItems[0].quantity,        // 退货数量	    int
            };
            this.state.refundItems.push(refundItem);
            this.setState({
                refundItems: this.state.refundItems,
            });
        }
        for(let i = 0; i < proNum; i++) {
            this.state.checkRefund[i] = false;
            this.setState({
                checkRefund: this.state.checkRefund,
            });
        }
        this.state.product.orderItems && this.state.product.orderItems.map((item, index) => {
            this.state.refundQuantity[index] = item.quantity;
            this.setState({
                refundQuantity: this.state.refundQuantity,
            });
        });

        // console.log("this.props.location.state", JSON.stringify(this.props.location.state));
        // console.log("this.state.produce", JSON.stringify(this.state.product));
    }


    applyForRefund() {
        this.setState({
            isLoading: true,
        });

        console.log("退款中");
        console.log("this.state.product.baseInfo.id", this.state.product.baseInfo.id);
        console.log("this.props.form.getFieldsValue().type", this.props.form.getFieldsValue().type);
        console.log("this.state.product.baseInfo.isDivided", this.state.product.baseInfo.isDivided);
        console.log("this.props.form.getFieldsValue().refundReason", this.props.form.getFieldsValue().refundReason);
        console.log("this.state.product.orderItems[0].id", this.state.product.orderItems[0].id);

        console.log("tyoeof this.props.form.getFieldsValue().refundReason", typeof this.props.form.getFieldsValue().refundReason);
        console.log("refundReasonOption[this.props.form.getFieldsValue().refundReason[0]].label", refundReasonOption[this.props.form.getFieldsValue().refundReason[0]].label);

        const refundInfo = {
            "orderId": this.state.product.baseInfo.id,                                                              // 订单id	    int
            // "isDelivered": (refundType[this.props.form.getFieldsValue().type[0]].label === '退货退款'),           // 是否退货	    Boolean
            "deliverType": this.state.product.baseInfo.isDivided ? 1: 0 ,                                           // 发货类型	    int
            "refundReason": refundReasonOption[this.props.form.getFieldsValue().refundReason[0]].label,              // 退款理由	    string
            // "refundReson": "不想要",                                                                             // 退款理由	    string
            "refundItems": this.state.refundItems,
            // "refundItems": [
            //     {
            //         "id": this.state.product.orderItems[0].id,                  // 订单明细id    int
            //         "quantity": 1,                                              // 购买数量	    int
            //         "refundQuantity": 1,                                        // 退货数量	    int
            //     }
            // ],
        };

        myApi.applyRefund(refundInfo, (rs)=>{
            console.log("rs: ", rs);
            if (rs && rs.success) {
                console.log("退款成功");
                console.log("rs", rs);
                Toast.info("申请成功！", 1);
                history.replaceState(null,null,'/#/my/order')
                this.context.router.history.push({pathname: "/my/order/refund/detail", orderId: this.state.product.baseInfo.id});
                // this.context.router.history.push({pathname: "/my/order/refund/detail", orderId: this.state.product.baseInfo.id, refundProduct: this.state.refundItems, refundInfo: refundInfo});
            } else {
                Toast.info("申请退款失败！", 1);
                Toast.info(rs.msg, 1);
            }
        });


    }


    checkEdit(id) {
        return <Card className = "overlayEdit" style={this.state.style}>
            <Flex>
                <Flex.Item style={{flex:'0 0 70%'}}>

                    <Stepper style={{ width: '50%', minWidth: '100px', touchAction: 'none', marginLeft:"2rem" }}
                             showNumber
                             max={this.state.product.orderItems[this.findIdIndex(id)].quantity}
                             min={1}
                             value={this.state.refundQuantity[this.findIdIndex(id)]}
                             onChange={this.onNumChange.bind(this, id)}
                    />

                </Flex.Item>
                <Flex.Item style={{flex:'0 0 30%', backgroundColor:'darkorange', color:'white',
                    fontSize:'0.6rem', textAlign:'center'}}
                           onClick = {()=>{
                               // this.changeItemQuantity(id, this.state.refNum);
                               this.closeNav();
                           }}>
                    <WhiteSpace size="lg"/>
                    <WhiteSpace size="lg"/>
                    <WhiteSpace size="xs"/>
                    <WhiteSpace size="xs"/>
                    完成
                    <WhiteSpace size="lg"/>
                    <WhiteSpace size="lg"/>
                    <WhiteSpace size="xs"/>
                </Flex.Item>
            </Flex>
        </Card>
    }

    openNav(index) {
        console.log(index);
        const style = { width : "65%", top: (60 + index * 125).toString() + 'px' };
        this.setState({ style });
    }

    closeNav() {
        const style = { width : 0 };
        this.setState({ style });
    }

    setEditId(id) {
        // this.setState({
        //     editId: id,
        // });
        console.log("editId", id);
        editId = id;
    }

     getDefaultNum(num) {
         // this.setState({
         //     num: num,
         // });
        this.state.refNum = num;
     }

     findIdIndex(id) {
        var idIndex = 0;
        this.state.product.orderItems && this.state.product.orderItems.map((item, index) => {
            if (item.id === id) {
                idIndex = index;
            }
        });
        return idIndex
     }

     //根据itemId找到item的数量
    changeItemQuantity(id, quantity) {
        //在product的orderItems里找id是id的商品，把它的商品数量改成quantity；
        const idIndex = this.findIdIndex(id);
        this.state.refundQuantity[idIndex] = quantity;
        this.setState({
            refundQuantity: this.state.refundQuantity,
        });
    }

    onNumChange = (id, val) => {

        // console.log("val", val);
        // console.log("id", id);
        const index = this.findIdIndex(id);
        this.state.refundQuantity[index] = val;

        const indexOfRefund = this.findIndexOfRefundItem(id);
        // console.log("indexRefund", indexOfRefund);
        // console.log("this.state.refundItems[indexOfRefund]", this.state.refundItems[indexOfRefund]);
        this.state.refundItems[indexOfRefund].refundQuantity = val;

        this.setState({
            refundQuantity: this.state.refundQuantity,
            refundItems: this.state.refundItems,
        });

    };


    onCheckChange = (item, index) => {
        this.state.checkRefund[index] = !this.state.checkRefund[index];
        this.setState({
            checkRefund: this.state.checkRefund,
        });

        if (this.state.checkRefund[index]) {
            const refundItem = {
                "id": item.id,                                                      // 订单明细id    int
                "quantity": item.quantity,                                          // 购买数量	    int
                "refundQuantity": this.state.refundQuantity[index],                 // 退货数量	    int
            };
            this.state.refundItems.push(refundItem);
            this.setState({
                refundItems: this.state.refundItems,
            });
        } else {
            this.state.refundItems.splice(this.findIndexOfRefundItem(item.id), 1);
            this.setState({
                refundItems: this.state.refundItems,
            });
        }

        // console.log(index);
    };


    //根据item的id找到它在this.state.product.orderItems里的位置
    findIndexOfRefundItem(id) {
        var indexOfRefund = -1;
        this.state.refundItems && this.state.refundItems.map((item, index) => {
            if (item.id === id) {
                indexOfRefund = index;
            }
        });
        console.log("indexOfRefund", indexOfRefund);
        return indexOfRefund
    }


    //如果选中了该退款商品，就显示该商品的编辑数量框
    checkEditable(item, index) {
        if (this.state.checkRefund[index]) {
            return <Flex.Item style={{flex:'0 0 %20'}}>
                <WhiteSpace/>
                <img src='./images/icons/编辑.png'
                     onClick={()=>{
                         this.setEditId(item.id);
                         this.openNav(index);
                     }}/>
                <WhiteSpace/>
                <div style={{marginTop:'0.5rem', fontColor:"#ccc"}}>x {item.quantity}</div>
            </Flex.Item>
        } else {
            return null
        }
    }


    isWhich(option, index) {
        if (option.length === refundType.length) {
            return this.state.chooseShipState[index]
        } else {
            return this.state.chooseRefundReason[index]
        }
    }

    checkStatus(option) {
        if (option.length === refundType.length) {
            return 'refundType'
        } else {
            return 'refundReason'
        }
    }

    showRefundQuantity(index) {
        if (this.state.checkRefund[index]) {
            return <div style={{color: "darkorange"}}>退款数量：{this.state.refundQuantity[index]}</div>
        }
        return null
    }

    onChange = (files, type, index) => {
        this.setState({
            files,
        });
    };



    render() {
        console.log("this.state.product.orderItems", this.state.product.orderItems);
        console.log("this.state.refundItems", this.state.refundItems);
        console.log("this.state.refundQuantity", this.state.refundQuantity);

        const { getFieldProps } = this.props.form;
        const { files } = this.state;
        const proNum = this.state.product.orderItems.length;


        const productInfo = this.state.product.orderItems && this.state.product.orderItems.map((item, index)=>{

            if (proNum === 1) {

                return <Flex key={index}>
                    <Flex.Item style={{flex:'0 0 30%'}}>
                        <img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'60%', margin:'1rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 50%'}}>
                        <div>{item.name} <span style={{marginLeft:'0.5rem', color: '#ccc'}}>￥{item.salePrice}</span></div>
                        <div style={{color: "darkorange"}}>退款数量：{this.state.refundQuantity[index]}</div>
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 %20'}}>
                        <img src='./images/icons/编辑.png'
                             onClick={()=>{
                                 this.setEditId(item.id);
                                 this.openNav(index);
                             }}/>
                        <div style={{fontColor:"#ccc"}}>x {item.quantity}</div>
                    </Flex.Item>
                </Flex>
            } else {
                return <Flex key={index}>
                    <Flex.Item style={{flex:'0 0 10%'}}>
                        <CheckboxItem key={index} onChange={() => this.onCheckChange(item, index)}>
                        </CheckboxItem>
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 30%'}}>
                        <img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'60%', margin:'0.5rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 40%'}}>
                        <div>{item.name}  <span style={{marginLeft:'0.5rem', color: '#ccc'}}>￥{item.salePrice}</span></div>
                        {this.showRefundQuantity(index)}
                    </Flex.Item>
                    {this.checkEditable(item, index)}
                </Flex>
            }

        });

        return <Layout header={false} footer={false}>

            <Navigation title="申请退款" left={true} backLink='/my/order'/>
            <WhiteSpace/>

            <Card>
                {productInfo}
            </Card>
            {this.checkEdit(editId)}

            <WhiteSpace size="xs"/>

            <Card className="payment_card">

                <List style={{ backgroundColor: 'white' }} className="picker-list">
                    <Picker data={shipStateOption} cols={1} {...getFieldProps('productState')} className="forss">
                        <List.Item arrow="horizontal">货物状态</List.Item>
                    </Picker>
                </List>

                <List style={{ backgroundColor: 'white' }} className="picker-list">
                    <Picker data={refundReasonOption} cols={1} {...getFieldProps('refundReason')} className="forss">
                        <List.Item arrow="horizontal">退款原因</List.Item>
                    </Picker>
                </List>

                {/*<List style={{ backgroundColor: 'white' }} className="picker-list">*/}
                    {/*<Picker data={refundType} cols={1} {...getFieldProps('type')} className="forss">*/}
                        {/*<List.Item arrow="horizontal">退款类型</List.Item>*/}
                    {/*</Picker>*/}
                {/*</List>*/}

            </Card>

            <WhiteSpace size="xs"/>

            <Card>
                {/*<WhiteSpace/>*/}
                {/*<div className="card_group">*/}
                    {/*<InputItem type='money' placeholder="" clear>退款金额：</InputItem>*/}
                {/*</div>*/}
                {/*<WhiteSpace/>*/}
                {/*<div style={{backgroundColor:'#eee', lineHeight:'2rem', color:'#999'}}>*/}
                    {/*<WingBlank> 最多￥100，含发货邮费0 </WingBlank>*/}
                {/*</div>*/}
                {/*<WhiteSpace/>*/}

                <div className="discount">
                <InputItem {...getFieldProps('reason')} placeholder="选填">退款说明：</InputItem>
                </div>
            </Card>

            <WhiteSpace size="xs"/>

            <Card>
                <WhiteSpace/>
                <WingBlank>上传凭证</WingBlank>
                <WhiteSpace/>
                {/*<div style={{border:'1px dashed #ccc', width:'30%', textAlign:'center', marginLeft:'2rem'}}>*/}
                    {/*<WhiteSpace/>*/}
                    {/*<img src="./images/icons/上传凭证.png"/>*/}
                    {/*<div style={{color:'#999'}}>上传凭证</div>*/}
                    {/*<div style={{color:'#999'}}>（最多3张）</div>*/}
                    {/*<WhiteSpace/>*/}
                {/*</div>*/}

                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    selectable={files.length < 4}
                    multiple={true}
                />
                <WhiteSpace/>
            </Card>

            <Submit onClick={()=>{this.applyForRefund()}}>
                <span >提交</span>
            </Submit>

        </Layout>
    }

}

RefundApply.contextTypes = {
    router: PropTypes.object.isRequired
};

const RefundApplyWrapper = createForm()(RefundApply);
// export default RefundApplyWrapper;
export default LoadingHoc(RefundApplyWrapper);