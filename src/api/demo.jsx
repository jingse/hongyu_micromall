import {getServerHost} from '../config.jsx';
import httpManager from '../manager/HttpManager.jsx';

var api = {
    getPermissionList(type, callback) {
        httpManager.fetch({
            url: getServerHost() + '/api/permissionlist',
            data: {
                type: type
            },
            success: (rs) => {
                callback && callback(rs);
            }
        });
    },
};

export default api;
