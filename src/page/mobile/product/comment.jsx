import React from 'react';
import {Pagination, Flex, WhiteSpace, Toast,ActivityIndicator,Button} from 'antd-mobile';
// import comment from "../../../static/mockdata/product_comment.js"; //mock假数据
import productApi from "../../../api/product.jsx";
import ImageView from 'react-mobile-imgview';
import 'react-mobile-imgview/dist/react-mobile-imgview.css'

import './index.less';

const pageSize = 10;
var totalPages = 0;

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // isLoading: true,
            data: [],
            // totalPages: 0,
            curPage: 1,
            animating:false,
            imagelist : [
            //    'http://pic5.photophoto.cn/20071228/0034034901778224_b.jpg',
            //    'http://pic5.photophoto.cn/20071228/0034034901778224_b.jpg',
            //    'http://pic5.photophoto.cn/20071228/0034034901778224_b.jpg',
            ],
            showViewer: false
           
        };
    }

    show(images) {
        this.setState({ showViewer: true, imagelist:images})
    }
    close() {
        this.setState({ showViewer: false})
    }
    

    componentWillMount() {
        this.requestComment(1);
    }

    requestComment(page) {
        console.log("请求页数", page);
        this.setState({ animating: !this.state.animating});
        productApi.getSpecialtyCommentDetail(this.props.specialtyId, page, pageSize, (rs) => {
            console.log("rs 55555555", rs);
            if (rs && rs.success) {
                
                const data = rs.obj.rows;
                this.setState({
                    data,
                },()=>{
                    this.setState({ animating: !this.state.animating});
                });
            }
        });
    }

    // componentDidMount() {
    //     this.requestData();
    // }
    //
    // requestData() {
    //     // 通过API获取首页配置文件数据
    //     // 模拟ajax异步获取数据
    //     setTimeout(() => {
    //         const data = comment.data;   //mock假数据
    //         // const data = this.props.comment;
    //         this.setState({
    //             data,
    //             // isLoading: false
    //         });
    //     }, 500);
    // }

    generateStars(star_num) {
        var stars = [];
        for(let i = 0; i < star_num; i++){
            stars.push(<img key={i} src="./images/icons/星.png" style={{width: '4%', marginBottom: 8}}/>);
        }
        return stars;
    }

    checkAnonymous(isAnonymous, name) {
        if (isAnonymous) {
            return name.substr(0, 1) + "********" + name.substr(-1);
        } else{
            let s = name;
            if(name!=null&&name.length>10){
            s = name.substring(0,10)+"...";
            }
            return s
        }
    }

    checkNum(num) {
        if (num === 0) {
            return "暂无"
        }
        return num
    }


    requestFormerPage() {     
        if ((this.state.curPage - 1) < 1) {
            Toast.info("已经是第一页啦", 1);
        } else {
            this.setState({
                curPage: --this.state.curPage,
            });
            this.requestComment(this.state.curPage);
        }
    }

    requestLatterPage() {
        if ((this.state.curPage + 1) > totalPages) {
            Toast.info("已经是最后一页啦", 1);
        } else {
            this.setState({
                curPage: ++this.state.curPage,
            });
            this.requestComment(this.state.curPage);
        }
    }


    checkPagination(num) {
        if (num === 0) {
            return null
        } else {
            totalPages = Math.floor((this.props.total + pageSize - 1) / pageSize);

            return <div>
            <Pagination total={totalPages}
                            className="custom-pagination"
                            current={this.state.curPage}
                            locale={{
                                prevText: (<span className="arrow-align"
                                                 onClick={() => {this.requestFormerPage()}}
                                >
                                    上一页</span>),
                                nextText: (<span className="arrow-align"
                                                 onClick={() => {this.requestLatterPage()}}
                                >
                                    下一页</span>),
                            }}
                            style={{width:'80%', marginLeft:'10%',marginTop:"0.5rem" }}
                />
            </div>
        }
    }

    render() {
        
      
        const content = this.state.data && this.state.data.map((item, index1) => {
            //  console.log("*******************",item.images)
            let imgs = item.images && item.images.map((item)=>{
                return item.sourcePath
                // return <img src={item.sourcePath} style={{width:'50%',height:'20%',paddingLeft:'1%',paddingRight:'1%',paddingTop:'1%'}}/>
            
            })
            // console.log("*******************",imgs,imgs.length)
            return <Flex style={{background:'#fff', borderBottom:'1px solid #eee'}} key={index1}>
                <Flex.Item>
                    <WhiteSpace/>
                    <div>{this.generateStars(item.contentLevel)}</div>
                    <div style={{}}>{item.appraiseContent}</div>
                    <Flex wrap="wrap" justify="end" style={{paddingTop:'1rem',paddingBottom:'1rem'}}>
                        <div style={{display:(imgs.length == 0)?'none':'inline'}}>
                            <Button type="ghost" size="small" inline onClick={e=>this.show(imgs)}>查看评价图片</Button>
                        </div>
                    </Flex>
                    
                    <div style={{color:'#ccc'}}>
                        {new Date(item.appraiseTime).toLocaleString()}
                        <span style={{color:'black', float:'right', marginRight:'1rem'}}>{this.checkAnonymous(item.isAnonymous, item.wechatName)}</span>
                    </div>
                </Flex.Item>
            </Flex>
        });


        return <div className="comment">
            <div className="comment_title">评价({this.checkNum(this.props.total)})</div>

            {content}

            {this.checkPagination(this.props.total)}
            
            <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
              />

              <div>
                {
                    this.state.showViewer && <ImageView imagelist={this.state.imagelist} close={this.close.bind(this)} />
                }
                
            </div>

            </div>

          


    }

}



