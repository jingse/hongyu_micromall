import React from "react";
import {List, Button, Toast, InputItem, Modal, WhiteSpace, WingBlank} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import { createForm } from 'rc-form';
import couponApi from "../../../../../api/coupon.jsx";
import PropTypes from "prop-types";

const Item = List.Item;
const prompt = Modal.prompt;
var itemKey = 1;

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

    componentWillMount() {
        // if (!localStorage.getItem("bindPhone")) {
        //     Toast.info('您还没有绑定手机号，不能充值哦！', 1);
        // } else {
        //     const phone = localStorage.getItem("bindPhone");
        //     this.getUnrechargedCoupons(wechatId, phone, 1, 10);
        // }

        // const phone = (!localStorage.getItem("bindPhone")) ? "18870245475" : localStorage.getItem("bindPhone");
        // this.getUnrechargedCoupons(wechatId, phone, 1, 10);
    }

    getUnrechargedCoupons(wechatId, phone, page, rows) {
        couponApi.getBalancePurchase(wechatId, phone, page, rows, (rs)=>{
            if (rs && rs.success) {
                const recharge = rs.obj;

                this.setState({
                    recharge
                });
            }
        });
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
            activationCode: val.replace(/\s+/g,""),
        });
    };

    // addAnItem() {
    //     const { getFieldProps } = this.props.form;
    //     console.log("this.props.form.getFieldValue(\"couponCode\" + itemKey)", this.props.form.getFieldValue("couponCode" + itemKey));
    //     this.state.items.push(<Item key={itemKey++} extra={<Button type="ghost" inline size="small" style={{ marginRight: '4px' }}
    //                                     onClick={() => prompt('输入激活码', '请输入电子券对应的激活码',
    //                                         [
    //                                             {
    //                                                 text: '取消',
    //                                                 onPress: value => new Promise((resolve) => {
    //                                                     Toast.info('已取消', 1);
    //                                                     setTimeout(() => {
    //                                                         resolve();
    //                                                         console.log(`value:${value}`);
    //                                                     }, 100);
    //                                                 }),
    //                                             },
    //                                             {
    //                                                 text: '确定',
    //                                                 onPress: value => new Promise((resolve, reject) => {
    //                                                     if(!value) {
    //                                                         Toast.info('您还未输入激活码', 1);
    //                                                     } else{
    //                                                         this.bindCouponRequest(wechatId,  this.props.form.getFieldValue("couponCode"), value);
    //                                                     }
    //
    //                                                     setTimeout(() => {
    //                                                         reject();
    //                                                         console.log(`value:${value}`);
    //                                                     }, 500);
    //                                                 }),
    //                                             },
    //                                         ], 'default', null, ['输入激活码'])}>
    //                                         充值
    //                                     </Button>}>
    //         <InputItem {...getFieldProps("couponCode")} placeholder="输入充值卡卡号"/>
    //     </Item>);
    //
    //     this.setState({
    //         items: this.state.items,
    //     });
    // }


    render() {
        // const content = this.state.recharge && this.state.recharge.map((item, index) => {
        //     return <Item key={index}
        //                  extra={<Button type="ghost" inline size="small" style={{ marginRight: '4px' }}
        //                                 onClick={() => {this.bindCouponRequest(wechatId, item.couponCode, item.activationCode);}}
        //                  >
        //                      充值
        //                  </Button>}>
        //         {item.couponCode}
        //         </Item>
        // });

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
                <div className="secondary_btn" style={{width:'50%'}} onClick={() => {history.go(-1)}}>
                    返回
                </div>
                {/*<Link to={{pathname: "/home/recharge/payment", state: this.state.rechargeInfo}} className="primary_btn" style={{width:'40%'}}*/}
                {/*onClick = {()=>{this.rechargePay()}}>*/}
                {/*结算*/}
                {/*</Link>*/}
                <div className="primary_btn" style={{width:'50%'}} onClick = {()=>{this.bindCouponRequest(wechatId, this.state.activationCode)}}>
                    确定
                </div>
            </div>

            {/*<List renderHeader="可直接激活的电子券">*/}
                {/*{content}*/}
            {/*</List>*/}

            {/*<List renderHeader="添加充值卡激活">*/}
                {/*<Item extra={<img src="./images/icons/添加.png" onClick={() => {this.addAnItem()}}/>}>添加一条充值卡</Item>*/}
                {/*{this.state.items}*/}
            {/*</List>*/}

            {/*<List>*/}
                {/*<Item extra={<img src="./images/icons/添加.png" onClick={() => {this.addAnItem()}}/>}>添加充值卡激活</Item>*/}
                {/*{content}*/}

                {/*{this.state.items}*/}
            {/*</List>*/}

        </Layout>
    }

}

BalanceRecharge.contextTypes = {
    router: PropTypes.object.isRequired
};

const BalanceRechargeWrapper = createForm()(BalanceRecharge);
export default BalanceRechargeWrapper;