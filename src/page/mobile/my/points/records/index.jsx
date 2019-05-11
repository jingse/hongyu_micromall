import React from 'react';
import {Flex} from 'antd-mobile';
import PaginationList from "../../../../../common/pagination_list/paginationList.jsx";

import pointsApi from "../../../../../api/points.jsx";
import DateManager from "../../../../../manager/DateManager.jsx";
import "./index.less";


export default class ExchangeRecords extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            pointsRecords: [],
            totalPages: 1,
        };
        this.requestExchangeRecords = this.requestExchangeRecords.bind(this);
    }

    requestExchangeRecords(pageNo) {
        pointsApi.getPointsChangeRecords(localStorage.getItem("wechatId"), pageNo, 10, (rs) => {
            console.log("兑换记录：", rs);
            if (rs && rs.success) {
                this.setState({
                    pointsRecords: rs.obj.rows,
                    totalPages: rs.obj.totalPages,
                });
            }
        });
    }


    render() {
        const columns = ["变化时间", "变化值", "变化原因"];

        const recordContent = this.state.pointsRecords && this.state.pointsRecords.map((item, index) => {
            return <Flex key={index} style={{textAlign: 'center'}}>
                <Flex.Item style={{padding: '0.5rem'}}>{DateManager.getDate(new Date(item.createTime))}</Flex.Item>
                <Flex.Item>{item.changevalue > 0 ? "+" + item.changevalue : item.changevalue}</Flex.Item>
                <Flex.Item>{item.reason}</Flex.Item>
            </Flex>
        });

        return <PaginationList title="积分记录" columns={columns} content={recordContent}
                               totalPages={this.state.totalPages}
                               reqDataFunc={this.requestExchangeRecords}
        />
    }
}