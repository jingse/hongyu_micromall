// 首页推荐产品、普通产品的card
import React from "react";
import {Flex, WhiteSpace} from "antd-mobile";
import {Link} from "react-router-dom";
import {getServerIp} from "../../config.jsx";


const flexStyle = {
    backgroundColor: 'white',
    marginBottom: '0.1rem',
    flex: '0 0 30%',
    marginLeft: '1.5%',
    marginRight: '1.5%'
};

const imgStyle = {width: '6rem', height: '6rem'};

export const ProductCard = (props) => {
    return (
        <Flex.Item className="product_card" style={flexStyle}>
            <Link to={props.targetLink}>
                <div><img src={"http://" + getServerIp() + props.cardProductImgUrl} style={imgStyle} alt=""/></div>
                <WhiteSpace/>
                <div className="product_name">{props.cardProductName}</div>
                <WhiteSpace/>
                <div className="product_amount">{props.cardProductHasSold}人付款</div>
                <WhiteSpace/>
                <div className="product_price">￥{props.cardProductPlatformPrice}元起</div>
                <WhiteSpace size='xs'/>
            </Link>
        </Flex.Item>
    )
};

//首页普通优惠、组合优惠的card
export const PromotionCard = (props) => {
    return (
        <Flex.Item className="product_card" style={flexStyle}>
            <Link to={props.targetLink}>
                <div><img src={"http://" + getServerIp() + props.cardPromotionImgUrl} style={imgStyle}/></div>
                <WhiteSpace/>
                <div className="product_name">{props.cardPromotionName}</div>
                <WhiteSpace/>
                <div className="myzhekou_amount">{props.cardPromotionRule}</div>
                <WhiteSpace/>
                <div className="myzhekou_amount">{props.cardPromotionHasSold}人付款</div>
                <WhiteSpace/>
                <div className="myzhekou_amount"><font color="red">￥{props.cardPromotionPlatformPrice}起</font></div>
                {/* <div className="product_price">￥{item.pPrice}元起</div>
                    <WhiteSpace size='xs'/> */}
            </Link>
        </Flex.Item>
    )
};