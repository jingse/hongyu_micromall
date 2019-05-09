import React from 'react';
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import {List, WhiteSpace} from 'antd-mobile';
import './index.less';

const Item = List.Item;

export default class Coupon extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            unusedCoupons: [],
            usedCoupons: [],
            overdueCoupons: [],
            isLoading: false,
            // tabIndex: 0,
        };
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        // 通过API获取首页配置文件数据
        // 模拟ajax异步获取数据
        setTimeout(() => {
            const unused = coupon_data.unused;     //mock data
            const used = coupon_data.used;
            const overdue = coupon_data.overdue;
            this.setState({
                unusedCoupons: unused,
                usedCoupons: used,
                overdueCoupons: overdue,
            });
        }, 100);
    }


    render() {

        const unused_coupons = this.state.unusedCoupons && this.state.unusedCoupons.map((item, index) => {
            return <Item key={index} multipleLine onClick={() => {
            }} extra={item.info}>
                <div className="iconH iconH_inline icon_calendar" style={{margin: '0 5'}}/>
                {item.origin}
            </Item>
        });

        const used_coupons = this.state.usedCoupons && this.state.usedCoupons.map((item, index) => {
            return <Item key={index} multipleLine disabled onClick={() => {
            }} extra={item.info}>
                <div className="iconH iconH_inline icon_calendar" style={{margin: '0 5'}}/>
                {item.origin}
            </Item>
        });

        const overdue_coupons = this.state.overdueCoupons && this.state.overdueCoupons.map((item, index) => {
            return <Item key={index} multipleLine disabled onClick={() => {
            }} extra={item.info}>
                <div className="iconH iconH_inline icon_calendar" style={{margin: '0 5'}}/>
                {item.origin}
            </Item>
        });

        return <Layout footer={false}>

            <Navigation title="我的电子券" left={true}/>

            <WhiteSpace size='xs'/>

            <List renderHeader={() => <div>
                <div className="iconH iconH_inline icon_ticket" style={{margin: '0 5', height: '16px'}}/>
                未使用</div>}>
                {unused_coupons}
            </List>
            <List renderHeader={() => <div>
                <div className="iconH iconH_inline icon_ticket" style={{margin: '0 5', height: '16px'}}/>
                已使用</div>}>
                {used_coupons}
            </List>
            <List renderHeader={() => <div>
                <div className="iconH iconH_inline icon_ticket" style={{margin: '0 5', height: '16px'}}/>
                已过期</div>}>
                {overdue_coupons}
            </List>

        </Layout>
    }
}
