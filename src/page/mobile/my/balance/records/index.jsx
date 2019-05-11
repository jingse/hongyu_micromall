import React from "react";
import {Flex} from "antd-mobile";
import PaginationList from "../../../../../common/pagination_list/paginationList.jsx";

import couponApi from "../../../../../api/coupon.jsx";
import DateManager from "../../../../../manager/DateManager.jsx";


export default class BalanceRecords extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {
            records: [],
            totalPages: 1,
        };

        this.requestBalanceRecords = this.requestBalanceRecords.bind(this);
    }

    requestBalanceRecords(wechatId, page, rows) {
        couponApi.getBalanceRecords(wechatId, page, rows, (rs) => {
            console.log("充值记录：", rs);
            if (rs && rs.success) {
                const records = rs.obj.rows;

                this.setState({
                    records: records,
                    totalPages: rs.obj.totalPages,
                });
            }
        });
    }


    static checkType(type) {
        switch (type) {
            case 1:
                return "线路赠送";
            case 2:
                return "销售奖励";
            case 3:
                return "商城销售";
            case 4:
                return "大客户购买";
            case 5:
                return "积分兑换";
            case 6:
                return "首单奖励";
            default:
                return "未知";
        }
    }


    render() {

        const columns = ["时间", "电子券种类", "电子券金额"];

        const content = this.state.records && this.state.records.map((item, index) => {
            return <Flex key={index} style={{textAlign: 'center'}}>
                <Flex.Item style={{padding: '0.5rem'}}>{DateManager.getDate(new Date(item.useTime))}</Flex.Item>
                <Flex.Item>{BalanceRecords.checkType(item.type)}</Flex.Item>
                <Flex.Item>{item.useAmount}</Flex.Item>
            </Flex>
        });

        return <PaginationList title="充值记录" columns={columns} content={content}
                               totalPages={this.state.totalPages}
                               reqDataFunc={this.requestBalanceRecords}
        />
    }

}