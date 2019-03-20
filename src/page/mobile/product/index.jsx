import React from 'react';
import { Link } from 'react-router-dom';
import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import Layout from "../../../common/layout/layout.jsx";
import SearchNavBar from "../../../components/search/index.jsx";
import Card from "../../../components/card/index.jsx";
import Comment from "./comment.jsx";
import Recommend from "./recommend.jsx";
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, Modal, List ,} from 'antd-mobile';
import Select from './select.jsx';
import CartModal from './cartmodal.jsx';
import PutInCart from './putincart.jsx';
// import Detail from "./detail.jsx";
import './index.less';

// import product_data from "../../../static/mockdata/product.js";   //mock假数据
// import comment from "../../../static/mockdata/product_comment.js"; // mock假数据
// import product_feature_data from "../../../static/mockdata/product_feature.js"; //mock假数据
// import coupon_data from "../../../static/mockdata/product_coupon.js"; //mock假数据

import wxApi from "../../../api/wechat.jsx";
import locManager from "../../../common/LockManager.jsx";
import proApi from "../../../api/product.jsx";
import cartApi from "../../../api/cart.jsx";
import {getServerIp,wxconfig} from "../../../config.jsx";
import PropTypes from "prop-types";

const Item = List.Item;
// const Brief = Item.Brief;

// const host = 'http://ymymmall.swczyc.com/';
const host = wxconfig.hostURL;

//注意：其它页面跳转到产品页面时，需要传2个参数：
// this.props.location.state(即specialtyId)、this.props.location.isPromotion(判断是否是优惠商品)


