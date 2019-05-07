import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

var api = {
    //----------------------------------product detail api-------------------------------------------

    getSpecialtySpecificationDetailBySpecialtyID(id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/specification_detail_by_specialty_id?id=' + id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getSpecialtySpecificationDetailBySpecificationID(id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/specification_detail_by_specification_id?id=' + id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);//如果存在回调函数就执行
            }
        });
    },

    getSpecialtyCommentDetail(id, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/product/appraisedetail?id=' + id + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

};

export default api;