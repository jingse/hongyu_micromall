import locManager from "./LockManager.jsx";
import {wxconfig} from "../config.jsx";
import wxApi from "../api/wechat.jsx";

const host = wxconfig.hostURL;


function share() {
    let shareData = {//自定义分享数据
        title: '土特产微商城',
        desc: '来自' + locManager.getMyNickname() + '的分享',
        link: host + locManager.generateSaleLink()
    };

    wx.ready(function () {
        wx.checkJsApi({
            jsApiList: ["chooseWXPay", "onMenuShareTimeline", "onMenuShareAppMessage"],
            success: function (res) {
                console.log(res)
            }
        });
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
    });

    wx.error(function (res) {
        console.log('wx.error');
        console.log(res);
    });
}


function auth() {
    const url = encodeURIComponent(window.location.href.split('#')[0]);

    wxApi.postJsApiData(url, (rs) => {
        const data = rs.result;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: ["chooseWXPay", "onMenuShareTimeline", "onMenuShareAppMessage"]
        });
    });
}


const WxManager = {
    share,
    auth,
};

export default WxManager;