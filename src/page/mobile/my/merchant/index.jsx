import React from "react";
import  {WhiteSpace, Flex } from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import Card from "../../../../components/card/index.jsx";
import InfoCard from "./infocard.jsx";
import './index.less';
// import profit_data from "../../../../static/mockdata/profit_share.js"; // mock假数据
import myApi from "../../../../api/my.jsx";


export default class ProfitShare extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading:false,
            profit:[],
            tabIndex:0,

            headerName: '',
            headerValue: '',
            totalDataList: [],
            dailyDataList: []
        };
    }

    componentWillMount() {
        this.requestData();
    }

    componentDidMount() {
        const type = this.props.location.type;
        switch (type) {
            case 'daily':
                this.setState({
                    headerName: '今日分成总额',
                    headerValue: '￥' + this.props.location.money
                });
                break;
            case 'total':
                this.setState({
                    headerName: '累计分成总额',
                    headerValue: '￥' + this.props.location.money
                });
                break;
            // case 'remain':
            //     this.setState({
            //         headerName: '待分成订单数量',
            //         headerValue: '0单'
            //     });
            //     break;
            default:
                break;
        }

    }

    requestData() {

        myApi.getTotalDivideList(localStorage.getItem("weBusinessID"), (rs)=>{
            const data = rs.obj.rows;
            this.setState({
                totalDataList: data
            });
        });

        myApi.getDailyDivideList(localStorage.getItem("weBusinessID"), (rs)=>{
            const data = rs.obj.rows;
            this.setState({
                dailyDataList: data
            });
        });
    }



    render() {

        let dataList = [];
        if (this.props.location.type === 'daily') {
            dataList = this.state.dailyDataList;
        } else if (this.props.location.type === 'total') {
            dataList = this.state.totalDataList;
        }


        return <Layout header={false} footer={false}>
            <Navigation title="微商分成" left={true}/>

            <WhiteSpace size="xs"/>


            <Card className="profitshare_infocard">
                <Flex justify="around">
                    <div>{this.state.headerName}</div>
                    <div>{this.state.headerValue}</div>
                </Flex>
            </Card>

            {dataList.map((item, index)=>{
                let data = {
                    time: item.ordertime,
                    user_name: item.wechatName,
                    total_fee: item.totalAmount,
                    share_fee: item.weBusinessAmount,
                    goods_name:item.itemName,
                };
                return <InfoCard data={data} key={index}/>
            })}


        </Layout>
    }
}
