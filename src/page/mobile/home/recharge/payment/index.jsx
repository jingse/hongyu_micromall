import React from "react";
import PropTypes from "prop-types";
import {Card, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import couponApi from "../../../../../api/coupon.jsx";
import WxManager from "../../../../../manager/WxManager.jsx";
import PayManager from "../../../../../manager/payManager.jsx";


export default class CouponBalance extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            payInfo: {},
            orderId: '',
        };
        this.payCharge = this.payCharge.bind(this);
    }

    componentWillMount() {
        console.log('this.props.location', this.props.location)
        let payInfo = this.props.location.state.rechargeInfo;
        let orderId = this.props.location.state.orderId;
        console.log("payInfo    orderId", payInfo, orderId);
        this.setState({
            payInfo: payInfo,
            orderId: orderId,
        });

        WxManager.auth();
    }

    componentDidMount() {
        WxManager.share();
    }

    couponPaySuccessCallback() {
        console.log("支付成功，进来了");
        couponApi.successfulCouponPayment(this.code, (rs) => {
            console.log("successfulCouponPayment rs", rs);
        });
    }

    couponPayCancelCallback() {
        console.log("支付取消，进来了");
    }

    couponPayFailCallback() {
        console.log("支付失败，进来了");
    }

    couponPayCallback() {
        this.context.router.history.push({pathname: '/home'});
    }

    payCharge() {
        const openid = localStorage.getItem("openid");
        const fee = Math.round(this.state.payInfo.price * this.state.payInfo.num * 100);
        console.log("paycharge ", this.state.orderId, fee, openid);

        couponApi.confirmCouponPayment(this.state.orderId, fee, openid, (rs) => {
            console.log("confirmCouponPayment rs: ", rs);

            let payConfig = {
                "appId": rs.result.appId,
                "nonceStr": rs.result.nonceStr,
                "package": rs.result.package,
                "paySign": rs.result.paySign,
                "signType": rs.result.signType,
                "timestamp": rs.result.timestamp,
            };

            this.code = this.state.orderId;
            console.log("this.code", this.code);

            PayManager.doPay(payConfig, this.couponPaySuccessCallback, this.couponPayCancelCallback,
                this.couponPayFailCallback, this.couponPayCallback);
        });
    }

    render() {
        return <Layout header={false} footer={false}>

            <Navigation title="电子券结算" left={true}/>
            <WhiteSpace size='xs'/>

            <Card>
                <div style={{fontSize: '1rem', marginLeft: '2rem', padding: '0.8rem'}}>电子券余额：余额</div>
                <div style={{
                    fontSize: '1rem',
                    marginLeft: '2rem',
                    padding: '0.8rem'
                }}>电子券面值：￥{this.state.payInfo.faceValue}</div>
                <div style={{
                    fontSize: '1rem',
                    marginLeft: '2rem',
                    padding: '0.8rem'
                }}>电子券单价：￥{this.state.payInfo.price}</div>
                <div style={{
                    fontSize: '1rem',
                    marginLeft: '2rem',
                    padding: '0.8rem'
                }}>电子券数量：{this.state.payInfo.num}</div>
                <div style={{
                    fontSize: '1rem',
                    marginLeft: '2rem',
                    padding: '0.8rem'
                }}>接收手机号：{this.state.payInfo.phone}</div>
            </Card>

            <div className="coupon_cart cart_summary">
                <div className="secondary_btn" style={{width: '60%', fontSize: '0.8rem'}}>
                    合计：￥{this.state.payInfo.price * this.state.payInfo.num}
                </div>
                <span className="primary_btn" style={{width: '40%'}} onClick={this.payCharge}>支付</span>
            </div>

        </Layout>
    }
}

CouponBalance.contextTypes = {
    router: PropTypes.object.isRequired
};