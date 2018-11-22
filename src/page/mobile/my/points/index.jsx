import React from "react";
import {WingBlank, WhiteSpace, List} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import PropTypes from "prop-types";
import myApi from "../../../../api/my.jsx";

const wechatId = localStorage.getItem("wechatId");

export default class MyPoints extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            totalPoints: 0,
            availablePoints: 0,
        }
    }

    componentWillMount() {
        if (this.props.location.totalPoints && this.props.location.availablePoints) {
            localStorage.setItem("totalPoints", this.props.location.totalPoints.toString());
            localStorage.setItem("availablePoints", this.props.location.availablePoints.toString());
        }

        this.requestInfo();
    }

    // 请求个人信息
    requestInfo() {
        myApi.getInfo(localStorage.getItem("wechatId"), (rs)=> {
            if (rs && rs.success) {
                console.log("rs", rs);
                this.setState({
                    totalPoints: rs.obj.wechatAccount.totalpoint,
                    availablePoints: rs.obj.wechatAccount.point,
                })
            }
        });
    }


    render() {
        return <Layout>

            <Navigation title="积分" left={true}/>

            <div style={{background: 'darkorange', color:'white', height:'8rem'}}>
                <WhiteSpace/>
                <WhiteSpace/>
                <WingBlank>总积分：
                    {/*{(!this.props.location.totalPoints)? localStorage.getItem("totalPoints") : this.props.location.totalPoints}*/}
                    {(this.state.totalPoints === 0 || !this.state.totalPoints) ? '0' : this.state.totalPoints}
                </WingBlank>
                <WhiteSpace/>
                <WingBlank>可用积分：</WingBlank>
                <WingBlank style={{fontSize:'2rem', marginTop:'1rem'}}>
                    {/*{(!this.props.location.availablePoints) ? localStorage.getItem("availablePoints") : this.props.location.availablePoints}*/}
                    {(this.state.availablePoints === 0 || !this.state.availablePoints) ? '0' : this.state.availablePoints}
                </WingBlank>
            </div>

            <List>
                <List.Item
                    thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                    onClick={() => {
                        this.context.router.history.push({pathname: '/my/points/exchange',
                        points: this.state.availablePoints})}}
                    arrow="horizontal"
                >
                    兑换
                </List.Item>
            </List>

            <WhiteSpace/>
            <WhiteSpace/>

            <List>
                <List.Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    arrow="horizontal"
                    onClick={() => {this.context.router.history.push('/my/points/records')}}
                >
                    积分记录
                </List.Item>

                {/*<List.Item*/}
                    {/*thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"*/}
                    {/*onClick={() => {this.context.router.history.push('/my/balance/purchase')}}*/}
                    {/*arrow="horizontal"*/}
                {/*>*/}
                    {/*我的购买*/}
                {/*</List.Item>*/}
            </List>


        </Layout>
    }

}

MyPoints.contextTypes = {
    router: PropTypes.object.isRequired
};