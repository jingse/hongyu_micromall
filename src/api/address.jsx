import {getServerHost} from '../config.jsx';
import http from '../common/http.jsx';
//llf
var api = {

    getDefaultMerchantAddress(merchantId, callback) {
        http.ajax({
            url: getServerHost() + "/receiver/we_business_address?webusiness_id=" + merchantId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getDefaultUserAddress(wechatId, callback) {
        http.ajax({
            url: getServerHost() + "/receiver/default?wechat_id=" + wechatId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getAddressList(wechatId, callback) {
        http.ajax({
            url: getServerHost() + "/receiver/list?wechat_id=" + wechatId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    addAddress(address, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + "/receiver/add",
            type: 'application/json',
            data: JSON.stringify(address),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    editAddress(address, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + "/receiver/edit",
            type: 'application/json',
            data: JSON.stringify(address),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    deleteAddress(addressId, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + "/receiver/delete?id=" + addressId,
            // type: 'application/json',
            data: {},
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

};

export default api;