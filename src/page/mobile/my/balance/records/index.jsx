import React from "react";
import {Flex, Card, WhiteSpace,Pagination,Toast} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import couponApi from "../../../../../api/coupon.jsx";

const wechatId = localStorage.getItem("wechatId");

export default class BalanceRecords extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            records: [],
            totalPages: 0,
            curPage: 1,
        };
    }

    componentWillMount() {
        this.requestBalanceRecords(wechatId, 1, 10);
    }

    requestBalanceRecords(wechatId, page, rows) {
        couponApi.getBalanceRecords(wechatId, page, rows, (rs) => {
            console.log("充值记录：", rs);
            if (rs && rs.success) {
                const records = rs.obj.rows;

                this.setState({
                    records,
                    totalPages: rs.obj.totalPages,
                });
            }
        });
    }

    requestFormerPage() {
        if ((this.state.curPage - 1) < 1) {
            Toast.info("已经是第一页啦", 1);
        } else {
            this.setState({
                curPage: --this.state.curPage,
            },()=>{
                this.requestBalanceRecords(wechatId,this.state.curPage,10);
            });
            
        }
    }

    requestLatterPage() {
        if ((this.state.curPage + 1) > this.state.totalPages) {
            Toast.info("已经是最后一页啦", 1);
        } else {
            this.setState({
                curPage: ++this.state.curPage,
            },()=>{
                this.requestBalanceRecords(wechatId,this.state.curPage,10);
            });
            
        }
    }

    checkPagination(num) {
        console.log(num)
        // if (num === 0 || num === 1) {
        //     return null
        // } else {
            return <div>
                <Pagination
                            total={this.state.totalPages}
                            className="custom-pagination"
                            current={this.state.curPage}
                            locale={{
                                prevText: (<span className="arrow-align"
                                                 onClick={() => {this.requestFormerPage()}}
                                >
                                    上一页</span>),
                                nextText: (<span className="arrow-align"
                                                 onClick={() => {this.requestLatterPage()}}
                                >
                                    下一页</span>),
                            }}
                            style={{width:'90%', marginLeft:'5%', marginRight:'5%',fontSize: '0.7rem'}}
                />
            </div>
        // }
    }

    checkType(type) {
        switch(type) {
            case 1: return "线路赠送";
            case 2: return "销售奖励";
            case 3: return "商城销售";
            case 4: return "大客户购买";
            case 5: return "积分兑换";
            case 6: return "首单奖励";
            default: return "未知";
        }
    }

    getDate(date) {
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        return Y+M+D
    }

    render() {

        const content = this.state.records && this.state.records.map((item, index) => {
            return <Flex key={index} style={{textAlign:'center'}}>
                        <Flex.Item style={{padding:'0.5rem'}}>{this.getDate(new Date(item.useTime))}</Flex.Item>
                        <Flex.Item>{this.checkType(item.type)}</Flex.Item>
                        <Flex.Item>{item.useAmount}</Flex.Item>
                    </Flex>
        });

        return <Layout>

            <Navigation title="充值记录" left={true}/>

            <Card>
                <Flex style={{textAlign:'center', background:'#F7F7F7'}}>
                    <Flex.Item style={{padding:'0.5rem'}}>时间</Flex.Item>
                    <Flex.Item>电子券种类</Flex.Item>
                    <Flex.Item>电子券金额</Flex.Item>
                </Flex>
                <WhiteSpace/>
                {content}
            </Card>
            {this.checkPagination(this.state.totalPages)}

        </Layout>
    }

}