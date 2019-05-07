import React from 'react';
import {Carousel, Flex, Toast, WhiteSpace, WingBlank} from 'antd-mobile';
import PropTypes from "prop-types";

import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import Layout from "../../../common/layout/layout.jsx";

import WxManager from "../../../manager/WxManager.jsx";

import {getServerIp} from "../../../config.jsx";

import Card from "../../../components/card/index.jsx";
import CartModal from '../../../components/cart/cartmodal.jsx';
import PutInCart from '../../../components/cart/putincart.jsx';

import Comment from "./comment.jsx";
import Recommend from "./recommend.jsx";
import './index.less';

import proApi from "../../../api/product.jsx";
import settingApi from "../../../api/setting.jsx";


// 注意：其它页面(sales和sales_group)跳转到产品页面时，需要传4个参数：
// this.props.location.isPromotion: 判断是否是优惠商品
// this.props.location.isPresent: 判断是否是赠品
// this.props.location.guige: 优惠产品或赠品的规格
// this.props.location.limitedNum: 优惠产品的限购数量


class Product extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,

            data: {},
            featureData: [],
            comment: [],
            recommends: [],
            servicePromise: {},

            // cartModal的显示控制
            modal: false,
            // isAdd: 0,

            modalSelectorText: '未选择',

            isNull: false, // 控制页面显示
            commentNum: 0,

            currentPrePrice: 0,
            currentMarketPrice: 0,

            //加购物车相关参数
            specialtyId: parseInt(window.location.href.split('#')[1].split('/product/')[1]),
            specificationId: 0,
            specification: "",
            isGroupPromotion: false,
            quantity: 1,
        }
    }

    componentWillMount() {
        this.requestProductDetailData(this.state.specialtyId);
        this.requestProductCommentData(this.state.specialtyId, 1, 10);
        this.requestServicePromise();

        WxManager.auth();

        localStorage.removeItem("inputBalance");
    }

    componentDidMount() {
        WxManager.share();
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
                this.setState({
                    isNull: true,
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
        });
    }


    // 如果是优惠产品页进来的，不显示购物车底栏
    checkCartDisplay(cartProps, buyItem) {
        if (this.props.location.isPromotion || this.props.location.isPresent)
            return null;

        return <PutInCart style={{height: '3.125rem'}}
                          modalSelectorText={this.state.modalSelectorText}
                          showModal={this.showModal.bind(this)}

                          cartProps={cartProps}
                          buyItem={buyItem}

                          isPromotion={this.props.location.isPromotion}
                          origin="product"
        />
    }

    // 如果是优惠产品页进来的，不显示规格选择
    checkSpecificationDisplay() {
        if (this.props.location.isPromotion || this.props.location.isPresent)
            return null;

        return <CartModal
            productData={this.state.data}
            modalData={this.state.featureData}

            visible={this.state.modal}
            hideModal={this.hideModal.bind(this)}
            selectorText={this.changeModalSelectorText.bind(this)}

            guige={this.props.location.guige}
            limit={this.props.location.limitedNum}
        />
    }

    // checkPromotion() {
    //     // if (this.props.location.isPromotion)
    //     //     return <Link to={{pathname: "/home/sales", dest: '/home'}}>
    //     //             <span style={{color: 'darkorange', fontStyle:'normal'}}> (点击查看更多优惠)</span>
    //     //         </Link>;
    //
    //     if (this.props.location.isPresent)
    //         return <span style={{color: 'darkorange', fontStyle: 'normal'}}> (赠品)</span>;
    //
    // }


    render() {

        if (this.state.isNull)
            return <Layout>
                <div>该产品的数据为空</div>
            </Layout>;


        if (!this.state.data || JSON.stringify(this.state.data) === "{}" ||
            !this.state.data[0].specialty || !this.state.data[0].specialty.images)
            return null;


        let cartProps = {
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

        const proData = this.state.data[0];
        let primaryImages = proData.specialty.images;

        for (let i = 0; i < primaryImages.length; i++) {
            if (primaryImages[i].isLogo)
                primaryImages.splice(i, 1);
        }
        // if(primaryImages.length === 1)
        //     primaryImages[1] = primaryImages[0];


        const images = primaryImages && primaryImages.map((img, index) => {
            return <img src={"http://" + getServerIp() + img.sourcePath}
                        key={index} style={{margin: '0 auto', height: '12rem', width: '100%'}}
                        alt="" onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
            }}/>
        });


        return <Layout>

            <a name="top"/>

            <Card className="general_container">
                <Carousel
                    style={{touchAction: 'none'}}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                    swipeSpeed={35}
                    dots={true}
                >
                    {images}
                </Carousel>


                <WingBlank>
                    <h3>
                        {proData.specialty.name}
                        {this.props.location.isPresent ? <span style={{color: 'darkorange', fontStyle: 'normal'}}> (赠品)</span> : ""}
                        {/*{this.checkPromotion()}*/}
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
                    <div className="selector_sec" onClick={this.showModal.bind(this)}>
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
                    <WingBlank>
                        <div className="para_title">产品介绍</div>
                        <div className="para_html" dangerouslySetInnerHTML={{__html: proData.specialty.descriptions}}/>
                    </WingBlank>
                </div>
            </Card>


            <WhiteSpace size="xs"/>


            <Card className="general_container">
                <WingBlank>
                    <WhiteSpace/>
                    <Comment specialtyId={this.state.specialtyId} comment={this.state.comment}
                             total={this.state.commentNum}/>
                </WingBlank>
            </Card>


            <WhiteSpace size="xs"/>

            <Recommend recommend={this.state.recommends}/>

            <WhiteSpace size="xs"/>


            <Card className="general_container">

                <div>

                    <WingBlank>
                        <div className="para_title">服务承诺</div>
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


                    {/* <WingBlank>*/}
                    {/*<video*/}
                    {/*id="my-player"*/}
                    {/*className="video-js vjs-default-skin vjs-fluid"*/}
                    {/*// x5-video-player-type="h5"*/}
                    {/*// x-webkit-airplay="true" */}
                    {/*// playsinline webkit-playsinline="true"*/}
                    {/*width="100%"*/}
                    {/*controls="false" */}
                    {/*loop="true" //自动循环*/}
                    {/*preload="metadata" //auto metadata none */}
                    {/*poster="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531238777253&di=ee388000b58e23ebda4df9ee02f224d6&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Faa64034f78f0f736fd98e0fe0655b319eac413ee.jpg"*/}
                    {/*data-setup='{}'>*/}
                    {/*<source src="http://ohjdda8lm.bkt.clouddn.com/course/sample1.mp4" type="video/mp4"></source>*/}
                    {/*/!* <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>*/}
                    {/*<source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source> *!/*/}
                    {/*</video>*/}
                    {/*</WingBlank>*/}

                </div>

            </Card>

            {this.checkCartDisplay(cartProps, buyItem)}

            {this.checkSpecificationDisplay()}

        </Layout>
    }
}

export default LoadingHoc(Product);

Product.contextTypes = {
    router: PropTypes.object.isRequired
};
