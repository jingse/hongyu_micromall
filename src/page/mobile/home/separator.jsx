import React from 'react';
import {WhiteSpace, Flex} from 'antd-mobile';
import {Link} from 'react-router-dom';
import Card from "../../../components/card/index.jsx";
import {getServerIp} from "../../../config.jsx";

export default class Separator extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render(){
        // let separator = this.props.separatorData && this.props.separatorData.data;
        // if (!separator) {
        //     return null;
        // }

        return <div>
            <WhiteSpace/>
            <Card>
                <div className="separator">
                    <Flex>
                        <Flex.Item style={{textAlign:'right'}}>
                            <Link to={{pathname: '/home/category',category: this.props.separatorData, categoryId: this.props.categoryData}} 
                            style={{color: 'darkorange'}}>
                            <img src={"http://" + getServerIp() + this.props.picUrl} height='105' width='100%'
                            
                                 />
                            </Link>
                            
                        </Flex.Item>
                    </Flex>
                </div>
            </Card>
            </div>
    }
}