class Product extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            isLoading: false,
            data: {},
            featureData: [],
            comment: [],
            productCoupon: [],
            selectorText: '未选择',
            modalSelectorText: '未选择',
            chooseCoupon: '· · ·',
            modal: false,
            modal2: false,
            currentPrePrice: 0,
            currentMarketPrice: 0,
            
            isadd: 0,
            //加购物车相关参数
            // specialtyId: this.props.location.state?71:71,
            specificationId: 0,
            specification: "",
            isGroupPromotion: false,
            quantity: 1,
            isNull: false,

            cartCount: localStorage.getItem("cartCount")!=0 ?localStorage.getItem("cartCount"):'',
        }
    }

    componentWillMount() {
        // console.log(this.state.specialtyId);
        const specialtyId = parseInt(window.location.href.split('#')[1].split('/product/')[1]);
        this.setState({
            specialtyId
        });

        // console.log("split specialtyId", specialtyId);
        // console.log("window.location.href.split('#')", window.location.href.split('#'));

        this.requestProductDetailData(specialtyId);
        this.requestProductCommentData(specialtyId, 1, 10);
        this.requestServicePromise();

        const url = encodeURIComponent(window.location.href.split('#')[0]);
        wxApi.postJsApiData(url, (rs) => {
            const data = rs.result;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"]
            });
        });

        localStorage.removeItem("inputBalance");
    }

    componentDidMount() {
        // this.requestData();

        const uid = locManager.getUId();
        const from_user = locManager.getFromUser();
        const myopenid = locManager.getMyOpenId();
        var shareData = {//自定义分享数据
            title: '土特产微商城',
            desc: '来自'+locManager.getMyNickname()+'的分享',
            link: host + locManager.generateSaleLink()
        };

        wx.ready(function(){
            wx.checkJsApi({
                jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"],
                success: function(res) {
                    console.log(res)
                }
            });
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData);
        });
        wx.error(function(res){
            console.log('wx.error');
            console.log(res);
        });
    }
    backTop(){
    
    }

    componentWillReceiveProps(){
        this.backTop();

        const specialtyId = parseInt(window.location.href.split('#')[1].split('/product/')[1]);
        this.setState({
            specialtyId
        });
        this.requestProductDetailData(specialtyId);
        this.requestProductCommentData(specialtyId, 1, 10);
        this.requestServicePromise();
        const url = encodeURIComponent(window.location.href.split('#')[0]);
        wxApi.postJsApiData(url, (rs) => {
            const data = rs.result;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"]
            });
        });
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
                console.log('data',data);
                if (!data || JSON.stringify(data) === "[]") {
                    this.setState({
                        isNull: true,
                    });
                } else {
                    // const specificationId = data[0].specialty.specifications[0].id;
                    const specificationId = data[0].specification.id;
                    const mPrice = data[0].mPrice;
                    const pPrice = data[0].pPrice;
                    const specifications = data[0].specialty.specifications;
                    const recommends = data[0].recommends;
                    // const specifications = data[0].specialty.specifications;
                    const specification = specifications && specifications.map((item, index) => {
                        return item.specification;
                    });
                    console.log("product specifications", specification);

                    this.setState({
                        data: data,
                        specificationId: specificationId,
                        featureData: specifications,
                        specification: specification,
                        recommends: recommends,
                        currentPrePrice: pPrice,
                        currentMarketPrice: mPrice,
                    });
                }

            }
        });
    }

    requestServicePromise() {
        proApi.getServicePromise((rs) => {
            if(rs && rs.success) {
                const data = rs.obj.servicePromise;
                this.setState({
                    servicePromise: data,
                });
            }
        });
    }

    requestProductCommentData(id, page, rows) {
        //id page rows
        proApi.getSpecialtyCommentDetail(id, page, rows, (rs) => {
            if(rs && rs.success) {
                console.log('9999999', rs);
                const comment = rs.obj.rows;
                const commentNum = rs.obj.total;
                this.setState({
                    comment: comment,
                    commentNum,
                });
            }
        });
    }

    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const data = product_data.data;     //mock data
    //         const featureData = product_feature_data.data;   //mock假数据
    //         const productCoupon = coupon_data.data;
    //         this.setState({
    //             data,
    //             featureData,
    //             productCoupon,
    //             isLoading: false,
    //         });
    //     }, 500);
    // }

    addToCart() {
        //addSingleItemToCart(id, specificationId, specialtyId, isGroupPromotion, quantity, callback)

        if(this.state.modalSelectorText === '未选择' && this.state.selectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);
            this.showModal(1);
            return
        }

        cartApi.addSingleItemToCart(localStorage.getItem("wechatId"), this.state.specificationId, this.state.specialtyId,
            this.state.isGroupPromotion, this.state.quantity, (rs) => {
                console.log("发给后台的购物车数量", this.state.quantity);
            if(rs && rs.success) {
                this.showToast();
                console.log("rs.msg", rs.msg);
                this.getCartCount();
            } else {
                Toast.info("添加失败！", 1);
            }
        });
    }

    getCartCount() {
        console.log("getCartCount");
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const count = rs.obj.length;
                localStorage.setItem("cartCount", count);
                console.log("count: ", count);
                this.setState({
                    cartCount: count,
                });
            }
        });
    }

    buyImmediately() {
        if(this.state.modalSelectorText === '未选择' && this.state.selectorText === '未选择') {
            Toast.info("您还未选择商品规格~", 1);
            // this.showModal(1);
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
        }];
        var price = {};
        cartApi.getTotalPriceInCart(item, (rs) => {
            console.log("getTotalPriceInCart rsllff", rs);
            if (rs && rs.success) {
                price = rs.obj;

                var presents = [];
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
                    this.context.router.history.push({pathname:'/cart/payment', products: item, price: price, origin: "product",presents,presents});
                }
            }
        });

    }

    showToast() {
        Toast.success('加入成功，快去购物车看看你的宝贝吧～', 1, null, false);
    }

    // changeSelectorText(active, num) {
    //     let cur_pre_price = active.platformPrice;
    //     let cur_mar_price = active.marketPrice;
    //
    //     this.setState({
    //         currentPrePrice: cur_pre_price,
    //         currentMarketPrice: cur_mar_price,
    //         quantity: num,
    //         modalSelectorText: active.specification + '' + num
    //     });
    // }

    changeModalSelectorText(active, num, specificationId, mPrice, pPrice,success) {
        // let str = '';
        // for (let i in active) {
        //     str = str + active[i].option_name + " ";
        // }
        // this.setState({
        //     modalSelectorText: str
        // });

        // let cur_pre_price = active.platformPrice;
        // let cur_mar_price = active.marketPrice;
        console.log('加购物车的数量',num);
        this.setState({
            currentPrePrice: pPrice,
            currentMarketPrice: mPrice,
            quantity: num,
            specification: active.specification,
            modalSelectorText: active.specification + '  ×' + num,
            specificationId: specificationId,
        },()=>{
            console.log('this.state.isadd',this.state.isadd);
            if(this.state.isadd === 1)
                this.addToCart();
        });
    }

    showModal(val) {
        this.setState({modal: true,isadd: val});
    }

    hideModal(status) {
        this.setState({modal: false});
        if (status === 'success') {
            // this.showToast();
            Toast.success('选择成功～', 1, null, false);
        }
    }

    showModal2() {
        this.setState({modal2: true});
    }

    onClose = (key, val) => () => {
        this.setState({
            [key]: false,
            chooseCoupon: val,
        });
    };

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

    displayPromotion() {
        if(this.props.location.isPromotion) {
            return <Card className="selector_container">
                <div className="selector_sec" onClick={this.showModal2.bind(this)}>
                    <WingBlank>
                        <span>优惠规则</span>
                        {/*<span>{this.state.chooseCoupon}</span>*/}
                        <span>{this.props.location.ruleType}</span>
                    </WingBlank>
                </div>
                <div className="selector_sec">
                    <WingBlank>
                        <span>优惠总量</span>
                        <span>{this.props.location.promoteNum}</span>
                        {/*<span>￥{proData.ship_fee}</span>*/}
                    </WingBlank>
                </div>
                <div className="selector_sec">
                    <WingBlank>
                        <span>限购数量</span>
                        <span>{this.props.location.limitedNum}</span>
                        {/*<span>￥{proData.ship_fee}</span>*/}
                    </WingBlank>
                </div>
            </Card>
        }
        return null
    }

    checkRuleType() {
        var content;
        switch (this.props.location.ruleType) {
            case "满减":
                content = this.props.location.subtracts && this.props.location.subtracts.map((item, index) => {
                    return <Item key={index} multipleLine
                          // onClick = {
                          //     this.onClose('modal2', " 满 " + item.coupon_value + " 减 " + item.reduce_value)
                          // }
                    >
                        <span>{ " 满 " + item.fullFreeRequirement + " 减 " + item.fullFreeAmount }</span>
                        {/*<Brief>{item.coupon_start_time + " - "}{item.coupon_due_time}</Brief>*/}
                    </Item>
                });
                break;
            case "满赠":
                content = this.props.location.presents && this.props.location.presents.map((item, index) => {
                    return <Flex style={{background:'#fff'}} key={index}>
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
                });
                break;
            case "满折":
                content = this.props.location.discounts && this.props.location.discounts.map((item, index) => {
                    return <Item key={index} multipleLine>
                        <span>{ " 满 " + item.discountRequirenment + " 打 " + item.discountOff + " 折" }</span>
                    </Item>
                });
                break;
        }
        return content;
    }

    getPromotionInfo() {
        if(this.props.location.isPromotion) {
            return <Modal
                popup
                visible={this.state.modal2}
                onClose={this.onClose('modal2', '')}
                animationType="slide-up"
            >
                <List renderHeader={() => <div>优惠规则</div>} className="popup-list">
                    {/*{this.state.productCoupon.map((item, index) => (*/}
                        {/*<Item key={index} multipleLine*/}
                              {/*onClick = {*/}
                                  {/*this.onClose('modal2', " 满 " + item.coupon_value + " 减 " + item.reduce_value)*/}
                              {/*}>*/}
                            {/*<span>{ " 满 " + item.coupon_value + " 减 " + item.reduce_value }</span>*/}
                            {/*/!*<Brief>{item.coupon_start_time + " - "}{item.coupon_due_time}</Brief>*!/*/}
                        {/*</Item>*/}
                    {/*))}*/}

                    {this.checkRuleType()}
                </List>
            </Modal>
        }
        return null
    }

    checkPromotion() {
        if (this.props.location.isPromotion) {
            return <Link to={{pathname: "/home/sales", dest: '/home'}}>
                    <span style={{color: 'darkorange', fontStyle:'normal'}}>  优惠<span>(点击查看更多优惠)</span></span>
                </Link>
        }
        return null
    }

    checkDest() {
        if (!localStorage.getItem("dest")) {
            return <SearchNavBar/>
        } else {
            return <SearchNavBar dest={localStorage.getItem("dest")}/>
        }
    }

    render() {
        console.log(this.state);
        console.log("dadsds",this.state.data);
        // console.log("recommends: ", this.state.recommends);

        if (this.state.isNull) {
            return <Layout>
                <div>
                    该产品的数据为空
                </div>
            </Layout>
        }

        if (!this.state.data || JSON.stringify(this.state.data) === "{}" || !this.state.data[0].specialty || !this.state.data[0].specialty.images) {
            return null
        }

        const proData = this.state.data[0];
        var primaryImages = this.state.data[0].specialty.images;
        var i;
        for(i=0;i<primaryImages.length;i++){
            if(primaryImages[i].isLogo==true){
                primaryImages.splice(i,1);
            }         
        }
        console.log('primaryImages',primaryImages)
        if(primaryImages.length==1){
            primaryImages[1]=primaryImages[0];
        }
        const images = primaryImages && primaryImages.map((img, index) => {
            return <img src={"http://" + getServerIp() + img.sourcePath} key={index} style={{margin: '0 auto', height:'12rem', width:'100%'}}
                        // onLoad={() => {window.dispatchEvent(new Event('resize'));}}
                    />
        });



        return <Layout>
            <a name="top"></a>
            {this.checkDest()}

            <Card className="general_container">
                <Carousel
                    style={{touchAction:'none'}}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                    swipeSpeed={35}
                    dots={false}
                >
                    {images}
                </Carousel>
                <WingBlank>
                    <h3>
                        {proData.specialty.name}
                        {this.checkPromotion()}
                        {/*<small style={{color:'darkorange'}}>{proData.sub_title}</small>*/}
                    </h3>
                    <hr/>

                    <Card>
                        <WingBlank>
                            <div className="product_info_div">

                                {/* <WhiteSpace/> */}

                                <Flex>
                                    <Flex.Item className="detail_info">产地：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{proData.specialty.originalPlace}</Flex.Item>
                                    <Flex.Item className="detail_info">厂家电话：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{proData.specialty.provider.contactorMobile}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">许可证：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{proData.specialty.productionLicenseNumber}</Flex.Item>
                                    <Flex.Item className="detail_info">产品标准：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{proData.product_standard}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">品牌：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{proData.specialty.brand}</Flex.Item>
                                    <Flex.Item className="detail_info">规格：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{proData.specification.specification}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">保质期：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{}</Flex.Item>
                                    <Flex.Item className="detail_info">储藏方法：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{proData.specialty.storageMethod}</Flex.Item>
                                </Flex>

                                {/*<Flex>*/}
                                    {/*<Flex.Item className="detail_info">商品毛重：</Flex.Item>*/}
                                    {/*<Flex.Item className="detail_val">{proData.product_gross_weight}</Flex.Item>*/}
                                    {/*<Flex.Item className="detail_info">特殊属性：</Flex.Item>*/}
                                    {/*<Flex.Item className="detail_val">{proData.product_special_prop}</Flex.Item>*/}
                                {/*</Flex>*/}

                                <Flex>
                                    <Flex.Item className="detail_info">优惠价格：</Flex.Item>
                                    <Flex.Item className="detail_val_left" style={{color:'darkorange', fontSize:'1.2rem', fontStyle:'bold'}}>
                                        {this.state.currentPrePrice}
                                    </Flex.Item>
                                    <Flex.Item className="detail_info">市场价格：</Flex.Item>
                                    <Flex.Item className="detail_val_right" style={{color:'darkorange', textDecoration:'line-through'}}>
                                        {this.state.currentMarketPrice}
                                    </Flex.Item>
                                </Flex>

                                <div className="comm_num">累计评价：{this.state.commentNum}
                                    {/*<span style={{color:'darkorange'}}>{comment.rows.length}</span>*/}
                                </div>

                            </div>
                        </WingBlank>
                    </Card>

                    <hr/>

                    {/*<Select data={this.state.featureData} selectorText={this.changeSelectorText.bind(this)} />*/}

                </WingBlank>
               
         

            {/*<Card className="selector_container">*/}
                {/*<div className="selector_sec" onClick={this.showModal2.bind(this)}>*/}
                    {/*<WingBlank>*/}
                        {/*<span>优惠规则</span>*/}
                        {/*<span>{this.state.chooseCoupon}</span>*/}
                    {/*</WingBlank>*/}
                {/*</div>*/}
                {/*<div className="selector_sec">*/}
                    {/*<WingBlank>*/}
                        {/*<span>优惠总量</span>*/}
                        {/*<span>限购数量</span>*/}
                        {/*/!*<span>￥{proData.ship_fee}</span>*!/*/}
                    {/*</WingBlank>*/}
                {/*</div>*/}
            {/*</Card>*/}
            {this.displayPromotion()}

            <div className="selector_container">
                <div className="selector_sec" onClick={this.showModal.bind(this)}>
                    <WingBlank>
                        <span>已选规格</span>
                        <span>{this.state.modalSelectorText}</span>
                    </WingBlank>
                </div>
                <div className="selector_sec">
                    <WingBlank>
                        <span>运费</span>
                        <span>￥{this.state.data[0].deliverPrice}</span>
                        <hr/>
                    </WingBlank>
                    
                </div>
                
            </div>
            
            <div>
            <WingBlank>
                {/* <div style={{width:'100%'}}> */}
                <div className="para_title">产品介绍</div>
                {console.log("lalala",proData.specialty.descriptions)}
                <div  className="para_html" dangerouslySetInnerHTML={{ __html: proData.specialty.descriptions}} />
                <hr/>
                {/* </div> */}
            </WingBlank>
            </div>
            <WingBlank>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <Comment specialtyId={this.state.specialtyId} comment={this.state.comment} total={this.state.commentNum}/>
                    <hr/>
            </WingBlank>
            <WingBlank>                
                    <Recommend recommend={this.state.recommends}/>
                    <hr/>
            </WingBlank>
            <div>
                <WingBlank>
                    <div className="para_title" >服务承诺</div>
                    <div className="paragraph">
                            {/*河北游购进出口贸易有限公司（游买有卖 特产商城）所售商品均为源产地正品，如有任何问题可与我们门店工作*/}
                        {/*人员直接沟通，我们会在当场进行处理。我们将争取以更具竞争力的价格、更优质的服务来满足您最大的需求。开箱验*/}
                        {/*货：签收同时当场进行开箱验货，并与门店人员当面核对：商品及配件、应付金额、商品数量及发货清单、发票（如有）、*/}
                        {/*赠品（如有）等；如存在包装破损、商品错误、商品短缺、商品存在质量问题等印象签收的因素，请您可以拒收全部或*/}
                        {/*部分商品，相关的赠品，配件或捆绑商品应一起当场拒收（如与综上所述原因不同产生退换货问题，本公司有权不承担*/}
                        {/*起责任）；为了保护您的权益，建议您尽量不要委托他人代为签收；如由他人代为签收商品而没有在门店人员在场的情*/}
                        {/*况下验货，则视为您所订购商品的包装无任何问题。*/}
                        {this.state.servicePromise}
                    </div>
                    <hr/>
                </WingBlank>
                <WingBlank>
                    <div className="para_title">温馨提示</div>
                    <div className="paragraph">
                            由于部分商品包装更换较为频繁，因此您收到的货品有可能与图片不完全一致，请您以收到的商品实物为准，同时
                       我们会尽量做到及时更新，由此给您带来不便多多谅解，谢谢！
                         {/*{this.state.servicePromise.prompt}*/}
                    </div>
                </WingBlank>

                {/*<WingBlank>*/}
                {/*<video*/}
                    {/*id="my-player"*/}
                    {/*className="video-js vjs-default-skin vjs-fluid"*/}
                    {/*// x5-video-player-type="h5"*/}
                    {/*// x-webkit-airplay="true" */}
                    {/*// playsinline webkit-playsinline="true"*/}
                    {/*width="100%"*/}
                    {/*controls="false" */}
                    {/*loop="true" //自动循环*/}
                    {/*preload="metadata" //auto metadata none*/}
                    {/*poster="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531238777253&di=ee388000b58e23ebda4df9ee02f224d6&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Faa64034f78f0f736fd98e0fe0655b319eac413ee.jpg"*/}
                    {/*data-setup='{}'>*/}
                {/*<source src="http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4" type="video/mp4"></source>*/}
                {/*/!* <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>*/}
                {/*<source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source> *!/*/}
                {/*</video>*/}
                {/*</WingBlank>*/}


                

                <WhiteSpace/>

                
            </div>
            </Card>

            <PutInCart style={{height:'3.125rem'}}
                       addToCart={this.addToCart.bind(this)}
                       buyImmediately={this.buyImmediately.bind(this)}
                       cartCount={this.state.cartCount}

            />

            <CartModal
                productData={this.state.data}
                modalData={this.state.featureData}
                modal={this.state.modal}
                hideModal={this.hideModal.bind(this)}
                selectorText={this.changeModalSelectorText.bind(this)}
            />

            {/*<Modal*/}
                {/*popup*/}
                {/*visible={this.state.modal2}*/}
                {/*onClose={this.onClose('modal2', '')}*/}
                {/*animationType="slide-up"*/}
            {/*>*/}
                {/*<List renderHeader={() => <div>优惠规则</div>} className="popup-list">*/}
                    {/*{this.state.productCoupon.map((item, index) => (*/}
                        {/*<Item key={index} multipleLine*/}
                              {/*onClick = {*/}
                                  {/*this.onClose('modal2', " 满 " + item.coupon_value + " 减 " + item.reduce_value)*/}
                              {/*}>*/}
                            {/*<span>{ " 满 " + item.coupon_value + " 减 " + item.reduce_value }</span>*/}
                            {/*/!*<Brief>{item.coupon_start_time + " - "}{item.coupon_due_time}</Brief>*!/*/}
                        {/*</Item>*/}
                    {/*))}*/}
                {/*</List>*/}
            {/*</Modal>*/}

            {this.getPromotionInfo()}
            
            
        </Layout>
    }
}

