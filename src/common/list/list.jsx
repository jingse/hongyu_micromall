import React from 'react';
import ReactDOM from "react-dom";
import {Link} from 'react-router-dom';
import {Flex, ListView, Tabs, WhiteSpace} from 'antd-mobile';
import Layout from "../../common/layout/layout.jsx";
import {getServerIp} from "../../config.jsx";
import homeApi from "../../api/home.jsx";
import httpManager from '../../manager/HttpManager.jsx';  //不能删除

let hasMore = true;
const NUM_SECTIONS = 1;
const NUM_ROWS_PER_SECTION = 10;
let pageIndex = 0;

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];


export default class List extends React.PureComponent {
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
            // 接口调用需要的参数
            anotherValue: this.props.anotherValue,
            fixedValue:this.props.fixedValue,

            data: [],
            dataSource,
            ascChoose: true,
            isLoading: true,
            tabIndex: 0,
            height: document.documentElement.clientHeight * 3 / 4,
        };
        this.onTabsChange = this.onTabsChange.bind(this);
    }


    componentWillMount() {

        this.requestListData(this.state.fixedValue, this.state.anotherValue, 1, 10, 0);

        console.log("this.state.data", this.state.data);
        hasMore = true;
        pageIndex = 0;
        dataBlobs = {};
        sectionIDs = [];
        rowIDs = [];
    }


    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.setState({
            height: hei,
        });

        setTimeout(() => {

            this.genData();

        }, 300);
    }

    requestListData(unUsed1, unUsed2, page, rows, condition) {
        const name = this.props.funcName;

        eval( "(" + homeApi[name] + ')' + "(unUsed1, unUsed2, page, rows, condition, (rs) => {\n" +
            "            if (rs && rs.success) {\n" +
            "                const proList = rs.obj.rows;\n" +
            "                let numlist = (rs.obj.pageNumber - 1) * 10 + rs.obj.rows.length;\n" +
            "\n" +
            "                if (numlist === rs.obj.total)\n" +
            "                    hasMore = false;\n" +
            "                \n" +
            "                this.setState({\n" +
            "                    data: proList,\n" +
            "                    isLoading: false\n" +
            "                });\n" +
            "            }\n" +
            "        })");
    }

    onEndReached = (event) => {

        if (!hasMore) {
            return;
        }
        this.setState({isLoading: true});
        setTimeout(() => {

            this.genData(++pageIndex);

        }, 500);
    };

    onTabsChange(tab, index) {
        this.setState({
            isLoading: true,
            tabIndex: index
        }, () => {
            hasMore = true;
            pageIndex = 0;
            dataBlobs = {};
            sectionIDs = [];
            rowIDs = [];
            this.genData();
        });

        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 500);
    }

    checkType(index) {
        switch (index) {
            case 0:
                return 0;
            case 1:
                return (this.state.ascChoose) ? 2 : 3;
            case 2:
                return 1;
        }
    }

    genData(pIndex = 0) {
        let tt = this.checkType(this.state.tabIndex);
        this.requestListData(this.state.fixedValue, this.state.anotherValue, pIndex + 1, 10, tt);

        console.log("请求完之后", this.state.data);

        setTimeout(() => {

            let reData = this.state.data;
            console.log("请求完之后 reData", this.state.data);

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

            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
            });
        }, 300);
    }

    onChange(value) {
        this.setState({
            anotherValue: value
        });
    }


    render() {
        const tabs = [
            {title: '综合排序', sub: 'default'},
            {
                title: <Flex>
                    <Flex.Item style={{flex: '0 0 80%', textAlign: 'center'}}>
                        按价格排序
                    </Flex.Item>
                    <Flex.Item style={{marginLeft: -1, flex: '0 0 30%'}}>
                        <div onClick={() => {
                            this.state.ascChoose = true;
                            this.setState({ascChoose: true}, () => {
                                hasMore = true;
                                pageIndex = 0;
                                dataBlobs = {};
                                sectionIDs = [];
                                rowIDs = [];
                                this.genData();
                            });
                            console.log("升序")
                        }}>
                            <img src={this.state.ascChoose ? "./images/icons/升序-选中.png" : "./images/icons/升序.png"}
                                 style={{width: '50%'}}/>
                        </div>
                        <div onClick={() => {
                            this.state.ascChoose = false;
                            this.setState({ascChoose: false}, () => {
                                hasMore = true;
                                pageIndex = 0;
                                dataBlobs = {};
                                sectionIDs = [];
                                rowIDs = [];
                                this.genData();
                            });
                            console.log("降序")
                        }}>
                            <img src={this.state.ascChoose ? "./images/icons/降序.png" : "./images/icons/降序-选中.png"}
                                 style={{width: '50%'}}/>
                        </div>
                    </Flex.Item>

                </Flex>,
                sub: 'price'
            },
            {title: '按销量排序', sub: 'comments'},
        ];

        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    borderTop: '1px dashed #ECECED',
                    borderBottom: '1px dashed #ECECED',
                }}
            />
        );
        const data = this.state.data;

        let index = data.length - 1;
        const row = (rowdata, sectionID, rowID) => {
            if (index < 0) {
                index = data.length - 1; //这是使它循环的原因
                return null
            }
            const obj = rowdata;
            if (obj) {
                return (
                    <div key={rowID} style={{padding: '0 15px'}}>
                        <Link to={{pathname: `/product/${obj.specialty.id}`}}>
                            <div style={{display: 'flex', padding: '15px 0'}}>
                                <img style={{height: '4rem', width: '25%', marginRight: '2rem'}}
                                     src={"http://" + getServerIp() + obj.iconURL.mediumPath}/>
                                <div style={{lineHeight: 1, color: 'black'}}>
                                    <div style={{marginBottom: 10}}>{obj.specialty.name}</div>
                                    <div style={{marginBottom: 10}}><span
                                        style={{color: 'darkorange'}}>￥{obj.pPrice}元</span></div>
                                    {/* <div style={{marginBottom: 10}}>商品规格：<span style={{color:'darkorange'}}>{obj.specification.specification}</span></div> */}
                                    <div>总销量：<span style={{color: 'darkorange'}}>{obj.hasSold}</span></div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            } else {
                return null;
            }

        };

        return <Layout header={true} footer={false} isSearchAgain={this.props.isSearchAgain}>

            <WhiteSpace size="xs"/>


            <div style={{borderBottom: '1px solid green', backgroundColor: 'white', color: 'green', fontSize: 'bold'}}>
                <Flex>
                    <Flex.Item style={{flex: '0 0 4%', marginRight: '0.4rem'}}>
                        <img src='./images/category/菜篮子.png'
                             style={{width: '90%', margin: '0.4rem'}}/>
                    </Flex.Item>
                    <Flex.Item>{this.props.name}</Flex.Item>
                </Flex>
            </div>

            <div className="search_container">
                <Tabs tabs={tabs}
                      onChange={this.onTabsChange}
                      initialPage={this.state.tabIndex}
                      useOnPan={false}
                >
                </Tabs>
            </div>

            <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{height: '10%', textAlign: 'center'}}>
                    {this.state.isLoading ? '加载中...' : (hasMore ? '加载完成' : '没有更多信息')}
                </div>)}
                renderBodyComponent={() => <MyBody/>}
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
            <span style={{display: 'none'}}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}