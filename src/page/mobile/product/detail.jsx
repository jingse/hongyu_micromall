import React from 'react';
import { WhiteSpace, WingBlank } from 'antd-mobile';
import Card from "../../../components/card/index.jsx";
import product_data from "../../../static/mockdata/product";
import product_feature_data from "../../../static/mockdata/product_feature";

export default class Product extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            data: {},
        }
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        // 通过API获取首页配置文件数据
        // 模拟ajax异步获取数据
        setTimeout(() => {
            const data = product_data.data;     //mock data
            const featureData = product_feature_data.data;   //mock假数据
            this.setState({
                data,
                featureData,
                isLoading: false
            });
        }, 500);
    }

    render() {
        const proData = this.state.data;

        return <Card>
            <WhiteSpace />
            <WingBlank>
                <div className="specialty_title">特产介绍</div>
            </WingBlank>
            <WhiteSpace />
            <Card>
                <div className="ship_common_info">{proData.ship_common_info}</div>
            </Card>
            {this.props.ImgsData.map((img, key)=>{
                return <img src={img.img_url} key={key} style={{width:'100%'}}/>
            })}

        </Card>
    }
}


