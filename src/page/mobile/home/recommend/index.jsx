import React from 'react';
import ReactDOM from "react-dom";
import {Link} from 'react-router-dom';
import {Flex, ListView, Tabs, WhiteSpace} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
// import SearchNavBar from "../../../../components/search/index.jsx";
import homeApi from "../../../../api/home.jsx";
import {getServerIp} from "../../../../config.jsx";
import PropTypes from "prop-types";
import "./index.less";

/**
 * @ListView 使用了一些react-native中ListView的API，可以查询 https://mobile.ant.design/components/list-view-cn/
 * @ListView.dataSource 同上，查询 https://reactnative.cn/docs/0.26/listviewdatasource.html
 */

var hasMore = true;
const NUM_SECTIONS = 1;
const NUM_ROWS_PER_SECTION = 10;
let pageIndex = 0;

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

export default class RecommendProducts extends React.Component {

    constructor(props) {
        super(props);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            recommendData: [],

            dataSource,
            value: '',
            isLoading: true,
            ascChoose: true,
            tabIndex: 0,
            height: document.documentElement.clientHeight * 3 / 4,
        };
    }

    componentWillMount() {
        hasMore = true;
        pageIndex = 0;
        dataBlobs = {};
        sectionIDs = [];
        rowIDs = [];
        // this.requestRecommendData(1, 10, 0);
    }

    requestRecommendData(page, rows, condition) {
        homeApi.getRecommendList(page, rows, condition, (rs) => {
            if(rs && rs.success) {
                const proList = rs.obj.rows;
                let numlist = (rs.obj.pageNumber-1)*10 + rs.obj.rows.length;
                
                if(numlist == rs.obj.total){
                    hasMore = false;
                }

                this.setState({
                    recommendData: proList,
                    isLoading: false
                });
            }
        });
    }


    componentDidMount() {
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
        
    }

    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        console.log('hasMore',this.state.isLoading,hasMore)//this.state.isLoading &&
        if ( !hasMore) {
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

    onTabsChange(tab, index) {
        this.setState({
            isLoading: true,
            tabIndex: index
        },()=>{
            hasMore = true;
            pageIndex = 0;
            dataBlobs = {};
            sectionIDs = [];
            rowIDs = [];
            this.genData();
        });
        
        // const type = this.checkType(index);
        // this.requestRecommendData(1, 10, type);
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
            case 1: return (this.state.ascChoose)?2:3;
            case 2: return 1;
        }
    }

    genData(pIndex = 0) {
        let tt = this.checkType(this.state.tabIndex);
        console.log('tttttttttt',tt)
        this.requestRecommendData(pIndex+1, 10, tt);
        
        setTimeout(() => {
            console.log('recommendData',this.state.recommendData)
            let reData = this.state.recommendData;

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
                    // dataBlobs[rowName] = rowName;
                }
            }
            sectionIDs = [...sectionIDs];
            rowIDs = [...rowIDs];
            console.log('188188',dataBlobs,sectionIDs,rowIDs)

            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
            });
            
          }, 500);
    
        
    }

    render() {
        // console.log(this.state.recommendData);

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

                            
                            // this.requestRecommendData(1, 10, 3);
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
                            // this.requestRecommendData(1, 10, 2);
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
        const data = this.state.recommendData;

        let index = data.length - 1;
        const row = (rowdata, sectionID, rowID) => {
            // console.log("rowdata**********", rowdata);
            if (index < 0) {
                index = data.length - 1; //这是使它循环的原因
                //hasMore = false;
                return null
            }
            const obj = rowdata;
            // const obj = data[index--];
            // console.log("obj", obj);
            
            // console.log(" sectionID rowID",sectionID,rowID);
            
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

        return <Layout header={true} footer={false}>

            {/*<SearchNavBar/>*/}
            <WhiteSpace size="xs"/>

            <div style={{borderBottom: '1px solid green', backgroundColor:'white', color:'green', fontSize:'bold'}}>
                <Flex>
                    <Flex.Item style={{flex: '0 0 4%', marginRight:'0.4rem'}}>
                        <img src='./images/category/菜篮子.png'
                             style={{width:'90%', margin:'0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item>推荐产品</Flex.Item>
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
                    height: this.state.height,
                    overflow: 'auto',
                }}
                pageSize={10}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
            />


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



RecommendProducts.contextTypes = {
    router: PropTypes.object.isRequired
};