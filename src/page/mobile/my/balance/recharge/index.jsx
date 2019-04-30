import React from "react";
import {InputItem, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import {createForm} from 'rc-form';
import couponApi from "../../../../../api/coupon.jsx";
import PropTypes from "prop-types";


const wechatId = localStorage.getItem("wechatId");


class BalanceRecharge extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            recharge: [],
            items: [],
            activationCode: '',
        };
    }


    bindCouponRequest(wechatId, activationCode) {
        console.log("bind", activationCode);
        couponApi.bindCoupon(wechatId, activationCode, (rs) => {
            console.log("rs", rs);
            if (rs && rs.success) {
                console.log("rs", rs);
                Toast.info(rs.msg, 1);
                history.go(-1);
            } else {
                Toast.info('激活失败', 1);
            }
        });
    }

    onCodeChange = (val) => {
        // console.log(val);
        this.setState({
            activationCode: val.replace(/\s+/g, ""),
        });
    };


    render() {

        return <Layout>

            <Navigation title="余额充值" left={true}/>

            <WhiteSpace/>

            <WingBlank>
                请输入激活码：
            </WingBlank>

            <WhiteSpace/>
            <WhiteSpace/>

            <InputItem onChange={this.onCodeChange}>激活码</InputItem>


            <div className="coupon_cart cart_summary">
                <div className="secondary_btn" style={{width: '50%'}} onClick={() => {
                    history.go(-1)
                }}>
                    返回
                </div>
                <div className="primary_btn" style={{width: '50%'}} onClick={() => {
                    this.bindCouponRequest(wechatId, this.state.activationCode)
                }}>
                    确定
                </div>
            </div>

        </Layout>
    }

}

BalanceRecharge.contextTypes = {
    router: PropTypes.object.isRequired
};

const BalanceRechargeWrapper = createForm()(BalanceRecharge);
export default BalanceRechargeWrapper;