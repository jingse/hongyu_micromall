import React from "react";
import {Checkbox, Flex, NoticeBar, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import couponApi from "../../../../../api/coupon.jsx";
import DateManager from "../../../../../manager/DateManager.jsx";

const CheckboxItem = Checkbox.CheckboxItem;
const wechatId = parseInt(localStorage.getItem("wechatId"));

export default class CouponChoose extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            available: [],
            choose: '',
        };
    }

    componentWillMount() {
        const price = parseFloat(localStorage.getItem("price"));
        console.log("localStorage.getItem(\"price\")", localStorage.getItem("price"));

        this.requestAvailableCoupon(price);
    }

    componentWillUnmount() {
        localStorage.removeItem("price");
    }


    requestAvailableCoupon(price) {
        couponApi.getAvailableCoupon(wechatId, price, (rs) => {
            if (rs && rs.success) {
                const availableCoupon = rs.obj;
                this.setState({
                    available: availableCoupon
                });
            }
        });
    }

    isChosen() {
        if (this.state.choose === '') {
            return <NoticeBar icon={null}>请选择优惠券</NoticeBar>
        }
        return <NoticeBar icon={null}>
            您已选中优惠券一张，共可抵用<span style={{color: 'darkorange'}}>￥{this.state.choose}</span>
        </NoticeBar>
    }

    checkOverlay(overlay) {
        if (overlay === 1) {
            return <div style={{marginBottom: 10, color: 'darkorange'}}>叠</div>
        }
        return <WhiteSpace/>
    }


    render() {

        const available_coupon = this.state.available && this.state.available.map((item, index) => {
            return <div key={index} style={{padding: '0 15px'}}>
                <Flex style={{background: '#fff'}}>
                    <Flex.Item style={{flex: '0 0 25%', backgroundColor: "#99CCFF"}}>
                        <div style={{textAlign: 'center', color: 'white'}}>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            <div style={{marginBottom: '0.5rem'}}>
                                <span>￥</span><span style={{fontSize: '1.3rem'}}>{item.sum}</span>
                            </div>
                            <div>满{item.couponCondition}可用</div>
                            <WhiteSpace/>
                            <WhiteSpace/>
                        </div>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 50%', color: 'black'}}>
                        <WhiteSpace/>
                        {this.checkOverlay(item.canOverlay)}
                        <div style={{marginBottom: 10, color: '#ccc'}}>
                            {DateManager.getDate(new Date(item.issueTime)) + " - " + DateManager.getDate(new Date(item.expireTime))}
                        </div>
                        <WhiteSpace/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 25%'}}>
                        <CheckboxItem onChange={() => {
                            localStorage.setItem("useCouponId", item.id);
                            localStorage.setItem("choose", "满" + item.couponCondition + "减" + item.sum);
                            localStorage.setItem("reduce", item.sum);
                        }}/>
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
            </div>
        });


        return <Layout header={false} footer={false}>

            <Navigation title="使用优惠券" left={true}/>

            <div style={{backgroundColor: '#eee'}}>
                {this.isChosen()}
                <WhiteSpace/>
                {available_coupon}
            </div>

        </Layout>
    }
}
