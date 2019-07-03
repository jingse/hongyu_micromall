import React from "react";
import {Button, Card, Flex, InputItem, List, Modal, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import "./index.less";
import homeApi from "../../../../api/home.jsx";
import couponApi from "../../../../api/coupon.jsx";
import PropTypes from "prop-types";
import {createForm} from 'rc-form';
import {NumStepper} from "../../../../components/num_stepper/numStepper.jsx";

const Item = List.Item;
const Brief = Item.Brief;
const wechatId = localStorage.getItem("wechatId");


class Recharge extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            couponAvailable: [],
            price: 0,
            faceValue: 0,
            phone: "",
            num: 1,

            // val: 3,
            modal2: false,
            choose: '',
            rechargeInfo: {},

            couponMoneyId: 0,

            delay: false,
            timer: 60,
            siv: null
        };
    }

    componentWillMount() {
        this.requestRechargeCoupon();
    }

    componentWillUnmount() {
        clearInterval(this.state.siv);
    }

    requestRechargeCoupon() {
        homeApi.getSaleCouponList((rs) => {
            if (rs && rs.success) {
                const coupon = rs.obj;

                this.setState({
                    couponAvailable: coupon,
                });
            }
        });
    }


    addNum = (val) => {
        this.setState({
            num: (val + 1) < 11 ? val + 1 : 10,
        });
    };
    minusNum = (val) => {
        this.setState({
            num: (val - 1) > 1 ? val - 1 : 1,
        });
    };


    onPhoneChange = (val) => {
        // console.log(val);
        this.setState({
            phone: val.replace(/\s+/g, ""),
        });
    };

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    };

    onClose = (key, val, price, faceValue) => () => {
        this.setState({
            modal2: false,
            choose: val,
            price: price,
            faceValue: faceValue,
            couponMoneyId: key,
        });
    };

    getCode() {
        if (this.state.phone === "") {
            Toast.info("请先输入手机号！", 1);
        } else {
            couponApi.getCouponCode(this.state.phone, (rs) => {
                if (rs && rs.success) {
                    Toast.info("发送成功，注意查收", 1);
                    let siv = setInterval(() => {
                        this.setState({timer: this.state.timer - 1, delay: true, siv: siv}, () => {
                            if (this.state.timer === 0) {
                                clearInterval(siv);
                                this.setState({delay: false, timer: 60})
                            }
                        });
                    }, 1000);
                } else {
                    Toast.info(rs.msg);
                    console.log(rs);
                }
            });
        }
    }

    createCouponOrderOperation(phone, confirmCode, couponTypeId, amount, info) {
        console.log("create coupon order: ", phone, confirmCode, couponTypeId, amount, info);
        couponApi.submitCouponOrder(wechatId, phone, confirmCode, couponTypeId, amount, (rs) => {
            console.log("submitCouponOrder_rs", rs);
            if (rs && rs.success) {
                this.context.router.history.push({
                    pathname: '/home/recharge/payment',
                    state: {rechargeInfo: info, orderId: rs.obj}
                });
            } else {
                Toast.info("请输入正确的验证码", 1)
            }
        });
    }


    rechargePay() {
        let info = {
            "price": this.state.price,
            "faceValue": this.state.faceValue,
            // "price": '0.01',
            "phone": this.state.phone,
            "confirmCode": this.props.form.getFieldsValue().confirmCode,
            "num": this.state.num,
            'couponMoneyId': this.state.couponMoneyId,
        };
        this.setState({
            rechargeInfo: info,
        });
        this.createCouponOrderOperation(this.state.phone, this.props.form.getFieldsValue().confirmCode, this.state.couponMoneyId, this.state.num, info);
    }

    checkParams() {
        if (this.state.price === 0) {
            Toast.info("请选择电子券金额！", 1);
        } else if (this.state.phone === "") {
            Toast.info("请先输入手机号！", 1);
        } else if (!this.props.form.getFieldsValue().confirmCode) {
            Toast.info("请输入验证码！", 1);
        } else {
            this.rechargePay();
        }
    }

    linkTo(link) {
        this.context.router.history.push({pathname: link, state: this.state.rechargeInfo});
    }


    render() {

        const {getFieldProps} = this.props.form;

        return <Layout header={false} footer={false}>

            <Navigation title="电子券购买" left={true}/>

            <WhiteSpace size='xs'/>

            <Card>
                <InputItem disabled editable={false} value={"余额"}>类型</InputItem>
                <List.Item extra={this.state.choose ? this.state.choose : "请选择"}
                           onClick={this.showModal('modal2')}>金额</List.Item>
                <WingBlank style={{borderBottom: '1px solid #eee'}}>
                    <Flex>
                        <Flex.Item style={{flex: '0 0 20%', fontSize: '1.1rem'}}>数量</Flex.Item>
                        <Flex.Item style={{flex: '0 0 80%'}}>
                            <NumStepper numVal={this.state.num}
                                        minusNumAction={this.minusNum.bind(this, this.state.num)}
                                        addNumAction={this.addNum.bind(this, this.state.num)}/>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
                <InputItem type="phone" onChange={this.onPhoneChange}>手机号</InputItem>
                <Flex>
                    <Flex.Item style={{flex: '0 0 65%'}}>
                        <InputItem type="number" {...getFieldProps('confirmCode')}>验证码</InputItem>
                    </Flex.Item>
                    <Flex.Item>
                        <Button disabled={this.state.delay} type="primary" inline size="small"
                                style={{marginRight: '4px'}}
                                onClick={() => { this.getCode() }}>
                            {this.state.delay === false ? '获取验证码' : '重新发送(' + this.state.timer + ')'}
                        </Button>
                    </Flex.Item>
                </Flex>

            </Card>

            <div className="coupon_cart cart_summary">
                <div className="secondary_btn" style={{width: '60%', fontSize: '0.8rem'}}>
                    合计：￥{this.state.price * this.state.num}
                </div>
                <div className="primary_btn" style={{width: '40%'}} onClick={() => {
                    this.checkParams()
                }}>
                    结算
                </div>
            </div>

            <Modal
                popup
                visible={this.state.modal2}
                onClose={this.onClose('', '', 0)}
                animationType="slide-up"
            >
                <List renderHeader={() => <div>金额选择</div>} className="popup-list">
                    {this.state.couponAvailable.map((item, index) => (
                        <Item key={index} multipleLine
                              onClick={
                                  this.onClose(item.couponMoneyId, item.discountPrice + " 代 " + item.price, item.discountPrice, item.price)
                              }
                              extra={<span style={{textDecoration: 'line-through'}}>￥{item.price}</span>}>
                            <span>￥{item.discountPrice}</span>
                            <Brief>{new Date(item.endTime).toLocaleString()}到期</Brief>
                        </Item>
                    ))}
                </List>
            </Modal>

        </Layout>
    }
}

const RechargeWrapper = createForm()(Recharge);
export default RechargeWrapper;