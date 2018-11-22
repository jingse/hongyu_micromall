import React from "react";
import {Card, WhiteSpace, Flex, TextareaItem, Checkbox, ImagePicker, Toast ,ActivityIndicator} from "antd-mobile";
// import { Link } from 'react-router-dom';
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import wxconfig from "../../../../../config.jsx";
import PropTypes from "prop-types";
import commentApi from "../../../../../api/my.jsx";
import { createForm } from 'rc-form';
import {getServerIp} from "../../../../../config.jsx";


// 需传入评价者名称、订单id
// const data = [{
//     url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
//     id: '2121',
// }, {
//     url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
//     id: '2122',
// }];
var llfkey = false;
const AgreeItem = Checkbox.AgreeItem;
const filesURL = new Array();;
let sendPic = 0;

class CommentOn extends React.Component {

    constructor(props) {
        super(props);

        const length = this.props.location.order.orderItems.length;
        var isLighted = new Array(length);
        var files = new Array(length);
        var anonymous = new Array(length);
        for (var i = 0; i < length; i++) {
            isLighted[i] = new Array(5);
            files[i] = new Array();
            anonymous[i] = false;
            for (var j = 0; j < 5; j++) {
                isLighted[i][j] = true;
            }
        }

        this.state = {
            order: this.props.location.order,
            isLighted,
            files,
            anonymous,
            animating:false
        };
    }

    componentWillMount() {
        let length = this.props.location.order.orderItems.length;
        for (var i = 0; i < length; i++) {
            filesURL[i] = new Array();
        }
    }

    getStarCount(index) {
        let starCount = 0;
        for (let i = 0; i < this.state.isLighted[index].length; i++) {
            if (this.state.isLighted[index][i]) {
                starCount++;
            }
        }
        return starCount;
    }

    //index:被点击的星的位置
    //pos:被评价的商品的位置
    makeFormerFull(index, pos) {
        //如果点击的那颗星是空的，那么把它和它之前的星都点亮
        //否则，把它和它后面的星都置空
        if (this.state.isLighted[pos][index]) {
            for (let i = 0; i < index; i++) {
                this.state.isLighted[pos][i] = true;
            }
        } else {
            for (let i = 4; i > index; i--) {
                this.state.isLighted[pos][i] = false;
            }
        }
        this.setState({isLighted:this.state.isLighted});
    }

    makeLatterNull(index, pos) {
        for (let i = 4; i > index; i++) {
            this.state.isLighted[pos][i] = false;
        }
    }


    getStarDescription(i) {
        if (this.getStarCount(i) === 1) {
            return "很差";
        } else if (this.getStarCount(i) === 2) {
            return "较差";
        } else if (this.getStarCount(i) === 3) {
            return "一般";
        } else if (this.getStarCount(i) === 4) {
            return "较好";
        } else if (this.getStarCount(i) === 5) {
            return "非常好";
        } else {

        }
    }

