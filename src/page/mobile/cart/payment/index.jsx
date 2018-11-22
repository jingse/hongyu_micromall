import React from 'react';
import { WhiteSpace, Flex, InputItem, List, Toast, Modal, Badge, NoticeBar } from 'antd-mobile';
import { Link } from 'react-router-dom';
// import LoadingHoc from "../../../common/loading-hoc.jsx";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx"
import Card from "../../../../components/card/index.jsx";
// import user_ship_address from "../../../../static/mockdata/user_ship_address.js"; // mock假数据
import './index.less';
import { createForm } from 'rc-form';
import PropTypes from "prop-types";
import wxApi from "../../../../api/wechat.jsx";
import productApi from "../../../../api/product.jsx";
import addressApi from "../../../../api/address.jsx";
import cartApi from "../../../../api/cart.jsx";
import paymentApi from "../../../../api/payment.jsx";
import {getServerIp} from "../../../../config.jsx";
import couponApi from "../../../../api/coupon.jsx";
import myApi from "../../../../api/my.jsx";

// 设置全局变量
// var balance = 0;

// var shipFee = 0;
// var couponSub = 0.0;

// var products = [];
const webusinessId = (!localStorage.getItem("uid")) ? 26 : parseInt(localStorage.getItem("uid"));


class Payment extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            address:[],
            products:[],
            orderPrice:[],
            priceResult:0,
            marks:'',
            // orderCode: '',
            available: true,

            isCreated: false,
            isNewOrder:false,

            ids: [],
            orderItems: [],
            balance:0,//余额
            balanceInput:'',//使用余额
            balancenum:0,
            shipFee:0,
            couponSub:0,//电子券
            presents: [],
        };
    }

    componentWillMount() {

        // get the items ticked in the shopping cart
        console.log('this.props.location',this.props.location);
        let products = (!this.props.location.products) ? JSON.parse(localStorage.getItem("products")) : this.props.location.products;
        let priceResult = (!this.props.location.price) ? JSON.parse(localStorage.getItem("priceResult")) : this.props.location.price;
        let presents = (!this.props.location.presents) ? JSON.parse(localStorage.getItem("presents")) : this.props.location.presents;
        let shipType = 0;
        let shipFee = 0;
        let couponSub = 0.0;

        

        //根据特产的id拿到shipType，来判断显示哪种地址
        //shipType=0：送货到家
        //shipType=1：加钱送货到家
        //shipType=2：门店自提
        
        products && products.map((item, index) => {
            productApi.getSpecialtySpecificationDetailBySpecialtyID(item.specialtyId, (rs) => {
                if (rs && rs.success) {
                    console.log('rsn', rs);
                    if (rs.obj[0].shipType > shipType) {
                        shipType = rs.obj.shipType;
                    }
                }
                //shipFee = rs.obj.shipFee;
                //console.log("邮费",shipFee);
            });
        });


        switch(shipType) {
            case 0:
                if (localStorage.hasOwnProperty("chooseAddress")) {
                    console.log("设置选择的地址");
                    this.setState({
                        address: JSON.parse(localStorage.getItem("chooseAddress")),
                    });
                }else{
                    this.requestDefaultUserAddress();
                    //shipFee = 9;//从接口中拿邮费
                    //shipFee = rs.obj.shipType;
                }
                break;
            case 1:
                if (localStorage.getItem("isVip") === "false") {
                    shipFee = 0.01; //邮费到时候从接口中拿
                }
                this.requestDefaultUserAddress();
                break;
            case 2:
                const uid = (!localStorage.getItem("uid")) ? 26 : localStorage.getItem("uid");
                this.requestDefaultMerchantAddress(uid);
                break;
        }
        


        if (this.props.location.products && this.props.location.price && this.props.location.presents) {
            // save the products and price
            localStorage.setItem("products", JSON.stringify(this.props.location.products));
            localStorage.setItem("priceResult", JSON.stringify(this.props.location.price));
            localStorage.setItem("presents", JSON.stringify(this.props.location.presents));
        }
        console.log(this.props.location.products);

        //如果选择了电子券，就减少相应的金额
        if(localStorage.getItem("reduce")) {
            couponSub = parseFloat(localStorage.getItem("reduce"));
            console.log("couponSub", couponSub);
        }
        this.setState({
            products: products,
            priceResult: priceResult,
            shipType:shipType,
            shipFee:shipFee,
            couponSub:couponSub,
            presents: presents,
        },()=>{
            const payMoney = this.state.priceResult.totalMoney - this.state.priceResult.promotionMoney + this.state.shipFee;
            localStorage.setItem("price", payMoney.toString());
            this.requestAvailableCoupon(payMoney.toString());
        });

        // calculate the should pay money
        // const price = this.state.priceResult;
        // this.state.shouldPay = price.totalMoney - price.promotionMoney + shipFee - couponSub - balance;
        // this.setState({
        //     shouldPay: this.state.shouldPay,
        // });

        //设拿到可用优惠券的参数
        

        // // create the order
        // const items = this.getOrderItems();
        // console.log("useCouponId", localStorage.getItem("useCouponId"));
        // this.cartCreateOrder(wechatId, webusinessId, items);

        console.log("localStorage.getItem(\"uid\")", localStorage.getItem("uid"));
        console.log("webusinessId", webusinessId);

        //微信相关
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
        myApi.getInfo(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                console.log('rs余额', rs);
                let balance = rs.obj.wechatAccount.totalbalance;
                let isNewOrder = rs.obj.wechatAccount.isNew;
                this.setState({balance:balance,isNewOrder:isNewOrder})
            }
        });


    }

    componentWillUnmount() {
        localStorage.removeItem("chooseAddress");
        localStorage.removeItem("useCouponId");
        localStorage.removeItem("choose");
        localStorage.removeItem("reduce");
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


    requestDefaultUserAddress() {
        addressApi.getDefaultUserAddress(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                console.log("default user address", rs);
                const address = rs.obj;

                this.setState({
                    address: address,
                });
            }
        });
    }

    requestDefaultMerchantAddress(uid) {
        addressApi.getDefaultMerchantAddress(uid, (rs) => {
            if(rs && rs.success) {
                const address = rs.obj;

                this.setState({
                    address: address,
                });
            }
        });
    }

    requestAvailableCoupon(price) {
        couponApi.getAvailableCoupon(parseInt(localStorage.getItem("wechatId")), price, (rs) => {
            console.log("available rs", rs);
            if (!rs.success || !rs.obj || JSON.stringify(rs.obj) === "[]") {
                this.setState({
                    available: false,
                });
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
                if(res.err_msg === "get_brand_wcpay_request:ok") {
                    // paymentApi.successfulPaymentCallback(this.code, (rs) => {
                    //
                    // });

                    this.linkTo({pathname: '/my/order', state:2});
                } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                    Modal.alert('取消付款', '您确认要取消吗？', [
                        { text: '再想想', onPress: () => {} },
                        { text: '确认', onPress: () => {
                            Toast.info("已取消，您可在个人中心的待付款订单查看", 1);
                            this.linkTo({pathname: '/my/order', state: 1});
                        } },
                    ])
                } else {
                    Toast.info("支付失败", 1);
                }

                //删除购物车相关商品
                if (localStorage.getItem("origin") === "cart") {
                    this.state.ids && this.state.ids.map((item, index) => {
                        cartApi.deleteItemsInCart(item, (rs) => {
                        });
                    });
                }

            }.bind(this)
        );
    }

    payCharge() {
        //如果没有填写或选择地址就不能支付
        if (!this.state.address || JSON.stringify(this.state.address) === "[]") {
            Toast.info("请先填写或选择地址！");
            return
        }

        //如果点击过立即支付，那么就直接支付，不再创建订单
        if (!this.state.isCreated) {
            // create the order
            const items = this.getOrderItems();
            console.log("useCouponId", localStorage.getItem("useCouponId"));
            this.cartCreateOrder(parseInt(localStorage.getItem("wechatId")), webusinessId, items);
        } else {
            this.cartConfirmOrder();
        }


    }


    getOrderItems() {
        console.log("this.props.location.products:", this.props.location.products);
        const items =  this.state.products && this.state.products.map((item, index) =>{
            if (localStorage.getItem("origin") === "cart") {
                this.state.ids.push(item.id);
                this.setState({ids : this.state.ids});
            }

            return {
                "quantity": item.quantity,
                "isGroupPromotion": item.isGroupPromotion,
                "purchaseItemId": null,
                "specialtySpecificationId": item.specialtySpecificationId,
                "specialtyId": item.specialtyId,
                "curPrice": item.curPrice.toFixed(2),
                "promotionId": item.promotionId
            };
        });
        console.log("ids", this.state.ids);
        console.log("items", items);
        return items;
    }


    cartCreateOrder(wechatId, webusinessId, items) {
        console.log("this.state.address", this.state.address);

        var presents = [];
        this.state.presents && this.state.presents.map((item, index) => {
            const present = {
                "id": null,
                // "iconURL": this.getSalesIconImg(item.fullPresentProduct.images),
                "isGroupPromotion": false,
                "curPrice": "0.00",
                "name": item.fullPresentProduct.name,
                "quantity": item.fullPresentProductNumber,
                "specialtyId": item.fullPresentProduct.id,
                "specialtySpecificationId": item.fullPresentProductSpecification.id,
                "specification": item.fullPresentProductSpecification.specification,
                "promotionId": item.promotionId,
                "isGift": true,
            };

            presents.push(present);
        });


        var order = {
            "orderPhone":null,//localStorage.getItem("bindPhone")
            "orderWechatId":wechatId,
            "webusinessId":webusinessId,

            "totalMoney":this.state.priceResult.totalMoney.toFixed(2),
            "promotionAmount":this.state.priceResult.promotionMoney.toFixed(2),
            "shipFee":this.state.shipFee.toFixed(2),
            "payMoney":(this.state.priceResult.totalMoney - this.state.priceResult.promotionMoney + this.state.shipFee - this.state.couponSub - this.state.balancenum).toFixed(2),
            "couponMoney":this.state.couponSub.toFixed(2),
            // "balanceMoney":balance.toFixed(2),
            "balanceMoney":(this.state.balancenum).toFixed(2),
            "shouldPayMoney":(this.state.priceResult.totalMoney - this.state.priceResult.promotionMoney + this.state.shipFee).toFixed(2),

            // "receiverRmark":"请送到我家",
            // "receiverName":"王五",
            // "receiverAddress":"北京市西土城路10号",
            // "receiverPhone":"13940404400",
            // "receiverType":1,

            "receiverRmark":this.state.marks,
            "receiverName":this.state.address.receiverName,
            "receiverAddress":this.state.address.receiverAddress,
            "receiverPhone":this.state.address.receiverMobile,
            "receiverType":this.state.shipType,

            // "orderItems":[
            //     {
            //         "quantity": 3,
            //         "isGroupPromotion": false,
            //         "purchaseItemId": null,
            //         "specialtySpecificationId": 70,
            //         "specialtyId": 71,
            //         "curPrice": 34.0.toFixed(2),
            //         "promotionId": null
            //     }
            // ],
            "orderItems":items.concat(presents),

            // "coupons": [1,2],
            // "coupons": [parseInt(localStorage.getItem("useCouponId"))],
            "coupons": (!parseInt(localStorage.getItem("useCouponId"))) ? [] : [parseInt(localStorage.getItem("useCouponId"))],
        };

        paymentApi.createOrder(order, (rs) => {
            console.log("create rs", rs);
            if(rs && rs.success) {
                console.log("createOrder rs: ", rs);
                const orderCode = rs.obj.orderCode;
                this.setState({
                    orderCode,
                    isCreated: true,
                }, () => {
                    this.cartConfirmOrder();
                });
            } else {
                Toast.info(rs.obj, 1);
            }
        });
    }

    cartConfirmOrder() {
        // const openid = 'oH0MfxK8jNSbMt0sTycKSVUbTnk0';//测试使用
        // const fee = '1';

        const openid = localStorage.getItem("openid");
        const shouldPay = this.state.priceResult.totalMoney - this.state.priceResult.promotionMoney + this.state.shipFee - this.state.couponSub - this.state.balancenum;
        const fee = Math.round(shouldPay * 100);


        console.log("this.state.orderCode", this.state.orderCode);

        paymentApi.confirmOrder(this.state.orderCode, fee, openid, (rs) => {
            console.log("confirm rs: ", rs);

            // this.appId = 'wx6d6fd71af24c22c3';
            this.appId = rs.result.appId;
            this.nonceStr = rs.result.nonceStr;
            this.package = rs.result.package;
            this.paySign = rs.result.paySign;
            this.signType = rs.result.signType;
            this.timestamp = rs.result.timestamp;

            this.code = this.state.orderCode;
            console.log("this.code", this.code);

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


    linkTo(link) {
        this.context.router.history.push(link);
    }

    checkAvailableCoupon() {
        if (this.state.available || localStorage.getItem("choose")) {
            return <List.Item style={{borderBottom:'1px solid #ccc'}} arrow="horizontal"
                              extra={localStorage.getItem("choose")}
                              onClick={() => {this.linkTo('/cart/payment/coupon')}}>
                优惠券
            </List.Item>
        }
        return <List.Item style={{borderBottom:'1px solid #ccc'}}
                          extra="暂无可用">
            优惠券
        </List.Item>
    }

    checkBalance() {
        const { getFieldProps } = this.props.form;

        // if (localStorage.getItem("balance") && parseInt(localStorage.getItem("balance")) !== 0) {
        if (this.state.balance !== 0) {
            // return <div className="balance_discount">
            //     {/*<div className="discount_select">个人明细</div>*/}
            //     {/*<div className="discount_title">发票信息</div>*/}
            //     <div className="balance_select">
            //
            //
            //     </div>
            //     <div className="balance_title">余额 <span style={{"color": 'orange'}}>￥{localStorage.getItem("balance")}</span></div>
            // </div>

            return <List style={{borderBottom: '1px solid #ccc'}}>
                <InputItem
                // {...getFieldProps('balanceInput', {
                //     normalize: (v, prev) => {
                //         if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                //             if (v === '.') {
                //                 return '0.';
                //             }
                //             return prev;
                //         }
                //         return v;
                //     },
                // })}
                type='money'
                value={this.state.balanceInput}
                placeholder="输入金额"
                maxLength={7}
                labelNumber={7}
                onChange={value => this.checkNum(value)}
                clear
            >余额<div  style={{"color": 'orange',display:'inline'}}>￥{this.state.balance}</div></InputItem>
            </List>
        }
        return null
    }
    checkNum(v){
        // console.log('v',v)
        // console.log('parseFloat(v)',parseFloat(v))
        let vNum = 0;
        if(v === ''){
            vNum = 0;
        }
        else{
            let moneyMax=parseFloat(this.state.balance.toFixed(2));
            let moneyp = parseFloat((this.state.priceResult.totalMoney - this.state.priceResult.promotionMoney + this.state.shipFee - this.state.couponSub).toFixed(2));
            // console.log('moneyp',moneyp)
            // console.log('moneyMax',moneyMax,parseFloat(v))
            if(moneyMax < moneyp){ 
                if(parseFloat(v) > moneyMax){
                    v = moneyMax.toFixed(2)
                }
            }
            if(moneyMax >= moneyp){
                if(parseFloat(v) >= moneyp || moneyp-parseFloat(v)<0.01){      
                    v = (moneyp-0.01).toFixed(2)
                }
               
            }
            vNum =parseFloat(v);
           
        } 
        this.setState({balanceInput:v,balancenum:vNum})
    }
    checkShipType() {
        switch (this.state.shipType) {
            case 0: return "送货到家";
            case 1: return "价钱送货到家";
            case 2: return "门店自提";
        }
    }

    checkFinalBalance() {
        if (this.state.balancenum && this.state.balanceInput !== "") {
            // return this.props.form.getFieldValue("balanceInput")
            return <div>
                <div className="discount_select price_text">-￥{this.state.balanceInput}</div>
                <div className="discount_title">余额</div>
                <WhiteSpace size="xs"/>
            </div>
        }
        // return balance
    }

    checkPromotionMoney(money) {
        if (money > 0) {
            return <div>
                <div className="discount_select price_text">-￥{money}</div>
                <div className="discount_title">立减</div>
                <WhiteSpace size="xs"/>
            </div>
        }
        return null
    }

    getSalesDetailIcon(salesImages) {
        var img = null;
        salesImages && salesImages.map((item, index) => {
            if (item.isLogo) {
                img = item.mediumPath
            }
        });
        console.log("img", img);
        return img
    }

    checkFullPresents() {
        var fullPresents = null;

        console.log("this.state.presents: ", this.state.presents);

        if (this.state.presents && JSON.stringify(this.state.presents) !== '[]') {

            fullPresents = this.state.presents && this.state.presents.map((item, index) => {
                console.log("item:", item);
                return <Flex style={{background:'#fff'}} key={index}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img src={"http://" + getServerIp() + this.getSalesDetailIcon(item.fullPresentProduct.images)} style={{width: '70%', height:'4rem', margin:'0.4rem'}}/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 60%', color:'black'}}>
                            <WhiteSpace/>
                            <div style={{marginBottom: 10, fontWeight:'bold'}}>
                                {item.fullPresentProduct.name}
                                <span style={{color:'darkorange', fontWeight:'bold'}}> (赠)</span>
                            </div>
                            <div style={{marginBottom: 10}}>赠品数量：<span style={{color:'red'}}>{item.fullPresentProductNumber}</span></div>
                            <div style={{marginBottom: 10}}>商品规格：<span style={{color:'red'}}>{item.fullPresentProductSpecification.specification}</span></div>
                            {/*<div>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div>*/}
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
            });

            return <Card className="payment_card clearfix">
                <List renderHeader={() => '赠品'}>
                {/*<List>*/}
                    {/*<div>赠品</div>*/}
                    {fullPresents}
                </List>
            </Card>
        }

        return fullPresents
    }

    backTo(specialtyId) {
        if (localStorage.getItem("origin") === "cart") {
            localStorage.removeItem("origin");
            this.context.router.history.push({pathname: '/cart'});
        } else if (localStorage.getItem("origin") === "sales_group") {
            localStorage.removeItem("origin");
            this.context.router.history.push({pathname: '/home/sales_group/detail'});
        } else {
            localStorage.setItem("dest", "/home");
            this.context.router.history.push({pathname: `/product/${specialtyId}`});
        }
    }

    checkDefault() {
        if (this.state.address.isDefaultReceiverAddress) {
            return <Badge text="默认" style={{ marginLeft: 2, padding: '0 3px', backgroundColor: '#21b68a', borderRadius: 2 }} />
        }
    }


    render() {
        const { getFieldProps } = this.props.form;

        if (!this.state.products || JSON.stringify(this.state.products) === "[]") {
            return null
        }

        const orderProducts = this.state.products && this.state.products.map((item, index) => {
            // if(item.isGroupPromotion) {
            //     return <Card className="payment_card clearfix" key={index}>
            //         <div className="payment_card_img">
            //             <img src={"http://" + getServerIp() + this.getSalesIconImg(item.pics)}/>
            //         </div>
            //         <div className="payment_card_text">
            //             <div className="title_text">{item.name}</div>
            //             <WhiteSpace/>
            //             <div className="num_text">x {item.quantity}</div>
            //             <div className="price_text">￥{item.curPrice}</div>
            //         </div>
            //     </Card>
            // }
            console.log('item11111111111111111111111111111',item)
            return <List.Item  key={index}>      
                <div className="payment_card_img">
                    <img src={"http://" + getServerIp() + item.iconURL.mediumPath}/>
                </div>
                <div className="payment_card_text">
                    <div className="title_text">{item.name}</div>
                    <div className="small_text">{item.isGroupPromotion?<WhiteSpace/> : item.specification}</div>
                    <div className="num_text">x {item.quantity}</div>
                    <div className="price_text">￥{item.curPrice}</div>
                </div>
            </List.Item>
        });

        return <Layout header={false} footer={false}>

            <Navigation title="支付" left={true}/>
            <WhiteSpace/>
            <div style={{display:this.state.isNewOrder?'inline':'none'}}>
            <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
                首单奖励：全现金购买，奖励订单金额的20%余额（最多不超过50元）
            </NoticeBar>
            </div>
            {/*<Card className="payment_card">*/}
                {/*<Link to="/address">*/}
                    {/*<Flex>*/}
                        {/*<Flex.Item style={{flex:'0 0 10%'}}>*/}
                            {/*<img src="./images/icons/地址.png" style={{width:'%10'}}/>*/}
                        {/*</Flex.Item>*/}
                        {/*<Flex.Item style={{flex:'0 0 70%'}}>*/}
                            {/*<div>收货人：{this.state.address.default_name}*/}
                                {/*<span style={{float:'right'}}>{this.state.address.default_tel}</span>*/}
                            {/*</div>*/}
                            {/*<div>收货地址：{this.state.address.default_address}</div>*/}
                        {/*</Flex.Item>*/}
                        {/*<Flex.Item style={{flex:'0 0 15%'}}>*/}
                            {/*<img src="./images/icons/向右.png" style={{width:'%10', float:'right'}}/>*/}
                        {/*</Flex.Item>*/}
                    {/*</Flex>*/}
                {/*</Link>*/}
            {/*</Card>*/}
            
            <Card className="payment_card">
                <Link to={{pathname:"/address",state:{fromSet:'cart'}  }} >
                    <Flex>
                        <Flex.Item style={{flex:'0 0 10%'}}>
                            <img src="./images/icons/地址.png" style={{width:'%10'}}/>
                            {this.checkDefault()}
                        </Flex.Item>
                        <Flex.Item style={{flex:'0 0 70%'}}>
                            {/*<Flex>*/}
                                {/*<Flex.Item style={{flex:'0 0 35%'}}>*/}
                                    {/*收货人：{this.state.address.receiverName}*/}
                                {/*</Flex.Item>*/}
                                {/*<Flex.Item style={{flex:'0 0 65%'}}>*/}
                                    {/*{this.state.address.receiverMobile}*/}
                                {/*</Flex.Item>*/}
                            {/*</Flex>*/}
                            <div>收货人：{this.state.address.receiverName}
                                <span style={{marginLeft:'10%'}}>{this.state.address.receiverMobile}</span>
                            </div>
                            <div>收货地址：{this.state.address.receiverAddress}</div>
                        </Flex.Item>
                        <Flex.Item style={{flex:'0 0 15%'}}>
                            <img src="./images/icons/向右.png" style={{width:'%10', float:'right'}}/>
                        </Flex.Item>
                    </Flex>
                </Link>
            </Card>

            <Card className="payment_card clearfix">
            <List>
            {orderProducts}
            </List>
            </Card>

            <WhiteSpace size="xs"/>

            {this.checkFullPresents()}



            <Card className="payment_card">
                <div>
                    {this.checkBalance()}

                    {/*<div className="discount" onClick={()=>{this.linkTo('/cart/payment/coupon')}}>*/}
                        {/*<div className="discount_select">暂无可用</div>*/}
                        {/*<div className="discount_title">优惠券</div>*/}
                    {/*</div>*/}

                    {this.checkAvailableCoupon()}

                    {/*<div className="discount">*/}
                        {/*<InputItem placeholder="选填">买家留言：</InputItem>*/}
                        {/*/!*<div>买家留言：</div>*!/*/}
                    {/*</div>*/}
                    <List style={{borderBottom:'1px solid #ccc'}}>
                        <InputItem {...getFieldProps("liuyan")} value={this.state.marks} onChange={(v) => { this.setState({marks:v}); }}>买家留言：</InputItem>
                        {/*<div>买家留言：</div>*/}
                    </List>
                    <List>
                        <List.Item>
                    <div className="discount clearfix">
                        <div className="discount_select price_text">{this.checkShipType()}</div>
                        <div className="discount_title">配送方式</div>
                        <WhiteSpace size="xs"/>
                        <div className="discount_select price_text">￥{this.state.priceResult.totalMoney}</div>
                        <div className="discount_title">商品金额</div>
                        <WhiteSpace size="xs"/>
                        {this.checkPromotionMoney(this.state.priceResult.promotionMoney)}
                        {this.checkFinalBalance()}
                        <div className="discount_select price_text">+￥{this.state.shipFee}</div>
                        <div className="discount_title">运费</div>
                        <WhiteSpace size="xs"/>
                        <div className="discount_select price_text">-￥{this.state.couponSub}</div>
                        <div className="discount_title">电子券</div>
                        <WhiteSpace size="xs"/>
                        <div className="discount_select price_text total">
                            ￥{(this.state.priceResult.totalMoney - this.state.priceResult.promotionMoney + this.state.shipFee - this.state.couponSub - this.state.balancenum).toFixed(2)}
                        </div>
                    </div>
                    </List.Item>
                    </List>
                </div>
                <WhiteSpace/>
                <WhiteSpace/>
                {/*<div className="bigbutton"*/}
                     {/*onClick={()=>{*/}
                         {/*// this.cartCreateOrder();*/}
                         {/*this.payCharge.bind(this);*/}
                     {/*}}>*/}
                    {/*确认支付*/}
                {/*</div>*/}
                <div className="bigbutton" onClick={this.payCharge.bind(this)}>确认支付</div>
                <div className="bigbutton cancel" onClick={() => {this.backTo(this.state.products[0].specialtyId)}}>取消付款</div>
            </Card>
        </Layout>
    }
}

Payment.contextTypes = {
    router: PropTypes.object.isRequired
};

const PaymentWrapper = createForm()(Payment);
export default PaymentWrapper;

// export default LoadingHoc(Payment);
