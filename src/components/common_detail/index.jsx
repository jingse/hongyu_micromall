import React from "react";
import {WingBlank} from "antd-mobile";

export const Introduction = (props) => {
    return <WingBlank>
        <div className="para_title">{props.title}</div>
        <div dangerouslySetInnerHTML={{__html: props.content}}/>
    </WingBlank>
};

export const ServicePromise = (props) => {
    return <WingBlank>
        <div className="para_title">服务承诺</div>
        <div className="paragraph">{props.content}</div>
    </WingBlank>
};

export const WarmPrompt = (props) => {
    return <WingBlank>
        <div className="para_title">温馨提示</div>
        <div className="paragraph">{props.content}</div>
    </WingBlank>
};