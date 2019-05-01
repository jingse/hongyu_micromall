import React from "react";
import SaleList from "../../../../common/sale_list/saleList.jsx";


export default class Sales extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        localStorage.setItem("categoryName", "普通优惠");
    }

    getSalesIconImg(item) {
        let img = null;
        for (let i = 0; i < item.pics.length; i++) {
            if (item.hySingleitemPromotions[0].hyPromotion.syncTagpic == false) {
                if (item.pics[i].isTag == true) {
                    img = item.pics[i].mediumPath;
                }
            } else {
                if (item.pics[i].isLogo == true) {
                    img = item.pics[i].mediumPath;
                }
            }
        }
        return img
    }


    render() {
        return <SaleList funcName="getOrdinaryPromotionList" targetLink='/home/sales/detail'
                         getIconFunc={this.getSalesIconImg.bind(this)}
                         name={(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}/>
    }
}