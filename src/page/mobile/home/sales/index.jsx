import React from "react";
import SaleList from "../../../../common/sale_list/saleList.jsx";
import SaleManager from "../../../../manager/SaleManager.jsx";


export default class Sales extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        localStorage.setItem("categoryName", "普通优惠");
    }


    render() {
        return <SaleList funcName="getOrdinaryPromotionList" targetLink='/home/sales/detail'
                         getIconFunc={SaleManager.getSalesIconImg}
                         name={(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}/>
    }
}