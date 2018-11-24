import React from 'react';
import {Link} from 'react-router-dom';
import {Flex, Carousel, Grid} from 'antd-mobile';
import {getServerIp} from "../../../config.jsx";
import { WhiteSpace} from 'antd-mobile';
import homeApi from "../../../api/home.jsx";
import Tag from "./tagshow.jsx";
import './index.less';
// var anotherPage = false;
// var category_flex = [];
// var second_flex = [];
// var changed = true;

export default class GridCategory extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data1: [],
            data2: [],
            data3: [],
            tags:  [],
        };
    }

    componentWillMount() {
        // category_flex = [];
        // const data1 = [
        //     {
        //         icon: './images/category/促销.png',
        //         text: `促销`,
        //         urlTo: '/home/sales',
        //         category: '促销活动区',
        //     },
        //     {
        //         icon: './images/category/组合选购.png',
        //         text: `组合优惠`,
        //         urlTo: '/home/sales_group',
        //         category: '组合优惠',
        //     },
        //     {
        //         icon: './images/category/充值.png',
        //         text: `电子券`,
        //         urlTo: 'home/recharge',
        //         category: '充值区',
        //     },
        //     {
        //         icon: './images/category/优惠券.png',
        //         text: `领券`,
        //         urlTo: '/home/coupon',
        //         category: '领券中心',
        //     },
        //     {
        //         icon: './images/category/推荐.png',
        //         text: `推荐`,
        //         urlTo: '/home/recommend',
        //         category: '推荐产品区',
        //     },
        // ];  
        //}
        // category_flex.push(<Flex.Item className="category_flex" key={0}>
        //         <div className="div_category">
        //             <Link to={{pathname: "/home/sales", category: '促销活动区'}} style={{color: 'black'}}>
        //                 <img src='./images/category/促销.png' className="category_img"/>
        //                 <div className="zone">促销</div>
        //             </Link>
        //         </div>
        //     </Flex.Item>);
        // category_flex.push(<Flex.Item className="category_flex" key={1}>
        //         <div className="div_category">
        //             <Link to={{pathname: "/home/sales_group", category: '组合优惠'}} style={{color: 'black'}}>
        //                 <img src='./images/category/组合选购.png' className="category_img"/>
        //                 <div className="zone">组合优惠</div>
        //             </Link>
        //         </div>
        //     </Flex.Item>);
        // category_flex.push(<Flex.Item className="category_flex" key={2}>
        //         <div className="div_category">
        //             <Link to={{pathname: "/home/recharge", category: '充值区'}} style={{color: 'black'}}>
        //                 <img src='./images/category/充值.png' className="category_img"/>
        //                 <div className="zone">购买</div>
        //             </Link>
        //         </div>
        //     </Flex.Item>);
        // category_flex.push(<Flex.Item className="category_flex" key={3}>
        //     <div className="div_category">
        //         <Link to={{pathname: "/home/coupon", category: '领券中心'}} style={{color: 'black'}}>
        //             <img src='./images/category/优惠券.png' className="category_img"/>
        //             <div className="zone">领券</div>
        //         </Link>
        //     </div>
        // </Flex.Item>);
        //this.setState({data: data1});
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
    componentWillUnmount() {
        // changed = true;
        // category_flex = [];
        // second_flex = [];
        // anotherPage = false;
    }

    // generateCategories(flex1, flex2) {
    //     var categories = [];

    //     if(flex1 && flex1 != "[]") {
    //         categories.push(<div className="grid_category_view" key={1}>
    //             <Flex style={{flexWrap:'wrap'}}>
    //                 {flex1}

    //             </Flex>
    //         </div>);
    //     }

    //     if(flex2 && flex2 != "[]") {
    //         categories.push(<div className="grid_category_view" key={2}>
    //             <Flex style={{flexWrap:'wrap'}}>
    //                 {flex2}
    //             </Flex>
    //         </div>);
    //     }
    //     return categories
    // }

    // checkCategory(name) {
    //     switch (name) {
    //         case "促销":
    //             return "/home/sales";
    //         case "组合优惠":
    //             return "/home/sales_group";
    //         case "充值":
    //             return "/home/recharge";
    //         case "领券中心":
    //             return "/home/coupon";
    //         default:
    //             return '/home/category';
    //     }
    // }


    render() {

        // const category = this.props.gridData;
        // const tags = this.props.tagData;

        // console.log("category: ", category);

        // if (!category || JSON.stringify(category) === '{}' || !tags || JSON.stringify(tags) === '{}') {
        //     return null
        // }

        // let categoryFROM = category && category.map((item, index) => {
        //     return {
        //         icon: "http:" + getServerIp() + item.iconUrl,
        //         text: item.name,
        //         urlTo: '/home/category',
        //         category: item.name,
        //         categoryId: item.id
        //     }
            // if (index === (category.length -1)) {
            //     changed = false;
            // }

            // console.log("index: ", index);
            // if (index <= 3) {

            //     if (index === 3) {
            //         anotherPage = true;
            //     }
            //     category_flex.push(<Flex.Item className="category_flex" key={index + 4}>
            //         <div className="div_category">
            //             <Link to={{pathname: '/home/category', category: item.name, categoryId: item.id}}
            //                   style={{color: 'black'}}>
            //                 <img src={"http://" + getServerIp() + item.iconUrl} className="category_img"/>
            //                 <div className="zone">{item.name}</div>
            //             </Link>
            //         </div>
            //     </Flex.Item>);
            //     // return <Flex.Item className="category_flex" key={index}>
            //     //     <div className="div_category">
            //     //         <Link to={{pathname: '/home/category', category: item.name, categoryId: item.id}}
            //     //               style={{color: 'black'}}>
            //     //             {/*<img src='./images/category/促销.png' className="category_img"/>*/}
            //     //             {/*<div className="zone">促销</div>*/}
            //     //             <img src={"http://" + getServerIp() + item.iconUrl} className="category_img"/>
            //     //             <div className="zone">{item.name}</div>
            //     //         </Link>
            //     //     </div>
            //     // </Flex.Item>

            // } else if (3 < index <= 7 && anotherPage) {

            //     second_flex.push(<Flex.Item className="category_flex" key={index - 4}>
            //         <div className="div_category">
            //             <Link to={{pathname: '/home/category', category: item.name, categoryId: item.id}}
            //                   style={{color: 'black'}}>
            //                 <img src={"http://" + getServerIp() + item.iconUrl} className="category_img"/>
            //                 <div className="zone">{item.name}</div>
            //             </Link>
            //         </div>
            //     </Flex.Item>);

            //     // return <Flex.Item className="category_flex" key={{index}}>
            //     //     <div className="div_category">
            //     //         <Link to={{pathname: '/home/category', category: item.name, categoryId: item.id}}
            //     //               style={{color: 'black'}}>
            //     //             <img src={"http://" + getServerIp() + item.iconUrl} className="category_img"/>
            //     //             <div className="zone">{item.name}</div>
            //     //         </Link>
            //     //     </div>
            //     // </Flex.Item>

            // } else {

            // }
            // return category_flex;
        // });

        // let tagFROM = tags && tags.map((item, index) => {
        //     return {
        //         icon: "http:" + getServerIp() + item.iconUrl,
        //         text: item.productName,
        //         urlTo: '/home/tag',
        //         category: item.productName,
        //         categoryId: item.id
        //     }
        // });

        // let tmp = this.state.data.concat(tagFROM);
        // let dataALL = tmp.concat(categoryFROM);

        // return <Grid data={dataALL} isCarousel={true} hasLine={false} itemStyle={{background: 'rgb(250, 250, 250)'}}
        //              renderItem={dataItem => (
        //                  <div className="div_category">
        //                      <Link to={{
        //                          pathname: dataItem.urlTo,
        //                          category: dataItem.category,
        //                          categoryId: dataItem.categoryId
        //                      }} style={{color: 'black'}}>
        //                          <img src={dataItem.icon} className="category_img"/>
        //                          <div className="zone">{dataItem.text}</div>
        //                      </Link>
        //                  </div>
        //              )}
        // >

        // </Grid>
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
            return  (
                
            <Flex.Item  key={index} className="product_card"
                               style={{marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>             
                <Link to={{pathname: `/home/sales/detail`, state: item.id}}>
                    <div><img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'6rem', height: '6rem'}}/></div> 
                    {/* <div><img style={{width:'6rem', height: '6rem'}}/></div> */}
                    <WhiteSpace/>
                    <div className="product_name">{item.name}</div> 
                    <WhiteSpace/>
                    <div className="product_amount">{item.ruleType}</div>
                    <WhiteSpace/>
                    {/* <div className="product_price">￥{item.pPrice}元 起</div>
                    <WhiteSpace size='xs'/> */}
                </Link>
            </Flex.Item>
            )
        });

        const content2 = topOfCoupon2 && topOfCoupon2.map((item, index) => {
            return  (
            <Flex.Item  key={index} className="product_card"
                               style={{marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>
                <Link to={{pathname: `/home/sales_group/detail`, state: item.id}}>
                    <div><img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'6rem', height: '6rem'}}/></div> 
                    {/* <div><img style={{width:'6rem', height: '6rem'}}/></div> */}
                    <WhiteSpace/>
                    <div className="product_name">{item.name}</div> 
                    <WhiteSpace/>
                    <div className="product_amount">{item.ruleType}</div>
                    <WhiteSpace/>
                    {/* <div className="product_price">￥{item.pPrice}元 起</div>
                    <WhiteSpace size='xs'/> */}
                </Link>
            </Flex.Item>
            )
        });

        const content3 = topOfCoupon3 && topOfCoupon3.map((item, index) => {
            return  (
            <Flex.Item  key={index} className="product_card"
                               style={{marginBottom:'0.1rem', flex:'0 0 30%', marginLeft:'1.5%', marginRight:'1.5%'}}>
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
        // return <Carousel className="my-carousel"
        //                  autoplay={false}
        //                 // infinite
        //                  selectedIndex={0}
        //                  // style={{touchAction: 'none'}}
        // >

        //     {this.generateCategories(category_flex, second_flex)}


        // </Carousel>

    }
}

// 生成栅格布局
// generateGrid(data, key, parentOrientation='h'){
//     var vdom = [];
//     if (data.hasOwnProperty('cells')) {
//         let list = [];
//         list = data.cells.map((item, index) => {
//             var keyz = key + index + "";
//             return this.generateGrid(item, keyz, data.orientation);
//         });
//         const cellOrientation = data.orientation;
//
//         if (cellOrientation === 'h') {
//             vdom.push(
//                 <Flex key={key}>
//                     {list}
//                 </Flex>
//             );
//             vdom.push(<WhiteSpace key={`ws${key}`}/>);
//         } else {
//             vdom.push(
//                 <Flex.Item key={key}>
//                     {list}
//                 </Flex.Item>
//             );
//         }
//
//     } else {
//         if (parentOrientation === 'h') {
//             vdom.push(
//                 <Flex.Item key={key}>
//                     <Link to={data.url}><img src={data.image_url} className="grid-category-img"/></Link>
//                 </Flex.Item>
//             );
//         } else {
//             vdom.push(
//                 <Flex key={key}><Flex.Item>
//                     <Link to={data.url}><img src={data.image_url} className="grid-category-img"/></Link>
//                 </Flex.Item></Flex>
//             );
//             vdom.push(<WhiteSpace key={`ws${key}`}/>);
//         }
//     }
//     return vdom;
// }

{/*<div className="grid_category_view">*/
}
{/*<Flex style={{flexWrap:'wrap'}}>*/
}
{/*{category_flex}*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/sales", category:'促销活动区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/促销.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">促销</div>*!/*/
}
{/*/!*<img src={"http://" + getServerHost() + "/" + this.props.gridData.iconURL}  className="category_img"/>*!/*/
}
{/*/!*<div className="zone">{this.props.gridData.name}</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/sales_group", category:'组合优惠' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/组合选购.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">组合优惠</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/recharge", category:'充值区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/充值.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">充值</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/coupon", category:'领券中心' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/优惠券.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">领券</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}

{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'水果专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/水果.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">水果</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'乳胶产品专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/乳胶.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">乳胶产品</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'玩具区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/玩具.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">玩具</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item className="category_flex">*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'饰品服饰专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/服饰类.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">饰品服饰</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}

{/*</Flex>*/
}
{/*</div>*/
}


{/*<div className="grid_category_view">*/
}
{/*<Flex>*/
}
{/*{second_flex}*/
}
{/*/!*<Flex.Item>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'奢侈品专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/奢侈品.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">奢侈品</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'化妆品专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/化妆品.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">化妆品</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'日用品专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/日用品.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">日用品</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'保健品专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/保健品.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">保健品</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}

{/*/!*<Flex.Item style={{flex:'0 0 23.5%'}}>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'食品酒水专区' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/食品.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">食品酒水</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item style={{flex:'0 0 23.5%'}}>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'箱包' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/箱包.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">箱包</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*/!*<Flex.Item style={{flex:'0 0 25%'}}>*!/*/
}
{/*/!*<div className="div_category">*!/*/
}
{/*/!*<Link to={{pathname:"/home/category", category:'电器' }} style={{color:'black'}} >*!/*/
}
{/*/!*<img src='./images/category/电器.png' className="category_img"/>*!/*/
}
{/*/!*<div className="zone">电器</div>*!/*/
}
{/*/!*</Link>*!/*/
}
{/*/!*</div>*!/*/
}
{/*/!*</Flex.Item>*!/*/
}
{/*</Flex>*/
}
{/*<WhiteSpace/>*/
}
{/*</div>*/
}