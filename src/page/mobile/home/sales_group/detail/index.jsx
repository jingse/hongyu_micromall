import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {Card, WingBlank, WhiteSpace, Toast, List, Flex} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Bottom from "./bottom.jsx";
// import sales_group_detail from "../../../../../static/mockdata/sales_group_detail.js"; // mock假数据
import homeApi from "../../../../../api/home.jsx";
import {getServerIp} from "../../../../../config.jsx";
import cartApi from "../../../../../api/cart.jsx";
import './index.less';

export default class SalesGroupDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            salesGroupDetail: [],
            salesGroupData: [],
            isLoading: false,
            val: 1,
            inbound:0,

            cartNum: localStorage.getItem("cartCount")!=0 ?localStorage.getItem("cartCount"):'',


            ruleType: '',
            presents: [],
            subtracts: [],
            discounts: [],
        };
    }

    componentWillMount() {

        var groupPromotionId = 0;

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
            if(rs && rs.success) {
                const proDetail = rs.obj;
                console.log('proDetail',proDetail)
                // this.state.salesGroupData = this.props.location.groupProduct;
                this.state.salesGroupData = proDetail;


                this.setState({
                    salesGroupDetail: proDetail,
                    salesGroupData: this.state.salesGroupData,
                    isLoading: false,
                    inbound:proDetail.hyGroupitemPromotions[0].promoteNum
                });
            }
        });
    }

    onChange = (val) => {
        // console.log(val);
        this.setState({ val });
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

    getSalesContent(salesContent) {
        const sales = salesContent && salesContent.map((item, index) => {
            return "满" + item.fullFreeRequirement + "减" + item.fullFreeAmount
        });

        return sales
    }

    checkPresents() {
        var fullPresents = null;
        if (this.state.presents && JSON.stringify(this.state.presents) !== '[]') {
            fullPresents = this.state.presents && this.state.presents.map((item, index) => {
                return <Link to={{pathname: `/product/${item.fullPresentProduct.id}`, isPromotion: false}} key={index}>
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


    getCartCount() {
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const count = rs.obj.length;
                localStorage.setItem("cartCount", count);
                this.setState({
                    cartNum: count,
                });
            }
        });
    }

    addToCart() {
        //addSingleItemToCart(id, specificationId, specialtyId, isGroupPromotion, quantity, callback)
        cartApi.addSingleItemToCart(localStorage.getItem("wechatId"), "", this.state.salesGroupDetail.hyGroupitemPromotions[0].id,
            true, this.state.val, (rs) => {
            if(rs && rs.success) {
                this.showToast();
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
        var price = {};
        cartApi.getTotalPriceInCart(item, (rs) => {
            console.log("getTotalPriceInCart rs", rs);
            if (rs && rs.success) {
                price = rs.obj;

                console.log("buyImmediately price", price);
                if (price !== {}) {
                    localStorage.setItem("origin", "sales_group");
                    this.context.router.history.push({pathname:'/cart/payment', products: item, price: price});
                }
            }
        });
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

    showToast() {
        Toast.success('加入成功，快去购物车看看你的宝贝吧～', 1, null, false);
    }

    showWebusinessInfo(item) {
        if (localStorage.getItem("isWebusiness")) {
            return <WingBlank>微商提成：{item.businessPersonDivide.proportion}</WingBlank>
        }
    }

    showImages(item) {
        const images = item.map((product, index) => {
            const imgs = product && product.itemId.images.map((img, index2) => {
                if (img.isLogo) {
                    return <img src={"http://" + getServerIp() + img.mediumPath} key={index2}
                                style={{width: '25%', margin:'0.4rem', height:'6rem', border:'1px solid #eee', marginLeft:'1rem'}}
                        // onClick={()=>{this.linkTo(`/product/${item.ids[index]}`)}}
                    />
                }
            });
            return imgs;
        });
        return images
    }

    // linkTo(link) {
    //     this.context.router.history.push(link);
    // }

    render() {

        console.log("this.state.salesGroupDetail", this.state.salesGroupDetail);
        if (!this.state.salesGroupDetail || JSON.stringify(this.state.salesGroupDetail) == "[]" || !this.state.salesGroupData ) {
            return null
        }

        const groupProducts = this.state.salesGroupDetail.hyGroupitemPromotions;
        // const groupProductsNum = groupProducts.length;

        const content = groupProducts && groupProducts.map((item, index) => {
            return <Link to={{pathname: `/home/sales_group/detail/products`, state: item.hyGroupitemPromotionDetails}} key={index}>
                <div style={{backgroundColor:'white', borderBottom:'1px solid #eee', color:'#999'}}>
                    <WhiteSpace/>
                    <WingBlank>
                        共 {item.hyGroupitemPromotionDetails.length} 件商品，优惠价格：{item.sellPrice}，市场价格：{item.marketPrice}
                    </WingBlank>
                    <WhiteSpace/>
                    {this.showWebusinessInfo(item)}
                    <WhiteSpace/>
                </div>
                <div style={{background:'#fff'}}>
                    <WhiteSpace/>
                    { this.showImages(item.hyGroupitemPromotionDetails) }
                    <WhiteSpace/>
                </div>
                <WhiteSpace />
            </Link>
        });
        console.log('inbound',this.state.inbound)

        // const salesContent = this.state.salesGroupDetail.sales_content && this.state.salesGroupDetail.sales_content.map((item, index) => {
        //     return <span key={index} className='tag' style={{marginRight:'0.5rem'}}>{item}</span>
        // });


        return <Layout header={false} footer={false}>

            <Navigation title={this.state.salesGroupDetail.name + "详情"} left={true} backLink='/home/sales_group'/>

            {/*<img src={"http://" + getServerIp() + this.getSalesIconImg(this.state.salesGroupData.pics)} style={{width:'100%'}}/>*/}

            {/*<Card>*/}
                {/*<WingBlank style={{fontSize:'1rem', textAlign:'center', fontWeight:'bold', margin:'1rem'}}>*/}
                    {/*{this.state.salesGroupData.name}简介*/}
                {/*</WingBlank>*/}
                {/*<WingBlank className='sales_detail_line'>*/}
                    {/*<span className='tag'>时间</span>*/}
                    {/*<span style={{marginLeft:'0.5rem'}}>*/}
                        {/*{this.state.salesGroupData.startTime} - {this.state.salesGroupData.endTime}*/}
                    {/*</span>*/}
                {/*</WingBlank>*/}
                {/*<WingBlank className='sales_detail_line'>*/}
                    {/*<span className='tag' style={{marginRight:'0.5rem'}}>{this.state.salesGroupData.ruleType}</span>*/}
                    {/*/!*{salesContent}*!/*/}
                    {/*{this.getSalesContent(this.state.salesGroupData.fullSubstracts)}*/}
                {/*</WingBlank>*/}
                {/*<WingBlank className='sales_detail_line'>*/}
                    {/*<span className='tag'>电子券</span>*/}
                {/*</WingBlank>*/}
            {/*</Card>*/}

            <Card>
                <div dangerouslySetInnerHTML={{ __html: this.state.salesGroupData.introduction}} />
            </Card>

            <WhiteSpace/>

            {content}
            {this.checkPresents()}

            {/*<div style={{margin:'1rem'}}>*/}
                {/**/}
            {/*</div>*/}
            <List.Item
                wrap
                extra={
                    // <Stepper
                    //     style={{ width: '90%', minWidth: '100px' }}
                    //     showNumber
                    //     // max={10}
                    //     min={1}
                    //     value={this.state.val}
                    //     onChange={this.onChange}
                    // />
                    <div className="step2">  
                        <div className="add_minus"onClick={() => {this.setState({val:(this.state.val-1)>1?this.state.val-1:1})}}
                            style={{backgroundImage:'url(./images/icons/minus.png)', backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
                        </div>
                        <div className="value">
                        {this.state.val}
                        </div>
                        <div className="add_minus" onClick={() => {this.setState({val:(this.state.val+1 >this.state.inbound?this.state.val:this.state.val+1)})}}
                            style={{backgroundImage:'url(./images/icons/add.png)',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
                        </div>
                </div>
                }
            >
                数量
            </List.Item>

            <Bottom style={{height:'3.125rem'}}
                    addToCart={this.addToCart.bind(this)}
                    buyImmediately={this.buyImmediately.bind(this)}
                    cartNum={this.state.cartNum}/>


        </Layout>
    }
}

SalesGroupDetail.contextTypes = {
    router: PropTypes.object.isRequired
};