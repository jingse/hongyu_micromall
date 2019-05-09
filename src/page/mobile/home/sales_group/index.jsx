import React from "react";
import SaleList from "../../../../common/sale_list/saleList.jsx";
import SaleManager from "../../../../manager/SaleManager.jsx";


export default class SalesGroup extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        localStorage.setItem("categoryName", "组合优惠");
    }


    render() {
        return <SaleList funcName="getGroupPromotionList" targetLink='/home/sales_group/detail'
                         getIconFunc={SaleManager.gerSalesGroupIconByItem}
                         name={(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}/>
    }
}