    commentOnProduct() {
        console.log("comment");
        // let formData = new FormData(this.refs.idcardFront);
        // console.log('formData',formData.get("files"))
        
        // fetch("http://admin.swczyc.com/hyapi/resource/image/upload",{
        //     method: 'POST',
        //     headers: {
        //     },body: formData,}).then((response) => response.json()).then((rs)=>{
        //         console.log('11111111111111888888888888',rs)
        // })

        // productApi.pushcom(formData,(rs)=>{
        //         console.log('llllllllllllllllllllllllllllllllllllfff',rs)
        // });
        let picNUm = 0;
        this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            picNUm = picNUm + this.state.files[index].length;
        });
        console.log('picNUm picNUm',picNUm)

        this.setState({animating: !this.state.animating});
        this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            
            if(this.state.files[index].length == 0){
                if(index == this.state.order.orderItems.length-1){
                    this.createCom()
                    // this.setState({ animating: !this.state.animating });
                }
            }
            else{
                for(let key in this.state.files[index]){
                    let formData = new FormData();
                    let files = this.state.files[index][key].file;
                    console.log('files size',files.size)
                    formData.append("files", files);
                    console.log('formData',formData.get("files"))
                    fetch("http://admin.swczyc.com/hyapi/resource/image/upload",{
                    //fetch("http://admin.lvxingbox.cn/hyapi/resource/image/upload",{
                    method: 'POST',
                    headers: {
                    },body: formData,}).then((response) => response.json()).then((rs)=>{
                        console.log('sourcePath',rs)
                        filesURL[index].push({"sourcePath":"http://ymymmall.swczyc.com" + rs.obj[0]});
                        //filesURL[index].push({"sourcePath":"http://ymymmall.lvxingbox.cn" + rs.obj[0]});
                        sendPic=sendPic+1;
                        console.log("uppppppppppppp",sendPic,key,index)

                        if(sendPic == picNUm){  
                            console.log('上传返回')
                            sendPic=0;
                            this.createCom()        
                        }
                            
                        // if(key == this.state.files[index].length-1 && index == this.state.order.orderItems.length-1)
                        //     {
                                
                                // this.closeTimer = setTimeout(() => {
                                //     console.log('上传返回')
                                //     this.createCom()
                                // }, 5000);
 
                            // }
                    })
                }
            }
        });
    }


    createCom(){
        console.log('filesURL',filesURL)
        const appraises = this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            const appraiseFormName = "count"+index;
            return {
                "orderItemId": item.id,
                "specialtyAppraise":
                    {
                        "appraiseContent": this.props.form.getFieldsValue()[appraiseFormName],
                        "appraiseTime": new Date(),
                        "contentLevel": this.getStarCount(index),
                        "isAnonymous": this.state.anonymous[index],
                        "isShow": true,
                        "images":filesURL[index],
                    },
            }
        });
        var appraisesInformation = {
            "wechat_id": localStorage.getItem("wechatId"),
            "wrapAppraises": appraises,
        };
        console.log("appraisesInformation", appraisesInformation);
        commentApi.applyAppraises(appraisesInformation, (rs)=>{
            console.log("rs: ", rs);
            if (rs && rs.success) {
                Toast.info('评价成功！', 1);
            } else {
                Toast.info('哎呀，出错了！', 1);
            } 
            this.setState({ animating: !this.state.animating });
            history.go(-1)
        });

    }

    linkTo(link) {
        this.context.router.history.push(link);
    }

    onChange = (fileIndex, files, type, index) => {
        console.log('onChange',fileIndex, files, type, index);
        console.log('files', files);
        this.state.files[fileIndex] = files;
        this.setState({
            files: this.state.files,
        });
    };

    onChangeAnonymous(index, e) {
        this.state.anonymous[index] = e.target.checked;
        this.setState({
            anonymous: this.state.anonymous,
        });
    }

    getStarOfIndex(i) {
        const content = this.state.isLighted[i] && this.state.isLighted[i].map((item, index) => {

            return <img key={index} src={item ? "./images/icons/星.png" : "./images/icons/星-空.png"} style={{marginLeft:'0.8rem'}}
                        onClick={() => {
                            this.state.isLighted[i][index] = !this.state.isLighted[i][index];
                            this.setState({isLighted: this.state.isLighted});
                            this.makeFormerFull(index, i);
                            // this.setState({isLighted: this.state.isLighted});
                        }}/>

        });
        return content
    }

    render() {
        console.log("order", this.state.order);
        console.log("this.state.files", this.state.files);
        console.log("this.props.form.getFieldsValue()", this.props.form.getFieldsValue());

        const { getFieldProps } = this.props.form;

        const comments = this.state.order.orderItems && this.state.order.orderItems.map((item, index) => {
            const files = this.state.files[index];

            return <div key={index}>
                <Card>
                    <div>
                        <Flex>
                            <Flex.Item style={{flex:'0 0 20%'}}>
                                <img src={"http://" + getServerIp() + item.iconURL.mediumPath} style={{width:'70%', padding:'1rem'}}/>
                            </Flex.Item>
                            <Flex.Item>
                                <span>描述相符</span>
                                <span>{this.getStarOfIndex(index)}</span>
                                <span style={{marginLeft:'0.8rem', color:'#999'}}>{this.getStarDescription(index)}</span>
                            </Flex.Item>
                        </Flex>
                    </div>
                </Card>

                <WhiteSpace/>

                <Card>
                    <div style={{borderBottom: '1px solid #ccc'}}>
                        <TextareaItem
                            autoHeight
                            rows={5}
                            count={200}
                            // labelNumber={5}
                            placeholder="商品好吗？给其他想买的小伙伴做个参考呗"
                            {...getFieldProps('count'+[index], {
                                initialValue: '',
                            })}
                        />
                    </div>
                    <ImagePicker
                        files={files}
                        onChange={this.onChange.bind(this, index)}
                        onImageClick={(index, fs) => console.log('onImageClick',index, fs)}
                        selectable={files.length < 5}
                        multiple={true}
                    />
                    <div style={{fontSize:'0.7rem'}}>
                        <AgreeItem data-seed="logId" onChange={e => this.onChangeAnonymous(index, e)}>
                            匿名 <a onClick={(e) => { e.preventDefault(); alert('agree it'); }}/>
                        </AgreeItem>
                    </div>
                </Card>
                <WhiteSpace/>
            </div>
        });

        return <Layout header={false} footer={false}>

            <Navigation title="发表评价" left={true}/>
            <WhiteSpace/>

            {comments}
            {/* <form ref="idcardFront" encType="multipart/form-data">
                <input type="file" name="files" accept="image/*">
                </input>
            </form> */}
            <Submit onClick={()=>{this.commentOnProduct()}}>
                <span>提交</span>
            </Submit>
            <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
              />
            
        </Layout>

    }
}

CommentOn.contextTypes = {
    router: PropTypes.object.isRequired
};

const CommentOnWrapper = createForm()(CommentOn);
export default CommentOnWrapper;