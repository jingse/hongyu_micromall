import React from 'react';
import {Link} from 'react-router-dom';
import { WhiteSpace, Flex,Carousel, WingBlank } from 'antd-mobile';
import Separator from "./separator.jsx";
// import category_list from "../../../static/mockdata/category_list.js";
import {getServerIp} from "../../../config.jsx";
import homeApi from "../../../api/home.jsx";

export default class CategoryGrid extends React.Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        this.requestTopNOfCategory(this.props.categoryId);
    }


    requestTopNOfCategory(categoryId) {
        // params: categoryId  size
        console.log("categoryId",categoryId);
        homeApi.getTopNOfCategory(categoryId, 6, (rs) => {
             console.log("llfrs",rs,categoryId);
            if (rs && rs.success) {
                const grid = rs.obj;
                this.setState({
                    data: grid
                });
                // console.log("gridCategory", gridCategory);
            }
        });

    }

    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const type = this.props.type;
    //         const data = category_list[type];     //mock data
    //         this.setState({
    //             data: data,
    //         });
    //     }, 100);
    // }

    render(){

        let categoryData = this.props.categoryData;
        if (!categoryData || JSON.stringify(categoryData) === "{}") {
            return null
        }

        let topOfCategory = this.state.data;
        if (!topOfCategory || JSON.stringify(topOfCategory) === "{}") {
            return null;
        }

        // const content = this.state.data && this.state.data.map((item, index) => {
        const content = topOfCategory && topOfCategory.map((item, index) => {

            // return <Flex.Item  key={index} className="product_card"
            //                    style={{marginBottom:'0.8rem', flex:'0 0 47%', marginLeft:'1.5%', marginRight:'1.5%'}}>
            //         <Link to='/product/1'>
            //             <div><img src={item.cover_img} style={{width:'100%'}}/></div>
            //             <WhiteSpace/>
            //             <div className="product_name">{item.name}</div>
            //             <WhiteSpace/>
            //             <div className="product_amount">{item.specification}</div>
            //             <WhiteSpace/>
            //             <div className="product_price">￥{item.price}元起</div>
            //             <WhiteSpace/>
            //         </Link>
            //     </Flex.Item>
            // let minprice = 99999;
            // item.specialty.specifications.map((temp,index) => {
            //     minprice = temp.platformPrice > minprice ? minprice :temp.platformPrice;
            // })
            return  (//<div className="roll">
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
            //</div>
            )
        });


        return <div>
            {content.length > 0 ?<Separator separatorData={categoryData} categoryData={this.props.categoryId} picUrl={this.props.picUrl}/> : <div></div>}
            
            <Flex style={{flexWrap:'nowrap',overflow:'scroll'}}>
                {content}
            </Flex>       
        </div>
    }
}
