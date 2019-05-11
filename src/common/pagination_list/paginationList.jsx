import React from "react";
import {Card, Flex, Pagination, Toast, WhiteSpace} from "antd-mobile";
import Layout from "../../common/layout/layout.jsx";
import Navigation from "../../components/navigation/index.jsx";


const wechatId = localStorage.getItem("wechatId");

export default class PaginationList extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            totalPages: this.props.totalPages,
            curPage: 1,
        };
    }

    componentWillMount() {
        this.props.reqDataFunc(wechatId, 1, 10);
    }

    requestFormerPage() {
        if ((this.state.curPage - 1) < 1) {
            Toast.info("已经是第一页啦", 1);
        } else {
            this.setState({
                curPage: --this.state.curPage,
            }, () => {
                this.props.reqDataFunc(wechatId, this.state.curPage, 10);
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
                this.props.reqDataFunc(wechatId, this.state.curPage, 10);
            });

        }
    }

    checkPagination(num) {

        if (num <= 1)
            return null;

        return <div>
            <Pagination
                total={this.state.totalPages}
                className="custom-pagination"
                current={this.state.curPage}
                locale={{
                    prevText: (<span className="arrow-align"
                                     onClick={() => {
                                         this.requestFormerPage()
                                     }}>上一页</span>),
                    nextText: (<span className="arrow-align"
                                     onClick={() => {
                                         this.requestLatterPage()
                                     }}>下一页</span>),
                }}
                style={{width: '90%', marginLeft: '5%', marginRight: '5%', fontSize: '0.7rem'}}
            />
        </div>
    }


    render() {

        const {title, columns, content} = this.props;

        const column = columns && columns.map((item, index) => {
            return <Flex.Item key={index}>{item}</Flex.Item>
        });

        return <Layout>

            <Navigation title={title} left={true}/>

            <Card>
                <Flex style={{textAlign: 'center', background: '#F7F7F7', padding: '0.5rem'}}>
                    {column}
                </Flex>

                <WhiteSpace/>

                {content}
            </Card>

            {this.checkPagination(this.state.totalPages)}

        </Layout>
    }
}