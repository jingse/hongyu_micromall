import React from "react";
import Layout from "../../../common/layout/layout.jsx";
import {getServerIp} from "../../../config.jsx";

export default class AdDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <Layout>
            <img src={"http://" + getServerIp() + this.props.location.state} style={{width: '100%', height: 'auto'}}
                 onLoad={() => {
                     window.dispatchEvent(new Event('resize'));
                 }}/>
        </Layout>
    }
}