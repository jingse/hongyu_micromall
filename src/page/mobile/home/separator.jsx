import React from 'react';
import {Flex, WhiteSpace} from 'antd-mobile';
import {Link} from 'react-router-dom';
import Card from "../../../components/card/index.jsx";
import {getServerIp} from "../../../config.jsx";


export const Separator = (props) => {
    const {separatorData, categoryData, picUrl} = props;

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
                        }}>
                            <img src={"http://" + getServerIp() + picUrl} height='105' width='100%'/>
                        </Link>

                    </Flex.Item>
                </Flex>
            </div>
        </Card>
    </div>
};
