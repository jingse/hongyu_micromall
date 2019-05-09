import React from "react";
import {Flex} from "antd-mobile";
import PaginationList from "../../../../../common/pagination_list/paginationList.jsx";

import couponApi from "../../../../../api/coupon.jsx";
import DateManager from "../../../../../manager/DateManager.jsx";


export default class UseHistory extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            history: [],
            totalPages: 1,
        };

        this.requestBalanceUseHistory = this.requestBalanceUseHistory.bind(this);
    }

    requestBalanceUseHistory(wechatId, page, rows) {
        couponApi.getBalanceUseHistory(wechatId, page, rows, (rs) => {
            console.log("使用记录：", rs);
            if (rs && rs.success) {
                const history = rs.obj.rows;

                this.setState({
                    history: history,
                    totalPages: rs.obj.totalPages,
                });
            }
        });
    }


    render() {
        const columns = ["时间", "类型", "使用金额", "当前剩余"];

        const content = this.state.history && this.state.history.map((item, index) => {
            return <Flex key={index} style={{textAlign: 'center'}}>
                <Flex.Item style={{padding: '0.5rem'}}>{DateManager.getDate(new Date(item.createTime))}</Flex.Item>
                <Flex.Item>{item.type === "use" ? "使用" : "退返"}</Flex.Item>
                <Flex.Item>{item.amount}</Flex.Item>
                <Flex.Item>{item.surplus}</Flex.Item>
            </Flex>
        });

        return <PaginationList title="使用记录" columns={columns} content={content}
                               totalPages={this.state.totalPages}
                               reqDataFunc={this.requestBalanceUseHistory}
        />
    }
}