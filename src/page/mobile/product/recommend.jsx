import React from 'react';
import {Link} from 'react-router-dom';
import {Flex, WhiteSpace} from "antd-mobile";
import recommend_data from '../../../static/mockdata/product_recommend.js'
import {getServerIp} from "../../../config.jsx";

export default class Recommend extends React.Component{

    constructor(props,context) {
        super(props,context);
        this.state = {
            data: this.props.recommend,
        };
    }

    getIconImages(images) {
        var img;
        images && images.map((item, index) => {
            if (item.isLogo) {
                img = item;
            }
        });
        return img.sourcePath;
    }


    render() {
        const content = this.state.data && this.state.data.map((item, index) => {
            return <Flex.Item  key={index} className="product_card"
                               style={{marginBottom:'0.4rem', marginTop:'0.4rem', flex:'0 0 47%', marginLeft:'1.5%', marginRight:'1.5%'}}>
                {/* <Link to={`/product/${item.id}`}> */}
                <Link to={{pathname:'/redirect', state: item.id}}>
                {/* <Link to={`/product/94`}> */}
                    <div><img src={"http://" + getServerIp() + this.getIconImages(item.images)} style={{width:'100%'}}/></div>
                    <WhiteSpace/>
                    <div className="product_name">{item.name}</div>
                    <WhiteSpace/>
                    {/*<div className="product_price">￥{item.pPrice}元起</div>*/}
                    {/*<WhiteSpace/>*/}
                </Link>
            </Flex.Item>
        });

        return <div className="recommend">
            <div className="para_title">推荐产品</div>

            <WhiteSpace/>
            <Flex style={{flexWrap:'wrap', backgroundColor:'#eee'}}>
                {content}
            </Flex>
            <WhiteSpace />

        </div>
    }
}
