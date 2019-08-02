import React from 'react';
import PropTypes from "prop-types";
import {Button, Flex, Modal, PullToRefresh, Tabs, Toast, WhiteSpace} from 'antd-mobile';
import {Link} from 'react-router-dom';
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import {PayButton, CancelOrderButton, ConfirmReceiveButton, EvaluateOrderButton, ViewOrderDetailButton} from "../../../../components/order_button/orderButton.jsx";
import myApi from "../../../../api/my.jsx";
import orderApi from "../../../../api/my.jsx";
import paymentApi from "../../../../api/payment.jsx";
import WxManager from "../../../../manager/WxManager.jsx";
import PayManager from "../../../../manager/payManager.jsx";
import OrderManager from "../../../../manager/OrderManager.jsx";
import {SecondLineFontColor} from "../../../../manager/ConstantManager.jsx";
import {getServerIp} from "../../../../config.jsx";
import './index.less';


const alert = Modal.alert;
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

            all: [],
            pay: [],
            deliver: [],
            receive: [],
            evaluate: [],
            refund: [],

            isNull: false,

            curOrderPage: 2,
            pageNum: [0, 0, 0, 0, 0, 0],

            refreshing: false,                                   //刷新状态上拉
            height: document.documentElement.clientHeight,       //新添加高度
        };
        this.orderPaySuccessCallback = this.orderPaySuccessCallback.bind(this);
        this.orderPayFailCallback = this.orderPayFailCallback.bind(this);
        this.orderPayCallback = this.orderPayCallback.bind(this);
    }

    componentWillMount() {
        console.groupCollapsed("订单列表页");

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


        WxManager.auth();
    }

    componentDidMount() {
        WxManager.share();
    }

    componentWillUnmount() {
        console.groupEnd();
    }

    requestTabData(tab, page, rows) {
        this.setState({isNull: false});
        switch (tab) {
            case 0:
                this.requestAllOrder(this.state.wechatId, page, rows);
                break;
            case 1:
                this.requestPayOrder(this.state.wechatId, page, rows);
                break;
            case 2:
                this.requestDeliverOrder(this.state.wechatId, page, rows);
                break;
            case 3:
                this.requestReceiveOrder(this.state.wechatId, page, rows);
                break;
            case 4:
                this.requestEvaluateOrder(this.state.wechatId, page, rows);
                break;
            case 5:
                this.requestRefundOrder(this.state.wechatId, page, rows);
                break;
        }
    }

    requestAllOrder(wechatId, page, rows) {
        console.log("请求所有订单");
        //所有订单
        myApi.getAllOrderListByAccount(wechatId, page, rows, (rs) => {
            const allOrder = rs.obj.rows;
            console.log("allOrder", rs);
            let alltemp = (page === 1) ? allOrder : this.state.all.concat(allOrder);
            this.state.pageNum[this.state.tab] = rs.obj.totalPages;
            this.setState({
                all: alltemp,
                pageNum: this.state.pageNum,
            });
            if (page === 1 && allOrder.length <= 0) {
                this.setState({isNull: true});
                return;
            }
            if (allOrder.length <= 0)
                Toast.info("没有更多订单", 1);
        });
    }

    requestPayOrder(wechatId, page, rows) {
        console.log("请求待付款订单");
        //待付款订单
        myApi.getOrderListByAccount(wechatId, 0, page, rows, (rs) => {
            const payOrder = rs.obj.rows;
            console.log("请求待付款订单", rs);
            let paytemp = (page === 1) ? payOrder : this.state.pay.concat(payOrder);
            this.state.pageNum[this.state.tab] = rs.obj.totalPages;
            this.setState({
                pay: paytemp,
                pageNum: this.state.pageNum,
            });
            if (page === 1 && payOrder.length <= 0) {
                this.setState({isNull: true});
                return;
            }
            if (payOrder.length <= 0)
                Toast.info("没有更多订单", 1);
        });

    }

    requestDeliverOrder(wechatId, page, rows) {
        console.log("请求待发货订单");
        let delivertemp = (page === 1) ? [] : this.state.deliver;
        let totalNum = 0;
        //待发货订单
        myApi.getOrderListByAccount(wechatId, 1, page, rows, (rs) => {
            let order1 = rs.obj.rows;
            totalNum += rs.obj.total;

            myApi.getOrderListByAccount(wechatId, 2, page, rows, (rs) => {
                let order2 = rs.obj.rows;
                order1 = order1.concat(order2);
                totalNum += rs.obj.total;

                myApi.getOrderListByAccount(wechatId, 3, page, rows, (rs) => {
                    let order3 = rs.obj.rows;
                    order1 = order1.concat(order3);
                    totalNum += rs.obj.total;
                    this.state.pageNum[this.state.tab] = Math.ceil(totalNum / rs.obj.pageSize);
                    this.setState({
                        deliver: delivertemp.concat(order1),
                        pageNum: this.state.pageNum,
                    });
                    if (page === 1 && order1.length <= 0) {
                        this.setState({isNull: true});
                        return;
                    }
                    if (order1.length <= 0)
                        Toast.info("没有更多订单", 1);
                });
            });
        });
    }

    requestReceiveOrder(wechatId, page, rows) {
        console.log("请求待收货订单");
        let receivetemp = (page === 1) ? [] : this.state.receive;
        //待收货订单
        myApi.getOrderListByAccount(wechatId, 4, page, rows, (rs) => {
            const order = rs.obj.rows;
            this.state.pageNum[this.state.tab] = rs.obj.totalPages;
            console.log("order", order, rs);
            console.log("receivetemp", receivetemp);
            this.setState({
                receive: receivetemp.concat(order),
                pageNum: this.state.pageNum,
            });
            if (page === 1 && order.length <= 0) {
                this.setState({isNull: true});
                return;
            }
            if (order.length <= 0)
                Toast.info("没有更多订单", 1);
        });

    }

    requestEvaluateOrder(wechatId, page, rows) {
        console.log("请求待评价订单");
        console.log("requestEvaluateOrder page", page);
        let evaluateetemp = (page === 1) ? [] : this.state.evaluate;
        //待评价订单
        let order = [];
        let totalNum = 0;
        myApi.getOrderListByAccount(wechatId, 5, page, rows, (rs) => {
            let order1 = rs.obj.rows;
            let valid1 = [];
            order1 && order1.map((item, index) => {
                if (!item.isAppraised) {
                    valid1.push(item);
                }
            });
            order = order.concat(valid1);
            totalNum += rs.obj.total;
            myApi.getOrderListByAccount(wechatId, 6, page, rows, (rs) => {
                const order2 = rs.obj.rows;
                let valid2 = [];
                order2 && order2.map((item, index) => {
                    if (!item.isAppraised) {
                        valid2.push(item);
                    }
                });
                order = order.concat(valid2);
                console.log("requestEvaluateOrder", evaluateetemp.concat(order));
                totalNum += rs.obj.total;
                this.state.pageNum[this.state.tab] = Math.ceil(totalNum / rs.obj.pageSize);
                this.setState({
                    evaluate: evaluateetemp.concat(order),
                    pageNum: this.state.pageNum,
                });
                if (page === 1 && order.length <= 0) {
                    this.setState({isNull: true});
                    return;
                }
                if (order.length <= 0)
                    Toast.info("没有更多订单", 1);
            });
        });

    }

    requestRefundOrder(wechatId, page, rows) {
        console.log("请求退款订单");
        let refundtemp = (page === 1) ? [] : this.state.refund;
        let totalNum = 0;
        //退款订单
        myApi.getOrderListByAccount(wechatId, 8, page, rows, (rs) => {
            let order1 = rs.obj.rows;
            totalNum += rs.obj.total;

            myApi.getOrderListByAccount(wechatId, 9, page, rows, (rs) => {
                let order2 = rs.obj.rows;
                order1 = order1.concat(order2);
                totalNum += rs.obj.total;

                myApi.getOrderListByAccount(wechatId, 10, page, rows, (rs) => {
                    let order3 = rs.obj.rows;
                    order1 = order1.concat(order3);
                    totalNum += rs.obj.total;

                    myApi.getOrderListByAccount(wechatId, 11, page, rows, (rs) => {
                        let order4 = rs.obj.rows;
                        order1 = order1.concat(order4);
                        totalNum += rs.obj.total;

                        myApi.getOrderListByAccount(wechatId, 12, page, rows, (rs) => {
                            let order5 = rs.obj.rows;
                            order1 = order1.concat(order5);
                            totalNum += rs.obj.total;
                            let baseNum = totalNum / rs.obj.pageSize;
                            // console.warn("baseNum", baseNum);
                            this.state.pageNum[this.state.tab] = Math.ceil(totalNum / rs.obj.pageSize);

                            this.setState({
                                refund: refundtemp.concat(order1),
                                pageNum: this.state.pageNum,
                            });
                            if (page === 1 && order1.length <= 0) {
                                this.setState({isNull: true});
                                return;
                            }
                            if (order1.length <= 0)
                                Toast.info("没有更多订单", 1);
                        });
                    });

                });

            });

        });
    }

    static isRefundOrder(state) {
        if (state === 8 || state === 9 || state === 10 || state === 11)
            return '/my/order/refund/detail';
        else
            return '/my/order/detail';
    }


    getOrderButton(tab, item) {
        switch (tab) {
            case 0:
                return null;

            case 1:
                return <Flex justify="between" style={{width: '50%'}}>
                    <PayButton payAction={this.payCharge.bind(this, item)}/>
                    <CancelOrderButton cancelOrderAction={this.cancelOrderPay.bind(this, item.id)}/>
                </Flex>;

            case 2:
                if (item.orderState === 3 || item.orderState === 2)
                    return null;

                return <div style={{background: '#fff', textAlign: 'right'}}>
                    <WhiteSpace/>
                    <CancelOrderButton cancelOrderAction={this.cancelOrderConfirm.bind(this, item.id)}/>
                    <WhiteSpace/>
                </div>;

            case 3:
                return <div style={{background: '#fff', textAlign: 'right'}}>
                    <WhiteSpace/>
                    <ConfirmReceiveButton confirmReceiveAction={this.orderConfirmReceive.bind(this, item.id)}/>
                    <WhiteSpace/>
                </div>;

            case 4:
                return <div style={{background: '#fff', textAlign: 'right'}}>
                    <WhiteSpace/>
                    <EvaluateOrderButton evaluateOrderAction={this.evaluateOrderAction.bind(this, item)}/>
                    <WhiteSpace/>
                </div>;

            case 5:
                return <div style={{background: '#fff', textAlign: 'right'}}>
                    <WhiteSpace/>
                    <ViewOrderDetailButton viewOrderDetailAction={this.viewOrderAction.bind(this, item)}/>
                    <WhiteSpace/>
                </div>;
        }
    }

    onTabChange(tab, index) {
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

                this.requestTabData(1, 1, pageSize);
            }
        });
    }

    deleteOrder(orderId) {
        orderApi.deleteOrder(orderId, (rs) => {
            if (rs && rs.success) {
                console.log(rs.msg);

                this.requestTabData(0, 1, pageSize);
            }
        });
    }

    evaluateOrderAction(item) {
        this.context.router.history.push({pathname: '/my/order/comment', order: item});
    }

    viewOrderAction(item) {
        this.linkTo({pathname: '/my/order/refund/detail', orderId: item.id});
    }

    orderPaySuccessCallback() {
        this.requestTabData(1, 1, pageSize);
    }

    orderPayFailCallback() {
        Toast.info("支付失败");
    }

    orderPayCallback() {
        console.log('待付款刷新1')
        this.requestTabData(1, 1, pageSize);
    }

    payCharge(item) {
        const openid = localStorage.getItem("openid");
        console.log("item", item);
        orderApi.getOrderDetailById(item.id, (rs) => {

            let orderCode = item.orderCode;
            let shouldPayMoney = rs.obj.baseInfo.payMoney * 100;

            console.log('getOrderDetailById_rs', rs)
            console.log("shouldPayMoney", shouldPayMoney);

            paymentApi.confirmOrder(orderCode, shouldPayMoney, openid, (rs) => {
                console.log("confirmOrder rs", rs);

                let payConfig = {
                    "appId": rs.result.appId,
                    "nonceStr": rs.result.nonceStr,
                    "package": rs.result.package,
                    "paySign": rs.result.paySign,
                    "signType": rs.result.signType,
                    "timestamp": rs.result.timestamp,
                };

                PayManager.doPay(payConfig, this.orderPaySuccessCallback, null, this.orderPayFailCallback, this.orderPayCallback);

                console.log('待付款刷新2')
                this.requestTabData(1, 1, pageSize);
            });

        });
    }

    checkAll(orderStateStr, orderStateDetail, orderId) {
        if (orderStateStr === "all") {
            if (orderStateDetail === 6 || orderStateDetail === 7 || orderStateDetail === 12) {
                return <img src="./images/icons/删除.png" style={{width: '5%'}} onClick={() => alert('删除订单', '您确定要删除吗？', [
                    {
                        text: '取消', onPress: () => {
                        }
                    },
                    {
                        text: '确认', onPress: () => {
                            this.deleteOrder(orderId)
                        }
                    },
                ])}/>
            }
        }
        return <div/>
    }

    getOrderContent(order, orderStateStr) {
        let orderContent;

        if (this.state.isNull)
            return <div className="tip">
                <div>您还没有{OrderManager.checkOrder(this.state.tab)}订单哦！</div>
                <WhiteSpace/>
                <Button type="ghost" inline size="small" onClick={() => {
                    this.linkTo('/home')
                }}>去逛逛</Button>
            </div>;

        if (!order || order.length === 0) {
            return <div className="tip">请求中...</div>
        } else {
            orderContent = order && order.map((item, index) => {
                // console.log('itemitemitemitemitemitemitemitem', item)
                if (item.orderItems.length === 1) {
                    const singleProduct = item.orderItems && item.orderItems.map((product, index2) => {
                        return <div key={index} className="order_card">
                            <div className="order_card_group">
                                <span>下单时间：{new Date(item.orderTime).toLocaleString()}</span>
                                {/*<span style={{marginLeft:'1rem'}}>下单人id:{this.state.wechatId}</span>*/}
                                <span
                                    className="order_card_status">{OrderManager.checkDetailState(item.orderState)}</span>
                            </div>
                            {/*<Link to='/my/order/detail'>*/}
                            <Link to={{
                                pathname: Order.isRefundOrder(item.orderState),
                                orderId: item.id,
                                orderState: item.orderState
                            }}>
                                <Flex style={{background: '#F7F7F7'}}>
                                    <Flex.Item style={{flex: '0 0 25%'}}>
                                        <img src={"http://" + getServerIp() + product.iconURL.thumbnailPath}
                                             style={{width: '60%', margin: '0.8rem'}}/>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: '0 0 40%', color: 'black', fontSize: '0.8rem'}}>
                                        <div style={{marginBottom: 10}}>{product.name}</div>
                                        <div style={{marginBottom: 10, color: SecondLineFontColor}}>{product.specification}</div>
                                        <WhiteSpace/>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: '0 0 25%', fontSize: '0.8rem'}}>
                                        <div style={{
                                            marginBottom: 10,
                                            color: 'black',
                                            textAlign: 'right'
                                        }}>￥{product.salePrice}</div>
                                        <div style={{
                                            marginBottom: 10,
                                            color: SecondLineFontColor,
                                            textAlign: 'right'
                                        }}>x {product.quantity}</div>
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
                            <img src={"http://" + getServerIp() + product.iconURL.thumbnailPath}
                                 style={{width: '60%', margin: '0.8rem'}}/>
                        </Flex.Item>
                    });

                    return <div key={index} className="order_card">
                        <div className="order_card_group">
                            <span>游买有卖</span>
                            <span className="order_card_status">{OrderManager.checkDetailState(item.orderState)}</span>
                        </div>
                        <Link to={{
                            pathname: Order.isRefundOrder(item.orderState),
                            orderId: item.id,
                            orderState: item.orderState
                        }}>
                            <Flex style={{background: '#F7F7F7'}}>
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

        return <div ref={el => this.lv = el} style={{
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
                    this.setState({refreshing: true});
                    this.requestTabData(this.state.tab, 1, pageSize);
                    this.setState({
                        curOrderPage: 2,
                    });

                    console.log("处理刷新事件");

                    setTimeout(() => {
                        this.setState({refreshing: false});
                    }, 1000);
                }}
            >

                {orderContent}

                {this.state.curOrderPage <= this.state.pageNum[this.state.tab] ? <div className='addMore' onClick={() => this.addMore()}>加载更多</div> : null}

                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>

            </PullToRefresh>
        </div>
    }

    addMore() {
        this.requestTabData(this.state.tab, this.state.curOrderPage, pageSize);
        this.setState({
            curOrderPage: ++this.state.curOrderPage,
        });
    }

    linkTo(link) {
        this.context.router.history.push(link);
    }


    render() {
        // console.log("this.state.pay: ", this.state.pay);
        // console.log("this.state.deliver: ", this.state.deliver);
        // console.log("this.state.receive: ", this.state.receive);
        // console.log("this.state.evaluate: ", this.state.evaluate);
        // console.log("this.state.refund: ", this.state.refund);
        console.log("this.state.curPage", this.state.curOrderPage);
        console.log("this.state.pageNum", this.state.pageNum);

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
                      onChange={(tab, index) => {
                          this.onTabChange(tab, index)
                      }}
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
    {title: '全部', sub: '0'},
    {title: '待付款', sub: '1'},
    {title: '待发货', sub: '2'},
    {title: '待收货', sub: '3'},
    {title: '待评价', sub: '4'},
    {title: '退款', sub: '5'},
];

Order.contextTypes = {
    router: PropTypes.object.isRequired
};