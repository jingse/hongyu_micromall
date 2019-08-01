/*管理请求状态的提示*/
import React from "react";


//请求中
export const ReqIngTip = (props) => {
    return <div className="null_product">请求中...</div>
};

//请求失败
export const ReqFailTip = (props) => {
    let content = [];
    if (props.errorMsg) {
        content.push(<div key="errorMsg">
            {props.errorMsg}
        </div>);
    }

    return <div className="null_product">
        请求失败orz
        {content}
    </div>
};

//请求结果为空
export const ReqNullTip = (props) => {
    return <div className="null_product">目前无产品</div>
};