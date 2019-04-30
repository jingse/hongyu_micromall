import React from "react";
import {Link} from "react-router-dom";
import {Flex, WhiteSpace} from "antd-mobile";
import Layout from "../../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../../components/navigation/index.jsx";
import {getServerIp} from "../../../../../../config.jsx";


export default class SalesGroupProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            salesGroupProducts: [],
        };
    }

    componentWillMount() {
        var groupPromotionDetail;

        if (!this.props.location.state) {
            groupPromotionDetail = JSON.parse(localStorage.getItem("groupPromotionDetail"));
        } else {
            groupPromotionDetail = this.props.location.state;
            localStorage.setItem("groupPromotionDetail", JSON.stringify(this.props.location.state));
        }

        // this.state.salesGroupProducts = groupPromotionDetail;
        this.setState({
            salesGroupProducts: groupPromotionDetail,
        });
    }

    getProductIconImg(images) {
        var img = null;
        images && images.map((item, index) => {
            if (item.isLogo) {
                img = item.mediumPath
            }
        });
        return img
    }


    render() {

        if (!this.state.salesGroupProducts || JSON.stringify(this.state.salesGroupProducts) === '[]')
            return null;

        console.log("this.state.salesGroupProducts", this.state.salesGroupProducts);

        const content = this.state.salesGroupProducts && this.state.salesGroupProducts.map((item, index) => {
            return <div key={index} style={{padding: '0 15px'}}>
                <Link to={{pathname: `/product/${item.itemId.id}`, isPromotion: true}}>
                    <Flex style={{background: '#fff', borderBottom: '1px solid #eee'}}>
                        <Flex.Item style={{flex: '0 0 25%'}}>
                            <img src={"http://" + getServerIp() + this.getProductIconImg(item.itemId.images)}
                                 style={{width: '60%', margin: '0.8rem'}} alt=""/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 40%', color: 'black'}}>
                            <div style={{marginBottom: 10}}>{item.itemId.name}</div>
                            <div style={{
                                marginBottom: 10,
                                color: 'black'
                            }}>{item.itemSpecificationId.specification}</div>
                            <WhiteSpace/>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 25%'}}>
                            {/* <div style={{marginBottom: 10, color:'black', textAlign:'right'}}>￥{item.itemSpecificationId.platformPrice}</div> */}
                            <div style={{
                                marginBottom: 10,
                                color: 'black',
                                textAlign: 'right'
                            }}>x {item.itemSpecificationId.saleNumber}</div>
                            <WhiteSpace/>
                        </Flex.Item>
                    </Flex>
                </Link>
                <WhiteSpace/>
            </div>

        });


        return <Layout header={false} footer={false}>
            <Navigation title="组合商品" left={true}/>
            <WhiteSpace/>

            {content}

        </Layout>
    }
}