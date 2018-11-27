import React from 'react';
import {Link} from 'react-router-dom';
import Layout from "../../../common/layout/layout.jsx";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import Bottom from "../../../components/bottom/index.jsx";
import SearchNavBar from "../../../components/search/index.jsx";
import LoadingHoc from "../../../common/loading/loading-hoc.jsx";
import { WhiteSpace, Flex, Tabs,SearchBar, ListView } from 'antd-mobile';
import './index.less';
// import search_data from "../../../static/mockdata/search_results.js";   //mock假数据
import homeApi from "../../../api/home.jsx";
import {getServerIp} from "../../../config.jsx";


var hasMore = true;
const NUM_SECTIONS = 1;
const NUM_ROWS_PER_SECTION = 10;
let pageIndex = 0;
// let categoryId = null;

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];


export default class Search extends React.Component {
    constructor(props, context) {
        super(props, context);

        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource,
        	isLoading: true,
            tabIndex: 0,
            ascChoose: true,
            data: [],
            searchValue: (!this.props.location.value) ? localStorage.getItem("searchCondition"): this.props.location.value,
            height: document.documentElement.clientHeight * 3 / 4,
        };
    }

    componentWillMount() {
        localStorage.setItem("searchCondition", this.state.searchValue);
        this.requestSearchResults(this.state.searchValue, 1, 10, 0);
        hasMore = true;
        pageIndex = 0;
        dataBlobs = {};
        sectionIDs = [];
        rowIDs = [];
    }

    componentDidMount() {
        // this.requestData();

        // you can scroll to the specified position
        // setTimeout(() => this.lv.scrollTo(0, 120), 800);

        //fixed id length bug
        // sectionIDs = [];
        // rowIDs = [];
        // pageIndex = 0;
        // dataBlobs = {};

        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.setState({
            height: hei,
        });
        // simulate initial Ajax
        setTimeout(() => {
            this.genData();
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            //     isLoading: false,
            //     height: hei,
            // });
        //console.log(dataBlobs)
        }, 500);
        //console.log(dataBlobs)
    }

    requestSearchResults(value, page, rows, condition) {

        //左侧参数：this.props.location.state.type，右侧参数：this.props.location.state.input
        homeApi.getSpecialtyListSearching("specialty_name", value, page, rows, condition, (rs) => {
            if(rs && rs.success) {
                const results = rs.obj.rows;

                let numlist = (rs.obj.pageNumber-1)*10 + rs.obj.rows.length;
                
                if(numlist == rs.obj.total){
                    hasMore = false;
                }

                this.setState({
                    data: results,
                    isLoading: false
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
        }, ()=>{
            hasMore = true;
            pageIndex = 0;
            dataBlobs = {};
            sectionIDs = [];
            rowIDs = [];
            this.genData();
        });

        // const type = this.checkType(index);
        // this.requestSearchResults(1, 10, type);

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

    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (!hasMore) {
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.genData(++pageIndex);
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            //     isLoading: false,
            // });
        }, 500);
    };

    genData(pIndex = 0) {
        let tt = this.checkType(this.state.tabIndex);
        console.log('tttttttttt',tt)
        this.requestSearchResults(this.state.searchValue, pIndex+1, 10, tt);

        setTimeout(() => {
        // console.log('categoryData',this.state.categoryData)

        // while(this.state.categoryData.length==0);

        let reData = this.state.data;


        for (let i = 0; i < NUM_SECTIONS; i++) {
            const ii = (pIndex * NUM_SECTIONS) + i;
            const sectionName = `Section ${ii}`;
            sectionIDs.push(sectionName);
            dataBlobs[sectionName] = sectionName;
            rowIDs[ii] = [];
    
            for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
                const rowName = `S${ii}, R${jj}`;
                rowIDs[ii].push(rowName);
                dataBlobs[rowName] = reData[jj];
            }
        }
        sectionIDs = [...sectionIDs];
        rowIDs = [...rowIDs];
        console.log('199199',dataBlobs,sectionIDs,rowIDs)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
            });
        }, 500);
    }



    render() {
        const tabs = [
            { title: '综合排序', sub: 'default' },
            { title: <Flex>
                    <Flex.Item style={{flex:'0 0 80%', textAlign:'center'}}>
                        按价格排序
                    </Flex.Item>
                    <Flex.Item style={{marginLeft: -1, flex:'0 0 30%'}}>
                        <div onClick={() => {
                            this.state.ascChoose = true;
                            this.setState({ascChoose: true},()=>{
                                hasMore = true;
                                pageIndex = 0;
                                dataBlobs = {};
                                sectionIDs = [];
                                rowIDs = [];
                                this.genData();
                            });
                            // this.requestCategoryList(categoryId, 1, 10, 3);
                            console.log("升序")}}>
                            <img src={this.state.ascChoose ? "./images/icons/升序-选中.png" : "./images/icons/升序.png"} style={{width:'50%'}}/>
                        </div>
                        <div onClick={() => {
                            this.state.ascChoose = false;
                            this.setState({ascChoose: false},()=>{
                                hasMore = true;
                                pageIndex = 0;
                                dataBlobs = {};
                                sectionIDs = [];
                                rowIDs = [];
                                this.genData();
                            });
                            // this.requestCategoryList(categoryId, 1, 10, 2);
                            console.log("降序")}}>
                            <img src={this.state.ascChoose ? "./images/icons/降序.png" : "./images/icons/降序-选中.png"} style={{width:'50%'}}/>
                        </div>
                    </Flex.Item>

                </Flex>,
                sub: 'price' },
            { title: '按销量排序', sub: 'comments' },
        ];

        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    // height: 8,
                    borderTop: '1px dashed #ECECED',
                    borderBottom: '1px dashed #ECECED',
                }}
            />
        );
        // const data = category_data;
        const data = this.state.data;

        // console.log("this.state.categoryData", this.state.categoryData);
        // console.log("category", category);

        // if (!category || category.length === 0) {
        //     return <Layout header={false} footer={true}>
        //
        //         <SearchNavBar/>
        //         <WhiteSpace size="xs"/>
        //
        //         <div style={{borderBottom: '1px solid green', backgroundColor:'white', color:'green', fontSize:'bold'}}>
        //             <Flex>
        //                 <Flex.Item style={{flex: '0 0 4%', marginRight:'0.4rem'}}>
        //                     <img src='./images/category/菜篮子.png'
        //                          style={{width:'90%', margin:'0.4rem'}}/>
        //                 </Flex.Item>
        //                 <Flex.Item>{this.props.location.category}</Flex.Item>
        //             </Flex>
        //         </div>
        //
        //
        //         <div style={{textAlign: 'center'}}>
        //             哎呀，这个分区没有数据
        //         </div>
        //     </Layout>
        // }


        let index = data.length - 1;
        const row = (rowdata, sectionID, rowID) => {
            if (index < 0) {
                index = data.length - 1; //这是使它循环的原因
                //hasMore = false;
                return null
            }
            const obj = rowdata;
            console.log("obj", obj);
            if(obj){
                return (
                    <div key={rowID} style={{ padding: '0 15px' }}>
                    <Link to={{pathname: `/product/${obj.specialty.id}`}}>
                        <div style={{ display: 'flex', padding: '15px 0' }}>
                            <img style={{ height: '4rem', width:'25%', marginRight: '2rem' }} src={"http://" + getServerIp() + obj.iconURL.mediumPath}/>
                            <div style={{ lineHeight: 1 , color:'black'}}>
                                <div style={{marginBottom: 10}}>{obj.specialty.name}</div>
                                <div style={{marginBottom: 10}}><span style={{color:'darkorange'}}>￥{obj.pPrice}元</span></div>
                                {/* <div style={{marginBottom: 10}}>商品规格：<span style={{color:'darkorange'}}>{obj.specification.specification}</span></div> */}
                                <div>总销量：<span style={{color:'darkorange'}}>{obj.hasSold}</span></div>
                            </div>
                        </div>
                    </Link>
                     </div>
                );
            }
            else{
                // return(<div></div>);
                return null;
            }

        };
      
        return <Layout header={true} footer={true} isSearchAgain={true}>

            {/* <SearchNavBar/> */}
            <WhiteSpace size="xs"/>



            <div style={{borderBottom: '1px solid green', backgroundColor:'white', color:'green', fontSize:'bold'}}>
                <Flex>
                    <Flex.Item style={{flex: '0 0 4%', marginRight:'0.4rem'}}>
                        <img src='./images/category/菜篮子.png'
                             style={{width:'90%', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item>搜索</Flex.Item>
                </Flex>
            </div>

            <div className="search_container">
                <Tabs tabs={tabs}
                      onChange={this.onTabsChange.bind(this)}
                      initialPage={this.state.tabIndex}
                      useOnPan={false}
                    // className="search_tabs"
                >
                </Tabs>
            </div>

            <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{ height:'10%', textAlign: 'center' }}>
                    {this.state.isLoading ? '加载中...' : (hasMore?'加载完成':'没有更多信息')}
                </div>)}
                renderBodyComponent={() => <MyBody />}
                renderRow={row}
                renderSeparator={separator}
                style={{
                    height: '100%',
                    overflow: 'auto',
                }}
                pageSize={10}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
            />
            {/* <div className='addMore' onClick={()=>this.addMore()}>加载更多</div> */}
            
        </Layout>
    }   
}

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}
Search.contextTypes = {
    router: PropTypes.object.isRequired
};

// export default LoadingHoc(Search);
