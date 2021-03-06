import React from 'react';
import {Flex, Toast, WhiteSpace, WingBlank} from 'antd-mobile';
import PropTypes from "prop-types";

import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import Layout from "../../../common/layout/layout.jsx";

import WxManager from "../../../manager/WxManager.jsx";

import Card from "../../../components/card/index.jsx";
import CartModal from '../../../components/cart/cartmodal.jsx';
import PutInCart from '../../../components/cart/putincart.jsx';
import {Banner, BannerImg} from "../../../components/banner/banner.jsx";
import {Introduction, ServicePromise, WarmPrompt} from "../../../components/common_detail/index.jsx";
import {ReqFailTip} from "../../../components/req_tip/reqTip.jsx";

import Comment from "./comment.jsx";
import {Recommend} from "./recommend.jsx";
import './index.less';

import proApi from "../../../api/product.jsx";
import settingApi from "../../../api/setting.jsx";


// 注意：其它页面(sales和sales_group)跳转到产品页面时，需要传4个参数：
// this.props.location.isPromotion: 判断是否是优惠商品
// this.props.location.isPresent: 判断是否是赠品
// this.props.location.guige: 优惠产品或赠品的规格
// this.props.location.limitedNum: 优惠产品的限购数量

let cartProps;
let buyProps;

