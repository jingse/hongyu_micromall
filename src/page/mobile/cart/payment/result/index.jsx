import React from "react";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import { Result, WhiteSpace } from "antd-mobile";
import "./index.less";

export default class PayResult extends React.Component {
    constructor(context, props) {
        super(context, props);
    }

    componentWillMount() {

    }

    render() {
        const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;

        return <Layout header={false} footer={false}>

            <Navigation title="支付结果" left={true}/>
            <WhiteSpace/>

            <Result
                img = {myImg('./images/icons/微信支付.png')}
                title = "支付成功"
                message = {
                    <div>
                        {this.props.location.finalPrice}元
                        <div>
                            <del>{this.props.location.originalPrice}元</del>
                        </div>

                    </div>
                }
            />

        </Layout>
    }
}