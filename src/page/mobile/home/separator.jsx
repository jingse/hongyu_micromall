import React from 'react';
import {Flex, WhiteSpace} from 'antd-mobile';
import {Link} from 'react-router-dom';
import Card from "../../../components/card/index.jsx";
import {getServerIp} from "../../../config.jsx";

export default class Separator extends React.Component {
    constructor(props, context) {
        super(props, context);
    }


    render() {
        const {separatorData, categoryData, picUrl} = this.props;

        // let separator = this.props.separatorData && this.props.separatorData.data;
        // if (!separator)
        //     return null;

        return <div>
            <WhiteSpace/>
            <Card>
                <div className="separator">
                    <Flex>
                        <Flex.Item style={{textAlign: 'right'}}>

                            <Link to={{
                                pathname: '/home/category',
                                category: separatorData,
                                categoryId: categoryData
                            }}
                                  style={{color: 'darkorange'}}>
                                <img src={"http://" + getServerIp() + picUrl} height='105' width='100%'/>
                            </Link>

                        </Flex.Item>
                    </Flex>
                </div>
            </Card>
        </div>
    }
}