class Product extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,

            // 页面数据
            data: {},
            featureData: [],
            comment: [],
            recommends: [],
            servicePromise: {},

            // cartModal的显示控制
            modal: false,
            modalSelectorText: '未选择',

            // putInCart的参数
            action: '',  //点击的是“加入购物车”还是“立即购买”

            // 页面显示
            isNull: false, // 控制页面显示
            isReqFail: false,
            commentNum: 0,
            currentPrePrice: 0,
            currentMarketPrice: 0,

            //加购物车相关参数
            specialtyId: parseInt(window.location.href.split('#')[1].split('/product/')[1]),
            specificationId: 0,
            specification: "",
            isGroupPromotion: false,
            quantity: 1,
        };

        this.handleAction = this.handleAction.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.changeModalSelectorText = this.changeModalSelectorText.bind(this);
    }

    componentWillMount() {
        console.groupCollapsed("产品详情页");

        this.requestProductDetailData(this.state.specialtyId);
        this.requestProductCommentData(this.state.specialtyId, 1, 10);
        this.requestServicePromise();
    }

    componentDidMount() {
        WxManager.auth();
        WxManager.share();

        localStorage.removeItem("inputBalance");
    }

    componentWillUnmount() {
        console.groupEnd();
    }


    requestProductDetailData(specialtyId) {
        proApi.getSpecialtySpecificationDetailBySpecialtyID(specialtyId, (rs) => {

            if (rs && rs.success) {
                const data = rs.obj;

                if (!data || JSON.stringify(data) === "[]") {
                    this.setState({isNull: true});
                } else {
                    const specificationId = data[0].specification.id;
                    const mPrice = data[0].mPrice;
                    const pPrice = data[0].pPrice;
                    const specifications = data[0].specialty.specifications;
                    const recommends = data[0].recommends;
                    const specification = specifications && specifications.map((item, index) => {
                        return item.specification;
                    });

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

            } else {
                this.setState({isReqFail: true});
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

    requestProductCommentData(id, page, rows) {
        proApi.getSpecialtyCommentDetail(id, page, rows, (rs) => {
            if (rs && rs.success) {
                const comment = rs.obj.rows;
                const commentNum = rs.obj.total;
                this.setState({
                    comment: comment,
                    commentNum: commentNum,
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
            this.setState({action: ""});
        });
    }


    render() {

        if (this.state.isNull)
            return <Layout>
                <div className="null_product">该产品的数据为空</div>
            </Layout>;


        if (this.state.isReqFail)
            return <ReqFailTip/>;

        if (!this.state.data || JSON.stringify(this.state.data) === "{}" ||
            !this.state.data[0].specialty || !this.state.data[0].specialty.images)
            // return <ActivityIndicator animating toast text="Loading..."/>;
            // return <ReqIngTip/>;
            return null;


        cartProps = {
            "wechatId": localStorage.getItem("wechatId"),
            "specificationId": this.state.specificationId,
            "specialtyId": this.state.specialtyId,
            "isGroupPromotion": this.state.isGroupPromotion,
            "quantity": this.state.quantity,
        };

        let buyItem = [{
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

        buyProps = {
            "buyItem": buyItem,
            "isPromotion": this.props.location.isPromotion,
            "origin": "product",
        };

        const proData = this.state.data[0];
        let primaryImages = proData.specialty.images;

        for (let i = 0; i < primaryImages.length; i++) {
            if (primaryImages[i].isLogo)
                primaryImages.splice(i, 1);
        }

        // if(primaryImages.length === 1)
        //     primaryImages[1] = primaryImages[0];

        const images = primaryImages && primaryImages.map((img, index) => {
            return <BannerImg imgPath={img.sourcePath} index={index}/>
        });


        return <Layout>

            <a name="top"/>

            <Card className="general_container">
                <Banner content={images}/>


                <WingBlank>
                    <h3>
                        {proData.specialty.name}
                        {this.props.location.isPresent ?
                            <span style={{color: 'darkorange', fontStyle: 'normal'}}> (赠品)</span> : ""}
                        {/*{this.props.location.isPromotion ? <Link to={{pathname: "/home/sales", dest: '/home'}}>*/}
                        {/*    <span style={{color: 'darkorange', fontStyle: 'normal'}}> (点击查看更多优惠)</span>*/}
                        {/*</Link> : ""}*/}
                    </h3>

                    <Card>
                        <WingBlank>
                            <div className="product_info_div">

                                <Flex>
                                    <Flex.Item className="detail_info">产地：</Flex.Item>
                                    <Flex.Item className="detail_val">{proData.specialty.originalPlace}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">品牌：</Flex.Item>
                                    <Flex.Item className="detail_val">{proData.specialty.brand}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">许可证：</Flex.Item>
                                    <Flex.Item
                                        className="detail_val">{proData.specialty.productionLicenseNumber}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">储藏方法：</Flex.Item>
                                    <Flex.Item className="detail_val">{proData.specialty.storageMethod}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">厂家电话：</Flex.Item>
                                    <Flex.Item
                                        className="detail_val">{proData.specialty.provider.contactorMobile}</Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">市场价格：</Flex.Item>
                                    <Flex.Item className="detail_val"
                                               style={{color: 'darkorange', textDecoration: 'line-through'}}>
                                        {this.props.location.isPromotion && this.props.location.mPrice ? this.props.location.mPrice : this.state.currentMarketPrice}
                                    </Flex.Item>
                                </Flex>

                                <Flex>
                                    <Flex.Item className="detail_info">优惠价格：</Flex.Item>
                                    <Flex.Item className="detail_val"
                                               style={{color: 'darkorange', fontSize: '1.2rem', fontStyle: 'bold'}}>
                                        {this.props.location.isPromotion && this.props.location.pPrice ? this.props.location.pPrice : this.state.currentPrePrice}
                                    </Flex.Item>
                                </Flex>

                                <div className="comm_num">累计评价：{this.state.commentNum}</div>

                            </div>
                        </WingBlank>
                    </Card>

                </WingBlank>
            </Card>


            <WhiteSpace size="xs"/>


            <Card className="general_container">
                <div className="selector_container">
                    <div className="selector_sec" onClick={this.showModal}>
                        <WingBlank>
                            <span>已选规格</span>
                            {/*如果是优惠产品页进来的，固定死该产品的规格，不让用户选择*/}
                            <span>
                                {(this.props.location.isPromotion || this.props.location.isPresent) ?
                                    this.props.location.guige : this.state.modalSelectorText}
                            </span>
                        </WingBlank>
                    </div>
                    {/*<div className="selector_sec">*/}
                    {/*    <WingBlank>*/}
                    {/*        <span>运费</span>*/}
                    {/*        <span>￥{this.state.data[0].deliverPrice}</span>*/}
                    {/*    </WingBlank>*/}
                    {/*</div>*/}
                </div>
            </Card>


            <WhiteSpace size="xs"/>


            <Card className="general_container">
                <div>
                    <Introduction title="产品介绍" content={proData.specialty.descriptions}/>
                </div>
            </Card>


            <WhiteSpace size="xs"/>


            <Comment specialtyId={this.state.specialtyId} comment={this.state.comment} total={this.state.commentNum}/>

            <WhiteSpace size="xs"/>

            <Recommend recommend={this.state.recommends}/>

            <WhiteSpace size="xs"/>


            <Card className="general_container">
                <div>
                    <ServicePromise content={this.state.servicePromise.servicePromise}/>
                    <WarmPrompt content={this.state.servicePromise.prompt}/>
                </div>
            </Card>

            {/*如果是优惠产品页进来的，不显示规格选择*/}
            {(this.props.location.isPromotion || this.props.location.isPresent) ? "" :
                <PutInCart style={{height: '3.125rem'}}
                           onRef={this.onRef}
                           handleAction={this.handleAction}

                           modalSelectorText={this.state.modalSelectorText}
                           showModal={this.showModal}

                           cartProps={cartProps}
                           buyProps={buyProps}
                />}


            {/*如果是优惠产品页进来的，不显示规格选择*/}
            {(this.props.location.isPromotion || this.props.location.isPresent) ? "" :
                <CartModal
                    productData={this.state.data}
                    modalData={this.state.featureData}
                    hasSpecification={true}

                    visible={this.state.modal}
                    hideModal={this.hideModal}
                    selectorText={this.changeModalSelectorText}

                    guige={this.props.location.guige}
                    limit={this.props.location.limitedNum}
                    stock={proData.inbound}
                />}

        </Layout>
    }
}

export default LoadingHoc(Product);

Product.contextTypes = {
    router: PropTypes.object.isRequired
};