import React from "react";
import {WingBlank, WhiteSpace, List, NoticeBar} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import PropTypes from "prop-types";
import myApi from "../../../../api/my.jsx";

const wechatId = localStorage.getItem("wechatId");

export default class Balance extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            balance:0,
        }
    }

    componentWillMount() {
        console.log('rs11',wechatId)
        this.requestInfo(wechatId);
    }
   
    requestInfo(wechatId) {
        myApi.getInfo(wechatId, (rs) => {
            if (rs && rs.success) {
                console.log('rs',rs)
                const balance = rs.obj.wechatAccount.totalbalance;
                if (balance) {
                    // localStorage.setItem("balance", balance.toString());
                    this.setState({balance:balance})
                }
            }
        });
    }

    checkBalance() {
        if (!localStorage.getItem("bindPhone")) {
            return <NoticeBar mode="closable" action={<span style={{ color: '#a1a1a1' }}>不再提示</span>}>
                您还未绑定手机号，余额不能使用
            </NoticeBar>
        }
        return null
    }

    render() {
        return <Layout>

            <Navigation title="余额" left={true}/>
            {/*{this.checkBalance()}*/}

            <div style={{background: 'darkorange', color:'white', height:'8rem'}}>
                <WhiteSpace/>
                <WhiteSpace/>
                <WingBlank>余额账户（元）</WingBlank>
                <WingBlank style={{fontSize:'2rem', marginTop:'2rem'}}>
                    {this.state.balance}
                </WingBlank>
            </div>

            <List>
                <List.Item
                    thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                    onClick={() => {this.context.router.history.push('/my/balance/recharge')}}
                    arrow="horizontal"
                >
                    充值
                </List.Item>
            </List>

            <WhiteSpace/>
            <WhiteSpace/>

            <List>
                <List.Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    arrow="horizontal"
                    // extra={localStorage.getItem("balance")}
                    onClick={() => {this.context.router.history.push('/my/balance/records')}}
                >
                    充值记录
                </List.Item>

                <List.Item
                    thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                    onClick={() => {this.context.router.history.push('/my/balance/purchase')}}
                    arrow="horizontal"
                >
                    我的购买
                </List.Item>
            </List>


        </Layout>
    }

}

Balance.contextTypes = {
    router: PropTypes.object.isRequired
};