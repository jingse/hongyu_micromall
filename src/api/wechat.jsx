import {wxconfig} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

var api = {
    postJsApiData(url, callback) {
        httpManager.ajax({
            method: 'POST',
            //url: 'http://ymymmall.lvxingbox.cn/auth',
            url: wxconfig.hostURL + 'auth',
            withCredentials: false,
            data: {
                url: url
            },
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
};

export default api;