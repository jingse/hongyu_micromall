import React from "react";
import {WingBlank, WhiteSpace} from "antd-mobile";

/*产品详情页、优惠活动详情页的一些公用组件*/

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

export const SalesInfo = (props) => {
    return <WingBlank>
        <h3>{props.name}</h3>
        <h4>
            <font color="red">优惠时间：</font>
            {props.salePeriod}
        </h4>
        <h4>
            <div style={{marginBottom: 5}}>
                <span style={{color: 'red'}}>优惠类型：</span>
                {props.saleType}
            </div>
        </h4>
        <h4>
            <font color="red">活动价格：</font>
            {props.activityPrice}
        </h4>
        <h4>
            <font color="red">已售数量：</font>
            {props.sellNum}
        </h4>
        <h4>
            <font color="red">限购数量：</font>
            {props.limitNum}
        </h4>
        <h4>
            <font color="red">活动库存：</font>
            {props.activityInbound}
        </h4>
        <h4>
            {(localStorage.getItem('isWebusiness') === '1') ?
                <div style={{marginBottom: 10}}>提成金额：
                    {(parseFloat(props.divideMoney).toFixed(2) > 0 ? parseFloat(props.divideMoney).toFixed(2) : 0)}
                </div> : <div/>}
        </h4>

        <WhiteSpace size="xs"/>

    </WingBlank>
};