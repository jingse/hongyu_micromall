import React from "react";
import {Link} from "react-router-dom";
import {Flex, Toast, WhiteSpace} from "antd-mobile";
import Layout from "../../common/layout/layout.jsx";
import {ListHeader} from "../../components/list_header/listHeader.jsx";
import {getServerIp} from "../../config.jsx";
import homeApi from "../../api/home.jsx";
import SaleManager from '../../manager/SaleManager.jsx';
import "./saleList.less";
import {ReqNullTip, ReqFailTip, ReqIngTip} from "../../components/req_tip/reqTip.jsx";


export default class SalesList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            nextPage: 2,
            isEnd: false,
            isNull: false,
            isReqFail: false,
        };
    }

    componentWillMount() {
        this.requestPromotionList(1);
    }


    requestPromotionList(page) {
        const name = this.props.funcName;

        homeApi[name](page, 10, (rs) => {
            if(rs && rs.success) {
                let numlist = (rs.obj.pageNumber - 1) * 10 + rs.obj.rows.length;
                let isEnd1 = false;
                if(numlist === rs.obj.total)
                    isEnd1 = true;

                const proList = rs.obj.rows;

                if (!proList || JSON.stringify(proList) === "[]")
                    this.setState({isNull: true});

                if(page === 1) {
                    console.log('getGroupPromotionList',rs);
                    this.setState({
                        data: proList,
                        isLoading: false,
                        isEnd:isEnd1
                    });
                } else {
                    if(this.state.isEnd) {
                        Toast.info("没有更多信息",1);
                        return;
                    }

                    console.log('getOrdinaryPromotionList2', rs, page, proList.length, numlist);
                    this.setState({
                        data: this.state.data.concat(proList),
                        isLoading: false,
                        nextPage:page + 1,
                        isEnd:isEnd1
                    });
                }
            } else {
                this.setState({isReqFail: true});
            }
        });
    }

    addMore() {
        this.requestPromotionList(this.state.nextPage);
    }


    render() {
        let content = null;

        if (this.state.isReqFail)
            content = <ReqFailTip/>;
        else if (this.state.isNull)
            content = <ReqNullTip/>;
        else if (JSON.stringify(this.state.data) === "[]")
            content = <ReqIngTip/>;
        else {
            content = this.state.data && this.state.data.map((item, index) => {
                let start = new Date(item.startTime).toLocaleString();
                let end = new Date(item.endTime).toLocaleString();
                let a = start.indexOf("午");
                let b = end.indexOf("午");

                start.substring(0, a + 2);
                end.substring(0, b + 2);

                return <Link to={{
                    pathname: this.props.targetLink, state: item.id, ruleType: item.ruleType,
                    presents: item.fullPresents, subtracts: item.fullSubstracts, discounts: item.fullDiscounts
                }} key={index}>
                    <Flex style={{background: '#fff'}}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img src={"http://" + getServerIp() + this.props.getIconFunc(item)}
                                 style={{width: '70%', margin: '0.4rem'}}/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 60%', color: 'black'}}>
                            <WhiteSpace/>
                            <div style={{marginBottom: 15, fontSize: '1rem', fontWeight: 'bold'}}>{item.name}</div>
                            <div style={{marginBottom: 10}}>
                            <span style={{
                                color: 'red',
                                border: '1px solid darkorange',
                                padding: '2px',
                                marginRight: '0.5rem'
                            }}>
                                {item.ruleType}
                            </span>
                                {SaleManager.getSalesContent(item.ruleType, item.fullSubstracts, item.fullDiscounts, item.fullPresents)}
                            </div>
                            <Flex style={{marginBottom: 10}}>
                                <Flex.Item style={{flex: '0 0 30%'}}>
                                <span style={{
                                    color: 'red',
                                    border: '1px solid darkorange',
                                    padding: '2px',
                                    marginRight: '0.5rem'
                                }}>
                                    时间
                                </span>
                                </Flex.Item>
                                <Flex.Item style={{flex: '0 0 70%'}}>
                                    <div className="sales_time_text">{start.substring(0, a + 2) + "时"}</div>
                                    <div className="sales_time_text">{end.substring(0, b + 2) + "时"}</div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>
                </Link>
            });
            content.push(<div className='addMore' key={this.state.data.length + 1} onClick={() => this.addMore()}>加载更多</div>);
        }


        return <Layout header={false} footer={false}>

            <ListHeader listName={this.props.name}/>

            {content}

        </Layout>
    }
}