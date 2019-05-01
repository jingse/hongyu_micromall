import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Card, Carousel, Flex, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
// import Navigation from "../../../../../components/navigation/index.jsx";

import PutInCart from '../../../../../components/cart/putincart.jsx';
import CartModal from './cartmodal.jsx';
import homeApi from "../../../../../api/home.jsx";
import cartApi from "../../../../../api/cart.jsx";
import proApi from "../../../../../api/product.jsx";
import {getServerIp} from "../../../../../config.jsx";

import "./index.less";


export default class SalesGroupDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            salesGroupDetail: [],
            salesGroupData: [],
            isLoading: false,

            val: 1,
            inbound: 0,


            ruleType: '',
            presents: [],
            subtracts: [],
            discounts: [],


            selectorText: '未选择',
            modalSelectorText: '未选择',

            isadd: 0,
            modal: false,

            specialtyId: -1,
            mynum: -1,

            //加购物车相关参数
            specificationId: 0,
            specification: "",
            isGroupPromotion: false,
            quantity: 1,
            isNull: false,

            data: {},
            featureData: -1,
            dots: true,
            cartCount: parseInt(localStorage.getItem("cartCount")) !== 0 ? parseInt(localStorage.getItem("cartCount")) : 0,
        };
    }

    componentWillMount() {

        var groupPromotionId = 0;
        this.requestServicePromise();
        if (!this.props.location.state) {
            groupPromotionId = localStorage.getItem("groupPromotionId");
        } else {
            groupPromotionId = this.props.location.state;
            localStorage.setItem("groupPromotionId", this.props.location.state);
        }


        //判断是从上个优惠页面回来的，还是从产品页面回来的
        var ruleType = '';
        if (!this.props.location.ruleType) {
            ruleType = localStorage.getItem("ruleType");
        } else {
            ruleType = this.props.location.ruleType;
            localStorage.setItem("ruleType", this.props.location.ruleType);
        }
        this.setState({
            ruleType: ruleType,
        });

        if (ruleType === '满赠') {
            //判断有没有满赠商品
            if (this.props.location.presents && JSON.stringify(this.props.location.presents) !== '[]') {
                this.setState({
                    presents: this.props.location.presents,
                });
                localStorage.setItem("presents", JSON.stringify(this.props.location.presents));
            } else {
                this.setState({
                    presents: JSON.parse(localStorage.getItem("presents")),
                });
            }
        }

        var subtracts, discounts;
        if (!this.props.location.subtracts) {
            subtracts = localStorage.getItem("subtracts");
            discounts = localStorage.getItem("discounts");
        } else {
            subtracts = this.props.location.subtracts;
            discounts = this.props.location.discounts;
        }
        this.setState({
            subtracts: subtracts,
            discounts: discounts,
        });


        this.requestGroupPromotionDetail(groupPromotionId);

        localStorage.removeItem("inputBalance");
    }

    requestGroupPromotionDetail(groupPromotionId) {
        homeApi.getGroupPromotionDetail(groupPromotionId, (rs) => {
            if (rs && rs.success) {
                const proDetail = rs.obj;
                console.log('proDetail', proDetail)
                // this.state.salesGroupData = this.props.location.groupProduct;
                this.state.salesGroupData = proDetail;


                this.setState({
                    salesGroupDetail: proDetail,
                    salesGroupData: this.state.salesGroupData,
                    isLoading: false,
                    inbound: proDetail.hyGroupitemPromotions[0].promoteNum
                });
            }
        });
    }

    requestServicePromise() {
        proApi.getServicePromise((rs) => {
            if (rs && rs.success) {
                const data = rs.obj;
                this.setState({
                    servicePromise: data,
                });
            }
        });
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


    addToCart() {
        if (this.state.modalSelectorText === '未选择' && this.state.selectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);
            this.showModal(1);
            return
        }
        console.log("???", this.state.specialtyId)
        cartApi.addSingleItemToCart(localStorage.getItem("wechatId"), "", this.state.salesGroupDetail.hyGroupitemPromotions[0].id,
            true, this.state.val, (rs) => {
                console.log("发给后台的购物车数量", this.state.quantity);
                if (rs && rs.success) {
                    Toast.success('加入成功，快去购物车看看你的宝贝吧～', 1, null, false);
                    console.log("rs.msg", rs.msg);
                    this.getCartCount();
                } else {
                    Toast.info("添加失败！", 1);
                }
            });
    }

    buyImmediately() {
        const item = [{
            "id": null,
            "iconURL": this.getSalesIconImg(this.state.salesGroupDetail.pics),
            "isGroupPromotion": true,
            "curPrice": this.state.salesGroupDetail.hyGroupitemPromotions[0].sellPrice,
            "name": this.state.salesGroupDetail.name,
            "quantity": this.state.val,
            "specialtyId": this.state.salesGroupDetail.hyGroupitemPromotions[0].id,
            "specialtySpecificationId": "",
            "specification": "",
            "promotionId": this.state.salesGroupDetail.id,
        }];
        let price = {};

        cartApi.getTotalPriceInCart(item, (rs) => {
            console.log("getTotalPriceInCart rs", rs);
            if (rs && rs.success) {
                price = rs.obj;

                console.log("buyImmediately price", price);
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
        this.setState({modal: true, isadd: val});
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
            val: num,
            specification: active.specification,
            modalSelectorText: active.specification + '  ×' + num,
            specificationId: specificationId,
        }, () => {
            console.log('this.state.isadd', this.state.isadd);
            if (this.state.isadd === 1)
                this.addToCart();
        });
    }


    getSalesContent(ruleType, substracts, discounts, presents) {
        var content = null;

        if (ruleType === "满减") {
            content = substracts && substracts.map((item, index) => {
                return "满" + item.fullFreeRequirement + "元减" + item.fullFreeAmount + "元"
            });
        } else if (ruleType === "满折") {
            content = discounts && discounts.map((item, index) => {
                return "满" + item.discountRequirenment + "元打" + item.discountOff + "折"
            });
        } else if (ruleType === "满赠") {
            content = presents && presents.map((item, index) => {
                return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProduct.name + "*" + item.fullPresentProductNumber
            });
        } else {

        }

        return content
    }

    getSalesDetailIcon(salesImages) {
        var img = null;
        salesImages && salesImages.map((item, index) => {
            if (item.isLogo) {
                img = item.mediumPath
            }
        });
        console.log("img", img);
        return img
    }

    getSalesIconImg(salesImages) {
        var img = null;
        salesImages && salesImages.map((item, index) => {
            if (item.isTag) {
                img = item
            }
        });
        return img
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

    checkPresents() {
        var fullPresents = null;
        if (this.state.salesGroupDetail.fullPresents && JSON.stringify(this.state.salesGroupDetail.fullPresents) !== '[]') {
            fullPresents = this.state.salesGroupDetail.fullPresents && this.state.salesGroupDetail.fullPresents.map((item, index) => {
                console.log("fsdgfds", item);
                return <Link to={{
                    pathname: `/product/${item.fullPresentProduct.id}`,
                    isPromotion: false,
                    isPresent: true,
                    guige: item.fullPresentProductSpecification.specification
                }} key={index}>
                    <Flex style={{background: '#fff'}}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img
                                src={"http://" + getServerIp() + this.getSalesDetailIcon(item.fullPresentProduct.images)}
                                style={{width: '70%', height: '4rem', margin: '0.4rem'}}/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 60%', color: 'black'}}>
                            <WhiteSpace/>
                            <div style={{marginBottom: 10, fontWeight: 'bold'}}>
                                {item.fullPresentProduct.name}
                                <span style={{color: 'darkorange', fontWeight: 'bold'}}> (赠)</span>
                            </div>
                            <div style={{marginBottom: 10}}>赠品数量：<span
                                style={{color: 'red'}}>{item.fullPresentProductNumber}</span></div>
                            <div style={{marginBottom: 10}}>商品规格：<span
                                style={{color: 'red'}}>{item.fullPresentProductSpecification.specification}</span></div>
                            {/*<div>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div>*/}
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace/>
                </Link>
            });
        }
        return fullPresents
    }

    showWebusinessInfo(item) {
        console.log("??", localStorage.getItem("isWebusiness"));
        if (localStorage.getItem("isWebusiness") == 1) {
            return <WingBlank>提成比例：{item.businessPersonDivide.proportion}</WingBlank>
        }
    }

    onChange = (val) => {
        this.setState({val});
    };


    render() {

        console.log("this.state.salesGroupDetail", this.state.salesGroupDetail);
        if (!this.state.salesGroupDetail || JSON.stringify(this.state.salesGroupDetail) == "[]" || !this.state.salesGroupData) {
            return null
        }
        console.log('inbound', this.state.inbound)

        const content = this.state.salesGroupDetail.hyGroupitemPromotions[0].hyGroupitemPromotionDetails && this.state.salesGroupDetail.hyGroupitemPromotions[0].hyGroupitemPromotionDetails.map((item, index) => {

            console.log('itemitemitemitem', item)
            console.log("mytest", this.state)
            return <Link to={{
                pathname: `/product/${item.itemId.id}`,
                isPromotion: true,
                ruleType: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule,
                discounts: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullDiscounts,
                subtracts: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
                presents: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullPresents,
                promoteNum: this.state.salesGroupDetail.hyGroupitemPromotions[0].promoteNum,
                limitedNum: this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum,
                guige: item.itemSpecificationId.specification,
                pPrice: item.itemSpecificationId.platformPrice,
                mPrice: item.itemSpecificationId.marketPrice
            }} key={index}>
                <Card>
                    <Flex style={{background: '#fff'}}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img src={"http://" + getServerIp() + this.getSalesDetailIcon(item.itemId.images)}
                                 style={{width: '70%', height: '4rem', margin: '0.4rem'}}/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 80%', color: 'black'}}>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            <div style={{marginBottom: 5, fontWeight: 'bold'}}>{item.itemId.name}</div>
                            <WhiteSpace/>
                            <div style={{marginBottom: 5}}>单买价格：<span
                                style={{color: 'red'}}>￥{item.itemSpecificationId.platformPrice}元</span></div>
                            <WhiteSpace/>
                            <div style={{marginBottom: 5}}>优惠规格：<span
                                style={{color: 'red'}}>{item.itemSpecificationId.specification}</span></div>
                            {/* <div style={{marginBottom: 5}}>优惠政策：<span style={{color:'red'}}>
                        {this.getSalesContent(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
                                         this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullDiscounts, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullPresents)}
                        </span></div> */}
                            {/* {(localStorage.getItem('isWebusiness') === '1')?<div style={{marginBottom: 10}}>提成金额：<span style={{color:'red'}}>{parseFloat(item.itemSpecificationId.dividMoney).toFixed(2)}</span></div>:<div></div>} */}
                            {/* <div style={{marginBottom: 5}}>销量：<span style={{color:'red'}}>{item.itemSpecificationId.hasSold}</span></div> */}
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
                </Card>
                <WhiteSpace/>
            </Link>
        });

        var bancontent;
        if (this.state.salesGroupDetail.hyGroupitemPromotions) {
            var tempban = this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyPromotionPics;
            console.log("before", tempban);
            for (var i = 0; i < tempban.length; i++) {
                if (tempban[i].isTag == true) {
                    tempban.splice(i, 1);
                }
            }
            console.log("after", tempban);
            bancontent = tempban && tempban.map((item, index) => {
                if (item.isTag == false) {
                    return <img key={index} style={{margin: '0 auto', height: '12rem', width: '100%'}}
                                src={"http:" + getServerIp() + item.sourcePath}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                }}/>
                }

            });
        }
        // if(bancontent.length==1){
        //     this.state.dots=false;
        //     bancontent[1]=bancontent[0];
        // }
        console.log("wgudsiuasjd", bancontent);
        var start, end, a, b;
        if (this.state.salesGroupDetail.hyGroupitemPromotions) {
            start = new Date(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionStarttime).toLocaleString();
            end = new Date(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionEndtime).toLocaleString();
            a = start.indexOf("午");
            b = end.indexOf("午");
            console.log("safsfasfsa", a, b, start.substring(0, a + 2), end.substring(0, b + 2));
            start.substring(0, a + 2);
            end.substring(0, b + 2);
        }


        return <Layout>
            {/*<Navigation title={this.state.salesGroupDetail.name + "详情"} left={true} backLink='/home/'/>*/}
            <Card>
                <Carousel
                    style={{touchAction: 'none'}}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                    swipeSpeed={35}
                    dots={this.state.dots}
                >
                    {bancontent}
                </Carousel>
                <WingBlank>
                    <h3>
                        {this.state.salesGroupDetail.hyGroupitemPromotions ? this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionName : ""}
                    </h3>
                    <h4>
                        <font color="red">优惠时间：</font>
                        {this.state.salesGroupDetail.hyGroupitemPromotions ? start.substring(0, a + 2) + "时 ~ " + end.substring(0, b + 2) + "时" : ""}
                    </h4>
                    <h4>
                        <div style={{marginBottom: 5}}><span style={{color: 'red'}}>优惠类型：</span>
                            {this.getSalesContent(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
                                this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullDiscounts, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullPresents)}
                        </div>
                    </h4>
                    <h4>
                        <font color="red">活动价格：</font>
                        {this.state.salesGroupDetail.hyGroupitemPromotions ? "￥" + this.state.salesGroupDetail.hyGroupitemPromotions[0].sellPrice : ""}
                    </h4>
                    <h4>
                        <font color="red">已售数量：</font>
                        {this.state.salesGroupDetail.hyGroupitemPromotions ? this.state.salesGroupDetail.hyGroupitemPromotions[0].havePromoted : ""}
                    </h4>
                    <h4>
                        <font color="red">限购数量：</font>
                        {this.state.salesGroupDetail.hyGroupitemPromotions ? this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum : ""}
                    </h4>
                    <h4>
                        <font color="red">活动库存：</font>
                        {this.state.salesGroupDetail.hyGroupitemPromotions ? this.state.salesGroupDetail.hyGroupitemPromotions[0].promoteNum : ""}
                    </h4>
                    <h4>
                        {(localStorage.getItem('isWebusiness') === '1') ? <div style={{marginBottom: 10}}>提成金额：<span
                            style={{color: 'black'}}>{parseFloat(this.state.salesGroupDetail.dividMoney).toFixed(2)}</span>
                        </div> : <div/>}
                    </h4>
                    <hr/>

                    <WhiteSpace/>


                </WingBlank>
            </Card>

            <WhiteSpace/>
            {content}
            {this.checkPresents()}
            <WingBlank>
                <div className="para_title">活动介绍</div>
                <div dangerouslySetInnerHTML={{__html: this.state.salesGroupData.introduction}}/>
            </WingBlank>
            <WingBlank>
                <div className="para_title">服务承诺</div>
                <div className="paragraph">
                    {this.state.servicePromise.servicePromise}
                </div>
            </WingBlank>

            <WingBlank>
                <div className="para_title">温馨提示</div>
                <div className="paragraph">
                    {this.state.servicePromise.prompt}
                </div>
            </WingBlank>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>

            {this.checkCartDisplay()}

            {this.checkSpecificationDisplay()}
        </Layout>
    }
}

SalesGroupDetail.contextTypes = {
    router: PropTypes.object.isRequired
};