export default LoadingHoc(Product);

Product.contextTypes = {
    router: PropTypes.object.isRequired
};


{/*<Card className="general_container">*/}
{/*<Carousel*/}
{/*style={{touchAction:'none'}}*/}
{/*autoplay={true}*/}
{/*infinite*/}
{/*selectedIndex={0}*/}
{/*swipeSpeed={35}*/}
{/*>*/}
{/*{images}*/}
{/*</Carousel>*/}
{/*<WingBlank>*/}
{/*<h3>{proData.name} <small style={{color:'darkorange'}}>{proData.sub_title}</small></h3>*/}

{/*<hr/>*/}

{/*<Card>*/}
{/*<WingBlank>*/}
{/*<div className="product_info_div">*/}

{/*<WhiteSpace/>*/}

{/*<Flex>*/}
{/*<Flex.Item className="detail_info">产地：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_location}</Flex.Item>*/}
{/*<Flex.Item className="detail_info">厂家电话：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_tel}</Flex.Item>*/}
{/*</Flex>*/}

{/*<Flex>*/}
{/*<Flex.Item className="detail_info">生成许可证：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_license}</Flex.Item>*/}
{/*<Flex.Item className="detail_info">产品标准：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_standard}</Flex.Item>*/}
{/*</Flex>*/}

