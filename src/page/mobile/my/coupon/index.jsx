import React from 'react';
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import {WhiteSpace, List} from 'antd-mobile';
import coupon_data from "../../../../static/mockdata/coupon.js";
import './index.less';

const Item = List.Item;
// const Brief = Item.Brief;

export default class Coupon extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            unusedCoupons:[],
            usedCoupons:[],
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

    // onTabsChange(tab, index) {
    //     this.setState({
    //         isLoading: false,
    //         tabIndex: index
    //     });
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         this.setState({
    //             isLoading: false
    //         });
    //     }, 300);
    // }

    render() {
        // const tabs = [
        //     { title: '余额电子券', sub: 'default' },
        //     { title: '一次电子券', sub: 'use once' },
        //     { title: '未绑定电子券', sub: 'unbound' },
        // ];
        //
        // const balanceCoupon = this.state.coupons && this.state.coupons.map((item, index) => {
        //     if ((index + 1)% 2 === 0) {
        //         return <div className="coupon_value_even" key={index}>
        //             <Flex>
        //                 <Flex.Item className="coupon_title_value">{item.date}</Flex.Item>
        //                 <Flex.Item className="coupon_title_value">{item.origin}</Flex.Item>
        //                 <Flex.Item className="coupon_title_value">{item.price}</Flex.Item>
        //             </Flex>
        //         </div>
        //     }
        //     return <div className="coupon_value_odd" key={index}>
        //         <Flex>
        //             <Flex.Item className="coupon_title_value">{item.date}</Flex.Item>
        //             <Flex.Item className="coupon_title_value">{item.origin}</Flex.Item>
        //             <Flex.Item className="coupon_title_value">{item.price}</Flex.Item>
        //         </Flex>
        //     </div>
        // });
        //
        // const disposableCoupon = this.state.coupons && this.state.coupons.map((item, index) => {
        //     if ((index + 1)% 2 === 0) {
        //         return <div className="coupon_value_even" key={index}>
        //             <Flex>
        //                 <Flex.Item className="coupon_title_value">{item.date}</Flex.Item>
        //                 <Flex.Item className="coupon_title_value">{item.origin}</Flex.Item>
        //                 <Flex.Item className="coupon_title_value">{item.price}</Flex.Item>
        //             </Flex>
        //         </div>
        //     }
        //     return <div className="coupon_value_odd" key={index}>
        //         <Flex>
        //             <Flex.Item className="coupon_title_value">{item.date}</Flex.Item>
        //             <Flex.Item className="coupon_title_value">{item.origin}</Flex.Item>
        //             <Flex.Item className="coupon_title_value">{item.price}</Flex.Item>
        //         </Flex>
        //     </div>
        // });
        //
        // const unboundCoupon = this.state.coupons && this.state.coupons.map((item, index) => {
        //     if ((index + 1)% 2 === 0) {
        //         return <div className="coupon_value_even" key={index}>
        //             <Flex>
        //                 <Flex.Item className="coupon_title_value">{item.date}</Flex.Item>
        //                 <Flex.Item className="coupon_title_value">{item.origin}</Flex.Item>
        //                 <Flex.Item className="coupon_title_value">{item.price}</Flex.Item>
        //             </Flex>
        //         </div>
        //     }
        //     return <div className="coupon_value_odd" key={index}>
        //         <Flex>
        //             <Flex.Item className="coupon_title_value">{item.date}</Flex.Item>
        //             <Flex.Item className="coupon_title_value">{item.origin}</Flex.Item>
        //             <Flex.Item className="coupon_title_value">{item.price}</Flex.Item>
        //         </Flex>
        //     </div>
        // });
        //
        // const total = () => {
        //     if (coupon_data.counts % 2 === 0) {
        //         return <div className="coupon_value_odd">可用电子券：
        //             <span style={{float:'right', marginRight:'13%'}}>{coupon_data.total_price}</span>
        //         </div>
        //     }
        //     return <div className="coupon_value_even">可用电子券：
        //         <span style={{float:'right', marginRight:'13%'}}>{coupon_data.total_price}</span>
        //     </div>
        // };

        const unused_coupons = this.state.unusedCoupons && this.state.unusedCoupons.map((item, index) => {
            return <Item key={index} multipleLine onClick={() => {}} extra={item.info}>
                <div className="iconH iconH_inline icon_calendar" style={{margin:'0 5'}}/>{item.origin}
            </Item>
        });

        const used_coupons = this.state.usedCoupons && this.state.usedCoupons.map((item, index) => {
            return <Item key={index} multipleLine disabled onClick={() => {}} extra={item.info}>
                <div className="iconH iconH_inline icon_calendar" style={{margin:'0 5'}}/>{item.origin}
            </Item>
        });

        const overdue_coupons = this.state.overdueCoupons && this.state.overdueCoupons.map((item, index) => {
            return <Item key={index} multipleLine disabled onClick={() => {}} extra={item.info}>
                <div className="iconH iconH_inline icon_calendar" style={{margin:'0 5'}}/>{item.origin}
            </Item>
        });

        return <Layout footer={false}>

            <Navigation title="我的电子券" left={true}/>

            <WhiteSpace size='xs'/>

            {/*<div className="search_container">*/}
                {/*<Tabs tabs={tabs}*/}
                      {/*onChange={this.onTabsChange.bind(this)}*/}
                      {/*initialPage={this.state.tabIndex}*/}
                      {/*useOnPan={false}*/}
                {/*>*/}
                {/*</Tabs>*/}

                {/*<WhiteSpace size='xs'/>*/}

                {/*<Card style={{borderRadius:'7px', marginLeft:'0.8rem', marginRight:'0.8rem'}}>*/}
                    {/*<div className="coupon_title">*/}
                        {/*<Flex>*/}
                            {/*<Flex.Item className="coupon_title_value">时间</Flex.Item>*/}
                            {/*<Flex.Item className="coupon_title_value">来源/消费</Flex.Item>*/}
                            {/*<Flex.Item className="coupon_title_value">电子券</Flex.Item>*/}
                        {/*</Flex>*/}
                    {/*</div>*/}

                    {/*{balanceCoupon}*/}
                    {/*{total}*/}
                {/*</Card>*/}

            {/*</div>*/}


            <List renderHeader={() => <div><div className="iconH iconH_inline icon_ticket" style={{margin:'0 5', height:'16px'}}/>未使用</div>}>
                {/*<Item multipleLine onClick={() => {}} extra="50元代金券">*/}
                    {/*<div className="iconH iconH_inline icon_calendar" style={{margin:'0 5'}}/>携程飞机票*/}
                {/*</Item>*/}
                {/*<Item multipleLine onClick={() => {}} extra="8折优惠券">*/}
                    {/*<div className="iconH iconH_inline icon_pie" style={{margin:'0 5'}}/>儿童拼图店*/}
                {/*</Item>*/}
                {/*<Item multipleLine onClick={() => {}} extra="10元代金券">*/}
                    {/*<div className="iconH iconH_inline icon_await" style={{margin:'0 5'}}/>捷安特自行车*/}
                {/*</Item>*/}
                {unused_coupons}
            </List>
            <List renderHeader={() => <div><div className="iconH iconH_inline icon_ticket" style={{margin:'0 5', height:'16px'}}/>已使用</div>}>
                {/*<Item multipleLine disabled extra="30元代金券">*/}
                    {/*<div className="iconH iconH_inline icon_deliver" style={{margin:'0 5'}}/>水滴食品店*/}
                {/*</Item>*/}
                {used_coupons}
            </List>
            <List renderHeader={() => <div><div className="iconH iconH_inline icon_ticket" style={{margin:'0 5', height:'16px'}}/>已过期</div>}>
                {/*<Item multipleLine disabled extra="10元代金券">*/}
                    {/*<div className="iconH iconH_inline icon_comment" style={{margin:'0 5'}}/>小绿植株店*/}
                {/*</Item>*/}
                {/*<Item multipleLine disabled extra="20元代金券">*/}
                    {/*<div className="iconH iconH_inline icon_pay" style={{margin:'0 5'}}/>小明文具店*/}
                {/*</Item>*/}
                {overdue_coupons}
            </List>
            {/*<Submit><Link to="/discount/add">添加优惠券</Link></Submit>*/}


        </Layout>
    }
}
