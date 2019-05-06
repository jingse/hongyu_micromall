import React from "react";
import cartApi from "../../api/cart";
import {Toast} from "antd-mobile";
import CartModal from "../../page/mobile/home/sales_group/detail/cartmodal";
import PutInCart from "../../components/cart/putincart";


export default class Purchase extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            cartCount: parseInt(localStorage.getItem("cartCount")) !== 0 ? parseInt(localStorage.getItem("cartCount")) : 0,
            selectorText: '未选择',
            modalSelectorText: '未选择',
            isAdd: 0,
            modal: false,

            quantity: 1,
        }
    }


    getCartCount() {
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const count = rs.obj.length;
                localStorage.setItem("cartCount", count);
                this.setState({
                    cartCount: count,
                });
            }
        });
    }


    addToCart(wechatId, specificationId, specialtyId, isGroupPromotion, quantity) {
        if (this.state.modalSelectorText === '未选择' && this.state.selectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);
            this.showModal(1);
            return
        }

        cartApi.addSingleItemToCart(wechatId, specificationId, specialtyId, isGroupPromotion, this.state.quantity, (rs) => {
            //console.log("发给后台的购物车数量", this.state.quantity);
            if (rs && rs.success) {
                Toast.success('加入成功，快去购物车看看你的宝贝吧～', 1, null, false);
                //console.log("rs.msg", rs.msg);
                this.getCartCount();
            } else {
                Toast.info("添加失败！", 1);
            }
        });
    }

    buyImmediately(item) {

        let price = {};

        cartApi.getTotalPriceInCart(item, (rs) => {
            // console.log("getTotalPriceInCart rs", rs);
            if (rs && rs.success) {
                price = rs.obj;

                // console.log("buyImmediately price", price);
                if (price !== {}) {
                    localStorage.setItem("origin", "sales_group");
                    this.context.router.history.push({
                        pathname: '/cart/payment',
                        products: item,
                        price: price,
                        origin: "sales_group",
                        isPromotion: true,
                        shipFee: 0
                    });
                }
            }
        });
    }


    showModal(val) {
        this.setState({modal: true, isAdd: val});
    }

    hideModal(status) {
        this.setState({modal: false});
        if (status === 'success')
            Toast.success('选择成功～', 1, null, false);
    }

    changeModalSelectorText(active, num, specificationId, mPrice, pPrice, success) {
        console.log('加购物车的数量', num);
        this.setState({
            currentPrePrice: pPrice,
            currentMarketPrice: mPrice,
            quantity: num,
            specification: active.specification,
            modalSelectorText: active.specification + '  ×' + num,
            specificationId: specificationId,
        }, () => {
            console.log('this.state.isAdd', this.state.isAdd);
            if (this.state.isAdd === 1)
                this.addToCart();
        });
    }

    checkSpecificationDisplay() {
        // if(this.state.specialtyId != -1 && this.state.featureData != -1){
        // console.log("wawawawawa",this.state.salesDetail.hySingleitemPromotions[0].limitedNum);
        return <CartModal
            productData={this.state.data}
            modalData={this.state.featureData}
            modal={this.state.modal}
            hideModal={this.hideModal.bind(this)}
            selectorText={this.changeModalSelectorText.bind(this)}
            limit={this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum}
        />
        // }

    }


    checkCartDisplay() {
        return <PutInCart style={{height: '3.125rem'}}
                          addToCart={this.addToCart.bind(this)}
                          buyImmediately={this.buyImmediately.bind(this)}
                          cartCount={this.state.cartCount}
        />
    }

}