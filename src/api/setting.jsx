import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

// 获取系统配置接口
var api = {
    getSystemSetting(propName, callback) {
        httpManager.ajax({
            url: getServerHost() + '/system_settings/detail/view?name=' + propName,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },

    getServicePromise(callback) {
        httpManager.ajax({
            url: getServerHost() + '/system_settings/service_promise/detail/view',
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
};

export default api;