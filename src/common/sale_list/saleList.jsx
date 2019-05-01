import React from "react";
import {Link} from "react-router-dom";
import {Flex, Toast, WhiteSpace} from "antd-mobile";
import Layout from "../../common/layout/layout.jsx";
import {getServerIp} from "../../config.jsx";
import homeApi from "../../api/home.jsx";
import http from '../../common/http.jsx';  //不能删除
import "./saleList.less";


export default class SalesList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            nextPage: 2,
            isEnd: false
        };
    }

    componentWillMount() {
        this.requestPromotionList(1);
    }


    requestPromotionList(page) {
        const name = this.props.funcName;

        eval("(" + homeApi[name] + ')' + "(page, 10, (rs) => {\n" +
            "            if(rs && rs.success) {\n" +
            "                console.log('rs', rs);\n" +
            "                let numlist = (rs.obj.pageNumber-1)*10 + rs.obj.rows.length;\n" +
            "                let isEnd1 = false;\n" +
            "                if(numlist === rs.obj.total){\n" +
            "                    isEnd1 = true;\n" +
            "                }\n" +
            "\n" +
            "                const proList = rs.obj.rows;\n" +
            "                if(page === 1){\n" +
            "                    console.log('getPromotionList',rs.obj.total);\n" +
            "                    this.setState({\n" +
            "                        data: proList,\n" +
            "                        isLoading: false,\n" +
            "                        isEnd:isEnd1\n" +
            "                    });\n" +
            "                }\n" +
            "                else{\n" +
            "                    if(this.state.isEnd) {\n" +
            "                        Toast.info(\"没有更多信息\",1);\n" +
            "                        return;\n" +
            "                    }\n" +
            "\n" +
            "                    console.log('getPromotionList2', rs, page, proList.length, numlist);\n" +
            "                    this.setState({\n" +
            "                        data: this.state.data.concat(proList),\n" +
            "                        isLoading: false,\n" +
            "                        nextPage:page+1,\n" +
            "                        isEnd:isEnd1\n" +
            "                    });\n" +
            "                }\n" +
            "\n" +
            "            }\n" +
            "        });");
    }

    addMore() {
        this.requestPromotionList(this.state.nextPage);
    }


    getSalesContent(ruleType, substracts, discounts, presents) {
        switch (ruleType) {
            case "满减":
                return substracts && substracts.map((item, index) => {
                    return "满" + item.fullFreeRequirement + "元减" + item.fullFreeAmount + "元"
                });
            case "满折":
                return discounts && discounts.map((item, index) => {
                    return "满" + item.discountRequirenment + "元打" + item.discountOff + "折"
                });
            case "满赠":
                return presents && presents.map((item, index) => {
                    return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProductNumber
                });
        }
    }


    render() {

        const content = this.state.data && this.state.data.map((item, index) => {
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
                            {this.getSalesContent(item.ruleType, item.fullSubstracts, item.fullDiscounts, item.fullPresents)}
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


        return <Layout header={false} footer={true}>

            <div style={{borderBottom: '1px solid green', backgroundColor: 'white', color: 'green', fontSize: 'bold'}}>
                <Flex>
                    <Flex.Item style={{flex: '0 0 4%', marginRight: '0.4rem'}}>
                        <img src='./images/category/菜篮子.png'
                             style={{width: '90%', margin: '0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item>{this.props.name}</Flex.Item>
                </Flex>
            </div>


            {content}

            <div className='addMore' onClick={() => this.addMore()}>加载更多</div>

        </Layout>
    }
}