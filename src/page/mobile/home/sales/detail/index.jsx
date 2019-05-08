import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Card, Carousel, Flex, Toast, WhiteSpace, WingBlank} from "antd-mobile";

import Layout from "../../../../../common/layout/layout.jsx";

import PutInCart from '../../../../../components/cart/putincart.jsx';
import CartModal from '../../../../../components/cart/cartmodal.jsx';

import settingApi from "../../../../../api/setting.jsx";
import homeApi from "../../../../../api/home.jsx";
import proApi from "../../../../../api/product.jsx";

import SaleManager from "../../../../../manager/SaleManager.jsx";
import {getServerIp} from "../../../../../config.jsx";

import "./index.less";


let cartProps = {};
let buyProps = {};

export default class SalesDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            salesDetail: [],
            isLoading: false,
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
        };

        this.handleAction = this.handleAction.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.changeModalSelectorText = this.changeModalSelectorText.bind(this);
    }

    componentWillMount() {
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
                    var myspecifications;

                    for (var i = 0; i < arrlength; i++) {
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
                    specialtyId: rs.obj.hySingleitemPromotions[0].specialtyId.id
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
        }, ()=>{
            if (this.state.action === "addToCart")
                this.child.addToCart(cartProps);
            else if (this.state.action === "buyImmediately")
                this.child.buyImmediately(buyProps);
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
                    <Flex style={{background: '#fff'}}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img
                                src={"http://" + getServerIp() + SaleManager.getSalesDetailIcon(item.fullPresentProduct.images)}
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


    render() {

        // console.log("this.state.specialtyId ", this.state.specialtyId )
        // console.log("this.state.mynum ", this.state.mynum )

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
                "iconURL": (JSON.stringify(this.state.data) !== "{}") && this.state.data[0].iconURL,
                "isGroupPromotion": this.state.isGroupPromotion,
                "curPrice": this.state.currentPrePrice,
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
                    <Flex style={{background: '#fff'}}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img
                                src={"http://" + getServerIp() + SaleManager.getSalesDetailIcon(item.specialtyId.images)}
                                style={{width: '70%', height: '4rem', margin: '0.4rem'}}/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 80%', color: 'black'}}>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            <div style={{marginBottom: 5, fontWeight: 'bold'}}>{item.specialtyId.name}</div>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            {/* <div style={{marginBottom: 5}}>价格：<span style={{color:'red'}}>￥{item.specificationId.platformPrice}元</span></div> */}
                            <div style={{marginBottom: 5}}>优惠规格：<span
                                style={{color: 'red'}}>{item.specificationId.specification}</span></div>
                            {/* <div style={{marginBottom: 5}}>优惠政策：<span style={{color:'red'}}>
                        {SaleManager.getDetailSalesContent(item.hyPromotion.promotionRule, item.hyPromotion.hyFullSubstracts, item.hyPromotion.hyFullDiscounts, item.hyPromotion.hyFullPresents)}
                        </span></div> */}
                            {/* {(localStorage.getItem('isWebusiness') === '1')?<div style={{marginBottom: 10}}>提成金额：<span style={{color:'red'}}>{parseFloat(item.specificationId.dividMoney).toFixed(2)}</span></div>:<div></div>} */}
                            {/* <div style={{marginBottom: 5}}>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div> */}
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
                </Card>
                <WhiteSpace/>
            </Link>
        });
        console.log("lalalalal", this.state.salesDetail.hySingleitemPromotions);

        let bancontent;
        if (this.state.salesDetail.hySingleitemPromotions) {
            let tempban = this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyPromotionPics;
            console.log("before", tempban);
            for (let i = 0; i < tempban.length; i++) {
                if (tempban[i].isTag)
                    tempban.splice(i, 1);
            }
            console.log("after", tempban);
            bancontent = tempban && tempban.map((item, index) => {
                if (!item.isTag)
                    return <img key={index} style={{margin: '0 auto', height: '12rem', width: '100%'}}
                                src={"http://" + getServerIp() + item.sourcePath}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                }}/>
            });
            // if(bancontent.length==1){
            //     this.state.dots=false;
            //     bancontent[1]=bancontent[0];
            // }
            console.log("wgudsiuasjd", bancontent);
        }

        let start, end, a, b;
        if (this.state.salesDetail.hySingleitemPromotions) {
            start = new Date(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionStarttime).toLocaleString();
            end = new Date(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionEndtime).toLocaleString();
            a = start.indexOf("午");
            b = end.indexOf("午");
            console.log("safsfasfsa", a, b, start.substring(0, a + 2), end.substring(0, b + 2));
            start.substring(0, a + 2);
            end.substring(0, b + 2);
        }

        //     cartApi.addSingleItemToCart(localStorage.getItem("wechatId"), this.state.specificationId, this.state.specialtyId,
        //         this.state.isGroupPromotion, this.state.quantity, (rs) => {


        return <Layout>
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
                        {this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionName : ""}
                    </h3>
                    <h4>
                        <font color="red">优惠时间：</font>
                        {this.state.salesDetail.hySingleitemPromotions ? start.substring(0, a + 2) + "时 ~ " + end.substring(0, b + 2) + "时" : ""}
                    </h4>
                    <h4>
                        <font color="red">优惠类型：</font>
                        {this.state.salesDetail.hySingleitemPromotions ? SaleManager.getDetailSalesContent(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionRule, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullSubstracts,
                            this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullDiscounts, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullPresents) : ""}
                    </h4>
                    <h4>
                        <font color="red">活动价格：</font>
                        {this.state.salesDetail.hySingleitemPromotions ? "￥" + this.state.salesDetail.hySingleitemPromotions[0].specificationId.platformPrice : ""}
                    </h4>
                    <h4>
                        <font color="red">已售数量：</font>
                        {this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].havePromoted : ""}
                    </h4>
                    <h4>
                        <font color="red">限购数量：</font>
                        {this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].limitedNum : ""}
                    </h4>
                    <h4>
                        <font color="red">活动库存：</font>
                        {this.state.salesDetail.hySingleitemPromotions ? this.state.salesDetail.hySingleitemPromotions[0].promoteNum : ""}
                    </h4>
                    <h4>
                        {console.log("safasd", this.state.salesDetail)}
                        {(localStorage.getItem('isWebusiness') === '1') && this.state.salesDetail ? <div
                                style={{marginBottom: 10}}>提成金额：{parseFloat(this.state.salesDetail.divideMoney).toFixed(2)}</div> :
                            <div/>}
                    </h4>
                    {/* <h4>
                结束时间：{this.state.salesDetail.hySingleitemPromotions?end.substring(0,b+2)+"时":""}
            </h4> */}
                    <hr/>

                    {content}
                    {this.checkPresents()}

                    {this.state.data[0] ?
                        <Card className="general_container">
                            <div>
                                <WingBlank>
                                    <div className="para_title">活动介绍</div>
                                    <div
                                        dangerouslySetInnerHTML={{__html: this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.introduction}}/>
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
                            </div>
                        </Card> : <div/>}

                </WingBlank>
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
                /> : ""}

        </Layout>
    }
}

SalesDetail.contextTypes = {
    router: PropTypes.object.isRequired
};