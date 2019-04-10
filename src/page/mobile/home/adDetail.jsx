import React from "react";
import Layout from "../../../common/layout/layout.jsx";
import {getServerIp} from "../../../config.jsx";

export default class AdDetail extends React.Component{

    constructor(props, context) {
        super(props, context);
        this.state={

        };
    }

    render() {
        return <Layout>
            <img src={"http://" + getServerIp() + this.props.location.state} className="carousel-img" onLoad={() => {window.dispatchEvent(new Event('resize'));}}/>
        </Layout>
    }
}