import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';
//llf
var api = {

    getDefaultMerchantAddress(merchantId, callback) {
        httpManager.ajax({
            url: getServerHost() + "/receiver/we_business_address?webusiness_id=" + merchantId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getDefaultUserAddress(wechatId, callback) {
        httpManager.ajax({
            url: getServerHost() + "/receiver/default?wechat_id=" + wechatId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getAddressList(wechatId, callback) {
        httpManager.ajax({
            url: getServerHost() + "/receiver/list?wechat_id=" + wechatId,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    addAddress(address, callback) {
        httpManager.ajax({
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
        httpManager.ajax({
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
        httpManager.ajax({
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