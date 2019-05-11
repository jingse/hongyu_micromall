/*管理请求状态的提示*/
import React from "react";


//请求中
export const ReqIngTip = (props) => {
    return <div className="null_product">请求中...</div>
};

//请求失败
export const ReqFailTip = (props) => {
    return <div className="null_product">请求失败orz</div>
};

//请求结果为空
export const ReqNullTip = (props) => {
    return <div className="null_product">目前无产品</div>
};