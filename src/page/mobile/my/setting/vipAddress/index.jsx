import React from "react";
import {Card,InputItem,ActivityIndicator,Toast} from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import myApi from "../../../../../api/my.jsx";
const wechatId = localStorage.getItem("wechatId");
export default class vipAddress extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            vipName:null,
            vipAddress:null,
            vipPhone:null,
            editable:true,
            id:null,
            animating:false,
            isZero:true,
        }
    }

    componentWillMount(){
        console.log("9999",this.props.location.state)
        let sta = this.props.location.state;
        let tempEdit = (!sta.vipAddress)?true:false;
        console.log(tempEdit)
        this.setState({
            id:sta.id,
            vipName:sta.vipName,
            vipAddress:sta.vipAddress,
            vipPhone:sta.vipMobile,
            editable:tempEdit,
            isZero:tempEdit,
        })
    }
    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }

    addUserAddress() {
        console.log(this.state)
        if (this.state.vipName === '') {
            Toast.info("请输入会员姓名！", 1);
            return
        } else if (this.state.vipPhone === '') {
            Toast.info("请输入会员手机号！", 1);
            return
        } else if (this.state.vipAddress === '') {
            Toast.info("请输入会员详细地址！", 1);
            return
        } 
        this.setState({ animating: !this.state.animating,editable:!this.state.editable});
        if(!this.state.editable){
            this.closeTimer = setTimeout(() => {
                this.setState({ animating: !this.state.animating });
              }, 500);
            return;
        }
        const address = {
            "vipName": this.state.vipName,
            "vipAddress": this.state.vipAddress,
            "vipPhone": this.state.vipPhone,
            'wechatId':wechatId,
            'id':this.state.id
        };
        console.log('address',address)
        console.log('isZero',this.state.isZero)
        if(this.state.isZero){
            myApi.vipAddressAdd(wechatId,this.state.vipName,this.state.vipPhone,this.state.vipAddress, (rs)=>{
                console.log('rsssssssssss',rs)
                if(rs && rs.success) {
                    console.log('rsssssssssss',rs)
                    Toast.info(rs.msg, 1);
                    // this.context.router.history.push("/address");
                    history.go(-1);
                }
            });
        }
        else{
            myApi.vipAddressEdit(wechatId,this.state.id,this.state.vipName,this.state.vipPhone,this.state.vipAddress, (rs)=>{
                console.log('rsssssssssss4444',rs)
                if(rs && rs.success) {
                    
                    Toast.info(rs.msg, 1);
                    // this.context.router.history.push("/address");
                    history.go(-1);
                }
            });
        }
        

        this.closeTimer = setTimeout(() => {
            this.setState({ animating: !this.state.animating });
          }, 500);
    }
    vipNameChange(val){
        this.setState({
            vipName:val
        })
    }
    vipPhoneChange(val){
        this.setState({
            vipPhone:val
        })
    }
    vipAddressChange(val){
        this.setState({
            vipAddress:val
        })
    }

    render() {

        return <Layout>

            <Navigation title="会员地址" left={true}/>
            <Card>
                <InputItem placeholder="会员姓名" editable={this.state.editable} value={this.state.vipName} onChange={(val)=>this.vipNameChange(val)}>收货人</InputItem>
                <InputItem type="phone" placeholder="会员手机号码" editable={this.state.editable} value={this.state.vipPhone} onChange={(val) =>this.vipPhoneChange(val)}>联系方式</InputItem>
                <InputItem placeholder="会员详细地址" editable={this.state.editable} value={this.state.vipAddress} onChange={(val)=>this.vipAddressChange(val)}>收货地址</InputItem>
            </Card>
            <Submit>
                <div onClick={()=>{this.addUserAddress()}}>{this.state.editable?'确认':'修改'}</div>
            </Submit>
            <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
              />

        </Layout>

    }
}