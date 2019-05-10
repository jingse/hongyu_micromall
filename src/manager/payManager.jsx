/*管理微信支付*/


let paySuccessCallback; //成功支付的回调函数
let payCancelCallback;  //取消支付的回调函数
let payFailCallback;    //支付失败的回调函数
let payCallback;        //支付（无论成功失败）后的回调函数


/**
 * 开始支付--这个方法其实是从后台请求微信支付签名。成功继续，失败回调
 * @param payConfig 传微信支付需要的5个参数
 * @param successCallback 成功支付的回调函数
 * @param CancelCallback 取消支付的回调函数
 * @param FailCallback 支付失败的回调函数
 * @param Callback 回调 true or false
 */
function doPay(payConfig, successCallback, CancelCallback, FailCallback, Callback) {
    paySuccessCallback = null;
    payCancelCallback = null;
    payFailCallback = null;
    payCallback = null;

    if (typeof successCallback === "function")
        paySuccessCallback = successCallback;
    if (typeof CancelCallback === "function")
        payCancelCallback = CancelCallback;
    if (typeof FailCallback === "function")
        payFailCallback = FailCallback;
    if (typeof Callback === "function")
        payCallback = Callback;

    callPay(payConfig);
}


// 调起微信支付接口
function callPay(payConfig) {
    if (typeof WeixinJSBridge === "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', callJsApi, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', callJsApi);
            document.attachEvent('onWeixinJSBridgeReady', callJsApi);
        }
    } else {
        callJsApi(payConfig);
    }
}

function callJsApi(payConfig) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": payConfig.appId,             //公众号名称，由商户传入
            "timeStamp": payConfig.timestamp,     //时间戳，自1970年以来的秒数
            "nonceStr": payConfig.nonceStr,       //随机串
            "package": payConfig.package,
            "signType": payConfig.signType,       //微信签名方式：
            "paySign": payConfig.paySign          //微信签名
        },
        function (res) {
            if (res.err_msg === "get_brand_wcpay_request:ok")
                paySuccessCallback();
            else if (res.err_msg === "get_brand_wcpay_request:cancel")
                payCancelCallback();
            else
                payFailCallback();

            payCallback();
         }.bind(this)
    );
}

const PayManager = {
    doPay,
};

export default PayManager;