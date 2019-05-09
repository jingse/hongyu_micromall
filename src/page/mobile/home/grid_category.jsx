import React from 'react';
import {Link} from 'react-router-dom';
import {Flex} from 'antd-mobile';
import {ProductCard, PromotionCard} from "../../../components/product_card/proCard.jsx";
import homeApi from "../../../api/home.jsx";
import Tag from "./tagShow.jsx";
import SaleManager from "../../../manager/SaleManager.jsx";
import './index.less';


export default class GridCategory extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data1: [],
            data2: [],
            data3: [],
            tags: [],
        };
    }

    componentDidMount() {
        this.requestTopNOfCoupon(9);
    }

    requestTopNOfCoupon(size) {
        homeApi.getTopNOFCoupon(size, (rs) => {
            console.log("普通优惠rs", rs);
            if (rs && rs.success) {
                const coupon = rs.obj;
                this.setState({
                    data1: coupon
                });
            }
        });
        homeApi.getTopNOFGroupCoupon(size, (rs) => {
            console.log("组合优惠rs", rs);
            if (rs && rs.success) {
                const coupon = rs.obj;
                this.setState({
                    data2: coupon
                });
            }
        });
        homeApi.getTopNOFRecommend(size, (rs) => {
            console.log("推荐rs", rs);
            if (rs && rs.success) {
                const coupon = rs.obj;
                this.setState({
                    data3: coupon
                });
            }
        });
        homeApi.getTags((rs) => {
            console.log("标签rs", rs);
            if (rs && rs.success) {
                const thetags = rs.obj;
                this.setState({
                    tags: thetags
                });
            }
        });
    }


    render() {
        const couponImgBlockStyle = {textAlign: 'right', marginRight: '0.8rem', marginLeft: '0.5rem', marginTop: '0.5rem'};

        let topOfCoupon1 = this.state.data1;
        if (!topOfCoupon1 || JSON.stringify(topOfCoupon1) === "{}")
            return null;

        let topOfCoupon2 = this.state.data2;
        if (!topOfCoupon2 || JSON.stringify(topOfCoupon2) === "{}")
            return null;

        let topOfCoupon3 = this.state.data3;
        if (!topOfCoupon3 || JSON.stringify(topOfCoupon3) === "{}")
            return null;


        let hometag = this.state.tags;
        const hometags = hometag && hometag.map((item, index) => {
            return <Tag key={index} tagId={item.id} name={item.productName} picUrl={item.iconUrl}/>
        });

        const content1 = topOfCoupon1 && topOfCoupon1.map((item, index) => {
            return <PromotionCard key={index}
                                  targetLink={{pathname: `/home/sales/detail`, state: item.id}}
                                  cardPromotionImgUrl={SaleManager.getSalesIconImg(item)}
                                  cardPromotionName={item.name}
                                  cardPromotionRule={SaleManager.getHomeSalesContent(item.ruleType, item.fullSubstracts, item.fullDiscounts, item.fullPresents)}
                                  cardPromotionHasSold={item.hySingleitemPromotions[0].havePromoted}
                                  cardPromotionPlatformPrice={item.hySingleitemPromotions[0].specificationId.platformPrice}/>;
        });

        const content2 = topOfCoupon2 && topOfCoupon2.map((item, index) => {
            return <PromotionCard key={index}
                                  targetLink={{pathname: `/home/sales_group/detail`, state: item.id}}
                                  cardPromotionImgUrl={SaleManager.getSalesGroupIconImg(item.pics)}
                                  cardPromotionName={item.name}
                                  cardPromotionRule={SaleManager.getHomeSalesContent(item.ruleType, item.fullSubstracts, item.fullDiscounts, item.fullPresents)}
                                  cardPromotionHasSold={item.groupItemPromotions[0].havePromoted}
                                  cardPromotionPlatformPrice={item.groupItemPromotions[0].sellPrice}/>;
        });

        const content3 = topOfCoupon3 && topOfCoupon3.map((item, index) => {
            return <ProductCard key={index}
                                targetLink={`/product/${item.specialty.id}`}
                                cardProductImgUrl={item.iconURL.mediumPath}
                                cardProductName={item.specialty.name}
                                cardProductHasSold={item.hasSold}
                                cardProductPlatformPrice={item.pPrice}/>;
        });

        return (<div>
                <Flex>
                    <Flex.Item style={couponImgBlockStyle}>
                        <Link to={{pathname: 'home/recharge'}}>
                            <img src='./images/category/优惠券图片.jpg' height='auto' width='100%'/>
                        </Link>
                        <Link to={{pathname: '/home/coupon'}}
                              style={{color: 'darkorange'}}>
                            <img src='./images/category/电子券图片.jpg' height='auto' width='100%'/>
                        </Link>
                    </Flex.Item>
                </Flex>

                {/*普通优惠*/}
                <Link to={{pathname: '/home/sales'}}>
                    <img src='./images/category/1.jpg' height='120' width='100%'/>
                </Link>
                <Flex style={{flexWrap: 'nowrap', overflow: 'scroll'}}>
                    {content1}
                </Flex>

                {/*组合优惠*/}
                <Link to={{pathname: '/home/sales_group'}}>
                    <img src='./images/category/2.jpg' height='120' width='100%'/>
                </Link>
                <Flex style={{flexWrap: 'nowrap', overflow: 'scroll'}}>
                    {content2}
                </Flex>

                {/*推荐产品*/}
                <Link to={{pathname: '/home/recommend'}}>
                    <img src='./images/category/3.jpg' height='120' width='100%'/>
                </Link>
                <Flex style={{flexWrap: 'nowrap', overflow: 'scroll'}}>
                    {content3}
                </Flex>

                {/*标签*/}
                {hometags}


            </div>
        )
    }
}