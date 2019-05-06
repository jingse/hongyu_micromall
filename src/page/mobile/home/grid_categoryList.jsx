import React from 'react';
import {Link} from 'react-router-dom';
import {Flex, WhiteSpace} from 'antd-mobile';
import Separator from "./separator.jsx";
import {getServerIp} from "../../../config.jsx";
import homeApi from "../../../api/home.jsx";

export default class CategoryGrid extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        this.requestTopNOfCategory(this.props.categoryId);
    }


    requestTopNOfCategory(categoryId) {
        // params: categoryId  size
        console.log("categoryId", categoryId);
        homeApi.getTopNOfCategory(categoryId, 6, (rs) => {
            console.log("llfrs", rs, categoryId);
            if (rs && rs.success) {
                const grid = rs.obj;
                this.setState({
                    data: grid
                });
                // console.log("gridCategory", gridCategory);
            }
        });

    }


    render() {

        let categoryData = this.props.categoryData;
        if (!categoryData || JSON.stringify(categoryData) === "{}") {
            return null
        }

        let topOfCategory = this.state.data;
        if (!topOfCategory || JSON.stringify(topOfCategory) === "{}") {
            return null;
        }

        const content = topOfCategory && topOfCategory.map((item, index) => {
            return (//<div className="roll">
                <Flex.Item key={index} className="product_card"
                           style={{
                               backgroundColor: 'white',
                               marginBottom: '0.1rem',
                               flex: '0 0 30%',
                               marginLeft: '1.5%',
                               marginRight: '1.5%'
                           }}>
                    {/*<Link to={{pathname:"/product", state: item.specialty.id }}>*/}
                    <Link to={`/product/${item.specialty.id}`}>
                        <div><img src={"http://" + getServerIp() + item.iconURL.mediumPath}
                                  style={{width: '6rem', height: '6rem'}}/></div>
                        <WhiteSpace/>
                        <div className="product_name">{item.specialty.name}</div>
                        <WhiteSpace/>
                        <div className="product_amount">{item.hasSold}人付款</div>
                        <WhiteSpace/>
                        <div className="product_price">￥{item.pPrice}元起</div>
                        <WhiteSpace size='xs'/>
                    </Link>
                </Flex.Item>
                //</div>
            )
        });


        return <div>
            {content.length > 0 ? <Separator separatorData={categoryData} categoryData={this.props.categoryId}
                                             picUrl={this.props.picUrl}/> : <div></div>}

            <Flex className="flex" style={{flexWrap: 'nowrap', overflow: 'scroll'}}>
                {content}
            </Flex>
        </div>
    }
}
