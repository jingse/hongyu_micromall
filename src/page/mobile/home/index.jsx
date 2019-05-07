import React from 'react';
import {Link} from 'react-router-dom';
import {ActivityIndicator, Carousel, Modal, WhiteSpace} from "antd-mobile";

import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import Layout from "../../../common/layout/layout.jsx";
import Bottom from "../../../components/bottom/index.jsx";

import InfoCard from "./card.jsx";
import GridCategory from "./grid_category.jsx"
import Grid from "./grid_categoryList.jsx";

import WxManager from "../../../manager/WxManager.jsx";
import locManager from "../../../manager/LockManager.jsx";

import homeApi from "../../../api/home.jsx";
import cartApi from "../../../api/cart.jsx";
import {getServerIp} from '../../../config.jsx';

import './index.less';



class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            carousel: [{}, {}],
            card: {},
            tags: [],
            gridCategory: [],

            isLoading: false,
            animating: false,
            modalBack: false,
        };
    }

    componentWillMount() {

        this.setState({animating: !this.state.animating});

        // console.log("browser localStorage", localStorage.valueOf());

        // window.addEventListener("popstate", function(e) {
        //     //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
        //     var ua = navigator.userAgent.toLowerCase();
        //     if(ua.match(/MicroMessenger/i)=="micromessenger") {
        //         localStorage.clear();
        //         WeixinJSBridge.call('closeWindow'); //微信
        //     }
        // }, false);


        WxManager.auth();

        this.init();

        WxManager.share();

        setTimeout(() => {
            this.checkLogin();
        }, 1000);

        localStorage.removeItem("dest");
    }

    componentDidMount() {
        this.closeTimer = setTimeout(() => {
            this.setState({animating: !this.state.animating});
        }, 1000);
    }

    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }


    // 初始操作：判断用户是否是第一次登录
    // 是微商第一次登录：将他的微信昵称、微信openid、点开的链接中的微商uid提交给后台
    // 不是第一次登录：提交微信昵称、微信openid给后台，创建账号
    init() {
        // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=你自己的appid&redirect_uri=微信想要回调的你的页面&response_type=code&scope=snsapi_userinfo&state=xxx#wechat_redirect'
        const uid = locManager.getUId();
        const myopenid = locManager.getMyOpenId();
        const mynickname = locManager.getMyNickname();

        // Toast.info(`oldUid: ${oldUid}`,1)
        console.log("openid: ", myopenid);


        if (uid) {          // 第一次扫码，url带uid字段，不带from_user
            localStorage.setItem("uid", uid);

            console.log("uid存在");
            console.log("myopenid", myopenid);

            homeApi.postOpenId(uid, mynickname, myopenid, (rs) => {
                if (rs.msg && rs.msg !== "")
                    console.log(rs);

                if (rs.obj !== null)
                    window.location.href = rs.obj;
            });

        } else {            // 分享后的链接，url不带uid字段，带from_user
            console.log("uid不存在");
            homeApi.createAccount(mynickname, myopenid, (rs) => {
                // localStorage.setItem("isWebusiness", 'false');
                // alert(rs);
            });
        }
    }


    checkLogin() {

        let uid = locManager.getUId();
        const myopenid = locManager.getMyOpenId();
        const wechatName = localStorage.getItem('nickname');

        if (!uid)
            uid = -1;

        console.log("login param openid", myopenid);
        console.log("login param wechatName", wechatName);
        console.log(" uiduiduid", uid);

        //非微商测试
        // let leoopid = 'asdfdsfsdfasdsnflkdslfldsgnm';
        // let uuuu = 342;
        // let leoname = 'lulifeng';


        // 微商测试
        // let leoopid = 'oH0MfxOKM2dnWQBFsMW9KTnPuf-s';
        // let uuuu = 27;
        // let leoname = 'Guihuan';

        // let leoopid = 'oH0MfxEv2CNGMw0RGbY7LD1quUdc';
        // let uuuu = 20;
        // let leoname = 'DuEnBo';


        // homeApi.loginCheck(leoopid, uuuu, leoname, (rs) => {
        homeApi.loginCheck(myopenid, uid, wechatName, (rs) => {
            if (rs && rs.success) {

                console.log("loginCheck rs:", rs);

                const wechatId = rs.obj.id;
                const balance = rs.obj.totalbalance;
                const isVip = rs.obj.isVip;
                // const bindPhone = rs.obj.phone;


                rs.obj.isWeBusiness ? localStorage.setItem("isWebusiness", '1') : localStorage.setItem("isWebusiness", '0');

                if (rs.obj.phone)
                    localStorage.setItem("bindPhone", rs.obj.phone);

                localStorage.setItem("wechatId", wechatId);
                localStorage.setItem("balance", balance);
                localStorage.setItem("isVip", isVip);
            }
        });


        this.requestCarousel();
        uid !== -1 && this.requestMerchantInfo(uid);
        this.requestTags();
        this.requestCategories();


        localStorage.setItem("firstLog", 'true');


        // 为了测试使用
        // if (!localStorage.getItem("wechatId")) {
        //     localStorage.setItem("wechatId", "48");
        //     // localStorage.setItem("uid",'191'); 
        //     // localStorage.setItem("isWebusiness", "1");
        // }


        this.requestCartCount(); //设置初始时购物车的数量

        console.log("localStorage wechatId", localStorage.getItem("wechatId"));
        console.log("localStorage isWebusiness", localStorage.getItem("isWebusiness"));
        console.log("localStorage bindPhone", localStorage.getItem("bindPhone"));
    }


    requestCarousel() {
        homeApi.getCarousel((rs) => {
            if (rs && rs.success) {
                const carousel = rs.obj;

                this.setState({
                    carousel,
                });
            }
        });
    }

    requestMerchantInfo(merchantId) {
        homeApi.getMerchantInfo(merchantId, (rs) => {
            if (!rs.obj.weBusiness.isActive)
                this.setState({modalBack: true});

            if (rs && rs.success) {
                const card = rs.obj;
                this.setState({
                    card
                }, () => {

                    if (this.state.card.weBusiness.openid === localStorage.getItem("openid")) {
                        console.log("isWebusiness设为1");
                        localStorage.setItem("isWebusiness", 1);
                    }

                });
            }

        });
    }

    requestTags() {
        homeApi.getTags((rs) => {
            if (rs && rs.success) {
                const tags = rs.obj;
                this.setState({
                    tags
                });
            }
        });
    }

    requestCategories() {
        homeApi.getCategories((rs) => {
            // this.checkLogin();//延迟重新登录
            if (rs && rs.success) {
                const gridCategory = rs.obj;
                this.setState({
                    gridCategory
                });
            }
        });
    }

    requestCartCount() {
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const count = rs.obj.length;
                localStorage.setItem("cartCount", count);
            }
        });
    }


    render() {

        const category = this.state.gridCategory;
        const categories = category && category.map((item, index) => {
            return <Grid key={index} categoryId={item.id} categoryData={item.name} picUrl={item.iconUrl} type="fruits"/>
        });

        var primaryImages = this.state.carousel;
        if (primaryImages.length == 1) {
            primaryImages[1] = primaryImages[0];
            var content = primaryImages && primaryImages.map((data, index) => {
                if (data.type === "广告") {
                    return <Link to={{pathname: '/home/ad', state: data.link}} key={index}>
                        <img key={index} src={"http://" + getServerIp() + data.img} className="carousel-img"
                             onLoad={() => {
                                 window.dispatchEvent(new Event('resize'));
                             }}/>
                    </Link>
                } else if (data.type === "活动") {
                    return <Link to={{pathname: data.isCheck === 0 ? "/home/sales" : "/home/sales_group", state: data.targetId}} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {
                            window.dispatchEvent(new Event('resize'));
                        }}/>
                    </Link>
                } else {
                    return <Link to={`/product/${data.targetId}`} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {
                            window.dispatchEvent(new Event('resize'));
                        }}/>
                    </Link>
                }
            });
        } else {
            var content = primaryImages && primaryImages.map((data, index) => {
                if (data.type === "广告") {
                    return <Link to={{pathname: '/home/ad', state: data.link}} key={index}>
                        <img key={index} src={"http://" + getServerIp() + data.img} className="carousel-img"
                             onLoad={() => {
                                 window.dispatchEvent(new Event('resize'));
                             }}/>
                    </Link>
                } else if (data.type === "活动") {
                    return <Link to={{pathname: data.isCheck === 0 ? "/home/sales" : "/home/sales_group", state: data.targetId}} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {
                            window.dispatchEvent(new Event('resize'));
                        }}/>
                    </Link>
                } else {
                    return <Link to={`/product/${data.targetId}`} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {
                            window.dispatchEvent(new Event('resize'));
                        }}/>
                    </Link>
                }
            });
        }

        return <Layout header={true} footer={true}>

            <div className="carousel_view">
                <Carousel
                    className="my-carousel"
                    style={{touchAction: 'none'}}
                    autoplay={true}
                    infinite
                    selectedIndex={0}
                    swipeSpeed={35}
                    dots={true}
                >
                    {content}
                </Carousel>
            </div>

            <InfoCard cardData={this.state.card}/>
            <GridCategory gridData={this.state.gridCategory} tagData={this.state.tags}/>

            {categories}

            <WhiteSpace/>
            <Bottom>已经到底啦</Bottom>


            <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
            />
            <Modal
                visible={this.state.modalBack}
                transparent
                maskClosable={false}
                title="提示"
                footer={[{
                    text: '退出', onPress: () => {
                        //WeixinJSBridge.call('closeWindow');
                        wx.closeWindow();
                    }
                }]}
            >
                该微商已失效
            </Modal>
        </Layout>
    }
}

export default LoadingHoc(Home);