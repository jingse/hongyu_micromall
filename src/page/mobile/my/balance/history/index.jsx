import React from "react";
import {Card, Flex, Pagination, Toast, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import couponApi from "../../../../../api/coupon.jsx";
import DateManager from "../../../../../manager/DateManager.jsx";

const wechatId = localStorage.getItem("wechatId");

export default class UseHistory extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            history: [],
            totalPages: 0,
            curPage: 1,
        };
    }

    componentWillMount() {
        this.requestBalanceUseHistory(wechatId, 1, 10);
    }

    requestBalanceUseHistory(wechatId, page, rows) {
        couponApi.getBalanceUseHistory(wechatId, page, rows, (rs) => {
            console.log("使用记录：", rs);
            if (rs && rs.success) {
                const history = rs.obj.rows;

                this.setState({
                    history,
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
            }, () => {
                this.requestBalanceUseHistory(wechatId, this.state.curPage, 10);
            });

        }
    }

    requestLatterPage() {
        if ((this.state.curPage + 1) > this.state.totalPages) {
            Toast.info("已经是最后一页啦", 1);
        } else {
            this.setState({
                curPage: ++this.state.curPage,
            }, () => {
                this.requestBalanceUseHistory(wechatId, this.state.curPage, 10);
            });

        }
    }

    checkPagination(num) {
        console.log(num);

        return <div>
            <Pagination
                total={this.state.totalPages}
                className="custom-pagination"
                current={this.state.curPage}
                locale={{
                    prevText: (<span className="arrow-align"
                                     onClick={() => {
                                         this.requestFormerPage()
                                     }}
                    >
                                    上一页</span>),
                    nextText: (<span className="arrow-align"
                                     onClick={() => {
                                         this.requestLatterPage()
                                     }}
                    >
                                    下一页</span>),
                }}
                style={{width: '90%', marginLeft: '5%', marginRight: '5%', fontSize: '0.7rem'}}
            />
        </div>
    }


    render() {

        const content = this.state.history && this.state.history.map((item, index) => {
            return <Flex key={index} style={{textAlign: 'center'}}>
                <Flex.Item style={{padding: '0.5rem'}}>{DateManager.getDate(new Date(item.createTime))}</Flex.Item>
                <Flex.Item>{item.type === "use" ? "使用" : "退返"}</Flex.Item>
                <Flex.Item>{item.amount}</Flex.Item>
                <Flex.Item>{item.surplus}</Flex.Item>
            </Flex>
        });

        return <Layout>

            <Navigation title="使用记录" left={true}/>

            <Card>
                <Flex style={{textAlign: 'center', background: '#F7F7F7'}}>
                    <Flex.Item style={{padding: '0.5rem'}}>时间</Flex.Item>
                    <Flex.Item>类型</Flex.Item>
                    <Flex.Item>使用金额</Flex.Item>
                    <Flex.Item>当前剩余</Flex.Item>
                </Flex>
                <WhiteSpace/>
                {content}
            </Card>
            {this.checkPagination(this.state.totalPages)}

        </Layout>
    }
}