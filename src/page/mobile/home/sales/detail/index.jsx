import React from "react";
import { Link } from "react-router-dom";
import { Card, WhiteSpace, Flex, NoticeBar } from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import SearchNavBar from "../../../../../components/search/index.jsx";
import "./index.less";
// import sales_detail from "../../../../../static/mockdata/sales_detail.js"; // mock假数据
import homeApi from "../../../../../api/home.jsx";
import {getServerIp} from "../../../../../config.jsx";

export default class SalesDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            salesDetail: [],
            isLoading: false,

            ruleType: '',
            presents: [],
            subtracts: [],
            discounts: [],
        };
    }

    componentWillMount() {
        var promotionId = 0;

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
                return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProductNumber
            });
        }
        else {

        }

        return content
    }

    requestOrdinaryPromotionDetail(promotionId) {
        homeApi.getOrdinaryPromotionDetail(promotionId, (rs) => {
            if(rs && rs.success) {
                const proDetail = rs.obj;
                this.setState({
                    salesDetail: proDetail,
                    isLoading: false
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


    render() {

        const content = this.state.salesDetail.hySingleitemPromotions && this.state.salesDetail.hySingleitemPromotions.map((item, index) => {
            
            console.log('itemitemitemitem',item)
            console.log("mytest",this.state)
            return <Link to={{pathname: `/product/${item.specialtyId.id}`, isPromotion: true, ruleType: item.hyPromotion.promotionRule,
                discounts: item.hyPromotion.hyFullDiscounts, subtracts: item.hyPromotion.hyFullSubstracts, presents: item.hyPromotion.hyFullPresents,
                promoteNum: item.promoteNum, limitedNum: item.limitedNum, guige:item.specificationId.specification}} key={index}>
                <Flex style={{background:'#fff'}}>
                    <Flex.Item style={{flex: '0 0 30%'}}>
                        <img src={"http://" + getServerIp() + this.getSalesDetailIcon(item.specialtyId.images)} style={{width: '70%', height:'4rem', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 60%', color:'black'}}>
                        <WhiteSpace/>
                        <div style={{marginBottom: 10, fontWeight:'bold'}}>{item.hyPromotion.promotionName}</div>
                        <div style={{marginBottom: 10}}>价格：<span style={{color:'red'}}>￥{item.specificationId.platformPrice}元</span></div>
                        <div style={{marginBottom: 10}}>优惠规格：<span style={{color:'red'}}>{item.specificationId.specification}</span></div>
                        <div style={{marginBottom: 10}}>优惠政策：<span style={{color:'red'}}>
                        {this.getSalesContent(item.hyPromotion.promotionRule, item.hyPromotion.hyFullSubstracts, item.hyPromotion.hyFullDiscounts, item.hyPromotion.hyFullPresents)}
                        </span></div>
                        {(localStorage.getItem('isWebusiness') === '1')?<div style={{marginBottom: 10}}>提成金额：<span style={{color:'red'}}>{(item.specificationId.dividMoney).toFixed(2)}</span></div>:<div></div>}
                        <div style={{marginBottom: 10}}>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div>
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
                <WhiteSpace />
            </Link>
        });


        return <Layout header={false} footer={true}>

            <SearchNavBar/>

            {/*<img src={this.state.salesDetail.img_url} style={{width:'100%'}}/>*/}

            {/*<Card>*/}
                {/*<WingBlank style={{fontSize:'1rem', textAlign:'center', fontWeight:'bold', margin:'1rem'}}>*/}
                    {/*{this.state.salesDetail.sales_title}简介*/}
                {/*</WingBlank>*/}
                {/*<WingBlank className='sales_detail_line'>*/}
                    {/*<span className='tag'>时间</span>*/}
                    {/*<span style={{marginLeft:'0.5rem'}}>*/}
                        {/*{this.state.salesDetail.sales_start_time} - {this.state.salesDetail.sales_end_time}*/}
                    {/*</span>*/}
                {/*</WingBlank>*/}
                {/*<WingBlank className='sales_detail_line'>*/}
                    {/*<span className='tag' style={{marginRight:'0.5rem'}}>{this.state.salesDetail.sales_tag}</span>*/}
                    {/*{salesContent}*/}
                {/*</WingBlank>*/}
                {/*<WingBlank className='sales_detail_line'>*/}
                    {/*<span className='tag'>电子券</span>*/}
                {/*</WingBlank>*/}
            {/*</Card>*/}


{/*  
             <Card>
                 <div dangerouslySetInnerHTML={{ __html: this.state.salesDetail.introduction}} />
             </Card> */}

            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            <WhiteSpace/>
            {this.checkNoticeBar()}

            {content}
            {this.checkPresents()}

        </Layout>
    }
}