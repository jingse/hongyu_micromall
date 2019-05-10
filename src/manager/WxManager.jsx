import locManager from "./LockManager.jsx";
import {wxconfig} from "../config.jsx";
import wxApi from "../api/wechat.jsx";

const host = wxconfig.hostURL;


function share() {
    let shareData = {//自定义分享数据
        title: '土特产微商城',   // 分享标题
        desc: '来自' + locManager.getMyNickname() + '的分享', //这是分享给朋友描述
        link: host + locManager.getUId(), //分享链接
        imgUrl: './images/zz_help_smile.png', // 分享图标
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

//关闭微信页面
function wxClosePage(curPage) {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', closeOperation, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', closeOperation);
            document.attachEvent('onWeixinJSBridgeReady', closeOperation);
        }
    } else {
        closeOperation(curPage);
    }
}

//关闭微商城的操作
function closeOperation(curPage) {
    if (curPage === "/cart/payment")
        alert("确认要离开吗？");

    alert("确认要离开吗？");
    WeixinJSBridge.call('closeWindow');
    localStorage.clear();
}


const WxManager = {
    share,
    auth,
    wxClosePage,
};

export default WxManager;