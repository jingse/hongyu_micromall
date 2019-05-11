import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

var api = {
    getVipRank(wechat_id, callback) {
        httpManager.ajax({
            url: getServerHost() + '/vip/detail/view?id=' + wechat_id,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getPointsChangeRecords(wechat_id, page, rows, callback) {
        httpManager.ajax({
            url: getServerHost() + '/vip/pointrecord/page/view?id=' + wechat_id + "&page=" + page + "&rows=" + rows,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    exchangePoints(wechat_id, changeValue, callback) {
        httpManager.ajax({
            url: getServerHost() + '/vip/point/change?id=' + wechat_id + "&changevalue=" + changeValue,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },


    getSystemSetting(name, callback) {
        httpManager.ajax({
            url: getServerHost() + '/system_settings/detail/view?name=' + name,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
};

export default api;