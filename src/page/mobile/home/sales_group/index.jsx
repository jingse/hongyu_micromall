import React from "react";
import SaleList from "../../../../common/sale_list/saleList.jsx";


export default class SalesGroup extends React.Component {

    constructor(props) {
        super(props);
        this.getSalesIconImg = this.getSalesIconImg.bind(this);
    }

    componentWillMount() {
        localStorage.setItem("categoryName", "组合优惠");
    }

    getSalesIconImg(item) {
        let img = null;
        item.pics && item.pics.map((image, index) => {
            if (image.isTag)
                img = image.mediumPath
        });
        return img
    }

    render() {
        return <SaleList funcName="getGroupPromotionList" targetLink='/home/sales_group/detail'
                         getIconFunc={this.getSalesIconImg}
                         name={(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}/>
    }
}