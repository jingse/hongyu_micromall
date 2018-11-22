import { getServerHost, wxconfig } from '../config.jsx';
import http from '../common/http.jsx';

var api = {

    //--------------------------coupon Buy  ->home page----------------------------
    submitCouponOrder(wechatId, phone, confirmCode, couponMoneyId, amount, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/sale/purchase?wechat_id=' + wechatId + "&couponMoneyId=" +
            couponMoneyId + "&amount=" + amount + "&phone=" + phone + "&confirmCode=" + confirmCode,
            // url: "//10.108.164.5:8080/hongyu/ymmall" + '/coupon/sale/purchase?wechat_id=' + wechatId + "&couponMoneyId=" + couponMoneyId + "&amount=" + amount,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    confirmCouponPayment(orderId, fee, openId, callback) {
        console.log('total_fee confirmCouponPayment',fee,orderId,openId)
        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/mp/' + orderId,
            // url: "//10.108.164.5:8080/hongyu/ymmall" + '/coupon/mp/' + orderId,
            type: 'application/json',
            data: JSON.stringify({
                "body": "土特产微商城",
                "total_fee": fee.toString(),
                // "spbill_create_ip": '123.12.12.123',
                // "notify_url": "http://admin.swczyc.com/hyapi/ymmall/order/pay/wechat/notify/" + orderId,
                "notify_url": wxconfig.adminURLHttp+"hyapi/ymmall/order/pay/wechat/notify/" + orderId,
                "openid": openId
            }),
            success: (rs) => {
                console.log("confirmCouponPayment_rs: ", rs);
                callback && callback(rs);
            }
        });
    },

    getCouponCode(phone, callback) {
        let formdata = new FormData();
        formdata.append("receiverPhone", phone);

        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/sale/confirmcode',
            // url: "//10.108.164.5:8080/hongyu/ymmall" + '/coupon/mp/' + orderId,
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    successfulCouponPayment(orderId, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/couponSale/notify/' + orderId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //--------------------------balance  ->my page----------------------------

    getBalance(wechatId, phone, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/balance_used_coupon/total?wechat_id=' + wechatId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getBalanceRecords(wechatId, page, rows, callback) {
        let formdata = new FormData();
        formdata.append("wechat_id", wechatId);
        formdata.append("page", page);
        formdata.append("rows", rows);

        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/balance_used_coupon/use_history',
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getBalancePurchase(wechatId, callback) {
        let formdata = new FormData();
        formdata.append("wechat_id", wechatId);

        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/orderlist',
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //--------------------------disposable coupon  ->my page----------------------------

    getDisposableCoupons(wechatId, callback) {
        http.ajax({
            url: getServerHost() + '/coupon/once_used_coupon/list?wechat_id=' + wechatId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //--------------------------bind coupon namely coupon recharge  ->my page----------------------------
    bindCoupon(wechatId, activationCode, callback) {
        let formdata = new FormData();
        formdata.append("wechat_id", wechatId);
        formdata.append("activation_code", activationCode);

        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/balance_used_coupon/bind',
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //--------------------------get available coupon  ->payment page----------------------------
    getAvailableCoupon(wechatId, price, callback) {
        let formdata = new FormData();
        formdata.append("wechat_id", wechatId);
        formdata.append("price", price);

        http.ajax({
            method: 'POST',
            url: getServerHost() + '/coupon/availableCoupon',
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

};

export default api;