import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Card, Toast, WhiteSpace, WingBlank} from "antd-mobile";

import Layout from "../../../../../common/layout/layout.jsx";

import PutInCart from '../../../../../components/cart/putincart.jsx';
import CartModal from '../../../../../components/cart/cartmodal.jsx';
import {Banner} from "../../../../../components/banner/banner.jsx";
import {PresentCard} from "../../../../../components/present_card/presentCard.jsx";
import {Introduction, ServicePromise, WarmPrompt, SalesInfo} from "../../../../../components/common_detail/index.jsx";

import settingApi from "../../../../../api/setting.jsx";
import homeApi from "../../../../../api/home.jsx";
import proApi from "../../../../../api/product.jsx";

import SaleManager from "../../../../../manager/SaleManager.jsx";

import "./index.less";

let cartProps = {};
let buyProps = {};

export default class SalesDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,

            salesDetail: [],
            servicePromise: {},

            ruleType: '',
            presents: [],
            subtracts: [],
            discounts: [],


            modal: false,
            modalSelectorText: '未选择',

            // putInCart的参数
            action: '',  //点击的是“加入购物车”还是“立即购买”

            specialtyId: -1,
            mynum: -1,

            isNull: false,

            //加购物车相关参数
            specificationId: 0,
            specification: "",
            isGroupPromotion: false,
            quantity: 1,


            data: {},
            featureData: -1,
            dots: true,
            divideMoney: 0
        };

        this.handleAction = this.handleAction.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.changeModalSelectorText = this.changeModalSelectorText.bind(this);
    }

    componentWillMount() {
        console.groupCollapsed("普通优惠详情页");

        let promotionId = 0;
        if (!this.props.location.state) {
            promotionId = localStorage.getItem("promotionId");
        } else {
            promotionId = this.props.location.state;
            localStorage.setItem("promotionId", this.props.location.state);
        }

        //判断是从上个优惠页面回来的，还是从产品页面回来的
        let ruleType = '';
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

        let subtracts, discounts;
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

        this.requestOrdinaryPromotionDetail(promotionId);
        this.requestServicePromise();
    }

    componentWillUnmount() {
        console.groupEnd();
    }

    requestProductDetailData(specialtyId) {
        proApi.getSpecialtySpecificationDetailBySpecialtyID(specialtyId, (rs) => {
            if (rs && rs.success) {
                const data = rs.obj;
                if (!data || JSON.stringify(data) === "[]") {
                    this.setState({
                        isNull: true,
                    });
                } else {
                    const temp = data[0].specialty.specifications;
                    const arrlength = temp.length;
                    let myspecifications;

                    for (let i = 0; i < arrlength; i++) {
                        if (temp[i].specification == this.state.specification)
                            myspecifications = temp[i];
                    }

                    console.log("product specifications", myspecifications);

                    this.setState({
                        data: data,
                        featureData: [myspecifications],
                    });
                }

            } else {
                this.setState({
                    isNull: true,
                });
            }
        });
    }

    requestOrdinaryPromotionDetail(promotionId) {
        homeApi.getOrdinaryPromotionDetail(promotionId, (rs) => {
            if (rs && rs.success) {
                const proDetail = rs.obj;
                this.setState({
                    salesDetail: proDetail,
                    isLoading: false,
                    specificationId: rs.obj.hySingleitemPromotions[0].specificationId.id,
                    specification: rs.obj.hySingleitemPromotions[0].specificationId.specification,
                    presents: rs.obj.hySingleitemPromotions[0].hyPromotion.hyFullPresents,
                    subtracts: rs.obj.hySingleitemPromotions[0].hyPromotion.hyFullSubstracts,
                    discounts: rs.obj.hySingleitemPromotions[0].hyPromotion.hyFullDiscounts,
                    ruleType: rs.obj.hySingleitemPromotions[0].hyPromotion.promotionRule,
                    specialtyId: rs.obj.hySingleitemPromotions[0].specialtyId.id,
                    divideMoney: proDetail.divideMoney
                });
            }
        });
    }

    requestServicePromise() {
        settingApi.getServicePromise((rs) => {
            if (rs && rs.success) {
                const data = rs.obj;
                this.setState({
                    servicePromise: data,
                });
            }
        });
    }

    // 父组件调用子组件的方法
    onRef = (ref) => {
        this.child = ref
    };

    handleAction(e) {
        console.log("handleAction", e);
        this.setState({action: e});
    }

    showModal() {
        this.setState({modal: true});
    }

    hideModal(status) {
        this.setState({modal: false});
        if (status === 'success')
            Toast.success('选择成功～', 1, null, false);
    }

    changeModalSelectorText(active, num, specificationId, mPrice, pPrice, success) {
        this.setState({
            currentPrePrice: pPrice,
            currentMarketPrice: mPrice,
            quantity: num,
            specification: active.specification,
            specificationId: specificationId,
            modalSelectorText: active.specification + '  ×' + num,
        }, () => {
            cartProps.quantity = num
            buyProps.buyItem[0].quantity = num
            console.log("hahahahha", num, this.state.quantity, buyProps.buyItem.quantity)
            if (this.state.action === "addToCart")
                this.child.addToCart(cartProps);
            else if (this.state.action === "buyImmediately")
                this.child.buyImmediately(buyProps);
            this.setState({action: ""});
        });
    }


    checkPresents() {
        let fullPresents = null;
        let temp = this.state.salesDetail;

        console.log("asfdsaf", temp);

        if (temp.hySingleitemPromotions && temp.hySingleitemPromotions[0].hyPromotion.promotionRule == "满赠") {
            fullPresents = temp.hySingleitemPromotions[0].hyPromotion.hyFullPresents && temp.hySingleitemPromotions[0].hyPromotion.hyFullPresents.map((item, index) => {
                console.log("asfsgastgdrg", item.fullPresentProductSpecification.specification);
                return <Link to={{
                    pathname: `/product/${item.fullPresentProduct.id}`,
                    isPromotion: false,
                    isPresent: true,
                    guige: item.fullPresentProductSpecification.specification
                }} key={index}>

                    <PresentCard isPresent={true}
                                 column1="赠品数量："
                                 column2="商品规格："
                                 presentImgUrl={SaleManager.getSalesDetailIcon(item.fullPresentProduct.images)}
                                 presentName={item.fullPresentProduct.name}
                                 presentNum={item.fullPresentProductNumber}
                                 presentSpecification={item.fullPresentProductSpecification.specification}/>

                    <WhiteSpace/>
                </Link>
            });
        }
        return fullPresents
    }


    render() {

        // console.log("this.state.specialtyId ", this.state.specialtyId )
        if (!this.state.salesDetail || JSON.stringify(this.state.salesDetail) === "[]")
            return null;

        // console.log("this.state.mynum ", this.state.mynum )

        const content = this.state.salesDetail.hySingleitemPromotions && this.state.salesDetail.hySingleitemPromotions.map((item, index) => {

            console.log('itemitemitemitem', item)
            console.log("mytest", this.state)

            return <Link to={{
                pathname: `/product/${item.specialtyId.id}`,
                isPromotion: true,
                ruleType: item.hyPromotion.promotionRule,
                discounts: item.hyPromotion.hyFullDiscounts,
                subtracts: item.hyPromotion.hyFullSubstracts,
                presents: item.hyPromotion.hyFullPresents,
                promoteNum: item.promoteNum,
                limitedNum: item.limitedNum,
                guige: item.specificationId.specification,
                pPrice: item.specificationId.platformPrice,
                mPrice: item.specificationId.marketPrice
            }} key={index}>
                <Card>

                    <PresentCard isPresent={false}
                                 column1=""
                                 column2="优惠规格："
                                 presentImgUrl={SaleManager.getSalesDetailIcon(item.specialtyId.images)}
                                 presentName={item.specialtyId.name}
                                 presentNum=""
                                 presentSpecification={item.specificationId.specification}/>

                </Card>
                <WhiteSpace/>
            </Link>
        });
        console.log("lalalalal", this.state.salesDetail.hySingleitemPromotions);

        let bancontent = SaleManager.getSalesBannerContent(this.state.salesDetail.hySingleitemPromotions,
                                                            this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.syncTagpic,
                                                            this.state.salesDetail.hySingleitemPromotions[0].specialtyId.images,
                                                            this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyPromotionPics);
        let start = SaleManager.getActivityStartTime(this.state.salesDetail.hySingleitemPromotions, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionStarttime);
        let end = SaleManager.getActivityEndTime(this.state.salesDetail.hySingleitemPromotions, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionEndtime);

        if (this.state.specialtyId != -1 && this.state.mynum == -1) {
            this.requestProductDetailData(this.state.specialtyId);
            this.state.mynum = 0;

            cartProps = {
                "wechatId": localStorage.getItem("wechatId"),
                "specificationId": this.state.specificationId,
                "specialtyId": this.state.specialtyId,
                "isGroupPromotion": this.state.isGroupPromotion,
                "quantity": this.state.quantity,
            };

            let buyItem = [{
                "id": null,
                "iconURL": SaleManager.getSalesIconImgArray(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.syncTagpic,
                                                            this.state.salesDetail.hySingleitemPromotions[0].specialtyId.images,
                                                            this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyPromotionPics),
                "isGroupPromotion": this.state.isGroupPromotion,
                "curPrice": this.state.salesDetail.hySingleitemPromotions[0].specificationId.platformPrice,
                "name": (JSON.stringify(this.state.data) !== "{}") && this.state.data[0].specialty.name,
                "quantity": this.state.quantity,
                "specialtyId": this.state.specialtyId,
                "specialtySpecificationId": this.state.specificationId,
                "specification": this.state.specification,
                "promotionId": this.state.salesDetail.id,
            }];

            buyProps = {
                "buyItem": buyItem,
                "isPromotion": true,
                "origin": "sales",
            };
        }


        return <Layout>
            <Card>
                <Banner content={bancontent}/>

                <SalesInfo
                    name={this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionName : ""}
                    salePeriod={this.state.salesDetail.hySingleitemPromotions ? start + "时 ~ " + end + "时" : ""}
                    saleType={this.state.salesDetail.hySingleitemPromotions ? SaleManager.getDetailSalesContent(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionRule, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullSubstracts,
                        this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullDiscounts, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullPresents) : ""}
                    activityPrice={this.state.salesDetail.hySingleitemPromotions ? "￥" + this.state.salesDetail.hySingleitemPromotions[0].specificationId.platformPrice : ""}
                    sellNum={this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].havePromoted : ""}
                    limitNum={this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].limitedNum : ""}
                    activityInbound={this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].promoteNum : ""}
                    divideMoney={this.state.divideMoney}
                />

                <WingBlank>
                    {content}
                    {this.checkPresents()}

                    {this.state.data[0] ?
                        <Card className="general_container">
                            <div>
                                <Introduction title="活动介绍"
                                              content={this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.introduction}/>
                                <ServicePromise content={this.state.servicePromise.servicePromise}/>
                                <WarmPrompt content={this.state.servicePromise.prompt}/>
                            </div>
                        </Card> : <div/>}

                </WingBlank>

                <WhiteSpace/>
                <WhiteSpace/>
                <WhiteSpace/>

            </Card>


            <PutInCart style={{height: '3.125rem'}}
                       onRef={this.onRef}
                       handleAction={this.handleAction}

                       modalSelectorText={this.state.modalSelectorText}
                       showModal={this.showModal}

                       cartProps={cartProps}
                       buyProps={buyProps}
            />


            {(this.state.specialtyId != -1 && this.state.featureData != -1) ?
                <CartModal
                    productData={this.state.data}
                    modalData={this.state.featureData}
                    hasSpecification={false}

                    visible={this.state.modal}
                    hideModal={this.hideModal}
                    selectorText={this.changeModalSelectorText}

                    guige={this.state.salesDetail.hySingleitemPromotions[0].specificationId.specification}
                    limit={this.state.salesDetail.hySingleitemPromotions[0].limitedNum}
                    stock={this.state.salesDetail.hySingleitemPromotions[0].promoteNum}
                /> : ""}

        </Layout>
    }
}

SalesDetail.contextTypes = {
    router: PropTypes.object.isRequired
};