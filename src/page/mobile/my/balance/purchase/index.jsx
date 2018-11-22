import React from "react";
import {List, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import couponApi from "../../../../../api/coupon.jsx";

const Item = List.Item;
const Brief = Item.Brief;

// const wechatId = localStorage.getItem("wechatId");

export default class BalancePurchase extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            purchase: []
        };
    }

    componentWillMount() {
        this.requestBalancePurchase(localStorage.getItem("wechatId"));
    }

    requestBalancePurchase(wechatId) {
        console.log("requestBalancePurchase");
        couponApi.getBalancePurchase(wechatId, (rs) => {
            console.log("我的购买",rs);
            if (rs && rs.success) {
                const purchase = rs.obj;

                this.setState({
                    purchase: purchase
                });
            }
        });
    }

    getDate(date) {
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = date.getDate() + ' ';
        return Y+M+D
    }


    render() {

        // if(JSON.stringify(this.state.purchase) === "[]") {
        //     return null
        // }
        console.log("this.state.purchase", this.state.purchase);

        const content = this.state.purchase && this.state.purchase.map((item, index) => {
            return <Item key={index} multipleLine
                         onClick={() => {}}
                         extra={item.orderAmount + "张"}
                    >
                <span>
                    ￥{item.sum}
                </span>
                <Brief>{this.getDate(new Date(item.orderTime))}购买</Brief>
            </Item>
        });

        return <Layout>

            <Navigation title="我的购买" left={true}/>

            <WhiteSpace/>

            <List>
                {content}
            </List>

        </Layout>
    }

}