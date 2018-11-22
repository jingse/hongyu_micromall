import React from "react";
import {WhiteSpace, Card, WingBlank, Flex} from "antd-mobile";
import Layout from "../../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../../components/navigation/index.jsx";
// import Submit from "../../../../../../components/submit/index.jsx";
// import refund_result from "../../../../../../static/mockdata/order_refund_result.js";
import myApi from "../../../../../../api/my.jsx";
import {getServerIp} from "../../../../../../config.jsx";

export default class RefundDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result:[],
        };
    }

    componentWillMount() {
        this.requestRefundOrderDetail(this.props.location.orderId);
    }

    requestRefundOrderDetail(orderId) {
        myApi.getOrderRefund(orderId, (rs)=>{
            if (rs && rs.success) {
                const refundDetail = rs.obj;
                this.setState({
                    result: refundDetail,
                });
            }
        });
        console.log("this.state.result", this.state.result);
    }

    displayState(state) {
        switch (state) {
            case 8: return "申请退货待确认";
            case 9: return "待退货";
            case 10: return "待入库";
            case 11: return "待退款";
            case 12: return "已退款";
        }
    }

    render() {
        console.log(this.state.result);

        if (!this.state.result || JSON.stringify(this.state.result) == '[]') {
            return null
        }

        const refundProduct = this.state.result.refundItems && this.state.result.refundItems.map((item, index) =>{
            return <Flex style={{backgroundColor:'#F7F7F7'}} key={index}>
                <Flex.Item style={{flex:'0 0 30%'}}>
                    <img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'60%', margin:'1rem'}}/>
                </Flex.Item>
                <Flex.Item style={{flex:'0 0 40%', fontSize:'0.8rem'}}>
                    <div style={{paddingBottom:'1rem'}}>{item.name}</div>
                    <div style={{fontSize:'0.7rem', color:'#999', paddingBottom:'1rem'}}>{item.specification}</div>
                </Flex.Item>
                <Flex.Item style={{flex:'0 0 30%', fontSize:'0.8rem'}}>
                    <div style={{fontSize:'0.8rem'}}>退款数量 ×{item.returnQuantity}</div>
                </Flex.Item>
            </Flex>
        });


        return <Layout header={false} footer={false}>
            <Navigation title="退款详情" left={true} backLink='/my/order'/>

            <div style={{background: 'darkorange', padding: '1rem', textAlign: 'center',
                            fontSize: '0.8rem', color:'white'}}>
                {this.displayState(this.state.result.order.orderState)}
                <WhiteSpace/>
                <div style={{fontSize:'0.4rem'}}>
                    {/*{this.state.result.refund_state_latest_time}*/}
                </div>
            </div>

            <Card>
                <div className="card_group">
                    <WingBlank style={{borderBottom:'1px solid #eee', padding:'1rem'}}>
                        <span>退款总金额</span>
                        <span style={{float:'right', color:'darkorange', fontSize:'1rem'}}>￥{this.state.result.refundTotalAmount}</span>
                    </WingBlank>
                    <WingBlank style={{padding:'1rem'}}>
                        <span>退回微信</span>
                        <span style={{float:'right'}}>￥{this.state.result.refundTotalAmount}</span>
                    </WingBlank>
                </div>
            </Card>

            <WhiteSpace/>

            <Card>
                <WingBlank style={{padding:'1rem'}}>退款信息</WingBlank>

                {refundProduct}

                <div style={{color:'#999', fontSize:'0.8rem'}}>
                    <WingBlank style={{padding:'0.5rem'}}>退款原因：{this.state.result.refundReson}</WingBlank>
                    <WingBlank style={{padding:'0.5rem'}}>退款金额：￥{this.state.result.refundTotalAmount}</WingBlank>
                    <WingBlank style={{padding:'0.5rem'}}>申请个数：{this.state.result.refundItems.length}</WingBlank>
                    {/*<WingBlank style={{padding:'0.5rem'}}>申请时间：{this.state.result.refund_apply_time}</WingBlank>*/}
                    <WingBlank style={{padding:'0.5rem'}}>退款编号：{this.state.result.order.orderCode}</WingBlank>
                </div>

            </Card>


        </Layout>
    }
}

