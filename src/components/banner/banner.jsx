import React from "react";
import {Carousel} from "antd-mobile";
import {getServerIp} from "../../config.jsx";

export const Banner = (props) => {
    return <Carousel
        style={{touchAction: 'none'}}
        autoplay={true}
        infinite
        selectedIndex={0}
        swipeSpeed={35}
        dots={true}
    >
        {props.content}
    </Carousel>
};

export const BannerImg = (props) => {
    return <img src={"http://" + getServerIp() + props.imgPath}
                style={{margin: '0 auto', height: '12rem', width: '100%'}}
                key={props.index}
                alt=""
                onLoad={() => {window.dispatchEvent(new Event('resize'));}} // fire window resize event to change height
    />
};