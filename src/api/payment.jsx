import { getServerHost, wxconfig } from '../config.jsx';
import http from '../common/http.jsx';

var api = {
    postCharge(fee, openid, callback) {
        http.ajax({
            method: 'POST',
            url: 'http://tobyli16.com:8080/pay/wechat/mp/' + Date.parse(new Date()),
            data: {
                body: 'WF电商平台通用客户端',
                total_fee: fee,
                spbill_create_ip: '123.12.12.123',
                notify_url: 'http://tobyli16.com/',
                openid: openid
            },
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //----------------------------------confirm orders api-------------------------------------------

    createOrder(orderItem, callback) {
        http.ajax({
            method: "POST",
            url: getServerHost() + "/order/create",
            type: 'application/json',
            data: JSON.stringify(orderItem),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    confirmOrder(orderCode, fee, openid, callback) {
        console.log('total_fee',fee,orderCode,openid)
        http.ajax({
            method: 'POST',
            // url: '//admin.swczyc.com/hyapi' + '/pay/wechat/mp/' + orderCode,
            url: wxconfig.adminURL + '/pay/wechat/mp/' + orderCode,
            type: 'application/json',
            data: JSON.stringify({
                "body": "土特产微商城",
                "total_fee": fee.toString(),
                // "spbill_create_ip": '123.12.12.123',
                // "notify_url": "http://admin.swczyc.com/hyapi/ymmall/order/pay/wechat/notify/" + orderCode,
                "notify_url": wxconfig.adminURLHttp+"hyapi/ymmall/order/pay/wechat/notify/" + orderCode,
                "openid": openid
            }),
            success: (rs) => {
                console.log('confirmOrder_rs',rs)
                callback && callback(rs);
            }
        });
    },

    // successfulPaymentCallback(orderCode, callback) {
    //     http.ajax({
    //         method: "POST",
    //         url: getServerHost() + '/order/pay/wechat/notify/' + orderCode,
    //         // type:"application/json",
    //         crossDomain:true,
    //         success: (rs) => {
    //             callback && callback(rs);
    //         }
    //     });
    // }

    //-----------------------------------hdr api--------------------------------------------
    // postOrder(fee, openid, callback) {
    //     http.ajax({
    //         method: 'POST',
    //         url: getServerHost() + '/pay/wechat/mp/' + Date.parse(new Date()),
    //         data: {
    //             orderPhone: 11111111111,
    //             orderWechatId: 1,
    //             webusinessId: 1,
    //             totalMoney: 1,
    //             promotionAmount: 0,
    //             shipFee: 0,
    //             shouldPayMoney: 1,
    //             couponMoney: 0,
    //             balanceMoney: 0,
    //             payMoney: 0,
    //             receiverRmark: '',
    //             receiverName: '',
    //             receiverAddress: '',
    //             receiverPhone: '',
    //             receiverType: 0,
    //             orderItems: {
    //                 specialtyId: 1,
    //                 specialtySpecificationId: 1,
    //                 purchaseItemId: 1,
    //                 quantity: 1,
    //                 curPrice: 1,
    //                 isGroupPromotion: 0
    //             },
    //             coupons: {}
    //         },
    //         success: (rs) => {
    //             callback && callback(rs);
    //         }
    //     });
    // },

    // postCharge(fee, openid, callback) {
    //     http.ajax({
    //         method: 'POST',
    //         url: getServerHost() + '/pay/wechat/mp/' + Date.parse(new Date()),
    //         data: {
    //             body: 'WF电商平台通用客户端',
    //             total_fee: fee,
    //             spbill_create_ip: '123.12.12.123',
    //             notify_url: 'http://tobyli16.com/',
    //             openid: openid
    //         },
    //         success: (rs) => {
    //             callback && callback(rs);
    //         }
    //     });
    // },
};

export default api;
