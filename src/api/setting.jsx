import {getServerHost} from '../config.jsx';
import http from '../common/http.jsx';

// 获取系统配置接口
var api = {
    getSystemSetting(propName, callback) {
        http.ajax({
            url: getServerHost() + '/system_settings/detail/view?name=' + propName,
            crossDomain: true,
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
};

export default api;