import { wxconfig } from '../config.jsx';
import http from '../common/http.jsx';

var api = {
    postJsApiData(url, callback) {
        http.ajax({
            method: 'POST',
            //url: 'http://ymymmall.lvxingbox.cn/auth',
            url: wxconfig.hostURL+'auth',
            withCredentials:false,
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