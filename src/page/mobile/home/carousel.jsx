import React from 'react';
import {Link} from 'react-router-dom';
import {Carousel} from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";

export default class MyCarousel extends React.Component {
    constructor(props,context) {
        super(props,context);
    }

    componentDidMount() {

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

        // if (this.props.carouselData && this.props.carouselData.data) {
        //     var content = this.props.carouselData.data.map((data, index) => {
        //         return <Link to={data.url} key={index}>
        //             <img src={data.img_url} className="carousel-img" onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
        //         </Link>
        //         // return <img src={data.img_url} className="carousel-img" key={index} onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
        //     });
        // }

        // console.log("this.state.carousel: ", this.props.carouselData);

        var content = null;
        if (!this.props.carouselData || JSON.stringify(this.props.carouselData) === "{}") {
            return null;
        } else {
            content = this.props.carouselData.map((data, index) => {
                if (data.type === "广告") {
                    return <img key={index} src={"http://" + getServerIp() + data.img} className="carousel-img" onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
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
            {/*
            <WhiteSpace size='xl' />
            */}
        </div>
    }
}
