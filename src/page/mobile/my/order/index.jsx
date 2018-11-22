import React from 'react';
import PropTypes from "prop-types";
import {WhiteSpace, Flex, Tabs, Button, Modal, PullToRefresh, Toast} from 'antd-mobile';
import { Link } from 'react-router-dom';
// import LoadingHoc from "../../../common/loading-hoc.jsx";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import Card from "../../../../components/card/index.jsx";
import myApi from "../../../../api/my.jsx";
import {getServerIp} from "../../../../config.jsx";
import './index.less';
import paymentApi from "../../../../api/payment.jsx";
import orderApi from "../../../../api/my.jsx";
import wxApi from "../../../../api/wechat.jsx";

const alert = Modal.alert;

// const wechatId = localStorage.getItem("wechatId");

const pageSize = 10;

export default class Order extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.startx; //触摸起始点x轴坐标
        this.starty; //触摸起始点y轴坐标


        this.state = {

            tab: 0,
            wechatId: localStorage.getItem("wechatId"),
            id: (!this.props.location.state && this.props.location.state !== 0) ? parseInt(localStorage.getItem("tab")) : parseInt(this.props.location.state),

            all:[],
            pay: [],
            deliver:[],
            receive:[],
            evaluate:[],
            refund:[],

            allPage: 0,
            payPage: 0,
            deliverPage: 0,
            receivePage: 0,
            evaluatePage: 0,
            refundPage: 0,

            // touchStart:this.touchStart.bind(this),
            // touchEnd:this.touchEnd.bind(this),
            refreshing: false,                                   //刷新状态上拉
            // down: true,                                          //方向 true下拉 false上拉
            height: document.documentElement.clientHeight,       //新添加高度

            curOrderPage: 2,
        };
    }

    componentWillMount() {
        console.log("wechatId", this.state.wechatId);
        console.log("this.state.id", this.state.id);
     
        // console.log("localstorage.getItem(tab)", localStorage.getItem("tab"));
        // console.log("!this.props.location.state", !this.props.location.state);


        if (!this.props.location.state && this.props.location.state !== 0) {
            // return from the detail page
            const tab = parseInt(localStorage.getItem("tab"));
            this.setState({
                tab: tab,
            });
            // this.clearData();
            this.requestTabData(tab, 1, pageSize);

        } else {
            this.state.tab = this.props.location.state;
            this.setState({
                tab: this.state.tab,
            });
            const tab = this.props.location.state;

            // save the tab
            localStorage.setItem("tab", tab);

            this.requestTabData(tab, 1, pageSize);
        }



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

    componentDidMount() {
        console.log('hei',this.refs.lv)
        const hei = this.state.height - this.refs.lv;
        console.log('hei',hei)
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
    }

    requestTabData(tab, page, rows) {
        switch(tab) {
            case 0: this.requestAllOrder(this.state.wechatId, page, rows);
                    break;
            case 1: this.requestPayOrder(this.state.wechatId, page, rows);
                    break;
            case 2: this.requestDeliverOrder(this.state.wechatId, page, rows);
                    break;
            case 3: this.requestReceiveOrder(this.state.wechatId, page, rows);
                    break;
            case 4: this.requestEvaluateOrder(this.state.wechatId, page, rows);
                    break;
            case 5: this.requestRefundOrder(this.state.wechatId, page, rows);
                    break;
        }
    }

    requestAllOrder(wechatId, page, rows) {
        console.log("请求所有订单");
        //所有订单
        myApi.getAllOrderListByAccount(wechatId, page, rows, (rs)=>{
            const allOrder = rs.obj.rows;
            console.log("allOrder",rs);
            let alltemp = (page == 1)?allOrder:this.state.all.concat(allOrder);
            this.setState({
                all: alltemp,
                allPage: rs.obj.totalPages,
            });
            if (allOrder.length > 0) {
                
            }
            else{
                Toast.info("没有更多订单",1);
            }

        });
    }

    requestPayOrder(wechatId, page, rows) {
        console.log("请求待付款订单");
        //待付款订单
        myApi.getOrderListByAccount(wechatId, 0, page, rows, (rs)=>{
            const payOrder = rs.obj.rows;
            console.log("请求待付款订单",rs);
            let paytemp = (page == 1)?payOrder:this.state.pay.concat(payOrder);
            this.setState({
                pay: paytemp,
                payPage: rs.obj.totalPages,
            });
            if (payOrder.length>0) {
                
            }
            else{
                Toast.info("没有更多订单",1);
            }
        });

    }

    requestDeliverOrder(wechatId, page, rows) {
        console.log("请求待发货订单");
        let delivertemp = (page == 1)?[]:this.state.deliver;
        //待发货订单
        myApi.getOrderListByAccount(wechatId, 1, page, rows, (rs)=>{
            let order1 = rs.obj.rows;
            // delivertemp = delivertemp.concat(order1);
            // if (order) {
            //     this.setState({
            //         deliver:delivertemp.concat(order),
            //         deliverPage: this.state.deliverPage + rs.obj.totalPages,
            //     });
            // }
            myApi.getOrderListByAccount(wechatId, 2, page, rows, (rs)=>{
                let order2 = rs.obj.rows;
                order1 = order1.concat(order2);
                // if (order) {
                //     this.setState({
                //         deliver: delivertemp.concat(order),
                //         deliverPage: this.state.deliverPage + rs.obj.totalPages,
                //     });
                // }
                myApi.getOrderListByAccount(wechatId, 3, page, rows, (rs)=>{
                    let order3 = rs.obj.rows;
                    order1 = order1.concat(order3);
                    this.setState({
                        deliver: delivertemp.concat(order1),
                        deliverPage: this.state.deliverPage + rs.obj.totalPages,
                    });
                    if (order1.length > 0) {
                        
                    }
                    else{
                        Toast.info("没有更多订单",1);
                    }
                });
            });
        });
    }

    requestReceiveOrder(wechatId, page, rows) {
        console.log("请求待收货订单");
        let receivetemp = (page == 1)?[]:this.state.receive;
        //待收货订单
        myApi.getOrderListByAccount(wechatId, 4, page, rows, (rs)=>{
            const order = rs.obj.rows;
            console.log("order",order,rs);
            console.log("receivetemp",receivetemp);
            this.setState({
                receive: receivetemp.concat(order),
                receivePage: rs.obj.totalPages,
            });
            if (order.length > 0) {
            }
            else{
                Toast.info("没有更多订单",1);
            }
        });

    }

    requestEvaluateOrder(wechatId, page, rows) {
        console.log("请求待评价订单");
        console.log("requestEvaluateOrder page", page);
        let evaluateetemp = (page == 1)?[]:this.state.evaluate;
        //待评价订单
        let order = [];
        myApi.getOrderListByAccount(wechatId, 5, page, rows, (rs)=>{
            let order1 = rs.obj.rows;
            var valid1 = [];
                order1 && order1.map((item, index) => {
                    if (!item.isAppraised) {
                        valid1.push(item);
                    }
                });
                order = order.concat(valid1);
            myApi.getOrderListByAccount(wechatId, 6, page, rows, (rs)=>{
                const order2 = rs.obj.rows;
                var valid2 = [];
                order2 && order2.map((item, index) => {
                    if (!item.isAppraised) {
                        valid2.push(item);
                    }
                });
                order = order.concat(valid2);
                console.log("requestEvaluateOrder", evaluateetemp.concat(order));
                this.setState({
                    evaluate: evaluateetemp.concat(order),
                    evaluatePage: this.state.evaluatePage + rs.obj.totalPages,
                });
                if(order.length > 0){
                    
                }
                else{
                    Toast.info("没有更多订单",1);
                }

            });
        });
        
    }

    requestRefundOrder(wechatId, page, rows) {
        console.log("请求退款订单");
        let refundtemp = (page == 1)?[]:this.state.refund;
        //退款订单
        myApi.getOrderListByAccount(wechatId, 8, page, rows, (rs)=>{
            let order1 = rs.obj.rows;

            myApi.getOrderListByAccount(wechatId, 9, page, rows, (rs)=>{
                let order2 = rs.obj.rows;
                order1 = order1.concat(order2);
                
                myApi.getOrderListByAccount(wechatId, 10, page, rows, (rs)=>{
                    let order3 = rs.obj.rows;
                    order1 = order1.concat(order3);
                    
                    myApi.getOrderListByAccount(wechatId, 11, page, rows, (rs)=>{
                        let order4 = rs.obj.rows;
                        order1 = order1.concat(order4);
                        
                        myApi.getOrderListByAccount(wechatId, 12, page, rows, (rs)=>{
                            let order5 = rs.obj.rows;
                            order1 = order1.concat(order5);
                            this.setState({
                                refund: refundtemp.concat(order1),
                                refundPage: this.state.refundPage + rs.obj.totalPages,
                            });
                            if(order1.length > 0){
                                
                            }
                            else{
                                Toast.info("没有更多订单",1);
                            }
                                
                            
                        });
                    });

                });

            });

        });

        

       

        

        
    }

    // checkState(orderState) {
    //     if (orderState === 0) {
    //         return "待付款"
    //     } else if (orderState === 1 || orderState ===2 || orderState ===3) {
    //         return "待发货"
    //     } else if (orderState === 4 || orderState === 7) {
    //         return "待收货"
    //     } else if (orderState === 5 || orderState === 6) {
    //         return "待评价"
    //     } else if (orderState === 8 || orderState === 9 || orderState === 10 || orderState === 11) {
    //         return "退款"
    //     } else {
    //         return null
    //     }
    // }

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
            case 7: stateStr = "已取消";//////
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

    checkOrder(tab) {
        switch (tab) {
            case 0: return "";
            case 1: return "待付款";
            case 2: return "待发货";
            case 3: return "待收货";
            case 4: return "待评价";
            case 5: return "退款";
        }
    }

    isRefundOrder(state) {
        // console.log("state", state);
        if (state === 8 || state === 9 || state === 10 || state ===11) {
            return '/my/order/refund/detail'
        } else {
            // console.log("/my/order/detail");
            return '/my/order/detail'
        }
    }

    getOrderData() {
        switch (this.state.tab) {
            case 0: return this.state.all;
            case 1: return this.state.pay;
            case 2: return this.state.deliver;
            case 3: return this.state.receive;
            case 4: return this.state.evaluate;
            case 5: return this.state.refund;
        }
    }


    // touchEnd(e) {
    //     let endx, endy;
    //     endx = e.changedTouches[0].pageX;
    //     endy = e.changedTouches[0].pageY;
    //     let direction = this.getDirection(this.startx, this.starty, endx, endy);
    //     switch (direction) {
    //         case 1:
    //             console.log("上");

    //             // 请求新的数据
    //             // TODO:分页
    //             // console.log("请求第", this.state.curOrderPage);
    //             // this.requestTabData(this.state.tab, this.state.curOrderPage, pageSize);
    //             // this.setState({
    //             //     curOrderPage: this.state.curOrderPage++,
    //             // });
    //             if(this.state.down == true)
    //                 this.setState({ down: false });
    //             break;
    //         case 2:
    //             console.log("下");
    //             if(this.state.down == false)
    //                 this.setState({ down: true });
    //             break;
    //     }
    // }

    // touchStart(e) {
    //     this.startx = e.touches[0].pageX;
    //     this.starty = e.touches[0].pageY;
    // }

    // getAngle(angx,angy) {
    //     return Math.atan2(angy, angx) * 180 / Math.PI;
    // }

    // getDirection(startx, starty, endx, endy) {
    //     let angx = endx - startx;
    //     let angy = endy - starty;
    //     let result = 0;
    //     if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    //         return result;
    //     }
    //     let angle = this.getAngle(angx, angy);
    //     if (angle >= -135 && angle <= -45) {
    //         result = 1;
    //     } else if (angle > 45 && angle < 135) {
    //         result = 2;
    //     } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    //         result = 3;
    //     } else if (angle >= -45 && angle <= 45) {
    //         result = 4;
    //     }
    //     return result;
    // }

    clearData() {
        this.setState({
            all:[],
            pay: [],
            deliver:[],
            receive:[],
            evaluate:[],
            refund:[],
            curOrderPage: 2,
        });
    }

    getOrderButton(tab, item) {
        switch (tab) {
            case 0: return null;

            case 1:
                // this.setState({
                //     orderCode: item.orderCode,
                //     payMoney: Math.round(item.payMoney * 100),
                // }, ()=>{
                //     console.log("更新orderCode payMoney成功");
                // });
                // orderCode = item.orderCode;
                // payMoney = Math.round(item.payMoney * 100);

                return <Flex justify="between" style={{width:'50%'}}>
                {/* <div style={{background:'#fff', textAlign:'right'}}> */}
                {/* <WhiteSpace/> */}
                <Button type="ghost" inline size="small" style={{marginRight:'4%', fontSize:'0.7rem'}}
                        onClick={this.payCharge.bind(this, item, Math.round(item.payMoney * 100))}>
                    去付款
                </Button>
                <Button type="ghost" inline size="small" style={{marginRight:'4%', fontSize:'0.7rem'}}
                        onClick={() => alert('取消订单', '您确定要取消吗？', [
                            { text: '取消', onPress: () => {} },
                            { text: '确认', onPress: () => {this.cancelOrderPay(item.id)} },
                        ])}>
                    取消订单
                </Button>
                {/* <WhiteSpace/> */}
                {/* </div> */}
                </Flex>;

            case 2:

                if (item.orderState === 3) {
                    return null
                }

                return <div style={{background:'#fff', textAlign:'right'}}>
                <WhiteSpace/>
                <Button type="ghost" inline size="small" style={{marginRight:'4%', fontSize:'0.7rem'}}
                        onClick={() => alert('取消订单', '您确定要取消吗？', [
                            { text: '取消', onPress: () => {} },
                            { text: '确认', onPress: () => {this.cancelOrderConfirm(item.id)} },
                        ])}>
                    取消订单
                </Button>
                <WhiteSpace/>
            </div>;

            case 3: return <div style={{background:'#fff', textAlign:'right'}}>
                <WhiteSpace/>
                <Button type="ghost" inline size="small" style={{marginRight:'4%', fontSize:'0.7rem'}}
                        onClick={() => alert('确认收货', '您确认要收货吗？', [
                            { text: '取消', onPress: () => {} },
                            { text: '确认', onPress: () => {this.orderConfirmReceive(item.id)} },
                        ])}>
                    确认收货
                </Button>
                <WhiteSpace/>
            </div>;
            case 4: return <div style={{background:'#fff', textAlign:'right'}}>
                <WhiteSpace/>
                <Button type="ghost" inline size="small" style={{marginRight:'4%', fontSize:'0.7rem', width:'5rem'}}
                        onClick={()=>{this.context.router.history.push({pathname: '/my/order/comment', order: item})}}>
                    评价
                </Button>
                <WhiteSpace/>
            </div>;
            case 5: return <div style={{background:'#fff', textAlign:'right'}}>
                <WhiteSpace/>
                <Button type="ghost" inline size="small" style={{marginRight:'4%', fontSize:'0.7rem'}}
                        onClick={()=>{this.linkTo({pathname: '/my/order/refund/detail', orderId: item.id})}}>
                    查看详情
                </Button>
                <WhiteSpace/>
            </div>;
        }
    }

    onTabChange(tab, index) {
        // this.clearData();
        this.requestTabData(index, 1, pageSize);
        localStorage.setItem("tab", index);

        this.setState({
            tab: index,
            curOrderPage: 2,
        });
    }

    orderConfirmReceive(orderId) {
        orderApi.confirmReceive(orderId, (rs) => {
            if (rs && rs.success) {
                console.log("rs: ", rs);
                this.requestTabData(3, 1, pageSize);
            }
        });
          
    }

    cancelOrderConfirm(orderId) {
        console.log("cancelOrderConfirm orderId: ", orderId);
        orderApi.cancelOrder(orderId, (rs) => {
            if (rs && rs.success) {
                console.log("rs: ", rs);
                // this.clearData();
                this.requestTabData(2, 1, pageSize);
            }
        });
        
    }
    cancelOrderPay(orderId) {
        console.log("cancelOrderPay orderId: ", orderId);
        orderApi.cancelOrder(orderId, (rs) => {
            if (rs && rs.success) {
                console.log("rs: ", rs);
                // this.clearData();
                this.requestTabData(1, 1, pageSize);
            }
        });
        
    }

    deleteOrder(orderId) {
        orderApi.deleteOrder(orderId, (rs) => {
            if (rs && rs.success) {
                console.log(rs.msg);
                // this.clearData();
                this.requestTabData(0, 1, pageSize);
            }
        });
        
    }

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
                console.log("res", res);
                if(res.err_msg === "get_brand_wcpay_request:ok") {
                    // paymentApi.successfulPaymentCallback(this.code, (rs) => {
                    //     // this.context.router.history.push({pathname: '/cart/payment/result', originalPrice: 0, finalPrice: this.state.shouldPay});
                    // });
                    this.requestTabData(1, 1, pageSize);
                    // this.linkTo({pathname: '/my/order', state:2});
                } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                    Toast.info("支付失败");
                }
            }
        );
        // this.clearData();
        console.log('待付款刷新1')
        this.requestTabData(1, 1, pageSize);
    }

    payCharge(item, payMoney, event) {
        const openid = localStorage.getItem("openid");
        console.log("item", item);
        orderApi.getOrderDetailById(item.id,(rs)=>{
            console.log('getOrderDetailById_rs',rs)
            let orderCode =item.orderCode;
            let shouldPayMoney= rs.obj.baseInfo.payMoney*100;
            console.log("shouldPayMoney", shouldPayMoney);
            paymentApi.confirmOrder(orderCode, shouldPayMoney, openid, (rs) => {
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
                console.log('待付款刷新2')
                this.requestTabData(1, 1, pageSize);
            });

        });

        
    }

    checkAll(orderStateStr, orderStateDetail, orderId) {
        if (orderStateStr === "all") {
            if (orderStateDetail === 6 || orderStateDetail === 7 || orderStateDetail === 12) {
                return <img src="./images/icons/删除.png" style={{width:'5%'}} onClick={() => alert('删除订单', '您确定要删除吗？', [
                    { text: '取消', onPress: () => {} },
                    { text: '确认', onPress: () => {this.deleteOrder(orderId)} },
                ])}/>
            }
        }
        return <div></div>
    }

    getOrderContent(order, orderStateStr) {
        var orderContent;

        if (!order || order.length === 0) {
            return <div className="tip">
                <div>您还没有{this.checkOrder(this.state.tab)}订单哦！</div>
                <WhiteSpace/>
                <Button type="ghost" inline size="small" onClick={()=>{this.linkTo('/home')}}>去逛逛</Button>
            </div>
        } else {
            orderContent = order && order.map((item, index) => {
                console.log('itemitemitemitemitemitemitemitem',item)
                if (item.orderItems.length === 1) {
                    const singleProduct = item.orderItems && item.orderItems.map((product, index2) =>{
                        return <div key={index} className="order_card">
                            <div className="order_card_group">
                                <span>游买有卖</span>
                                {/*<span style={{marginLeft:'1rem'}}>下单人id:{this.state.wechatId}</span>*/}
                                <span className="order_card_status">{this.checkDetailState(item.orderState)}</span>
                            </div>
                            {/*<Link to='/my/order/detail'>*/}
                            <Link to={{pathname:this.isRefundOrder(item.orderState), orderId: item.id, orderState: item.orderState}}>
                                <Flex style={{background:'#F7F7F7'}}>
                                    <Flex.Item style={{flex: '0 0 25%'}}>
                                        <img src={"http://" + getServerIp() + product.iconURL.thumbnailPath} style={{width: '60%', margin:'0.8rem'}}/>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: '0 0 40%', color:'black', fontSize:'0.8rem'}}>
                                        <div style={{marginBottom: 10}}>{product.name}</div>
                                        <div style={{marginBottom: 10, color:'#ccc'}}>{product.specification}</div>
                                        <WhiteSpace/>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: '0 0 25%', fontSize:'0.8rem'}}>
                                        <div style={{marginBottom: 10, color:'black', textAlign:'right'}}>￥{product.salePrice}</div>
                                        <div style={{marginBottom: 10, color:'#ccc', textAlign:'right'}}>x {product.quantity}</div>
                                        <WhiteSpace/>
                                    </Flex.Item>
                                </Flex>
                            </Link>
                            <div className="order_card_group">
                                <Flex justify="between">
                                {this.checkAll(orderStateStr, item.orderState, item.id)}
                                <div>共{item.orderItems.length}件商品 合计：￥{item.payMoney}</div>
                                {this.getOrderButton(this.state.tab, item)}
                                </Flex>
                            </div>
                            
                        </div>
                    });
                    return singleProduct
                } else {
                    const images = item.orderItems && item.orderItems.map((product, index2) => {
                        return <Flex.Item key={index2} style={{flex: '0 0 25%'}}>
                            <img src={"http://" + getServerIp() + product.iconURL.thumbnailPath} style={{width: '60%', margin:'0.8rem'}}/>
                        </Flex.Item>
                    });

                    return <div key={index} className="order_card">
                        <div className="order_card_group">
                            <span>游买有卖</span>
                            <span className="order_card_status">{this.checkDetailState(item.orderState)}</span>
                        </div>
                        <Link to={{pathname:this.isRefundOrder(item.orderState), orderId: item.id, orderState: item.orderState}}>
                            <Flex style={{background:'#F7F7F7'}}>
                                {images}
                            </Flex>
                        </Link>
                        <div className="order_card_group">
                        <Flex justify="between">
                            {this.checkAll(orderStateStr, item.orderState, item.id)}
                            <div>共{item.orderItems.length}件商品 合计：￥{item.payMoney}</div>
                            {this.getOrderButton(this.state.tab, item)}
                        </Flex>
                        </div>
                        {/* {this.getOrderButton(this.state.tab, item)} */}
                    </div>
                }
            });
        }

        return  <div ref={el => this.lv = el} style={{
            height: this.state.height,
            overflow: 'scroll',
        }}> 
        <PullToRefresh
            style={{
                height: this.state.height,
                overflow: 'scroll',
            }}
            indicator={{}} // activate:"释放加载",deactivate: '上拉加载',release:"加载中",finish: "加载完成"
            direction={'down'}
            refreshing={this.state.refreshing}
            onRefresh={() => {
                this.setState({ refreshing: true });
                this.requestTabData(this.state.tab, 1, pageSize);
                this.setState({
                    curOrderPage: 2,
                });
                // if(this.state.down){//刷新事件
                //     // this.clearData();
                //     this.requestTabData(this.state.tab, 1, pageSize);
                //     this.setState({
                //         curOrderPage: 2,
                //     });
                // }
                // else{//加载事件
                //     // 请求新的数据
                //     // TODO:分页    
                //     console.log("请求第", this.state.curOrderPage);
                //     this.requestTabData(this.state.tab, this.state.curOrderPage, pageSize);
                //     this.setState({
                //         curOrderPage: ++this.state.curOrderPage,
                //     });
                // }
                console.log("处理刷新事件");
                
                setTimeout(() => {
                    this.setState({ refreshing: false });
                }, 1000);
            }}
        >
        <div ref={el => this.lv = el} style={{
                height: this.state.height,
                // overflow: 'scroll',
            }}> 
            {orderContent}
            <div className='addMore' onClick={()=>this.addMore()}>加载更多</div>
        </div>
        
        </PullToRefresh>
        </div>
    }

    addMore(){
        this.requestTabData(this.state.tab, this.state.curOrderPage, pageSize);
        this.setState({
                curOrderPage: ++this.state.curOrderPage,
        });
    }
    linkTo(link) {
        this.context.router.history.push(link);
    }


    render() {
        console.log("this");
        // console.log("this.state.pay: ", this.state.pay);
        // console.log("this.state.deliver: ", this.state.deliver);
        // console.log("this.state.receive: ", this.state.receive);
        // console.log("this.state.evaluate: ", this.state.evaluate);
        // console.log("this.state.refund: ", this.state.refund);

        const allOrders = this.getOrderContent(this.state.all, "all");
        const payOrders = this.getOrderContent(this.state.pay, "");
        const deliverOrders = this.getOrderContent(this.state.deliver, "");
        const receiveOrders = this.getOrderContent(this.state.receive, "");
        const evaluateOrders = this.getOrderContent(this.state.evaluate, "");
        const refundOrders = this.getOrderContent(this.state.refund, "");


        return <Layout header={false} footer={false}>

            <Navigation title="我的订单" left={true} backLink='/my'/>

            <div className="order_container" onTouchStart={this.state.touchStart} onTouchEnd={this.state.touchEnd}>
            <Tabs tabs={tabs}
                  initialPage={this.state.id}
                //   swipeable={false}
                useOnPan={false}
                  // animated={false}
                  onChange={(tab, index) => {this.onTabChange(tab, index)}}
                  // style={{backgroundColor:'#eee'}}
                >

                    {allOrders}
                    {payOrders}
                    {deliverOrders}
                    {receiveOrders}
                    {evaluateOrders}
                    {refundOrders}

                </Tabs>
            </div>
        </Layout>

    }
}

const tabs = [
    { title: '全部', sub: '0' },
    { title: '待付款', sub: '1' },
    { title: '待发货', sub: '2' },
    { title: '待收货', sub: '3' },
    { title: '待评价', sub: '4' },
    { title: '退款', sub: '5'},
];

Order.contextTypes = {
    router: PropTypes.object.isRequired
};
