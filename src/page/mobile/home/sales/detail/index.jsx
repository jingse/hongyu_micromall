import React from "react";
import { Link } from "react-router-dom";
import { Card, WhiteSpace, Flex, NoticeBar,Carousel,WingBlank,Toast } from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import "./index.less";
// import sales_detail from "../../../../../static/mockdata/sales_detail.js"; // mock假数据
import homeApi from "../../../../../api/home.jsx";
import {getServerIp} from "../../../../../config.jsx";
import PutInCart from '../../../../../components/cart/putincart.jsx';
import CartModal from '../../../../../components/cart/cartmodal.jsx';
import cartApi from "../../../../../api/cart.jsx";
import proApi from "../../../../../api/product.jsx";
import PropTypes from "prop-types";

export default class SalesDetail extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = {
            salesDetail: [],
            isLoading: false,

            ruleType: '',
            presents: [],
            subtracts: [],
            discounts: [],

            selectorText: '未选择',
            modalSelectorText: '未选择',

            isadd: 0,
            modal: false,

            specialtyId: -1,
            mynum :-1,
            
            //加购物车相关参数
            specificationId: 0,
            specification: "",
            isGroupPromotion: false,
            quantity: 1,
            isNull: false,

            data: {},
            featureData: -1,
            dots : true,
            cartCount: parseInt(localStorage.getItem("cartCount")) !== 0 ? parseInt(localStorage.getItem("cartCount")) : 0,
        };
    }

    componentWillMount() {
        var promotionId = 0;
        this.requestServicePromise();
        if (!this.props.location.state) {
            promotionId = localStorage.getItem("promotionId");
        } else {
            promotionId = this.props.location.state;
            localStorage.setItem("promotionId", this.props.location.state);
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

        this.requestOrdinaryPromotionDetail(promotionId);
    }

    requestServicePromise() {
        proApi.getServicePromise((rs) => {
            if(rs && rs.success) {
                const data = rs.obj;
                this.setState({
                    servicePromise: data,
                });
            }
        });
    }

    addToCart() {
        if(this.state.modalSelectorText === '未选择' && this.state.selectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);
            this.showModal(1);
            return
        }
        console.log("???",this.state.specialtyId)
        cartApi.addSingleItemToCart(localStorage.getItem("wechatId"), this.state.specificationId, this.state.specialtyId,
            this.state.isGroupPromotion, this.state.quantity, (rs) => {
                console.log("发给后台的购物车数量", this.state.quantity);
            if(rs && rs.success) {
                Toast.success('加入成功，快去购物车看看你的宝贝吧～', 1, null, false);
                console.log("rs.msg", rs.msg);
                this.getCartCount();
            } else {
                Toast.info("添加失败！", 1);
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

    buyImmediately() {
        if(this.state.modalSelectorText === '未选择' && this.state.selectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);
            return
        }

        const item = [{
            "id": null,
            "curPrice": this.state.currentPrePrice,
            "iconURL": this.state.data[0].iconURL,
            "isGroupPromotion": this.state.isGroupPromotion,
            "name": this.state.data[0].specialty.name,
            "quantity": this.state.quantity,
            "specialtyId": this.state.specialtyId,
            "specialtySpecificationId": this.state.specificationId,
            "specification": this.state.specification,
            "promotionId": this.state.salesDetail.id,
        }];
        let price = {};

        cartApi.getTotalPriceInCart(item, (rs) => {
            console.log("getTotalPriceInCart rsllff", rs);
            if (rs && rs.success) {
                price = rs.obj;

                let presents = [];
                rs.obj.promotions && rs.obj.promotions.map((item, index) => {
                    if (item.promotion && JSON.stringify(item.promotion) !== '{}') {
                        if (item.promotion.promotionRule === "满赠") {
                            item.promotionCondition && item.promotionCondition.map((pre, index2) => {
                                pre.promotionId = item.promotionId;
                                presents.push(pre);
                            });
                        }
                    }
                });

                console.log("赠品：", presents);
                console.log("buyImmediately price", price);

                if (price !== {}) {
                    let temp = false;
                    if(this.props.location.isPromotion)
                        temp = true;

                    this.context.router.history.push({pathname:'/cart/payment', products: item, price: price, origin: "product", presents: presents,isPromotion:true,shipFee:this.state.salesDetail.hySingleitemPromotions[0].specificationId.deliverPrice});
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
        console.log('加购物车的数量',num);
        this.setState({
            currentPrePrice: pPrice,
            currentMarketPrice: mPrice,
            quantity: num,
            specification: active.specification,
            modalSelectorText: active.specification + '  ×' + num,
            specificationId: specificationId,
        },()=>{
            console.log('this.state.isadd', this.state.isadd);
            if(this.state.isadd === 1)
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
                return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProduct.name +"*"+item.fullPresentProductNumber 
            });
        }
        else {

        }

        return content
    }

    requestProductDetailData(specialtyId) {
        //传入了this.props.location.specialtyId
        proApi.getSpecialtySpecificationDetailBySpecialtyID(specialtyId, (rs) => {
            if (!rs.success) {
                this.setState({
                    isNull: true,
                });
                return
            }

            if(rs && rs.success) {
                const data = rs.obj;
                if (!data || JSON.stringify(data) === "[]") {
                    this.setState({
                        isNull: true,
                    });
                } else {
                    // const specificationId = data[0].specification.id;
                    // const mPrice = data[0].mPrice;
                    // const pPrice = data[0].pPrice;
                    const temp = data[0].specialty.specifications;
                    const arrlength = temp.length;
                    var myspecifications;
                    for(var i=0;i<arrlength;i++){
                        if(temp[i].specification == this.state.specification){
                            myspecifications = temp[i];
                            // console.log("what happened", myspecifications,i,arrlength);
                        }
                    }
                    // const recommends = data[0].recommends;
                    // const specification = specifications && specifications.map((item, index) => {

                        // return item.specification;
                    // });
                    console.log("product specifications", myspecifications);

                    this.setState({
                        data: data,
                        // specificationId: specificationId,
                        featureData: [myspecifications],
                        // specification: specification,
                        // recommends: recommends,
                        // currentPrePrice: pPrice,
                        // currentMarketPrice: mPrice,
                    });
                }

            }
        });
    }

    requestOrdinaryPromotionDetail(promotionId) {
        homeApi.getOrdinaryPromotionDetail(promotionId, (rs) => {
            if(rs && rs.success) {
                const proDetail = rs.obj;
                this.setState({
                    salesDetail: proDetail,
                    isLoading: false,
                    specificationId:rs.obj.hySingleitemPromotions[0].specificationId.id,
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

    checkNoticeBar() {
        if (this.state.ruleType === '满赠') {
            return <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable" action={<span style={{ color: '#a1a1a1' }}>不再提示</span>}>
                您只需要点击优惠商品内购买即可，赠品会附带上
            </NoticeBar>
        }
    }

    checkSpecificationDisplay() {
        if(this.state.specialtyId != -1 && this.state.featureData != -1){
            // console.log("wawawawawa",this.state.salesDetail.hySingleitemPromotions[0].limitedNum);
            return <CartModal
            productData={this.state.data}
            modalData={this.state.featureData}
            modal={this.state.modal}
            hideModal={this.hideModal.bind(this)}
            selectorText={this.changeModalSelectorText.bind(this)}
            guige={this.state.salesDetail.hySingleitemPromotions[0].specificationId.specification}
            limit={this.state.salesDetail.hySingleitemPromotions[0].limitedNum}
            />
        }

    }

    checkCartDisplay() {
        return <PutInCart style={{height:'3.125rem'}}
                          addToCart={this.addToCart.bind(this)}
                          buyImmediately={this.buyImmediately.bind(this)}
                          cartCount={this.state.cartCount}
        />
    }



    checkPresents() {
        var fullPresents = null;
        var temp = this.state.salesDetail;
        console.log("asfdsaf",temp);
        if (temp.hySingleitemPromotions && temp.hySingleitemPromotions[0].hyPromotion.promotionRule=="满赠") {
            fullPresents = temp.hySingleitemPromotions[0].hyPromotion.hyFullPresents && temp.hySingleitemPromotions[0].hyPromotion.hyFullPresents.map((item, index) => {
                console.log("asfsgastgdrg",item.fullPresentProductSpecification.specification);
                return <Link to={{pathname: `/product/${item.fullPresentProduct.id}`, isPromotion: false, isPresent:true,guige:item.fullPresentProductSpecification.specification}} key={index}>
                    <Flex style={{background:'#fff'}}>
                        <Flex.Item style={{flex: '0 0 30%'}}>
                            <img src={"http://" + getServerIp() + this.getSalesDetailIcon(item.fullPresentProduct.images)} style={{width: '70%', height:'4rem', margin:'0.4rem'}}/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 60%', color:'black'}}>
                            <WhiteSpace/>
                            <div style={{marginBottom: 10, fontWeight:'bold'}}>
                                {item.fullPresentProduct.name}
                                <span style={{color:'darkorange', fontWeight:'bold'}}> (赠)</span>
                            </div>
                            <div style={{marginBottom: 10}}>赠品数量：<span style={{color:'red'}}>{item.fullPresentProductNumber}</span></div>
                            <div style={{marginBottom: 10}}>商品规格：<span style={{color:'red'}}>{item.fullPresentProductSpecification.specification}</span></div>
                            {/*<div>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div>*/}
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
                    <WhiteSpace />
                </Link>
            });
        }
        return fullPresents
    }


    render() {

        if(this.state.specialtyId != -1 && this.state.mynum == -1){
            this.requestProductDetailData(this.state.specialtyId);
            this.state.mynum = 0;
        }
        const content = this.state.salesDetail.hySingleitemPromotions && this.state.salesDetail.hySingleitemPromotions.map((item, index) => {
            
            console.log('itemitemitemitem',item)
            console.log("mytest",this.state)

            return <Link to={{pathname: `/product/${item.specialtyId.id}`, isPromotion: true, ruleType: item.hyPromotion.promotionRule,
                discounts: item.hyPromotion.hyFullDiscounts, subtracts: item.hyPromotion.hyFullSubstracts, presents: item.hyPromotion.hyFullPresents,
                promoteNum: item.promoteNum, limitedNum: item.limitedNum, guige:item.specificationId.specification,pPrice:item.specificationId.platformPrice,mPrice:item.specificationId.marketPrice}} key={index}>
                <Card>
                <Flex style={{background:'#fff'}}>
                    <Flex.Item style={{flex: '0 0 30%'}}>
                        <img src={"http://" + getServerIp() + this.getSalesDetailIcon(item.specialtyId.images)} style={{width: '70%', height:'4rem', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 80%', color:'black'}}>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <div style={{marginBottom: 5, fontWeight:'bold'}}>{item.specialtyId.name}</div>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        {/* <div style={{marginBottom: 5}}>价格：<span style={{color:'red'}}>￥{item.specificationId.platformPrice}元</span></div> */}
                        <div style={{marginBottom: 5}}>优惠规格：<span style={{color:'red'}}>{item.specificationId.specification}</span></div>
                        {/* <div style={{marginBottom: 5}}>优惠政策：<span style={{color:'red'}}>
                        {this.getSalesContent(item.hyPromotion.promotionRule, item.hyPromotion.hyFullSubstracts, item.hyPromotion.hyFullDiscounts, item.hyPromotion.hyFullPresents)}
                        </span></div> */}
                        {/* {(localStorage.getItem('isWebusiness') === '1')?<div style={{marginBottom: 10}}>提成金额：<span style={{color:'red'}}>{parseFloat(item.specificationId.dividMoney).toFixed(2)}</span></div>:<div></div>} */}
                        {/* <div style={{marginBottom: 5}}>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div> */}
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
                </Card>
                <WhiteSpace />
            </Link>
        });
        console.log("lalalalal",this.state.salesDetail.hySingleitemPromotions);

        var bancontent;
        if(this.state.salesDetail.hySingleitemPromotions){
            var tempban = this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyPromotionPics;
            console.log("before",tempban);
            for(var i=0;i<tempban.length;i++){
                if(tempban[i].isTag==true){
                    tempban.splice(i,1);
                }
            }
            console.log("after",tempban);
            bancontent = tempban && tempban.map((item, index) => {
            if(item.isTag==false){
                return <img key={index} style={{margin: '0 auto', height:'12rem', width:'100%'}} src={"http://" + getServerIp() + item.sourcePath}
                onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                  }}/>
            }
        });
        // if(bancontent.length==1){
        //     this.state.dots=false;
        //     bancontent[1]=bancontent[0];
        // }
        console.log("wgudsiuasjd",bancontent);

        }

        var start,end,a,b;
        if(this.state.salesDetail.hySingleitemPromotions){
            start = new Date(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionStarttime).toLocaleString();
            end = new Date(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionEndtime).toLocaleString();
            a=start.indexOf("午");
            b=end.indexOf("午");
            console.log("safsfasfsa",a,b,start.substring(0,a+2),end.substring(0,b+2));
            start.substring(0,a+2);
            end.substring(0,b+2);
        }
        
        
        
        return <Layout>
        <Card>
            <Carousel
                    style={{touchAction:'none'}}
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
                {this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionName:""}
            </h3>
            <h4>
                <font color="red">优惠时间：</font>
                {this.state.salesDetail.hySingleitemPromotions?start.substring(0,a+2)+"时 ~ "+end.substring(0,b+2)+"时":""}
            </h4>
            <h4>
                <font color="red">优惠类型：</font>
                {this.state.salesDetail.hySingleitemPromotions?this.getSalesContent(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionRule, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullSubstracts,
                                         this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullDiscounts, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullPresents):""}
            </h4>
            <h4>
                <font color="red">活动价格：</font>
                {this.state.salesDetail.hySingleitemPromotions?"￥"+this.state.salesDetail.hySingleitemPromotions[0].specificationId.platformPrice:""}
            </h4>
            <h4>
                <font color="red">已售数量：</font>
                {this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].havePromoted:""}
            </h4>
            <h4>
                <font color="red">限购数量：</font>
                {this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].limitedNum:""}
            </h4>
            <h4>
                <font color="red">活动库存：</font>
                {this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].promoteNum:""}
            </h4>
            <h4>
                {console.log("safasd",this.state.salesDetail)}
                {(localStorage.getItem('isWebusiness') === '1')&&this.state.salesDetail?<div style={{marginBottom: 10}}>提成金额：{parseFloat(this.state.salesDetail.divideMoney).toFixed(2)}</div>:<div></div>}
            </h4>
            {/* <h4>
                结束时间：{this.state.salesDetail.hySingleitemPromotions?end.substring(0,b+2)+"时":""}
            </h4> */}
                    <hr/>
                    {/* <Card>
                        <WingBlank>
                            <div className="my_product_info_div">

                                <Flex>
                                    <Flex.Item className="detail_info">类型：</Flex.Item>
                                    <Flex.Item className="detail_val_left">
                                    {this.state.salesDetail.hySingleitemPromotions?this.getSalesContent(this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.promotionRule, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullSubstracts,
                                         this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullDiscounts, this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.hyFullPresents):""}
                                    
                                    </Flex.Item>
                                    <Flex.Item className="detail_info">运费：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{this.state.salesDetail.hySingleitemPromotions?"￥"+this.state.salesDetail.hySingleitemPromotions[0].specificationId.deliverPrice:""}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">限购：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].limitedNum:""}</Flex.Item>
                                    <Flex.Item className="detail_info">销量：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].specificationId.hasSold:""}</Flex.Item>
                                </Flex>
                                <Flex>
                                    <Flex.Item className="detail_info">规格：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{this.state.salesDetail.hySingleitemPromotions?this.state.salesDetail.hySingleitemPromotions[0].specificationId.specification:""}</Flex.Item>
                                    <Flex.Item className="detail_info">价格：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{this.state.salesDetail.hySingleitemPromotions?"￥"+this.state.salesDetail.hySingleitemPromotions[0].specificationId.platformPrice:""}</Flex.Item>
                                </Flex>
                            </div>
                        </WingBlank>
                    </Card> */}
                    {content}
                    {this.checkPresents()}  
                    {this.state.data[0]?
                    <Card className="general_container">
                    <div>
                    <WingBlank>
                        <div className="para_title">活动介绍</div>
                        <div  className="para_html" dangerouslySetInnerHTML={{ __html: this.state.salesDetail.hySingleitemPromotions[0].hyPromotion.introduction}} />
                    </WingBlank>
                    {/* <WingBlank>
                        <div className="para_title">产品详情</div>
                        <div  className="para_html" dangerouslySetInnerHTML={{ __html: this.state.data[0].specialty.descriptions}} />
                    </WingBlank> */}
                                        <WingBlank>
                       <div className="para_title" >服务承诺</div>
                       <div className="paragraph">
                           {/* 河北游购进出口贸易有限公司（游买有卖 特产商城）所售商品均为源产地正品，如有任何问题可与我们门店工作
                       人员直接沟通，我们会在当场进行处理。我们将争取以更具竞争力的价格、更优质的服务来满足您最大的需求。开箱验
                       货：签收同时当场进行开箱验货，并与门店人员当面核对：商品及配件、应付金额、商品数量及发货清单、发票（如有）、
                       赠品（如有）等；如存在包装破损、商品错误、商品短缺、商品存在质量问题等印象签收的因素，请您可以拒收全部或
                       部分商品，相关的赠品，配件或捆绑商品应一起当场拒收（如与综上所述原因不同产生退换货问题，本公司有权不承担
                       起责任）；为了保护您的权益，建议您尽量不要委托他人代为签收；如由他人代为签收商品而没有在门店人员在场的情
                       况下验货，则视为您所订购商品的包装无任何问题。 */}
                           {this.state.servicePromise.servicePromise}
                       </div>
                    </WingBlank>

                    <WingBlank>
                       <div className="para_title">温馨提示</div>
                       <div className="paragraph">
                           {/* 由于部分商品包装更换较为频繁，因此您收到的货品有可能与图片不完全一致，请您以收到的商品实物为准，同时
                       我们会尽量做到及时更新，由此给您带来不便多多谅解，谢谢！ */}
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
                    </Card>:<div/>}

            </WingBlank>
        </Card>
        {/* {content} */}
        

        {this.checkCartDisplay()}

        {this.checkSpecificationDisplay()}

        </Layout>
    }
}

SalesDetail.contextTypes = {
    router: PropTypes.object.isRequired
};