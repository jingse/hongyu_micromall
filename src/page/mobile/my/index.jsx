import React from 'react';
import { Link } from 'react-router-dom';
import Layout from "../../../common/layout/layout.jsx";
import Card from "../../../components/card/index.jsx";
// import Navigation from "../../../components/navigation/index.jsx"
import { Flex, WingBlank, WhiteSpace, Badge, List } from 'antd-mobile';
import './index.less';
import {wxconfig} from "../../../config.jsx";
import myApi from "../../../api/my.jsx";
import pointsApi from "../../../api/points.jsx";
import PropTypes from "prop-types";

const Item = List.Item;
const pageSize =10;
var wechatIdmy = localStorage.getItem("wechatId");

export default class My extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            webusinessTotal: 0,
            webusinessDaily: 0,
            isWebusiness:(localStorage.getItem("isWebusiness")=="1")?true:false,

            allCount: 0,
            payCount: 0,
            deliverCount: 0,
            receiveCount: 0,
            evaluateCount: 0,
            refundCount: 0,

            balance:0,

            myWebusinessInfo: {},
            vipRank: '',
            totalPoints: 0,
            availablePoints: 0,
        };
    }

    componentWillMount() {
        wechatIdmy = localStorage.getItem("wechatId");
         var str = localStorage.getItem("nickname");
        let s = str;
        if(str.length>10){
            s = str.substring(0,10)+"...";
        }
        this.nickname = s;
        this.headimgurl = localStorage.getItem("headimgurl");

        this.requestInfo();
        this.requestVipRank();
        this.requestOrderCounts();

        myApi.getInfo(wechatIdmy, (rs) => {
            if (rs && rs.success) {
                console.log('rs info',rs);
                const balance = rs.obj.wechatAccount.totalbalance;
                console.log('rs info balance',rs.obj.weBusiness);
                localStorage.setItem("isVip",rs.obj.wechatAccount.isVip)
                if(rs.obj.weBusiness!=null)
                    localStorage.setItem("weBusinessID",rs.obj.weBusiness.id)
                if (balance) {
                    console.log('rs info balance1',balance);
                    // localStorage.setItem("balance", balance.toString());
                    this.setState({balance:balance})
                }
            }
        });

    }

    componentDidMount() {
        localStorage.removeItem("tab");
    }

    // 请求个人信息
    requestInfo() {
        myApi.getInfo(wechatIdmy, (rs)=> {
            if (rs && rs.success) {
                console.log("rs", rs);
                this.setState({
                    userData: rs.obj.wechatAccount,
                    myWebusinessInfo: rs.obj.weBusiness,
                    totalPoints: rs.obj.wechatAccount.totalpoint,
                    availablePoints: rs.obj.wechatAccount.point,
                })
            }
    
            console.log("是微商吗？", this.state.isWebusiness);
            if (this.state.isWebusiness) {
                // const uid = localStorage.getItem("uid");
                console.log("进入判断, this.state.myWebusinessInfo.id: ", this.state.myWebusinessInfo.id);
                localStorage.setItem('WebusinessID',this.state.myWebusinessInfo.id)
                myApi.webusinessLogoEdit(this.state.myWebusinessInfo.id,this.headimgurl,(rs)=>{
                    console.log('设置微商城logo rs',rs)//this.headimgurl
                })
                this.requestData(this.state.myWebusinessInfo.id);
            }
        });


    }


    requestVipRank() {
        pointsApi.getVipRank(wechatIdmy, (rs)=> {
            console.log('isvip',rs);
            if (rs && rs.success) {
                if(rs.obj == null)
                    localStorage.setItem("isVip", false);
                else
                    localStorage.setItem("isVip", true);
                console.log("rs", rs);
                this.setState({
                    vipRank: rs.obj.levelname,
                })
            }
        });
    }

    requestOrderCounts() {

        this.requestAllOrderCount();
        this.requestPayCount();
        this.requestDeliverCount();
        this.requestReceiveCount();
        this.requestEvaluateCount();
        this.requestRefundCount();
    }

    requestAllOrderCount() {
        myApi.getAllOrderListByAccount(wechatIdmy, 1, pageSize, (rs)=>{
            this.setState({
                allCount: rs.obj.total,
            }, ()=>{
                console.log("全部订单", this.state.allCount);
            });
        });
    }


    requestPayCount() {
        myApi.getOrderListByAccount(wechatIdmy, 0, 1, pageSize, (rs)=>{
            this.setState({
                payCount: rs.obj.total,
            });
        });
    }

    requestDeliverCount() {
        myApi.getOrderListByAccount(wechatIdmy, 1, 1, pageSize, (rs)=>{
            this.setState({
                deliverCount: this.state.deliverCount + rs.obj.total,
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 2, 1, pageSize, (rs)=>{
            this.setState({
                deliverCount: this.state.deliverCount + rs.obj.total,
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 3, 1, pageSize, (rs)=>{
            this.setState({
                deliverCount: this.state.deliverCount + rs.obj.total,
            });
        });
    }

    requestReceiveCount() {
        myApi.getOrderListByAccount(wechatIdmy, 4, 1, pageSize, (rs)=>{
            this.setState({
                receiveCount: rs.obj.total,
            });
        });
    }

    requestEvaluateCount() {
        myApi.getOrderListByAccount(wechatIdmy, 5, 1, pageSize, (rs)=>{
            rs.obj.rows && rs.obj.rows.map((item, index) => {
                if (!item.isAppraised) {
                    this.setState({
                        evaluateCount: this.state.evaluateCount + 1,
                    });
                }
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 6, 1, pageSize, (rs)=>{
            rs.obj.rows && rs.obj.rows.map((item, index) => {
                if (!item.isAppraised) {
                    this.setState({
                        evaluateCount: this.state.evaluateCount + 1,
                    });
                }
            });
        });
    }

    requestRefundCount() {
        myApi.getOrderListByAccount(wechatIdmy, 8, 1, pageSize, (rs)=>{
            this.setState({
                refundCount: this.state.refundCount + rs.obj.total,
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 9, 1, pageSize, (rs)=>{
            this.setState({
                refundCount: this.state.refundCount + rs.obj.total,
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 10, 1, pageSize, (rs)=>{
            this.setState({
                refundCount: this.state.refundCount + rs.obj.total,
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 11, 1, pageSize, (rs)=>{
            this.setState({
                refundCount: this.state.refundCount + rs.obj.total,
            });
        });
        myApi.getOrderListByAccount(wechatIdmy, 12, 1, pageSize, (rs)=>{
            this.setState({
                refundCount: this.state.refundCount + rs.obj.total,
            });
        });
    }

    requestData(myWebusinessId) {
        // myApi.getInfo(8, (rs)=>{
        //     const data = rs.obj;
        //     this.setState({
        //         userData: data
        //     });
        // });

        myApi.getTotalDivide(myWebusinessId, (rs)=>{
            const data = rs.obj;
            this.setState({
                webusinessTotal: data
            });
        });

        myApi.getDailyDivide(myWebusinessId, (rs)=>{
            const data = rs.obj;
            this.setState({
                webusinessDaily: data
            });
        });
    }


    checkWebusiness() {
        
    
        if (this.state.isWebusiness) {
            return <Card>
                <div className="card_group">
                    <WingBlank>
                        <span>微商分成区</span>
                    </WingBlank>
                </div>
                <div className="card_group">
                    <Link to={{pathname:"/my/merchant", type:"daily", money: this.state.webusinessDaily}}>
                        <WingBlank>
                            <div className="iconH iconH_inline icon_pie" style={{marginRight:'10px'}}/>
                            <span style={{fontSize:"0.8rem"}}>日分成</span>
                            <span className="my_content_right">￥{JSON.stringify(this.state.webusinessDaily)}></span>
                        </WingBlank>
                    </Link>
                </div>
                <div className="card_group">
                    <Link to={{pathname:"/my/merchant", type:"total", money: this.state.webusinessTotal}}>
                        <WingBlank>
                            <div className="iconH iconH_inline icon_calendar" style={{marginRight:'10px'}}/>
                            <span style={{fontSize:"0.8rem"}}>总分成</span>
                            <span className="my_content_right">￥{JSON.stringify(this.state.webusinessTotal)}></span>
                        </WingBlank>
                    </Link>
                </div>
                {/*<div className="card_group">*/}
                    {/*<Link to={{pathname:"/my/merchant", type:"remain"}}>*/}
                        {/*<WingBlank>*/}
                            {/*<div className="iconH iconH_inline icon_await" style={{marginRight:'10px'}}/>*/}
                            {/*<span style={{fontSize:"0.8rem"}}>待分成</span>*/}
                            {/*<span className="my_content_right">2单 ></span>*/}
                        {/*</WingBlank>*/}
                    {/*</Link>*/}
                {/*</div>*/}
            </Card>
        } else{
            return null
        }
    }

    checkPhone() {
        // console.log("my bindPhone", localStorage.getItem("bindPhone"));
        console.log("bindPhone", this.state.userData.phone);
        localStorage.setItem("bindPhone", this.state.userData.phone);
        //if (this.state.userData.phone || localStorage.getItem("bindPhone")) {      
        if (this.state.userData.phone) {
            return <div className="my_header_text">
                <img src="./images/icons/手机.png" style={{width:'5%'}}/>
                {(!this.state.userData.phone) ? localStorage.getItem("bindPhone") : this.state.userData.phone}
            </div>
        } else {
            return <Link to={{pathname:'/my/tel'}}>
                <div className="my_header_text">
                    <img src="./images/icons/手机.png" style={{width:'5%'}}/>
                    {/*{userData.phone ? userData.phone : '未绑定'}*/}
                    未绑定
                </div>
            </Link>
        }
    }

    // checkVip() {
    //     if (this.state.userData.isVip || localStorage.getItem("isVip") === "true") {
    //         this.requestVipRank();
    //
    //         return <span style={{marginLeft:'0.8rem'}}>{this.state.vipRank}</span>
    //     }
    //     return null
    // }

    render() {
        
        return <Layout footer={true}>

            {/*<Navigation title="个人中心" curPath='/my'/>*/}

            <div className="my_setting">
                <WingBlank>
                    <span className="my_font">我的</span>
                    <Link to={{pathname:'/my/setting'}}  >
                        <span className="my_font" style={{float:'right'}}>设置</span>
                    </Link>
                </WingBlank>
            </div>

            <div className="my_header">
                <WhiteSpace/>
                <Flex>
                    <Flex.Item style={{flex:'0 0 20%'}}>
                        <img className="my_header_img" src={this.headimgurl ? this.headimgurl : "./images/zz_help_smile.png"} />
                        <img className="crown_img" src="./images/icons/皇冠.png" />
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 80%'}}>
                        <div className="my_header_text">
                            <Flex>
                                <div style={{overflow:'hidden',width:'100%'}}>
                                {this.nickname ? this.nickname : <a href={wxconfig.redirectUri} style={{color:"#fff"}}>点击登录</a>}
                                </div>
                                <div>
                                <span style={{marginLeft:'0.8rem',width:'50%'}}>{this.state.vipRank}</span>
                                </div>
                            </Flex>
                            
                            {/*{this.checkVip()}*/}
                            
                        </div>

                        {this.checkPhone()}

                        {/*<div className="my_header_text">*/}
                            {/*积分：*/}
                            {/*<Link to="/my/points/exchange">兑换</Link>*/}
                            {/*{this.checkVip()}*/}
                        {/*</div>*/}
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
            </div>


            <Card>
                <div className="card_group">
                    <Link to={{pathname:'/my/order', state:0 }} >
                        <WingBlank>
                            <span>我的订单</span>
                            <span className="my_content_right">
                                全部订单
                                <Badge text={this.state.allCount} overflowCount={99} />
                                >
                            </span>
                        </WingBlank>
                    </Link>
                </div>
                <div className="card_group">
                    <WhiteSpace/>
                    <Flex>
                        <Flex.Item style={{marginLeft:'1rem'}}>
                            {/*badge={order_deliver.data.count}*/}
                            <Link to={{pathname:'/my/order', state:1 }}>
                                <WhiteSpace/>
                                <Badge text={this.state.payCount}>
                                    {/*<div className="div_order">*/}
                                        {/*<img src='./images/icons/待付款.png' style={{width:'35%', height:'1.5rem'}}/>*/}
                                        {/*<div className="to_be_value">待付款</div>*/}
                                    {/*</div>*/}
                                    <div className="iconH icon_pay"/>待付款
                                </Badge>
                            </Link>
                        </Flex.Item>
                        <Flex.Item style={{marginLeft:'1rem'}}>
                            {/*badge={order_deliver.data.count}*/}
                            <Link to={{pathname:'/my/order', state:2 }}>
                                <WhiteSpace/>
                                <Badge text={this.state.deliverCount}>
                                    {/*<div className="div_order">*/}
                                        {/*<img src='./images/icons/待发货.png' style={{width:'30%', height:'1.5rem'}}/>*/}
                                        {/*<div className="to_be_value">待发货</div>*/}
                                    {/*</div>*/}
                                    <div className="iconH icon_deliver"/>待发货
                                </Badge>
                            </Link>
                        </Flex.Item>
                        <Flex.Item style={{marginLeft:'1rem'}}>
                            {/*badge={order_receive.data.count}*/}
                            <Link to={{pathname:'/my/order', state:3 }}>
                                <WhiteSpace/>
                                <Badge text={this.state.receiveCount}>
                                {/*<div className="div_order">*/}
                                    {/*<img src='./images/icons/待收货.png' style={{width:'30%', height:'1.5rem'}}/>*/}
                                    {/*<div className="to_be_value">待收货</div>*/}
                                {/*</div>*/}
                                    <div className="iconH icon_receive"/>待收货
                                </Badge>
                            </Link>

                        </Flex.Item>
                        <Flex.Item style={{marginLeft:'1rem'}}>
                            {/*badge={order_evaluate.data.count}*/}
                            <Link to={{pathname:'/my/order', state:4 }}>
                                <WhiteSpace/>
                                <Badge text={this.state.evaluateCount}>
                                    {/*<div className="div_order">*/}
                                        {/*<img src='./images/icons/待评价.png' style={{width:'40%', height:'1.5rem'}}/>*/}
                                        {/*<div className="to_be_value">待评价</div>*/}
                                    {/*</div>*/}
                                    <div className="iconH icon_comment"/>待评价
                                </Badge>
                            </Link>
                        </Flex.Item>
                        <Flex.Item style={{marginLeft:'1rem'}}>
                            {/*badge={order_refund.data.count}*/}
                            <Link to={{pathname:'/my/order', state:5 }}>
                                <WhiteSpace/>
                                <Badge text={this.state.refundCount}>
                                    {/*<div className="div_order">*/}
                                        {/*<img src='./images/icons/退款.png' style={{width:'35%', height:'1.5rem'}}/>*/}
                                        {/*<div className="to_be_value">退款</div>*/}
                                    {/*</div>*/}
                                    <div className="iconH icon_refund"/>退款
                                </Badge>
                            </Link>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>
                    <WhiteSpace/>
                </div>
            </Card>

            {/*<Card>*/}
                {/*<div className="card_group">*/}
                    {/*<Link to='/my/coupon'>*/}
                        {/*<WingBlank>*/}
                            {/*<span>我的可用电子券<span style={{color:'red', marginLeft:'8px'}}>{counts}</span></span>*/}
                            {/*<span className="my_content_right">></span>*/}
                        {/*</WingBlank>*/}
                    {/*</Link>*/}
                {/*</div>*/}

                {/*{merchant()}*/}

            {/*</Card>*/}


            {/*<Card>*/}
                {/*<div className="card_group">*/}
                    {/*<Link to={{pathname:"/my/coupon"}}>*/}
                        {/*<WingBlank>*/}
                            {/*<span>我的优惠</span>*/}
                            {/*<span className="my_content_right">全部优惠券></span>*/}
                        {/*</WingBlank>*/}
                    {/*</Link>*/}
                {/*</div>*/}
                {/*<div className="card_group">*/}
                    {/*<Flex style={{textAlign:'center',height:'5rem'}}>*/}
                        {/*<Flex.Item><Link to={{pathname:"/my/coupon"}}>*/}
                            {/*<span style={{lineHeight:1, fontSize:"0.7rem"}}><div className="iconH icon_ticket"/>优惠券(6)</span>*/}
                        {/*</Link></Flex.Item>*/}
                        {/*<Flex.Item><Link to={{pathname:"/my/coupon"}}>*/}
                            {/*<span style={{lineHeight:1, fontSize:"0.7rem"}}><div className="iconH icon_ticket"/>未使用(3)</span>*/}
                        {/*</Link></Flex.Item>*/}
                        {/*<Flex.Item><Link to={{pathname:"/my/coupon"}}>*/}
                            {/*<span style={{lineHeight:1, fontSize:"0.7rem"}}><div className="iconH icon_ticket"/>已使用(1)</span>*/}
                        {/*</Link></Flex.Item>*/}
                        {/*<Flex.Item><Link to={{pathname:"/my/coupon"}}>*/}
                            {/*<span style={{lineHeight:1, fontSize:"0.7rem"}}><div className="iconH icon_ticket"/>已过期(2)</span>*/}
                        {/*</Link></Flex.Item>*/}
                    {/*</Flex>*/}
                {/*</div>*/}
            {/*</Card>*/}

            <Card>
                <List>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        extra={this.state.availablePoints?this.state.availablePoints:'0'}
                        onClick={() => {this.context.router.history.push({pathname: '/my/points', totalPoints:this.state.totalPoints, availablePoints: this.state.availablePoints})}}
                    >
                        积分
                    </Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                        arrow="horizontal"
                        extra={this.state.balance?this.state.balance:'0'}
                        onClick={() => {this.context.router.history.push('/my/balance')}}
                    >
                        余额
                    </Item>
                    <Item
                        thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                        onClick={() => {this.context.router.history.push('/my/coupon/disposable')}}
                        arrow="horizontal"
                    >
                       一次性电子券
                    </Item>
                </List>
            </Card>

            {this.checkWebusiness()}

            {/*<Card>*/}
                {/*<div className="card_group">*/}
                    {/*<Link to='/my/help'>*/}
                        {/*<WingBlank>*/}
                            {/*<span>设置</span>*/}
                            {/*<span className="my_content_right">></span>*/}
                        {/*</WingBlank>*/}
                    {/*</Link>*/}
                {/*</div>*/}
            {/*</Card>*/}

        </Layout>
    }
}

My.contextTypes = {
    router: PropTypes.object.isRequired
};