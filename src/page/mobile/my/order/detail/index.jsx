import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {WhiteSpace, Flex, Button, Modal} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import {getServerIp} from "../../../../../config.jsx";
// import order_detail from "../../../../../static/mockdata/order_detail.js";
import orderApi from "../../../../../api/my.jsx";
import paymentApi from "../../../../../api/payment.jsx";
import wxApi from "../../../../../api/wechat.jsx";

//传到这个页面的参数：this.props.location.orderId

const alert = Modal.alert;

//去付款需要的参数
var orderCode = "";
var payMoney = 0;

export default class OrderDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            detail:[],
            orderId: (!this.props.location.orderId) ? localStorage.getItem("orderId") : this.props.location.orderId,
            orderState: (!this.props.location.orderState && this.props.location.orderState!==0) ? parseInt(localStorage.getItem("orderState")) : this.props.location.orderState,
        };
    }

    componentWillMount() {
        if (this.props.location.orderId && this.props.location.orderState) {
            localStorage.setItem("orderId", this.props.location.orderId);
            localStorage.setItem("orderState", this.props.location.orderState);
        }

        this.requestOrderDetail();

        // console.log("window.location.href.split('#')[0]", window.location.href.split('#')[0]);

        const url = encodeURIComponent(window.location.href.split('#')[0]);
        wxApi.postJsApiData(url, (rs) => {
            const data = rs.result;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: ["chooseWXPay","onMenuShareTimeline","onMenuShareAppMessage"]
            });
        });
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
        wx.ready(function(){
            wx.checkJsApi({
                jsApiList: ['chooseWXPay',"onMenuShareTimeline","onMenuShareAppMessage"],
                success: function(res) {
                    console.log(res)
                }
            });
        });
        wx.error(function(res){
            console.log('wx.error');
            console.log(res);
        });


        // this.requestData();
    }

    // requestData() {
    //     const orderid = this.props.location.query || localStorage.getItem("nowOrderId");
    //     if (this.props.location.query) {
    //         localStorage.setItem("nowOrderId", this.props.location.query);
    //     }
    // }

    // componentDidMount() {
    //     this.requestData();
    // }
    //
    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const detail = order_detail.data;     //mock data
    //         this.setState({
    //             detail: detail,
    //         })
    //     }, 100);
    // }

    // 微信支付接口
    onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": this.appId,             //公众号名称，由商户传入
                "timeStamp": this.timestamp,     //时间戳，自1970年以来的秒数
                "nonceStr": this.nonceStr,       //随机串
                "package": this.package,
                "signType": this.signType,       //微信签名方式：
                "paySign": this.paySign          //微信签名
            },
            function(res){
                if(res.err_msg === "get_brand_wcpay_request:ok") {
                    // paymentApi.successfulPaymentCallback(this.code, (rs) => {
                    //     // this.context.router.history.push({pathname: '/cart/payment/result', originalPrice: 0, finalPrice: this.state.shouldPay});
                    // });
                    this.linkTo({pathname: '/my/order', state:2});
                }
            }
        );
        // this.requestRealData();
    }

    payCharge() {
        const openid = localStorage.getItem("openid");

        console.log("payMoney", payMoney);
        paymentApi.confirmOrder(orderCode, payMoney, openid, (rs) => {
            console.log("confirmOrder rs", rs);

            this.appId = rs.result.appId;
            this.nonceStr = rs.result.nonceStr;
            this.package = rs.result.package;
            this.paySign = rs.result.paySign;
            this.signType = rs.result.signType;
            this.timestamp = rs.result.timestamp;

            this.code = orderCode;

            // 调起微信支付接口
            if (typeof WeixinJSBridge === "undefined") {
                if ( document.addEventListener ) {
                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                }
            } else {
                this.onBridgeReady();
            }
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
        this.context.router.history.push({pathname : link, state: this.state.detail});
    }

    checkDetailState(orderState) {
        var stateStr = '';
        switch (orderState) {
            case 0: stateStr = "待付款";
                break;
            case 1: stateStr = "待审核";
                break;
            case 2: stateStr = "待出库";
                break;
            case 3: stateStr = "待发货";
                break;
            case 4: stateStr = "待收货";
                break;
            case 5: stateStr = "已收货";
                break;
            case 6: stateStr = "已完成";
                break;
            case 7: stateStr = "已取消";///////
                break;
            case 8: stateStr = "待确认";
                break;
            case 9: stateStr = "待退货";
                break;
            case 10: stateStr = "待入库";
                break;
            case 11: stateStr = "待退款";
                break;
            case 12: stateStr = "已退款";
                break;
        }
        return stateStr
    }

    getOrderButtonContent(orderState) {
        if (orderState === 0 || orderState === 1 || orderState === 2) {
            //return "退款";
            return <Button type="ghost" inline size="small"
            style={{  marginLeft:'65%',marginTop: '4px', marginBottom:'4px', marginRight:'10%',
            width:'25%', backgroundColor:'white', fontSize:'0.8rem'}}
                           onClick={() => alert('取消订单', '您确定要取消吗？', [
                               { text: '取消', onPress: () => {} },
                               { text: '确认', onPress: () => {this.cancelOrderConfirm(this.state.orderId)} },
                           ])}>
                            取消订单
                    </Button>
        } else if (orderState === 5) {
            //return "申请售后";
            return <Button type="ghost" inline size="small"
            style={{  marginLeft:'65%',marginTop: '4px', marginBottom:'4px', marginRight:'10%',
            width:'25%', backgroundColor:'white', fontSize:'0.8rem'}}
                           onClick={()=>{this.linkTo('/my/order/refund')}}>
                    申请退款
            </Button>
        } else {
            return null
        }
    }

    getButtonContent(orderState) {
        if (orderState === 0) {
            //return "取消订单";
            orderCode = this.state.detail.baseInfo.orderCode;
            payMoney = Math.round(this.state.detail.baseInfo.payMoney * 100); //TODO
            return <Button type="ghost" inline size="small"
                           style={{  marginLeft:'65%',marginTop: '4px', marginBottom:'4px', marginRight:'10%',
                               width:'25%', backgroundColor:'white', fontSize:'0.8rem'}}
                           onClick={this.payCharge.bind(this)}>
                去付款
            </Button>
        }  else if (orderState === 4) {
            //return "确认收货";
            return <Button type="ghost" inline size="small"
                            style={{  marginLeft:'65%',marginTop: '4px', marginBottom:'4px', marginRight:'10%',
                            width:'25%', backgroundColor:'white', fontSize:'0.8rem'}}
                           onClick={()=>{this.orderConfirmReceive(this.state.orderId)}}>
                确认收货
            </Button>
        } else if (orderState === 5 || orderState === 6) {
            //return "评价";
            return <Button type="ghost" inline size="small"
                            style={{  marginLeft:'65%',marginTop: '4px', marginBottom:'4px', marginRight:'10%',
                            width:'25%', backgroundColor:'white', fontSize:'0.8rem'}}
                           onClick={()=>{this.context.router.history.push({pathname : '/my/order/comment', order: this.state.detail})}}>
                去评价
            </Button>
        } else {
            return null
        }
    }

    getLogisticInfo() {
        if (!this.state.detail.ships || JSON.stringify(this.state.detail.ships) === "[]") {
            return <div style={{background: 'white',
                padding: '1rem',
                textAlign: 'center',
                color:'black'}}>
                <Flex>
                    <Flex.Item style={{flex:'0 0 10%'}}>
                        <img src="./images/icons/货车.png" style={{width:'%100', marginLeft:'0.5rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 70%', color:'green'}}>
                        暂无物流信息
                    </Flex.Item>
                </Flex>
            </div>
        }
        return <div style={{backgroundColor:'white', borderBottom:'1px solid #ccc'}}
                    // onClick={()=>{this.linkTo('/my/order/logistic')}}
                    >
            <WhiteSpace/>
            <Flex>
                <Flex.Item style={{flex:'0 0 10%'}}>
                    <img src="./images/icons/货车.png" style={{width:'%100', marginLeft:'1.2rem'}}/>
                </Flex.Item>
                <Flex.Item style={{flex:'0 0 70%', color:'green'}}>
                    <div>{this.state.detail.ships[0].shipCompany}
                        <span style={{float:'right'}}>{this.state.detail.ships[0].shipCode}</span>
                    </div>
                    <WhiteSpace/>
                    <div>{new Date(this.state.detail.ships[0].recordTime).toLocaleString()}</div>
                </Flex.Item>
                <Flex.Item style={{flex:'0 0 15%'}}>
                    <img src="./images/icons/向右.png" style={{width:'%10', float:'right'}}/>
                </Flex.Item>
            </Flex>
            <WhiteSpace/>
        </div>
    }

    checkPresent(isPresent) {
        if (isPresent) {
            return <span style={{color:'darkorange', fontWeight:'bold'}}> (赠)</span>
        }
    }


    render() {
        console.log("this.state.detail: ", this.state.detail);
        if (!this.state.detail || JSON.stringify(this.state.detail) === '[]') {
            return null
        }

        console.log("this.props.location.orderState", this.props.location.orderState);
        console.log("this.state.orderState", this.state.orderState);

        const orderButtonContent = this.getOrderButtonContent(this.state.orderState);
        const buttonContent = this.getButtonContent(this.state.orderState);

        const productDetail = this.state.detail.orderItems && this.state.detail.orderItems.map((item, index) => {
            {/*<Link to='/product/1'>*/}
                {/*<Flex style={{background:'#fff'}}>*/}
                    {/*<Flex.Item style={{flex: '0 0 25%'}}>*/}
                        {/*<img src={this.state.detail.product_order_img} style={{width: '60%', margin:'0.8rem'}}/>*/}
                    {/*</Flex.Item>*/}
                    {/*<Flex.Item style={{flex: '0 0 40%', color:'black', fontSize:'0.3rem'}}>*/}
                        {/*<div style={{marginBottom: 10}}>{this.state.detail.product_name}</div>*/}
                        {/*<div style={{marginBottom: 10, color:'#ccc'}}>{this.state.detail.product_specification}</div>*/}
                        {/*<WhiteSpace/>*/}
                    {/*</Flex.Item>*/}
                    {/*<Flex.Item style={{flex: '0 0 25%', fontSize:'0.3rem'}}>*/}
                        {/*<div style={{marginBottom: 10, color:'black', textAlign:'right'}}>{this.state.detail.cost}</div>*/}
                        {/*<div style={{marginBottom: 10, color:'#ccc', textAlign:'right'}}>x {this.state.detail.product_amount}</div>*/}
                        {/*<WhiteSpace/>*/}
                    {/*</Flex.Item>*/}
                {/*</Flex>*/}
            {/*</Link>*/}
            return <Link key={index} to={`/product/${item.specialtyId}`}>
                <Flex style={{background:'#fff'}}
                      onClick={()=>{
                          localStorage.setItem("orderId", this.state.orderId);
                          localStorage.setItem("orderState", this.state.orderState);
                      }}>
                    <Flex.Item style={{flex: '0 0 25%'}}>
                        <img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width: '60%', margin:'0.8rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 40%', color:'black', fontSize:'0.8rem'}}>
                        <div style={{marginBottom: 10}}>
                            {item.name}
                            {this.checkPresent(item.isGift)}
                        </div>
                        <div style={{marginBottom: 10, color:'#ccc'}}>{item.specification}</div>
                        <WhiteSpace/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 25%', fontSize:'0.8rem'}}>
                        <div style={{marginBottom: 10, color:'black', textAlign:'right'}}>{item.salePrice}</div>
                        <div style={{marginBottom: 10, color:'#ccc', textAlign:'right'}}>x {item.quantity}</div>
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
            </Link>
        });

        return <Layout header={false} footer={false}>

            <Navigation title="订单详情" left={true}/>

            <div style={{background: 'darkorange',
                padding: '1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color:'white'}}>
                {this.checkDetailState(this.state.orderState)}
            </div>

            <WhiteSpace/>

            {this.getLogisticInfo()}

            <WhiteSpace/>

            <div style={{backgroundColor:'white'}}>
                <WhiteSpace/>
                <Flex>
                    <Flex.Item style={{flex:'0 0 10%'}}>
                        <img src="./images/icons/地址.png" style={{width:'%10', marginLeft:'0.8rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 70%'}}>
                        <div>收货人：{this.state.detail.baseInfo.receiverName}
                            <span style={{float:'right'}}>{this.state.detail.baseInfo.receiverPhone}</span>
                        </div>
                        <WhiteSpace/>
                        <div>收货地址：{this.state.detail.baseInfo.receiverAddress}</div>
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
            </div>

            <WhiteSpace/>

            {productDetail}

            <div style={{background:'#fff', textAlign:'right'}}>
                {/*<Button type="ghost" inline size="small" style={{marginRight:'2rem'}}>{orderButtonContent}</Button>*/}
                {orderButtonContent}
                <WhiteSpace/>
            </div>

            <WhiteSpace/>
            <div style={{backgroundColor:'white', fontSize:'0.7rem'}}>
                <WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>商品总额
                    <span style={{float:'right', marginRight:'2rem'}}>￥{this.state.detail.baseInfo.totalMoney}</span>
                </div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>商品优惠
                    <span style={{float:'right', marginRight:'2rem'}}>￥{(this.state.detail.baseInfo.totalMoney - this.state.detail.baseInfo.payMoney).toFixed(2)}</span>
                </div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem', fontSize:'1rem'}}>实付款
                    <span style={{float:'right', marginRight:'2rem', fontSize:'1rem', color:'darkorange'}}>
                        ￥{this.state.detail.baseInfo.payMoney}
                    </span>
                </div><WhiteSpace/>
                <WhiteSpace/>
            </div>
            <WhiteSpace/>

            <div style={{backgroundColor:'white', fontSize:'0.7rem', color:'#999'}}>
                <WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>订单编号：{this.state.detail.baseInfo.orderCode}</div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>创建时间：
                    {(!this.state.detail.baseInfo.orderTime)? "" : new Date(this.state.detail.baseInfo.orderTime).toLocaleString()}
                </div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>付款时间：
                    {(!this.state.detail.baseInfo.payTime)? "" : new Date(this.state.detail.baseInfo.payTime).toLocaleString()}
                </div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>发货时间：
                    {(!this.state.detail.baseInfo.deliveryTime)? "" : new Date(this.state.detail.baseInfo.deliveryTime).toLocaleString()}
                </div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>成交时间：
                    {(!this.state.detail.baseInfo.receiveTime) ? "" : new Date(this.state.detail.baseInfo.receiveTime).toLocaleString()}
                </div><WhiteSpace/>
                <div style={{marginLeft:'0.6rem'}}>买家备注：
                    {this.state.detail.baseInfo.receiverRemark}
                </div><WhiteSpace/>
                <WhiteSpace/>
            </div>

            {/* <div className='buttons'> */}
            <div style={{background:'#fff', textAlign:'right'}}>
                <span>
                    {buttonContent}
                    {/*<Button type="ghost" inline size="small"*/}
                            {/*style={{  position:'fixed', right:'1rem', marginTop: '4px', marginBottom:'4px',*/}
                                {/*backgroundColor:'white', fontSize:'0.8rem'}}*/}
                            {/*onClick={()=>{this.context.router.history.push({pathname : '/my/order/logistic', orderId: this.state.orderId})}}>*/}
                            {/*查看物流*/}
                    {/*</Button>*/}

                    {/*<Button type="ghost" inline size="small"*/}
                    {/*style={{ marginTop: '4px', marginBottom:'4px', marginRight:'4px',*/}
                    {/*width:'5.3rem', backgroundColor:'white', fontSize:'0.8rem'}}*/}
                    {/*onClick={()=>{}}>*/}
                    {/*{buttonContent}*/}
                    {/*</Button>*/}


                </span>
            </div>

        </Layout>
    }

}

OrderDetail.contextTypes = {
    router: PropTypes.object.isRequired
};
