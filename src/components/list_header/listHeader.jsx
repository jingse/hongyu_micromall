import React from "react";
import {Flex} from "antd-mobile";


export const ListHeader = (props) => {
    return <div style={{borderBottom: '1px solid green', backgroundColor: 'white', color: 'green', fontSize: 'bold'}}>
        <Flex>
            <Flex.Item style={{flex: '0 0 4%', marginRight: '0.4rem'}}>
                <img src='./images/category/菜篮子.png' style={{width: '90%', margin: '0.4rem'}}/>
            </Flex.Item>
            <Flex.Item>{props.listName}</Flex.Item>
        </Flex>
    </div>
};