{/*<Flex>*/}
{/*<Flex.Item className="detail_info">品牌：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_brand}</Flex.Item>*/}
{/*<Flex.Item className="detail_info">规格：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_spec}</Flex.Item>*/}
{/*</Flex>*/}

{/*<Flex>*/}
{/*<Flex.Item className="detail_info">保质期：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_guarantee_date}</Flex.Item>*/}
{/*<Flex.Item className="detail_info">储藏方法：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_store_method}</Flex.Item>*/}
{/*</Flex>*/}

{/*<Flex>*/}
{/*<Flex.Item className="detail_info">商品毛重：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_gross_weight}</Flex.Item>*/}
{/*<Flex.Item className="detail_info">特殊属性：</Flex.Item>*/}
{/*<Flex.Item className="detail_val">{proData.product_special_prop}</Flex.Item>*/}
{/*</Flex>*/}

{/*<Flex>*/}
{/*<Flex.Item className="detail_info">优惠价格：</Flex.Item>*/}
{/*<Flex.Item style={{color:'darkorange', fontSize:'1.2rem', fontStyle:'bold'}}>*/}
{/*{this.state.currentPrePrice}*/}
{/*</Flex.Item>*/}
{/*<Flex.Item className="detail_info">市场价格：</Flex.Item>*/}
{/*<Flex.Item style={{color:'darkorange', textDecoration:'line-through'}}>*/}
{/*{this.state.currentMarketPrice}*/}
{/*</Flex.Item>*/}
{/*</Flex>*/}

