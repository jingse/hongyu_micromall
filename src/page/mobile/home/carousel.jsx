import React from 'react';
import {Link} from 'react-router-dom';
import {Carousel} from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";

export default class MyCarousel extends React.Component {
    constructor(props,context) {
        super(props,context);
    }


    checkPromotion(isCheck) {
        if (isCheck === 0) {
            return "/home/sales"
        } else if (isCheck === 1) {
            return "/home/sales_group"
        } else {
            return null
        }
    }

    render(){

        var content = null;
        if (!this.props.carouselData || JSON.stringify(this.props.carouselData) === "{}") {
            return null;
        } else {
            content = this.props.carouselData.map((data, index) => {
                if (data.type === "广告") {
                    return <Link to={{pathname:'/home/ad', state: data.link}} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
                    </Link>
                } else if (data.type === "活动") {
                    return <Link to={{pathname: this.checkPromotion(data.isCheck), state: data.targetId}} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
                    </Link>
                } else {
                    return <Link to={`/product/${data.targetId}`} key={index}>
                        <img src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
                    </Link>
                }
            });
        }
        
        return <div className="carousel_view">
            <Carousel className="my-carousel"
                // style={{ touchAction:'none' }}
                autoplay
                infinite
                selectedIndex={0}
                swipeSpeed={12}
            >
                {content}
            </Carousel>
        </div>
    }
}
