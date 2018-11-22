import React from "react";
import { WhiteSpace, NoticeBar, Flex, Checkbox, Button } from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
// import coupon_available from "../../../../../static/mockdata/payment_coupon_available.js";
// import coupon_unavailable from "../../../../../static/mockdata/payment_coupon_unavailable.js";
import couponApi from "../../../../../api/coupon.jsx";

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

    // componentDidMount() {
    //     this.requestData();
    // }
    //
    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const available_data = coupon_available.data;     //mock data
    //         this.setState({
    //             available: available_data,
    //         });
    //     }, 100);
    // }

    // onTabsChange(tab, index) {
    //     this.setState({
    //         tabIndex: index
    //     });
    // }

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
        if(this.state.choose === '') {
            return <NoticeBar icon={null}>请选择优惠券</NoticeBar>
        }
        return <NoticeBar icon={null}>
            您已选中优惠券一张，共可抵用<span style={{color:'darkorange'}}>￥{this.state.choose}</span>
        </NoticeBar>
    }

    checkOverlay(overlay) {
        if (overlay === 1) {
            return <div style={{marginBottom: 10, color: 'darkorange'}}>叠</div>
        }
        return <WhiteSpace/>
    }

    getDate(date) {
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = date.getDate() + ' ';
        return Y+M+D
    }

    render() {

        const available_coupon = this.state.available && this.state.available.map((item, index) => {
            return <div key={index} style={{ padding: '0 15px' }}>
                    <Flex style={{background:'#fff'}}>
                        <Flex.Item style={{flex: '0 0 25%', backgroundColor:"#99CCFF"}}>
                            <div style={{textAlign:'center', color:'white'}}>
                                <WhiteSpace/>
                                <WhiteSpace/>
                                <div style={{marginBottom:'0.5rem'}}>
                                    <span>￥</span><span style={{fontSize:'1.3rem'}}>{item.sum}</span>
                                </div>
                                <div>满{item.couponCondition}可用</div>
                                <WhiteSpace/>
                                <WhiteSpace/>
                            </div>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 50%', color:'black'}}>
                            <WhiteSpace/>
                            {this.checkOverlay(item.canOverlay)}
                            <div style={{marginBottom: 10, color:'#ccc'}}>
                                {this.getDate(new Date(item.issueTime)) + " - " + this.getDate(new Date(item.expireTime))}
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

        // const unavailable_coupon = this.state.unavailable && this.state.unavailable.map((item, index) => {
        //     return <div key={index} style={{ padding: '0 15px' }}>
        //         <Flex style={{background:'#fff'}}>
        //             <Flex.Item style={{flex: '0 0 25%', backgroundColor:"#99CCFF"}}>
        //                 <div style={{textAlign:'center', color:'white'}}>
        //                     <WhiteSpace/>
        //                     <WhiteSpace/>
        //                     <div style={{marginBottom:'0.5rem'}}>
        //                         <span>￥</span><span style={{fontSize:'1.3rem'}}>{item.reduce_value}</span>
        //                     </div>
        //                     <div>{item.coupon_tag}</div>
        //                     <WhiteSpace/>
        //                     <WhiteSpace/>
        //                 </div>
        //             </Flex.Item>
        //             <Flex.Item style={{flex: '0 0 50%', color:'black', fontSize:'0.3rem'}}>
        //                 <WhiteSpace/>
        //                 <div style={{marginBottom: 10}}>{item.coupon_category}</div>
        //                 <div style={{marginBottom: 10, color:'#ccc'}}>{item.coupon_due_time + " - " + item.coupon_due_time}</div>
        //                 <WhiteSpace/>
        //             </Flex.Item>
        //         </Flex>
        //         <WhiteSpace/>
        //     </div>
        // });


        return <Layout header={false} footer={false}>

            <Navigation title="使用优惠券" left={true}/>

            {/*<div className="order_container">*/}
                {/*<Tabs tabs={ tabs }*/}
                      {/*onChange={this.onTabsChange.bind(this)}*/}
                      {/*initialPage={this.state.tabIndex}*/}
                      {/*animated={false}*/}
                      {/*useOnPan={false}*/}
                {/*>*/}
                    {/*<div style={{backgroundColor:'#eee'}}>*/}
                        {/*{this.isChosen()}*/}
                        {/*<WhiteSpace/>*/}
                        {/*{available_coupon}*/}

                        {/*<div style={{textAlign:'center'}}>*/}
                            {/*<Button style={{width:'30%', marginLeft:'34%', position: "fixed",*/}
                                            {/*fontSize:'0.5rem'}}*/}
                                    {/*type="primary"*/}
                                    {/*onClick={() =>{history.back()}}>*/}
                                {/*确定*/}
                            {/*</Button>*/}
                            {/*<WhiteSpace/>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div style={{backgroundColor:'#eee'}}>*/}
                        {/*<WhiteSpace/>*/}
                        {/*{unavailable_coupon}*/}
                    {/*</div>*/}


                {/*</Tabs>*/}
            {/*</div>*/}

            <div style={{backgroundColor:'#eee'}}>
                {this.isChosen()}
                <WhiteSpace/>
                {available_coupon}

                {/*<div style={{textAlign:'center'}}>*/}
                    {/*<Button style={{width:'30%', marginLeft:'34%', position: "fixed",*/}
                        {/*fontSize:'0.5rem'}}*/}
                            {/*type="primary"*/}
                            {/*onClick={() =>{history.back()}}>*/}
                        {/*确定*/}
                    {/*</Button>*/}
                    {/*<WhiteSpace/>*/}
                {/*</div>*/}
            </div>

        </Layout>
    }
}
