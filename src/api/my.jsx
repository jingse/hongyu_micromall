import {getServerHost} from '../config.jsx';
import http from '../common/http.jsx';

var api = {
    /**
     * [my center info]
     */
    getInfo(wechat_id, callback) {
        http.ajax({
            url: getServerHost() + '/usermanagement/info?wechat_id=' + wechat_id,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    validatePhone(phone, callback) {
        let formdata = new FormData();
        formdata.append("phone", phone);

        http.ajax({
            method: "POST",
            url: getServerHost() + '/usermanagement/validate_phone',
            crossDomain:true,
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    bindPhoneOrTel(wechat_id, phone, code, callback) {
        let formdata = new FormData();
        formdata.append("wechat_id", wechat_id);
        formdata.append("phone", phone);
        formdata.append("code", code);

        http.ajax({
            method: "POST",
            // url: 'http://admin.swczyc.com/hyapi/business/usermanagement/bind_phone',
            url: getServerHost() + '/usermanagement/bind_phone',
            crossDomain:true,
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    vipAddressView(wechat_id, callback) {
        http.ajax({
            url: getServerHost() + '/receiver/vipAddress/view?wechat_id=' + wechat_id,
            // dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    vipBirthdayAdd(wechat_id,birthday, callback) {
        http.ajax({
            url: getServerHost() + '/receiver/birthday/add?wechat_id=' + wechat_id+'&birthday='+birthday,
            // dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    vipAddressAdd(wechat_id, receiverName,receiverMobile,receiverAddress, callback) {
        http.ajax({
            url: getServerHost() + '/receiver/vipAddress/add?wechat_id=' + wechat_id+'&receiverName='+receiverName+'&receiverMobile='+receiverMobile+'&receiverAddress='+receiverAddress,
            // dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    vipAddressEdit(wechat_id, id,receiverName,receiverMobile,receiverAddress, callback) {
        http.ajax({
            url: getServerHost() + '/receiver/vipAddress/edit?wechat_id=' + wechat_id+'&id='+id+'&receiverName='+receiverName+'&receiverMobile='+receiverMobile+'&receiverAddress='+receiverAddress,
            // dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    /**
     * [webusiness part]
     */
    webusinessLogoEdit(weBusinessId,logoUrl,callback){
        http.ajax({
            // url: '//10.108.164.11:8080/hongyu/ymmall'+'/webusiness/logo/edit?weBusinessId=' + weBusinessId + '&logoUrl='+logoUrl,
            url: getServerHost()+'/webusiness/logo/edit?weBusinessId=' + weBusinessId + '&logoUrl='+logoUrl,
            method: "POST",
            // crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    webusinessShopNameEdit(weBusinessId,shopName,callback){
        http.ajax({
            // url: '//10.108.164.11:8080/hongyu/ymmall'+'/webusiness/shopName/edit?weBusinessId=' + weBusinessId + '&shopName='+shopName,
            url: getServerHost()+'/webusiness/shopName/edit?weBusinessId=' + weBusinessId + '&shopName='+shopName,
            method: "POST",
            // crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },



    getTotalDivide(webusiness_id, callback) {
        http.ajax({
            url: getServerHost() + '/webusiness/total_divide?webusiness_id=' + webusiness_id + '&page=1&rows=10',
            // dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getDailyDivide(webusiness_id, callback) {
        http.ajax({
            url: getServerHost() + '/webusiness/daily_divide?webusiness_id=' + webusiness_id + '&page=1&rows=10',
            // dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTotalDivideList(webusiness_id, callback) {
        http.ajax({
            url: getServerHost() + '/webusiness/total_divide_list?webusiness_id=' + webusiness_id,
            // url: '//localhost/hyapi/ymmall' + '/webusiness/total_divide_list?webusiness_id='+webusiness_id,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getDailyDivideList(webusiness_id, callback) {
        http.ajax({
            url: getServerHost() + '/webusiness/daily_divide_list?webusiness_id=' + webusiness_id,
            // url: '//localhost/hyapi/ymmall' + '/webusiness/total_divide_list?webusiness_id='+webusiness_id,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getUnfilledOrders(webusiness_id, callback) {
        http.ajax({
            url: getServerHost() + '/webusiness/unfilled_orders?webusiness_id=' + webusiness_id,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },



    /**
     * [order part]
     */
    getAllOrderListByAccount(wechat_id, page, rows, callback) {
        http.ajax({
            url: getServerHost() + '/order/list_by_account?wechat_id=' + wechat_id + "&page=" + page + "&rows=" + rows,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderListByAccount(wechat_id, status, page, rows, callback) {
        http.ajax({
            url: getServerHost() + '/order/list_by_account?wechat_id=' + wechat_id + "&status=" + status + "&page=" + page + "&rows=" + rows,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getOrderDetailById(orderid, callback) {
        http.ajax({
            url: getServerHost() + '/order/detail?orderid=' + orderid,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderDetailByCode(ordercode, callback) {
        http.ajax({
            url: getServerHost() + '/order/detail?ordercode=' + ordercode,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrderRefund(orderid, callback) {
        http.ajax({
            url: getServerHost() + '/order/refund_detail?orderid=' + orderid,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    applyRefund(refund_info, callback) {
        http.ajax({
            method: "POST",
            url: getServerHost() + '/order/apply_refund',
            type:"application/json",
            crossDomain:true,
            data: JSON.stringify(refund_info),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    applyAppraise(appraise_info, callback) {
        http.ajax({
            method: "POST",
            // url: '//localhost/hyapi/ymmall' + '/order/appraise/create',
            url: getServerHost() + '/order/appraise/create',
            type: "application/json",
            crossDomain:true,
            data: JSON.stringify(appraise_info),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    applyAppraises(appraise_info, callback) {
        http.ajax({
            method: "POST",
            // url: '//localhost/hyapi/ymmall' + '/order/appraise/create',
            url: getServerHost() + '/order/appraises/create',
            type: "application/json",
            crossDomain:true,
            data: JSON.stringify(appraise_info),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    cancelOrder(orderId, callback) {
        http.ajax({
            url: getServerHost() + '/order/cancel?order_id=' + orderId,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    confirmReceive(orderId, callback) {
        http.ajax({
            url: getServerHost() + '/order/confirm_receive?order_id=' + orderId,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    deleteOrder(orderId, callback) {
        http.ajax({
            url: getServerHost() + '/order/delete?id=' + orderId,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


};

export default api;