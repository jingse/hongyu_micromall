import React from 'react';
import {Link} from 'react-router-dom';
import { WhiteSpace, Flex,Carousel, WingBlank } from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";
import homeApi from "../../../api/home.jsx";

export default class Tagshow extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        this.requestTopTag(this.props.tagId);
    }


    requestTopTag(tagId) {
        homeApi.getTopNOfTags(tagId,9,(rs) => {
            console.log("每个标签内容rs",rs);
            console.log("props内容",this.props.name);
            if (rs && rs.success) {
                const tag = rs.obj;
                this.setState({
                    data: tag
                });
            }               
        });

    }

    render(){
        let topOfCategory = this.state.data;
        if (!topOfCategory || JSON.stringify(topOfCategory) === "{}") {
            return null;
        }

        const content = topOfCategory && topOfCategory.map((item, index) => {
            return  (
            <Flex.Item  key={index} className="product_card"
                               style={{marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>
                {/*<Link to={{pathname:"/product", state: item.specialty.id }}>*/}
                <Link to={`/product/${item.specialty.id}`}>
                    <div><img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'6rem', height: '6rem'}}/></div>
                    <WhiteSpace/>
                    <div className="product_name">{item.specialty.name}</div> 
                    <WhiteSpace/>
                    <div className="product_amount">{item.hasSold}人付款</div>
                    <WhiteSpace/>
                    <div className="product_price">￥{item.pPrice}元 起</div>
                    <WhiteSpace size='xs'/>
                </Link>
            </Flex.Item>
            )
        });


        return <div>
             {content.length > 0 ? <Link to={{pathname: `/home/tag`, category: this.props.name, categoryId: this.props.tagId}}>
            <img src={"http://" + getServerIp() + this.props.picUrl} height='120' width='100%' />  </Link> : <div></div>}
            
            
            <Flex style={{flexWrap:'nowrap',overflow:'scroll'}}>
                {content}
            </Flex>      
           
        </div>
    }
}
