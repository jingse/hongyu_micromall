import React from 'react';
import {Link} from 'react-router-dom';
import {Flex, WhiteSpace} from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";
import homeApi from "../../../api/home.jsx";
import Tag from "./tagshow.jsx";
import './index.less';


export default class GridCategory extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data1: [],
            data2: [],
            data3: [],
            tags:  [],
            mypic:""
        };
    }

    componentDidMount() {
        this.requestTopNOfCoupon(9);  
    }

    requestTopNOfCoupon(size){
        homeApi.getTopNOFCoupon(size, (rs) => {
            console.log("普通优惠rs",rs);
            if (rs && rs.success) {
                const coupon = rs.obj;
                this.setState({
                    data1: coupon
                });
            }
        });
        homeApi.getTopNOFGroupCoupon(size,(rs) => {
            console.log("组合优惠rs",rs);
            if (rs && rs.success) {
                const coupon = rs.obj;
                this.setState({
                    data2: coupon
                });
            }
        });
        homeApi.getTopNOFRecommend(size,(rs) => {
            console.log("推荐rs",rs);
            if (rs && rs.success) {
                const coupon = rs.obj;
                this.setState({
                    data3: coupon
                });
            }
        });
        homeApi.getTags((rs) => {
            console.log("标签rs",rs);
            if (rs && rs.success) {
                const thetags = rs.obj;
                this.setState({
                    tags: thetags
                    
                });
            }
        });
        
    }

    getSalesContent(ruleType, substracts, discounts, presents) {
        var content = null;

        if (ruleType === "满减") {
            content = substracts && substracts.map((item, index) => {
                return "满" + item.fullFreeRequirement + "减" + item.fullFreeAmount + "元"
            });
        } else if (ruleType === "满折") {
            content = discounts && discounts.map((item, index) => {
                return "满" + item.discountRequirenment + "打" + item.discountOff*10 + "折"
            });
        } else if (ruleType === "满赠") {
            content = presents && presents.map((item, index) => {
                // return "满" + item.fullPresentRequirenment + "赠" + item.fullPresentProduct.name +"*"+item.fullPresentProductNumber
                return "满" + item.fullPresentRequirenment + "赠商品"  
            });
        }
        return content
    }

    render() {

        let topOfCoupon1 = this.state.data1;
        if (!topOfCoupon1 || JSON.stringify(topOfCoupon1) === "{}") {
            return null;
        }

        let topOfCoupon2 = this.state.data2;
        if (!topOfCoupon2 || JSON.stringify(topOfCoupon2) === "{}") {
            return null;
        }

        let topOfCoupon3 = this.state.data3;
        if (!topOfCoupon3 || JSON.stringify(topOfCoupon3) === "{}") {
            return null;
        }

        const hometag = this.state.tags;
        const hometags = hometag && hometag.map((item, index) => {
            console.log("名字",item);
            return <Tag key={index} tagId={item.id} name={item.productName} picUrl={item.iconUrl}/>
        });

        const content1 = topOfCoupon1 && topOfCoupon1.map((item, index) => {
            console.log("sfdsaf",item);
            for(let i = 0;i < item.pics.length; i++){
                if(item.pics[i].isTag == 1){
                    this.state.mypic = item.pics[i].mediumPath;
                }
            }
            return  (
                
            <Flex.Item  key={index} className="product_card"
                               style={{backgroundColor:'white', marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>
                <Link to={{pathname: `/home/sales/detail`, state: item.id}}>
                    <div><img src={"http://" + getServerIp() + this.state.mypic} style={{width:'6rem', height: '6rem'}}/></div> 
                    {/* <div><img style={{width:'6rem', height: '6rem'}}/></div> */}
                    <WhiteSpace/>
                    <div className="product_name">{item.name}</div> 
                    <WhiteSpace/>
                    <div className="myzhekou_amount">{this.getSalesContent(item.ruleType,item.fullSubstracts,item.fullDiscounts,item.fullPresents)}</div>
                    <WhiteSpace/>
                    {/* <div className="product_price">￥{item.pPrice}元起</div>
                    <WhiteSpace size='xs'/> */}
                </Link>
            </Flex.Item>
            )
        });

        const content2 = topOfCoupon2 && topOfCoupon2.map((item, index) => {
            console.log("sfdsaf2",item);
            for(var i=0;i<item.pics.length;i++){
                if(item.pics[i].isTag == 1){
                    this.state.mypic = item.pics[i].mediumPath;
                }
            }
            return  (
            <Flex.Item  key={index} className="product_card"
                               style={{backgroundColor:'white', marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>
                <Link to={{pathname: `/home/sales_group/detail`, state: item.id}}>
                    <div><img src={"http://" + getServerIp() + this.state.mypic} style={{width:'6rem', height: '6rem'}}/></div> 
                    {/* <div><img style={{width:'6rem', height: '6rem'}}/></div> */}
                    <WhiteSpace/>
                    <div className="product_name">{item.name}</div> 
                    <WhiteSpace/>
                    <div className="myzhekou_amount">{this.getSalesContent(item.ruleType,item.fullSubstracts,item.fullDiscounts,item.fullPresents)}</div>
                    <WhiteSpace/>
                    {/* <div className="product_price">￥{item.pPrice}元起</div>
                    <WhiteSpace size='xs'/> */}
                </Link>
            </Flex.Item>
            )
        });

        const content3 = topOfCoupon3 && topOfCoupon3.map((item, index) => {
            return  (
            <Flex.Item  key={index} className="product_card"
                               style={{backgroundColor:'white', marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>
                <Link to={`/product/${item.specialty.id}`}>
                    <div><img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'6rem', height: '6rem'}} alt=""/></div>
                    <WhiteSpace/>
                    <div className="product_name">{item.specialty.name}</div> 
                    <WhiteSpace/>
                    <div className="product_amount">{item.hasSold}人付款</div>
                    <WhiteSpace/>
                    <div className="product_price">￥{item.pPrice}元起</div>
                    <WhiteSpace size='xs'/>
                </Link>
            </Flex.Item>
            )
        });

        return  (<div>
        <Flex>
        <Flex.Item style={{textAlign:'right', marginRight:'0.8rem',marginLeft:'0.5rem',marginTop:'0.5rem'}}>
            <Link to={{pathname: 'home/recharge'}} 
            style={{color: 'darkorange'}}>
            <img src='./images/category/优惠券图片.jpg' height='auto' width='100%'
                 />
            </Link>
            <Link to={{pathname: '/home/coupon'}} 
            style={{color: 'darkorange'}}>
            <img src='./images/category/电子券图片.jpg' height='auto' width='100%'
                 />
            </Link>
        </Flex.Item>
        </Flex>

        <Link to={{pathname: '/home/sales'}} style={{color: 'darkorange'}}>
           <img src='./images/category/1.jpg' height='120' width='100%' />
        </Link> 
        <Flex style={{flexWrap:'nowrap',overflow:'scroll'}}>
            {content1}
        </Flex> 

        <Link to={{pathname: '/home/sales_group'}} style={{color: 'darkorange'}}>
           <img src='./images/category/2.jpg' height='120' width='100%' />
        </Link> 
        <Flex style={{flexWrap:'nowrap',overflow:'scroll'}}>
            {content2}
        </Flex>      

         <Link to={{pathname: '/home/recommend'}} style={{color: 'darkorange'}}>
           <img src='./images/category/3.jpg' height='120' width='100%' />
        </Link>    
        <Flex style={{flexWrap:'nowrap',overflow:'scroll'}}>
            {content3}
        </Flex> 


        {hometags}
        

        </div>   
        )

    }
}