import {getServerHost} from '../config.jsx';
import http from '../common/http.jsx';

var api = {
    //----------------------------------product detail api-------------------------------------------

    getSpecialtySpecificationDetailBySpecialtyID(id, callback) {
        http.ajax({
            url: getServerHost() + '/product/specification_detail_by_specialty_id?id=' + id,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getSpecialtySpecificationDetailBySpecificationID(id, callback) {
        http.ajax({
            url: getServerHost() + '/product/specification_detail_by_specification_id?id=' + id,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);//如果存在回调函数就执行
            }
        });
    },

    getSpecialtyCommentDetail(id, page, rows, callback) {
        http.ajax({
            url: getServerHost() + '/product/appraisedetail?id=' + id + "&page=" + page + "&rows=" + rows,
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getServicePromise(callback) {
        http.ajax({
            url: getServerHost() + '/system_settings/service_promise/detail/view',
            crossDomain:true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
    // pushcom(formData,callback) {

    //     http.ajax({
    //         url: "http://admin.swczyc.com/hyapi/resource/image/upload",
    //         method: 'POST',
    //         date:formData,
            
    //         // processData: false,  
    //         contentType: false,
    //         // cache: false,
    //         // crossDomain:true,
    //         success: (rs) => {
    //             callback && callback(rs);
    //         },
    //         error:(res)=>{ 
    //             console.log('error',res)
    //         }
    //     });
    // },

};

export default api;