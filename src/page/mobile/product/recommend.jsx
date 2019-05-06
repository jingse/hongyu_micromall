import React from 'react';
import {Link} from 'react-router-dom';
import {Flex, WhiteSpace, WingBlank} from "antd-mobile";
import {getServerIp} from "../../../config.jsx";
import Card from "../../../components/card/index.jsx";

export default class Recommend extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            data: this.props.recommend,
        };
    }

    getIconImages(images) {
        let img = {};
        images && images.map((item, index) => {
            if (item.isLogo) {
                img = item;
            }
        });
        return img.sourcePath;
    }

    checkRecommendNull(content) {
        console.log("content:", content);
        if (content.length == 0)
            return null;
        return <Card className="general_container">
            <WingBlank>
                <WhiteSpace/>

                <div className="recommend">

                    <div className="para_title">推荐产品</div>

                    <WhiteSpace/>
                    <Flex style={{flexWrap: 'wrap', backgroundColor: '#eee'}}>
                        {content}
                    </Flex>
                    <WhiteSpace/>

                </div>

            </WingBlank>
        </Card>


    }


    render() {
        const content = this.state.data && this.state.data.map((item, index) => {
            return <Flex.Item key={index} className="product_card"
                              style={{
                                  marginBottom: '0.4rem',
                                  marginTop: '0.4rem',
                                  flex: '0 0 47%',
                                  marginLeft: '1.5%',
                                  marginRight: '1.5%'
                              }}>
                {/* <Link to={`/product/${item.id}`}> */}
                <Link to={{pathname: '/redirect', state: item.id}}>
                    <div><img src={"http://" + getServerIp() + this.getIconImages(item.images)}
                              style={{width: '100%'}}/></div>
                    <WhiteSpace/>
                    <div className="product_name">{item.name}</div>
                    <WhiteSpace/>
                    {/*<div className="product_price">￥{item.pPrice}元起</div>*/}
                </Link>
            </Flex.Item>
        });

        return this.checkRecommendNull(content)
    }
}
