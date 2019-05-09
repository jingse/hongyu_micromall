import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Card, Carousel, Flex, Toast, WhiteSpace, WingBlank} from "antd-mobile";

import Layout from "../../../../../common/layout/layout.jsx";

import PutInCart from '../../../../../components/cart/putincart.jsx';
import CartModal from "../../../../../components/cart/cartmodal.jsx";

import SaleManager from "../../../../../manager/SaleManager.jsx";

import homeApi from "../../../../../api/home.jsx";
import settingApi from "../../../../../api/setting.jsx";
import {getServerIp} from "../../../../../config.jsx";

import "./index.less";

let cartProps;
let buyProps;


export default class SalesGroupDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,

            salesGroupDetail: [],
            salesGroupData: [],
            servicePromise: {},

            inbound: 0,

            // 优惠规则相关
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


            //加购物车相关参数
            specificationId: 0,
            specification: "",
            isGroupPromotion: true,
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
        let groupPromotionId = 0;
        if (!this.props.location.state) {
            groupPromotionId = localStorage.getItem("groupPromotionId");
        } else {
            groupPromotionId = this.props.location.state;
            localStorage.setItem("groupPromotionId", this.props.location.state);
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


        this.requestGroupPromotionDetail(groupPromotionId);
        this.requestServicePromise();

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
            if (this.state.action === "addToCart")
                this.child.addToCart(cartProps);
            else if (this.state.action === "buyImmediately")
                this.child.buyImmediately(buyProps);
        });
    }


    checkPresents() {
        let fullPresents = null;
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

    // showWebusinessInfo(item) {
    //     console.log("??", localStorage.getItem("isWebusiness"));
    //     if (localStorage.getItem("isWebusiness") == 1) {
    //         return <WingBlank>提成比例：{item.businessPersonDivide.proportion}</WingBlank>
    //     }
    // }


    render() {

        console.log("this.state.salesGroupDetail", this.state.salesGroupDetail);
        if (!this.state.salesGroupDetail || JSON.stringify(this.state.salesGroupDetail) === "[]" || !this.state.salesGroupData)
            return null;

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
                            <img src={"http://" + getServerIp() + SaleManager.getSalesDetailIcon(item.itemId.images)}
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
                        {SaleManager.getDetailSalesContent(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
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

        let bancontent;
        if (this.state.salesGroupDetail.hyGroupitemPromotions) {
            let tempban = this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyPromotionPics;
            console.log("before", tempban);
            for (let i = 0; i < tempban.length; i++) {
                if (tempban[i].isTag == true)
                    tempban.splice(i, 1);
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

        let start, end, a, b;
        if (this.state.salesGroupDetail.hyGroupitemPromotions) {
            start = new Date(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionStarttime).toLocaleString();
            end = new Date(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionEndtime).toLocaleString();
            a = start.indexOf("午");
            b = end.indexOf("午");
            console.log("safsfasfsa", a, b, start.substring(0, a + 2), end.substring(0, b + 2));
            start.substring(0, a + 2);
            end.substring(0, b + 2);
        }


        cartProps = {
            "wechatId": localStorage.getItem("wechatId"),
            "specificationId": "",
            "specialtyId": this.state.salesGroupDetail.hyGroupitemPromotions[0].id,
            "isGroupPromotion": true,
            "quantity": this.state.quantity,
        };

        let buyItem = [{
            "id": null,
            "iconURL": SaleManager.getSalesGroupIconImgArray(this.state.salesGroupDetail.pics),
            "isGroupPromotion": true,
            "curPrice": this.state.salesGroupDetail.hyGroupitemPromotions[0].sellPrice,
            "name": this.state.salesGroupDetail.name,
            "quantity": this.state.quantity,
            "specialtyId": this.state.salesGroupDetail.hyGroupitemPromotions[0].id,
            "specialtySpecificationId": "",
            "specification": "",
            "promotionId": this.state.salesGroupDetail.id,
        }];

        buyProps = {
            "buyItem": buyItem,
            "isPromotion": true,
            "origin": "sales_group",
        };


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
                            {SaleManager.getDetailSalesContent(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
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
                            style={{color: 'black'}}>{parseFloat(this.state.salesGroupDetail.divideMoney).toFixed(2)}</span>
                        </div> : <div></div>}
                    </h4>
                    <hr/>

                    <WhiteSpace/>
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

            <PutInCart style={{height: '3.125rem'}}
                       onRef={this.onRef}
                       handleAction={this.handleAction}

                       modalSelectorText={this.state.modalSelectorText}
                       showModal={this.showModal}

                       cartProps={cartProps}
                       buyProps={buyProps}
            />

            <CartModal
                productData={this.state.data}
                modalData={this.state.featureData}
                hasSpecification={false}

                visible={this.state.modal}
                hideModal={this.hideModal}
                selectorText={this.changeModalSelectorText}

                limit={this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum}
            />
        </Layout>
    }
}

SalesGroupDetail.contextTypes = {
    router: PropTypes.object.isRequired
};