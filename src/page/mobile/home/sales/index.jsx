import React from "react";
import { Link } from "react-router-dom";
import { Flex, WhiteSpace,Toast } from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import SearchNavBar from "../../../../components/search/index.jsx";
import Bottom from "../../../../components/bottom/index.jsx";
import "./index.less";
// import sales_data from "../../../../static/mockdata/sales.js"; //mock假数据
 import homeApi from "../../../../api/home.jsx";
 import {getServerIp} from "../../../../config.jsx";


export default class Sales extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            nextPage:2,
            isEnd:false
        };
    }

    componentWillMount() {
        this.requestOrdinaryPromotionList(1);
        localStorage.setItem("categoryName", "促销");
    }

    // componentDidMount() {
    //     this.requestData();
    // }

    requestOrdinaryPromotionList(page) {
        homeApi.getOrdinaryPromotionList(page,10,(rs) => {
            if(rs && rs.success) {
                console.log('rs',rs)
                let numlist = (rs.obj.pageNumber-1)*10 + rs.obj.rows.length;
                let isEnd1 = false;
                if(numlist == rs.obj.total){
                    isEnd1 = true;
                }

                const proList = rs.obj.rows;
                if(page == 1){
                    console.log('getOrdinaryPromotionList',rs.obj.total)
                    this.setState({
                        data: proList,
                        isLoading: false,
                        isEnd:isEnd1
                    });
                }
                else{
                    if(this.state.isEnd) {
                        Toast.info("没有更多信息",1);
                        return;
                    }
                    
                    console.log('getOrdinaryPromotionList2',rs,page,proList.length,numlist)
                    this.setState({
                        data: this.state.data.concat(proList),
                        isLoading: false,
                        nextPage:page+1,
                        isEnd:isEnd1
                    });
                }
                // console.log('getOrdinaryPromotionList',rs)
                // const proList = rs.obj;
                // this.setState({
                //     data: proList,
                //     isLoading: false
                // });
            }
        });
    }
    addMore(){
        this.requestOrdinaryPromotionList(this.state.nextPage);
    }

    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const data = sales_data.data;   //mock假数据
    //         this.setState({
    //             data: data,
    //             isLoading: false
    //         });
    //     }, 300);
    // }

    getSalesIconImg(salesImages) {
        var img = null;
        salesImages && salesImages.map((item, index) => {
            if (item.isTag) {
                img = item.mediumPath
            }
        });
        return img
    }

    getSalesContent(ruleType, substracts, discounts, presents) {
        var content = null;

        if (ruleType === "满减") {
            content = substracts && substracts.map((item, index) => {
                return "满" + item.fullFreeRequirement + "元减" + item.fullFreeAmount + "元"
            });
        } else if (ruleType === "满折") {
            content = discounts && discounts.map((item, index) => {
                return "满" + item.discountRequirenment + "元打" + item.discountOff + "折"
            });
        } else if (ruleType === "满赠") {
            content = presents && presents.map((item, index) => {
                return "满" + item.fullPresentRequirenment + "元赠" + item.fullPresentProductNumber
            });
        }
        else {

        }

        return content
    }

    checkDest() {
        if (this.props.location.dest) {
            return <SearchNavBar dest={this.props.location.dest}/>
        } else {
            return <SearchNavBar/>
        }
    }

    render() {

        const content = this.state.data && this.state.data.map((item, index) => {

            return <Link to={{pathname: `/home/sales/detail`, state: item.id, ruleType: item.ruleType,
                presents: item.fullPresents, subtracts: item.fullSubstracts, discounts: item.fullDiscounts}} key={index}>
                <Flex style={{background:'#fff'}}>
                    <Flex.Item style={{flex: '0 0 30%'}}>
                        <img src={"http://" + getServerIp() + this.getSalesIconImg(item.pics)} style={{width: '70%', height:'4rem', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 60%', color:'black'}}>
                        <WhiteSpace/>
                        <div style={{marginBottom: 15, fontSize:'1rem', fontWeight:'bold'}}>{item.name}</div>
                        <div style={{marginBottom: 10}}>
                            <span style={{color:'red', border:'1px solid darkorange', padding:'2px', marginRight:'0.5rem'}}>
                                {item.ruleType}
                            </span>
                            {this.getSalesContent(item.ruleType, item.fullSubstracts, item.fullDiscounts, item.fullPresents)}
                        </div>
                        <Flex style={{marginBottom: 10}}>
                            <Flex.Item style={{flex:'0 0 30%'}}>
                                <span style={{color:'red', border:'1px solid darkorange', padding:'2px', marginRight:'0.5rem'}}>
                                    时间
                                </span>
                            </Flex.Item>
                            <Flex.Item style={{flex:'0 0 70%'}}>
                                <div className="sales_time_text">{new Date(item.startTime).toLocaleString()}</div>
                                <div className="sales_time_text">{new Date(item.endTime).toLocaleString()}</div>
                            </Flex.Item>
                        </Flex>
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
            </Link>

        });

        return <Layout header={false} footer={true}>

            {this.checkDest()}

            <div style={{borderBottom: '1px solid green', backgroundColor:'white', color:'green', fontSize:'bold', marginTop:'3.125rem'}}>
                <Flex>
                    <Flex.Item style={{flex: '0 0 4%', marginRight:'0.4rem'}}>
                        <img src='./images/category/菜篮子.png'
                             style={{width:'90%', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item>{(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}</Flex.Item>
                </Flex>
            </div>


            <div style={{backgroundColor:'white', height:'3rem', borderBottom:'1px solid #eee'}}>
                <div className="order_button">
                    <WhiteSpace size='lg'/>
                    <a style={{marginLeft:'0.6rem'}}>满减</a>
                    <a style={{marginLeft:'0.6rem'}}>满赠</a>
                    <a style={{marginLeft:'0.6rem'}}>折扣</a>
                    {/*<img src="./images/icons/筛选.png" style={{width:'5%'}}/>*/}
                </div>
            </div>


            {content}

            <div className='addMore' onClick={()=>this.addMore()}>加载更多</div>
            {/* <Bottom>我是有底线的</Bottom> */}
        </Layout>
    }
}