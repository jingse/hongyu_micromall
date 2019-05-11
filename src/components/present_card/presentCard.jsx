/*赠品的卡片*/
import React from "react";
import {Flex, WhiteSpace} from "antd-mobile";
import {getServerIp} from "../../config.jsx";

export const PresentCard = (props) => {
    return <Flex style={{background: '#fff'}}>
        <Flex.Item style={{flex: '0 0 30%'}}>
            <img
                src={"http://" + getServerIp() + props.presentImgUrl}
                style={{width: '70%', height: '4rem', margin: '0.4rem'}}/>
        </Flex.Item>

        <Flex.Item style={{flex: '0 0 60%', color: 'black'}}>
            <WhiteSpace/>
            <div style={{marginBottom: 10, fontWeight: 'bold'}}>
                {props.presentName}
                {props.isPresent ? <span style={{color: 'darkorange', fontWeight: 'bold'}}> (赠)</span> : ""}
            </div>

            <div style={{marginBottom: 10}}>{props.column1}<span
                style={{color: 'red'}}>{props.presentNum}</span></div>
            <div style={{marginBottom: 10}}>{props.column2}<span
                style={{color: 'red'}}>{props.presentSpecification}</span></div>
            {/*<div>销量：<span style={{color:'red'}}>{item.specificationId.hasSold}</span></div>*/}

            <WhiteSpace/>
        </Flex.Item>

    </Flex>
};