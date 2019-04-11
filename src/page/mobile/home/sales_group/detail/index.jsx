import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {Card, WingBlank, WhiteSpace, Toast, List, Flex,Carousel} from "antd-mobile";
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
        console.log("??",localStorage.getItem("isWebusiness"));
        if (localStorage.getItem("isWebusiness")==1) {
            return <WingBlank>提成比例：{item.businessPersonDivide.proportion}</WingBlank>
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

        // const content = groupProducts && groupProducts.map((item, index) => {
        //     return <Link to={{pathname: `/home/sales_group/detail/products`, state: item.hyGroupitemPromotionDetails}} key={index}>
        //         <div style={{backgroundColor:'white', borderBottom:'1px solid #eee', color:'#999'}}>
        //             <WhiteSpace/>
        //             <WingBlank>
        //                 共 {item.hyGroupitemPromotionDetails.length} 件商品，优惠价格：{item.sellPrice}，市场价格：{item.marketPrice}
        //             </WingBlank>
        //             <WhiteSpace/>
        //             {this.showWebusinessInfo(item)}
        //             <WhiteSpace/>
        //             <WingBlank>
        //                 限购数量：{this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum}
        //             </WingBlank>
        //         </div>
        //         <div style={{background:'#fff'}}>
        //             <WhiteSpace/>
        //             { this.showImages(item.hyGroupitemPromotionDetails) }
        //             <WhiteSpace/>
        //         </div>
        //         <WhiteSpace />
        //     </Link>
        // });
        console.log('inbound',this.state.inbound)

        // const salesContent = this.state.salesGroupDetail.sales_content && this.state.salesGroupDetail.sales_content.map((item, index) => {
        //     return <span key={index} className='tag' style={{marginRight:'0.5rem'}}>{item}</span>
        // });
        var bancontent;
        if(this.state.salesGroupDetail.hyGroupitemPromotions){
            var tempban = this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyPromotionPics;
            console.log("before",tempban);
            for(var i=0;i<tempban.length;i++){
                if(tempban[i].isTag==true){
                    tempban.splice(i,1);
                }
            }
            console.log("after",tempban);
            bancontent = tempban && tempban.map((item, index) => {
            if(item.isTag==false){
                return <img key={index} style={{margin: '0 auto', height:'12rem', width:'100%'}} src={"http://" + getServerIp() + item.sourcePath}/>
            }
        });
        }
        
        var start,end,a,b;
        if(this.state.salesGroupDetail.hyGroupitemPromotions){
            start = new Date(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionStarttime).toLocaleString();
            end = new Date(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionEndtime).toLocaleString();
            a=start.indexOf("午");
            b=end.indexOf("午");
            console.log("safsfasfsa",a,b,start.substring(0,a+2),end.substring(0,b+2));
            start.substring(0,a+2);
            end.substring(0,b+2);
        }

        const content = this.state.salesGroupDetail.hyGroupitemPromotions[0].hyGroupitemPromotionDetails && this.state.salesGroupDetail.hyGroupitemPromotions[0].hyGroupitemPromotionDetails.map((item, index) => {
            
            console.log('itemitemitemitem',item)
            console.log("mytest",this.state)
            return <Link to={{pathname: `/product/${item.itemId.id}`, isPromotion: true, ruleType: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule,
                discounts: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullDiscounts, 
                subtracts: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts, 
                presents: this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullPresents,
                promoteNum: this.state.salesGroupDetail.hyGroupitemPromotions[0].promoteNum, limitedNum: this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum, 
                guige:item.itemSpecificationId.specification}} key={index}>
                <Card>
                <Flex style={{background:'#fff'}}>
                    <Flex.Item style={{flex: '0 0 30%'}}>
                        <img src={"http://" + getServerIp() + this.getSalesDetailIcon(item.itemId.images)} style={{width: '70%', height:'4rem', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 80%', color:'black'}}>
                        <WhiteSpace/>
                        <div style={{marginBottom: 5, fontWeight:'bold'}}>{item.itemId.name}</div>
                        <div style={{marginBottom: 5}}>价格：<span style={{color:'red'}}>￥{item.itemSpecificationId.platformPrice}元</span></div>
                        <div style={{marginBottom: 5}}>优惠规格：<span style={{color:'red'}}>{item.itemSpecificationId.specification}</span></div>
                        <div style={{marginBottom: 5}}>优惠政策：<span style={{color:'red'}}>
                        {this.getSalesContent(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
                                         this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullDiscounts, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullPresents)}
                        </span></div>
                        {(localStorage.getItem('isWebusiness') === '1')?<div style={{marginBottom: 10}}>提成金额：<span style={{color:'red'}}>{parseFloat(item.itemSpecificationId.dividMoney).toFixed(2)}</span></div>:<div></div>}
                        <div style={{marginBottom: 5}}>销量：<span style={{color:'red'}}>{item.itemSpecificationId.hasSold}</span></div>
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
                </Card>
                <WhiteSpace />
            </Link>
        });





        return <Layout>
            <Navigation title={this.state.salesGroupDetail.name + "详情"} left={true} backLink='/home/sales_group'/>
            <Card>
                <Carousel
                    style={{touchAction:'none'}}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                    swipeSpeed={35}
                    dots={false}
                >
                    {bancontent}
                </Carousel> 
            <WingBlank>    
            <h3>
                {this.state.salesGroupDetail.hyGroupitemPromotions?this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionName:""}
            </h3>
            <h4>
                开始时间：{this.state.salesGroupDetail.hyGroupitemPromotions?start.substring(0,a+2)+"时":""}
            </h4>
            <h4>
                结束时间：{this.state.salesGroupDetail.hyGroupitemPromotions?end.substring(0,b+2)+"时":""}
            </h4>
            <hr/>
            <Card>
                        <WingBlank>
                            <div className="my2_product_info_div">

                                {/* <WhiteSpace/> */}

                                <Flex>
                                    <Flex.Item className="detail_info">类型：</Flex.Item>
                                    <Flex.Item className="detail_val_left">
                                    {this.state.salesGroupDetail.hyGroupitemPromotions?this.getSalesContent(this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.promotionRule, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullSubstracts,
                                         this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullDiscounts, this.state.salesGroupDetail.hyGroupitemPromotions[0].promotionId.hyFullPresents):""}
                                    
                                    </Flex.Item>
                                    <Flex.Item className="detail_info">运费：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{this.state.salesGroupDetail.hyGroupitemPromotions?"￥"+this.state.salesGroupDetail.hyGroupitemPromotions[0].sellPrice:""}</Flex.Item>
                                </Flex>
                                <Flex>
                                    <Flex.Item className="detail_info">限购：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{this.state.salesGroupDetail.hyGroupitemPromotions?this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum:""}</Flex.Item>
                                    <Flex.Item className="detail_info">销量：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{this.state.salesGroupDetail.hyGroupitemPromotions?"￥"+this.state.salesGroupDetail.hyGroupitemPromotions[0].sellPrice:""}</Flex.Item>
                                </Flex>
                                <Flex>
                                    <Flex.Item className="detail_info">市场价：</Flex.Item>
                                    <Flex.Item className="detail_val_left">{this.state.salesGroupDetail.hyGroupitemPromotions?"￥"+this.state.salesGroupDetail.hyGroupitemPromotions[0].marketPrice:""}</Flex.Item>
                                    <Flex.Item className="detail_info">平台价：</Flex.Item>
                                    <Flex.Item className="detail_val_right">{this.state.salesGroupDetail.hyGroupitemPromotions?"￥"+this.state.salesGroupDetail.hyGroupitemPromotions[0].sellPrice:""}</Flex.Item>
                                </Flex>
                            </div>
                        </WingBlank>
            </Card>

            <WhiteSpace></WhiteSpace>


                <WingBlank>
                <div className="para_title">活动介绍</div>
                <div dangerouslySetInnerHTML={{ __html: this.state.salesGroupData.introduction}} />
                </WingBlank>

            </WingBlank>
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
                    cartNum={this.state.cartNum}
                    limmit={this.state.salesGroupDetail.hyGroupitemPromotions[0].limitedNum}
                    myval={this.state.val}/>


        </Layout>
    }
}

SalesGroupDetail.contextTypes = {
    router: PropTypes.object.isRequired
};