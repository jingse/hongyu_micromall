import React from "react";
import { Link } from "react-router-dom";
import { Card, WhiteSpace } from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import wxApi from "../../../../../api/wechat.jsx";
import couponApi from "../../../../../api/coupon.jsx";
import PropTypes from "prop-types";

const wechatId = localStorage.getItem("wechatId");

export default class CouponBalance extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            payInfo: {},
            orderId: '',
        };
    }
    componentWillMount() {
        console.log('this.props.location',this.props.location)
        let payInfo = this.props.location.state.rechargeInfo;
        let orderId = this.props.location.state.orderId;
        console.log("payInfo    orderId", payInfo,orderId);
        this.setState({
            payInfo: payInfo,
            orderId: orderId,
        });

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

        // this.createCouponOrderOperation(this.state.payInfo.phone, this.state.payInfo.confirmCode, this.state.payInfo.couponMoneyId, this.state.payInfo.num);
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

    // createCouponOrderOperation(phone, confirmCode, couponTypeId, amount) {
    //     console.log("create coupon order: ");
    //     couponApi.submitCouponOrder(wechatId, phone, confirmCode, couponTypeId, amount, (rs)=>{
    //         console.log("rs.msg", rs.msg);
    //         console.log("rs", rs);
    //         if (rs && rs.success) {
    //             const couponOrderId = rs.obj;
    //             console.log("orderId: ", couponOrderId);
    //             this.setState({
    //                 orderId: couponOrderId,
    //             });
    //         }
    //     });
    // }

    // requestData() {
    //     const orderid = this.props.location.query || localStorage.getItem("nowOrderId");
    //     if (this.props.location.query) {
    //         localStorage.setItem("nowOrderId", this.props.location.query);
    //     }
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
                    console.log("支付成功，进来了");
                    couponApi.successfulCouponPayment(this.code, (rs) => {
                        console.log("successfulCouponPayment rs", rs);
                    });
                }
                this.context.router.history.push({pathname: '/home'});
            }.bind(this)
        );
    }

    payCharge() {
        const openid = localStorage.getItem("openid");
        const fee = Math.round(this.state.payInfo.price * this.state.payInfo.num * 100);
        console.log("paycharge ",this.state.orderId, fee, openid);
        couponApi.confirmCouponPayment(this.state.orderId, fee, openid, (rs) => {
            console.log("confirmCouponPayment rs: ", rs);
            this.appId = rs.result.appId;
            this.nonceStr = rs.result.nonceStr;
            this.package = rs.result.package;
            this.paySign = rs.result.paySign;
            this.signType = rs.result.signType;
            this.timestamp = rs.result.timestamp;

            this.code = this.state.orderId;
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

    render() {
        return <Layout header={false} footer={false}>

            <Navigation title="电子券结算" left={true}/>
            <WhiteSpace size='xs'/>

            <Card>
                <div style={{fontSize:'1rem', marginLeft:'2rem', padding:'0.8rem'}}>电子券余额：余额</div>
                <div style={{fontSize:'1rem', marginLeft:'2rem', padding:'0.8rem'}}>电子券面值：￥{this.state.payInfo.faceValue}</div>
                <div style={{fontSize:'1rem', marginLeft:'2rem', padding:'0.8rem'}}>电子券单价：￥{this.state.payInfo.price}</div>
                <div style={{fontSize:'1rem', marginLeft:'2rem', padding:'0.8rem'}}>电子券数量：{this.state.payInfo.num}</div>
                <div style={{fontSize:'1rem', marginLeft:'2rem', padding:'0.8rem'}}>接收手机号：{this.state.payInfo.phone}</div>
            </Card>

            <div className="coupon_cart cart_summary">
                <div className="secondary_btn" style={{width:'60%',fontSize:'0.8rem'}}>
                    合计：￥{this.state.payInfo.price * this.state.payInfo.num}
                </div>
                <span className="primary_btn" style={{width:'40%'}} onClick={this.payCharge.bind(this)}>支付</span>
            </div>

        </Layout>
    }
}

CouponBalance.contextTypes = {
    router: PropTypes.object.isRequired
};