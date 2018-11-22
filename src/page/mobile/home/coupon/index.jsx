import React from "react";
import { List, WhiteSpace, NoticeBar } from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
// import home_coupon from "../../../../static/mockdata/home_coupon.js";//mock假数据
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
                // console.log("gridCategory", gridCategory);
            }
        });
    }

    getSpecificCoupon(couponId, wechatId) {
        homeApi.getCoupon(couponId, wechatId ,(rs)=>{
            if (rs && rs.success) {
                console.log(rs.msg);
                this.requestCoupons(wechatId);
            }
        });
    }

    // componentDidMount() {
    //     this.requestData();
    // }
    //
    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const data = home_coupon;   //mock假数据
    //         this.setState({
    //             couponData: data,
    //         });
    //     }, 300);
    // }

    checkCoupon(acquired, id) {
        // console.log("acquired: ", acquired);
        if (acquired) {
            return
        }

        this.getSpecificCoupon(id, wechatId);
    }

    isSuperimposed(isSuperimposed) {
        if (isSuperimposed) {
            return <a style={{fontSize:'0.4rem', color:'darkorange'}}>叠</a>
        }
        return
    }

    getColor(isReceived) {
        // console.log("isReceived: ", isReceived);
        if(isReceived) {
            return '#999'
        }
        return 'black'
    }

    checkDisabled(acquired) {
        if (acquired) {
            return true
        }
        return false
    }

    render() {

        // const content = this.state.couponData.data && this.state.couponData.data.map((item, index) => {
        //     return  <Item key={index} multipleLine onClick={() => {}} extra={item.coupon_due_time + "到期"}>
        //         <span style={{color:this.getColor(item.isReceived)}}>
        //             ￥{item.coupon_value} {this.isSuperimposed(item.isSuperimposed)}
        //         </span>
        //         <Brief>{item.coupon_category}{item.coupon_tag}</Brief>
        //     </Item>
        //
        // });
        const content = this.state.couponData && this.state.couponData.map((item, index) => {
            return  <Item key={index} multipleLine disabled={this.checkDisabled(item.hasAcquired)}
                          onClick={() => {this.checkCoupon(item.hasAcquired, item.id)}}
                          extra={new Date(item.endTime).toLocaleString() + "到期"}>
                <span style={{color: this.getColor(item.hasAcquired)}}>
                    ￥{item.money} {this.isSuperimposed(item.canOverlay)}
                </span>
                <Brief>{item.specialtyCategory}满{item.condition}可用</Brief>
            </Item>
        });


        return <Layout header={false} footer={false}>

            <Navigation title="领券中心" left={true}/>

            <NoticeBar mode="closable" action={<span style={{ color: '#a1a1a1' }}>不再提示</span>}>
                灰色代表已领取
            </NoticeBar>

            <WhiteSpace size='xs'/>

            <List>
                {content}
            </List>

        </Layout>
    }
}