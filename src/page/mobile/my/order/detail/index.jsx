import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Button, Flex, Modal, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import {getServerIp} from "../../../../../config.jsx";
import orderApi from "../../../../../api/my.jsx";
import paymentApi from "../../../../../api/payment.jsx";
import WxManager from "../../../../../manager/WxManager.jsx";
import PayManager from "../../../../../manager/payManager.jsx";
import OrderManager from "../../../../../manager/OrderManager.jsx";

//传到这个页面的参数：this.props.location.orderId

const alert = Modal.alert;

//去付款需要的参数
let orderCode = "";
let payMoney = 0;

export default class OrderDetail extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            detail: [],
            orderId: (!this.props.location.orderId) ? localStorage.getItem("orderId") : this.props.location.orderId,
            orderState: (!this.props.location.orderState && this.props.location.orderState !== 0) ? parseInt(localStorage.getItem("orderState")) : this.props.location.orderState,
        };
        this.payCharge = this.payCharge.bind(this);
    }

    componentWillMount() {
        if (this.props.location.orderId && this.props.location.orderState) {
            localStorage.setItem("orderId", this.props.location.orderId);
            localStorage.setItem("orderState", this.props.location.orderState);
        }

        this.requestOrderDetail();

        WxManager.auth();
    }

    requestOrderDetail() {
        // const orderId = parseInt(window.location.href.split('#')[1].split('/my/order/detail/')[1]);
        // console.log("orderId: ", orderId);
        orderApi.getOrderDetailById(this.state.orderId, (rs) => {
            if (rs && rs.success) {
                const detail = rs.obj;
                console.log("rs.obj: ", rs.obj);

                this.setState({
                    detail,
                });
            }
        });
    }

    componentDidMount() {
        WxManager.share();
    }

    orderDetailPaySuccessCallback() {
        this.linkTo({pathname: '/my/order', state: 2});
    }

    payCharge() {
        const openid = localStorage.getItem("openid");
        console.log("payMoney", payMoney);

        paymentApi.confirmOrder(orderCode, payMoney, openid, (rs) => {
            console.log("confirmOrder rs", rs);

            let payConfig = {
                "appId": rs.result.appId,
                "nonceStr": rs.result.nonceStr,
                "package": rs.result.package,
                "paySign": rs.result.paySign,
                "signType": rs.result.signType,
                "timestamp": rs.result.timestamp,
            };

            PayManager.doPay(payConfig, this.orderDetailPaySuccessCallback, null, null, null);
        });
    }

    orderConfirmReceive(orderId) {
        orderApi.confirmReceive(orderId, (rs) => {
            if (rs && rs.success) {
                console.log("rs: ", rs);
                history.go(-1);
            }
        });
    }

    cancelOrderConfirm(orderId) {
        orderApi.cancelOrder(orderId, (rs) => {
            if (rs && rs.success) {
                console.log("rs: ", rs);
                history.go(-1);
            }
        });
    }

    linkTo(link) {
        this.context.router.history.push({pathname: link, state: this.state.detail});
    }

    getOrderButtonContent(orderState) {
        if (orderState === 0 || orderState === 1 || orderState === 2) {
            return <Button type="ghost" inline size="small"
                           style={{
                               marginLeft: '65%', marginTop: '4px', marginBottom: '4px', marginRight: '10%',
                               width: '25%', backgroundColor: 'white', fontSize: '0.8rem'
                           }}
                           onClick={() => alert('取消订单', '您确定要取消吗？', [
                               {
                                   text: '取消', onPress: () => {
                                   }
                               },
                               {
                                   text: '确认', onPress: () => {
                                       this.cancelOrderConfirm(this.state.orderId)
                                   }
                               },
                           ])}>
                取消订单
            </Button>
        } else if (orderState === 5) {
            return <Button type="ghost" inline size="small"
                           style={{
                               marginLeft: '65%', marginTop: '4px', marginBottom: '4px', marginRight: '10%',
                               width: '25%', backgroundColor: 'white', fontSize: '0.8rem'
                           }}
                           onClick={() => {
                               this.linkTo('/my/order/refund')
                           }}>
                申请退款
            </Button>
        } else {
            return null
        }
    }

    getButtonContent(orderState) {
        if (orderState === 0) {
            orderCode = this.state.detail.baseInfo.orderCode;
            payMoney = Math.round(this.state.detail.baseInfo.payMoney * 100);
            return <Button type="ghost" inline size="small"
                           style={{
                               marginLeft: '65%', marginTop: '4px', marginBottom: '4px', marginRight: '10%',
                               width: '25%', backgroundColor: 'white', fontSize: '0.8rem'
                           }}
                           onClick={this.payCharge}>
                去付款
            </Button>
        } else if (orderState === 4) {
            return <Button type="ghost" inline size="small"
                           style={{
                               marginLeft: '65%', marginTop: '4px', marginBottom: '4px', marginRight: '10%',
                               width: '25%', backgroundColor: 'white', fontSize: '0.8rem'
                           }}
                           onClick={() => {
                               this.orderConfirmReceive(this.state.orderId)
                           }}>
                确认收货
            </Button>
        } else if (orderState === 5 || orderState === 6) {
            //return "评价";
            return <Button type="ghost" inline size="small"
                           style={{
                               marginLeft: '65%', marginTop: '4px', marginBottom: '4px', marginRight: '10%',
                               width: '25%', backgroundColor: 'white', fontSize: '0.8rem'
                           }}
                           onClick={() => {
                               this.context.router.history.push({
                                   pathname: '/my/order/comment',
                                   order: this.state.detail
                               })
                           }}>
                去评价
            </Button>
        } else {
            return null
        }
    }

    getLogisticInfo() {
        if (!this.state.detail.ships || JSON.stringify(this.state.detail.ships) === "[]") {
            return <div style={{
                background: 'white',
                padding: '1rem',
                textAlign: 'center',
                color: 'black'
            }}>
                <Flex>
                    <Flex.Item style={{flex: '0 0 10%'}}>
                        <img src="./images/icons/货车.png" style={{width: '%100', marginLeft: '0.5rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 70%', color: 'green'}}>
                        暂无物流信息
                    </Flex.Item>
                </Flex>
            </div>
        }
        return <div style={{backgroundColor: 'white', borderBottom: '1px solid #ccc'}}
            // onClick={()=>{this.linkTo('/my/order/logistic')}}
        >
            <WhiteSpace/>
            <Flex>
                <Flex.Item style={{flex: '0 0 10%'}}>
                    <img src="./images/icons/货车.png" style={{width: '%100', marginLeft: '1.2rem'}}/>
                </Flex.Item>
                <Flex.Item style={{flex: '0 0 70%', color: 'green'}}>
                    <div>{this.state.detail.ships[0].shipCompany}
                        <span style={{float: 'right'}}>{this.state.detail.ships[0].shipCode}</span>
                    </div>
                    <WhiteSpace/>
                    <div>{new Date(this.state.detail.ships[0].recordTime).toLocaleString()}</div>
                </Flex.Item>
                <Flex.Item style={{flex: '0 0 15%'}}>
                    <img src="./images/icons/向右.png" style={{width: '%10', float: 'right'}}/>
                </Flex.Item>
            </Flex>
            <WhiteSpace/>
        </div>
    }

    checkPresent(isPresent) {
        if (isPresent)
            return <span style={{color: 'darkorange', fontWeight: 'bold'}}> (赠)</span>
    }


    render() {
        console.log("this.state.detail: ", this.state.detail);
        if (!this.state.detail || JSON.stringify(this.state.detail) === '[]')
            return null;


        console.log("this.props.location.orderState", this.props.location.orderState);
        console.log("this.state.orderState", this.state.orderState);

        const orderButtonContent = this.getOrderButtonContent(this.state.orderState);
        const buttonContent = this.getButtonContent(this.state.orderState);

        const productDetail = this.state.detail.orderItems && this.state.detail.orderItems.map((item, index) => {
            return <Link key={index} to={`/product/${item.specialtyId}`}>
                <Flex style={{background: '#fff'}}
                      onClick={() => {
                          localStorage.setItem("orderId", this.state.orderId);
                          localStorage.setItem("orderState", this.state.orderState);
                      }}>
                    <Flex.Item style={{flex: '0 0 25%'}}>
                        <img src={"http://" + getServerIp() + item.iconURL.mediumPath}
                             style={{width: '60%', margin: '0.8rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 40%', color: 'black', fontSize: '0.8rem'}}>
                        <div style={{marginBottom: 10}}>
                            {item.name}
                            {this.checkPresent(item.isGift)}
                        </div>
                        <div style={{marginBottom: 10, color: '#ccc'}}>{item.specification}</div>
                        <WhiteSpace/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 25%', fontSize: '0.8rem'}}>
                        <div style={{marginBottom: 10, color: 'black', textAlign: 'right'}}>{item.salePrice}</div>
                        <div style={{marginBottom: 10, color: '#ccc', textAlign: 'right'}}>x {item.quantity}</div>
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
            </Link>
        });

        return <Layout header={false} footer={false}>

            <Navigation title="订单详情" left={true}/>

            <div style={{
                background: 'darkorange',
                padding: '1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'white'
            }}>
                {OrderManager.checkDetailState(this.state.orderState)}
            </div>

            <WhiteSpace/>

            {this.getLogisticInfo()}

            <WhiteSpace/>

            <div style={{backgroundColor: 'white'}}>
                <WhiteSpace/>
                <Flex>
                    <Flex.Item style={{flex: '0 0 10%'}}>
                        <img src="./images/icons/地址.png" style={{width: '%10', marginLeft: '0.8rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 70%'}}>
                        <div>收货人：{this.state.detail.baseInfo.receiverName}
                            <span style={{float: 'right'}}>{this.state.detail.baseInfo.receiverPhone}</span>
                        </div>
                        <WhiteSpace/>
                        <div>收货地址：{this.state.detail.baseInfo.receiverAddress}</div>
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
            </div>

            <WhiteSpace/>

            {productDetail}

            <div style={{background: '#fff', textAlign: 'right'}}>
                {orderButtonContent}
                <WhiteSpace/>
            </div>

            <WhiteSpace/>
            <div style={{backgroundColor: 'white', fontSize: '0.7rem'}}>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>商品总额
                    <span style={{float: 'right', marginRight: '2rem'}}>￥{this.state.detail.baseInfo.totalMoney}</span>
                </div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>商品优惠
                    <span style={{
                        float: 'right',
                        marginRight: '2rem'
                    }}>￥{(this.state.detail.baseInfo.totalMoney - this.state.detail.baseInfo.payMoney).toFixed(2)}</span>
                </div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem', fontSize: '1rem'}}>实付款
                    <span style={{float: 'right', marginRight: '2rem', fontSize: '1rem', color: 'darkorange'}}>
                        ￥{this.state.detail.baseInfo.payMoney}
                    </span>
                </div>
                <WhiteSpace/>
                <WhiteSpace/>
            </div>
            <WhiteSpace/>

            <div style={{backgroundColor: 'white', fontSize: '0.7rem', color: '#999'}}>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>订单编号：{this.state.detail.baseInfo.orderCode}</div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>创建时间：
                    {(!this.state.detail.baseInfo.orderTime) ? "" : new Date(this.state.detail.baseInfo.orderTime).toLocaleString()}
                </div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>付款时间：
                    {(!this.state.detail.baseInfo.payTime) ? "" : new Date(this.state.detail.baseInfo.payTime).toLocaleString()}
                </div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>发货时间：
                    {(!this.state.detail.baseInfo.deliveryTime) ? "" : new Date(this.state.detail.baseInfo.deliveryTime).toLocaleString()}
                </div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>成交时间：
                    {(!this.state.detail.baseInfo.receiveTime) ? "" : new Date(this.state.detail.baseInfo.receiveTime).toLocaleString()}
                </div>
                <WhiteSpace/>
                <div style={{marginLeft: '0.6rem'}}>买家备注：
                    {this.state.detail.baseInfo.receiverRemark}
                </div>
                <WhiteSpace/>
                <WhiteSpace/>
            </div>

            <div style={{background: '#fff', textAlign: 'right'}}>
                <span>
                    {buttonContent}
                </span>
            </div>

        </Layout>
    }

}

OrderDetail.contextTypes = {
    router: PropTypes.object.isRequired
};
