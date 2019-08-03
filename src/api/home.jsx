import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';


// let myOrigin = "10.8.219.22";

var api = {
    //----------------------------------login api-------------------------------------------

    postOpenId(uid, nickname, openid, callback) {
        let formdata = new FormData();
        formdata.append("uid", uid);
        formdata.append("wechatName", nickname);
        formdata.append("openId", openid);

        httpManager.ajax({
            method: 'POST',
            url: getServerHost() + '/api/postOpenId',
            // data: {
            //     uid: uid,
            //     wechatName: nickname,
            //     openId: openid
            // },
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    createAccount(nickname, openid, callback) {
        let formdata = new FormData();
        formdata.append("wechatName", nickname);
        formdata.append("openId", openid);

        httpManager.ajax({
            method: 'POST',
            url: getServerHost() + '/api/createAccount',
            // data: JSON.stringify({
            //     'wechatName': nickname,
            //     'openId': openid
            // }),
            // data: {
            //     wechatName: nickname,
            //     openId: openid
            // },
            data: formdata,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    loginCheck(wechatId, webusinessId, wechatName, callback) {
        httpManager.ajax({
            method: 'POST',
            url: getServerHost() + '/login/submit?wechat_openid=' + wechatId + "&webusiness_id=" + webusinessId + "&wechat_name=" + wechatName,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getmoren(callback) {
        httpManager.ajax({
            method: 'get',
            url: "http://admin.lvxingbox.cn/hyapi/ymmall/system_settings/detail/view?name=门户微商ID",
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    //----------------------------------homepage api-------------------------------------------

    getCarousel(callback) {
        httpManager.ajax({
            url: getServerHost() + '/banner/listad',
            // origin: myOrigin,
            dataType: "json",
            // crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getMerchantInfo(merchantId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/webusiness/detail/?id=' + merchantId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTags(callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/labels/list/view',
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getCategories(callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/category/super_categories',
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTopNOFCoupon(size, callback) {
        httpManager.ajax({
            url: getServerHost() + '/promotion/normal/sub_list?size=' + size,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTopNOFGroupCoupon(size, callback) {
        httpManager.ajax({
            url: getServerHost() + '/promotion/group/sub_list?size=' + size,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTopNOFRecommend(size, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/sub_list_for_recommend?size=' + size,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTopNOfTags(TagId, size, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/sub_list_by_label_id?id=' + TagId + '&size=' + size,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getTopNOfCategory(categoryId, size, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/sub_list_by_category_id?category_id=' + categoryId + '&size=' + size,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //-----------------------------------category list api--------------------------------------------

    getTagList(unused1, id, page, rows, condition, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/label_specialtys/page/view?id=' + id + "&page=" + page +
                "&rows=" + rows + "&condition=" + condition,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getCategoryList(unused1, categoryId, page, rows, condition, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/pages_by_category_id?category_id=' + categoryId + "&page=" + page +
                "&rows=" + rows + "&condition=" + condition,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getRecommendList(unused1, unused2, page, rows, condition, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/recommend_product_pages?condition=' + condition + "&page=" + page +
                "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //----------------------------------homepage search api-------------------------------------------

    getSpecialtyListSearching(type, input, page, rows, condition, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/search?' + type + "=" + input + "&page=" + page + "&rows=" + rows + "&condition=" + condition,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //----------------------------------ordinary preferential api-------------------------------------------

    getOrdinaryPromotionList(page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/promotion/normal/list?page=' + page + '&rows=' + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getOrdinaryPromotionDetail(promotionId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/promotion/normal/detail?id=' + promotionId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //----------------------------------group preferential api-------------------------------------------

    getGroupPromotionList(page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/promotion/group/list?page=' + page + '&rows=' + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getGroupPromotionDetail(promotionId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/promotion/group/detail?id=' + promotionId,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    //----------------------------------coupon list api-------------------------------------------
    getCouponList(wechatId, callback) {
        httpManager.ajax({
            // url: getServerHost() + '/business/coupon/once_used_coupon/receive_list?wechat_id=' + wechatId,
            url: getServerHost() + '/coupon/once_used_coupon/receive_list?wechat_id=' + wechatId,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getCoupon(couponId, wechatId, callback) {
        httpManager.ajax({
            url: getServerHost() + '/coupon/once_used_coupon/create_coupon?wechat_id=' + wechatId + "&couponMoneyId=" + couponId,
            // dataType:"json",
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    //----------------------------------coupon recharge api-------------------------------------------
    getSaleCouponList(callback) {
        httpManager.ajax({
            url: getServerHost() + '/coupon/balance_used_coupon/sale_list',
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getRedictUid(oid, cid, callback) {
        console.log("redirect!", getServerHost());
        httpManager.ajax({
            url: getServerHost() + '/webusiness/get_id_by_oid?oid=' + oid + '&cid=' + cid,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
};

export default api;
