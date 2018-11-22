import React from 'react';
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import {WhiteSpace, Flex, Card, Toast, Pagination} from 'antd-mobile';
import pointsApi from "../../../../../api/points.jsx";
import "./index.less";

const pageSize = 10;
// var totalPages = 0;

export default class ExchangeRecords extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            pointsRecords: [],
            totalPages: 0,
            curPage: 1,
        }
    }

    componentWillMount() {
        this.requestExchangeRecords(1);
    }

    requestExchangeRecords(pageNo) {
        pointsApi.getPointsChangeRecords(localStorage.getItem("wechatId"), pageNo, pageSize, (rs) => {
            console.log("兑换记录：", rs);
            if (rs && rs.success) {
                this.setState({
                    pointsRecords: rs.obj.rows,
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
            });
            this.requestExchangeRecords(this.state.curPage);
        }
    }

    requestLatterPage() {
        if ((this.state.curPage + 1) > this.state.totalPages) {
            Toast.info("已经是最后一页啦", 1);
        } else {
            this.setState({
                curPage: ++this.state.curPage,
            });
            this.requestExchangeRecords(this.state.curPage);
        }
    }

    getDate(date) {
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = date.getDate() + ' ';
        return Y+M+D
    }

    checkPagination(num) {
        if (num === 0 || num === 1) {
            return null
        } else {
            // totalPages = Math.floor((this.props.total + pageSize - 1) / pageSize);

            return <div>
                <Pagination
                            // total={totalPages}
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
        }
    }

    checkChangeValue(value) {
        if (value > 0)
            return "+" + value;
        return value
    }


    render() {

        const recordContent = this.state.pointsRecords && this.state.pointsRecords.map((item, index) => {
            return <Flex key={index} style={{textAlign:'center'}}>
                <Flex.Item style={{padding:'0.5rem'}}>{this.getDate(new Date(item.createTime))}</Flex.Item>
                <Flex.Item>{this.checkChangeValue(item.changevalue)}</Flex.Item>
                <Flex.Item>{item.reason}</Flex.Item>
            </Flex>
        });

        return <Layout>

            <Navigation title="积分记录" left={true}/>

            <WhiteSpace/>

            <Card>
                <Flex style={{textAlign:'center', background:'#F7F7F7'}}>
                    <Flex.Item style={{padding:'0.5rem'}}>变化时间</Flex.Item>
                    <Flex.Item>变化值</Flex.Item>
                    <Flex.Item>变化原因</Flex.Item>
                </Flex>
                <WhiteSpace/>

                {recordContent}
            </Card>

            {this.checkPagination(this.state.totalPages)}

        </Layout>
    }

}