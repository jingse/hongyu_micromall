import React from "react";
import {Link} from "react-router-dom";
import {getServerIp} from "../../config.jsx";


export const FixedHeader = (props) => {
    return <Link to={props.targetUrl}>
        <img src={props.imgPath} height={props.isAuto ? 'auto' : '120'} width='100%' alt=""/>
    </Link>
};

export const CateHeader = (props) => {
    return <Link to={props.targetUrl}>
        <img src={"http://" + getServerIp() + props.imgPath} height='120' width='100%' alt=""/>
    </Link>
};

