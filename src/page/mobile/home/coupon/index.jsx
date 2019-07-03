import React from "react";
import {List, NoticeBar, WhiteSpace} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import homeApi from "../../../../api/home.jsx";

const Item = List.Item;
const Brief = Item.Brief;

const wechatId = localStorage.getItem("wechatId");

export default class HomeCoupon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            couponData: [],
        };
    }

    componentWillMount() {
        this.requestCoupons(wechatId);
    }

    requestCoupons(wechatId) {
        homeApi.getCouponList(wechatId, (rs) => {
            if (rs && rs.success) {
                const couponData = rs.obj;
                this.setState({
                    couponData
                });
            }
        });
    }

    getSpecificCoupon(couponId, wechatId) {
        homeApi.getCoupon(couponId, wechatId, (rs) => {
            if (rs && rs.success) {
                // console.log(rs.msg);
                this.requestCoupons(wechatId);
            }
        });
    }

    checkCoupon(acquired, id) {
        if (acquired)
            return;

        this.getSpecificCoupon(id, wechatId);
    }


    render() {

        const content = this.state.couponData && this.state.couponData.map((item, index) => {
            return <Item key={index} multipleLine disabled={!!item.hasAcquired}
                         onClick={() => {
                             this.checkCoupon(item.hasAcquired, item.id)
                         }}
                         extra={new Date(item.endTime).toLocaleString() + "到期"}>
                <span style={{color: item.hasAcquired ? '#999' : 'black'}}>
                    ￥{item.money} {item.canOverlay ? <a style={{fontSize: '0.4rem', color: 'darkorange'}}>叠</a> : null}
                </span>
                <Brief>{item.specialtyCategory}满{item.condition}可用</Brief>
            </Item>
        });


        return <Layout header={false} footer={false}>

            <Navigation title="领券中心" left={true}/>

            <NoticeBar mode="closable" action={<span style={{color: '#a1a1a1'}}>不再提示</span>}>
                灰色代表已领取
            </NoticeBar>

            <WhiteSpace size='xs'/>

            <List>
                {content}
            </List>

        </Layout>
    }
}