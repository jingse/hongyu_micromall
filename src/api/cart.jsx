import {getServerHost} from '../config.jsx';
import http from '../common/http.jsx';

var api = {

    //----------------------------------add to cart api-------------------------------------------
    addSingleItemToCart(id, specificationId, specialtyId, isGroupPromotion, quantity, callback) {
        http.ajax({
            method: "POST",
            url: getServerHost() + '/shopping_cart/add_items?wechat_id=' + id + "&specialtySpecificationId=" + specificationId
            + "&specialtyId=" + specialtyId + "&isGroupPromotion=" + isGroupPromotion + "&quantity=" + quantity,
            dataType:"json",
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    //----------------------------------cart page api-------------------------------------------

    //params: wechat_id
    getCartItemsList(id, callback) {
        http.ajax({
            url: getServerHost() + "/shopping_cart/get_items?wechat_id=" + id,
            // data: {
            //     wechat_id: 8,
            // },
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    editItemsCountInCart(id, quantity, callback) {
        http.ajax({
            url: getServerHost() + "/shopping_cart/edit_items?id=" + id + "&quantity=" + quantity,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    deleteItemsInCart(id, callback) {
        http.ajax({
            url: getServerHost() + "/shopping_cart/delete_items?id=" + id,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTotalPriceInCart(items, callback) {
        http.ajax({
            method: 'POST',
            url: getServerHost() + "/shopping_cart/total_price",
            type: 'application/json',
            data: JSON.stringify(items),
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

};

export default api;
