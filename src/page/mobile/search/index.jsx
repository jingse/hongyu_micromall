import React from 'react';
import {Link} from 'react-router-dom';
import Layout from "../../../common/layout/layout.jsx";
import Bottom from "../../../components/bottom/index.jsx";
import SearchNavBar from "../../../components/search/index.jsx";
import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import { WhiteSpace, Flex, Tabs,SearchBar } from 'antd-mobile';
import './index.less';
// import search_data from "../../../static/mockdata/search_results.js";   //mock假数据
import homeApi from "../../../api/home.jsx";
import {getServerIp} from "../../../config.jsx";


class Search extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        	isLoading: false,
            tabIndex: 0,
            ascChoose: true,
            data: [],
            searchValue: (!this.props.location.value) ? localStorage.getItem("searchCondition"): this.props.location.value,
        };
    }

    componentWillMount() {
        localStorage.setItem("searchCondition", this.state.searchValue);
        this.requestSearchResults(this.state.searchValue, 1, 10, 0);
    }

    componentDidMount() {
        // this.requestData();
    }

    requestSearchResults(value, page, rows, condition) {

        //左侧参数：this.props.location.state.type，右侧参数：this.props.location.state.input
        homeApi.getSpecialtyListSearching("specialty_name", value, page, rows, condition, (rs) => {
            if(rs && rs.success) {
                const results = rs.obj;

                this.setState({
                    data: results,
                });
            }
        });
    }

    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //     	const data = search_data.data;   //mock假数据
    //         this.setState({
    //             data,
    //             isLoading: false
    //         });
    //     }, 500);
    // }

    onTabsChange(tab, index) {
        this.setState({
            isLoading: false,
            tabIndex: index
        });

        const type = this.checkType(index);
        this.requestSearchResults(1, 10, type);

        // 模拟ajax异步获取数据
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 300);
    }

    checkType(index) {
        switch(index) {
            case 0: return 0;
            case 1: return 2;
            case 2: return 1;
        }
    }
    onCancel(value){
        this.setState({
            searchValue: ''
        });
    }
    onChange(value){
        this.setState({
            searchValue: value
        });
    }
    onSubmit(value){
        this.requestSearchResults(this.state.searchValue, 1, 10, 0);
    }

    render() {

        const tabs = [
            { title: '综合排序', sub: 'default' },
            { title: <Flex>
                    <Flex.Item style={{flex:'0 0 80%', textAlign:'center'}}>
                        按价格排序
                    </Flex.Item>
                    <Flex.Item style={{flex:'0 0 30%'}}>
                        <div onClick={() => {
                            this.state.ascChoose = true;
                            this.setState({ascChoose: this.state.ascChoose});
                            this.requestSearchResults(1, 10, 2);
                            console.log("升序")}}>
                            <img src={this.state.ascChoose ? "./images/icons/升序-选中.png" : "./images/icons/升序.png"} style={{width:'50%'}}/>
                        </div>
                        <div onClick={() => {
                            this.state.ascChoose = false;
                            this.setState({ascChoose: this.state.ascChoose});
                            this.requestSearchResults(1, 10, 3);
                            console.log("降序")}}>
                            <img src={this.state.ascChoose ? "./images/icons/降序.png" : "./images/icons/降序-选中.png"} style={{width:'50%'}}/>
                        </div>
                    </Flex.Item>

                </Flex>,
                sub: 'price' },
            { title: '按销量排序', sub: 'comments' },
        ];

        console.log("this.state.data: ", this.state.data);
        const content = this.state.data.rows && this.state.data.rows.map((item, index) => {
            // return <Link to={`/product/${item.id}`} key={index}>
        		// <Flex style={{background:'#fff'}}>
	        	// 	<Flex.Item style={{flex: '0 0 30%'}}>
	        	// 		<img src={item.img_url} style={{width: '70%', margin:'0.4rem'}}/>
	        	// 	</Flex.Item>
	        	// 	<Flex.Item style={{flex: '0 0 60%', color:'black', fontSize:'0.3rem'}}>
             //            <WhiteSpace/>
	        	// 		<div style={{marginBottom: 10}}>{item.name}</div>
	        	// 		<div style={{marginBottom: 10}}>优惠价格：<span style={{color:'red'}}>￥{item.price}元</span></div>
             //            <div style={{marginBottom: 10}}>商品规格：<span style={{color:'red'}}>{item.price}</span></div>
             //            <div>销量：<span style={{color:'red'}}>{item.sales_count}</span></div>
             //            <WhiteSpace/>
	        	// 	</Flex.Item>
        		// </Flex>
    			// <WhiteSpace/>
			// </Link>
            return <Link to={{pathname: `/product/${item.specialty.id}`}} key={index}>
                <Flex style={{background:'#fff'}}>
                    <Flex.Item style={{flex: '0 0 30%'}}>
                        <img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width: '70%', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item style={{flex: '0 0 60%', color:'black'}}>
                        <WhiteSpace/>
                        <div style={{marginBottom: 10}}>{item.specialty.name}</div>
                        <div style={{marginBottom: 10}}>优惠价格：<span style={{color:'darkorange'}}>￥{item.pPrice}元</span></div>
                        <div style={{marginBottom: 10}}>商品规格：<span style={{color:'darkorange'}}>{item.specification.specification}</span></div>
                        <div>销量：<span style={{color:'darkorange'}}>{item.hasSold}</span></div>
                        <WhiteSpace/>
                    </Flex.Item>
                </Flex>
                <WhiteSpace/>
            </Link>
        });

        return <Layout>
            {/* <SearchNavBar value={this.state.searchValue}/> */}
            <SearchBar
                value={this.state.searchValue}
                placeholder="搜索"
                onCancel={this.onCancel.bind(this)}
                onChange={this.onChange.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
            />

            <div className="search_container">
                <Tabs tabs={tabs}
                    onChange={this.onTabsChange.bind(this)} 
                    initialPage={this.state.tabIndex}
                    useOnPan={false}
                    className="search_tabs"
                >
                </Tabs>
                <WhiteSpace size='xs' />
                {content}
                <Bottom>我是有底线的</Bottom>
            </div>
        </Layout>
    }
}

export default LoadingHoc(Search);