{/*<div className="comm_num">累计评价：*/}
{/*<span style={{color:'darkorange'}}>{comment.comment_count}</span>*/}
{/*</div>*/}

{/*</div>*/}
{/*</WingBlank>*/}
{/*</Card>*/}

{/*<hr/>*/}

{/*<Select data={this.state.featureData} selectorText={this.changeSelectorText.bind(this)} />*/}

{/*</WingBlank>*/}
{/*<WhiteSpace size="xs" />*/}
{/*</Card>*/}

{/*<Card className="selector_container">*/}
{/*<div className="selector_sec" onClick={this.showModal2.bind(this)}>*/}
{/*<WingBlank>*/}
{/*<span>优惠规则</span>*/}
{/*<span>{this.state.chooseCoupon}</span>*/}
{/*</WingBlank>*/}
{/*</div>*/}
{/*<div className="selector_sec">*/}
{/*<WingBlank>*/}
{/*<span>优惠总量</span>*/}
{/*<span>限购数量</span>*/}
{/*/!*<span>￥{proData.ship_fee}</span>*!/*/}
{/*</WingBlank>*/}
{/*</div>*/}
{/*</Card>*/}

{/*<Card className="selector_container">*/}
{/*<div className="selector_sec" onClick={this.showModal.bind(this)}>*/}
{/*<WingBlank>*/}
{/*<span>已选</span>*/}
{/*<span>{this.state.modalSelectorText}</span>*/}
{/*</WingBlank>*/}
{/*</div>*/}
{/*<div className="selector_sec">*/}
{/*<WingBlank>*/}
{/*<span>运费</span>*/}
{/*<span>￥{proData.ship_fee}</span>*/}
{/*</WingBlank>*/}
{/*</div>*/}
{/*</Card>*/}

{/*<Detail ImgsData={proData.intro_imgs}/>*/}
{/*<WhiteSpace size="lg"/>*/}
