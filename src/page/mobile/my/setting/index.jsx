import React from "react";
import {List, WhiteSpace,DatePicker,Toast,Modal} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import PropTypes from "prop-types";
import myApi from "../../../../api/my.jsx";

const alert = Modal.alert;
const prompt = Modal.prompt;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const minDate = new Date('1900/01/01');
const wechatId = localStorage.getItem("wechatId");

export default class Setting extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            isVip:(localStorage.getItem("isVip")=="true")?true:false,
            isWebusiness:(localStorage.getItem("isWebusiness")=="1")?true:false,
            hadBindPhone:(localStorage.getItem("bindPhone")!='null')?true:false,
            dateNow:now, //当前时间
            dateSet:null, //会员设置时间
            vipAddress:null,
            vipName:null,
            vipMobile:null,
            vipAddressId:null
        }
    }
    componentWillMount(){
        //获得会员地址and生日
        console.log('this.props isVip',localStorage.getItem("isVip"),wechatId,localStorage.getItem("bindPhone"))
        myApi.vipAddressView(wechatId,(rs)=>{
            console.log('会员地址and生日',rs,new Date(rs.obj.birthday))
            if(rs && rs.success){
                let vipinfo = rs.obj;
                this.setState({
                    vipName:vipinfo.receiverName,
                    vipAddress:vipinfo.receiverAddress,
                    vipMobile:vipinfo.receiverMobile,
                    dateSet:(!vipinfo.birthday)?null:new Date(vipinfo.birthday),
                    vipAddressId:vipinfo.id,
                    
                })
            }
        })
    }

    formatDate(date) {
        const pad = n => n < 10 ? `0${n}` : n;
        const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        // const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;${timeStr}
        console.log('111111111',`${dateStr} `)
        return `${dateStr} `;
    }


    render() {

        return <Layout>

            <Navigation title="设置" left={true}/>
            <WhiteSpace/>
            <List>
                <div style={{display:(this.state.hadBindPhone)?'none':'line'}}>
                <List.Item
                    // thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    arrow="horizontal"
                    onClick={() => {this.context.router.history.push('/my/setting/tel')}}
                >
                    修改绑定手机号
                </List.Item>
                </div>
                <List.Item
                    // thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                    onClick={() => {this.context.router.history.push({pathname: '/address', state: {fromSet:'set'} })}}
                    arrow="horizontal"
                >
                    收货地址管理
                </List.Item>
                <div style={{display:(this.state.isVip)?'inline':'none'}}>
                <DatePicker
                    disabled={(this.state.dateSet === null) ?false:true}
                    maxDate = {this.state.dateNow}
                    minDate = {minDate}
                    mode="date"
                    title="选择日期"
                    extra="未设置"
                    value={this.state.dateSet}
                    //onChange
                    onOk={date => {
                        alert('提示信息', '会员生日只允许设置一次，设置后就不能修改。您是否继续设置?', [
                            { text: '取消', onPress: () => console.log('取消设置') },
                            { text: '确认', onPress: () => {
                                console.log('date',this.formatDate(date))
                                if(this.state.dateSet === null){
                                    console.log('date',date)
                                    this.setState({ dateSet:date });
                                    myApi.vipBirthdayAdd(wechatId,this.formatDate(date),(rs)=>{
                                        console.log('set vip birthday rs',rs)
                                    })
                                }
                                else
                                    Toast.info('会员生日已经设置无法修改', 1);
                            } },
                          ])
                        
                    }}
                >
                <List.Item arrow="horizontal" onClick={()=>{Toast.info('会员生日仅能设置一次', 2, null, false)}}>会员生日</List.Item>
                </DatePicker>
                </div>
                <div style={{display:(this.state.isVip)?'inline':'none'}}>
                <List.Item
                    onClick={() => {this.context.router.history.push({pathname:'/my/setting/vipAddress',state:{
                        vipName:this.state.vipName,
                        vipAddress:this.state.vipAddress,
                        vipMobile:this.state.vipMobile,
                        id:this.state.vipAddressId,
                    }})}}
                    arrow="horizontal"
                    extra={!this.state.vipAddress?"未设置":"修改"}
                >
                    会员地址
                </List.Item>
                </div>
            </List>

            <WhiteSpace/>
            <WhiteSpace/>

            <List>
            <div style={{display:(this.state.isWebusiness)?'inline':'none'}}>
                <List.Item
                    // thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    arrow="horizontal"
                    onClick={() => {
                        prompt('设置微商城名称', '', [
                            { text: '取消' },
                            { text: '设置', onPress: value => {
                                myApi.webusinessShopNameEdit(localStorage.getItem('WebusinessID'),value,(rs)=>{
                                    console.log('设置微商城名称rs',rs)
                                })
                                // myApi.webusinessShopNameEdit(191,value,(rs)=>{
                                //     console.log('设置微商城名称rs',rs)
                                // })
                            } },
                          ], 'default', '土特产微商城')
                    }}
                >
                    设置微商城名称
                </List.Item>
            </div>
            </List>

            <WhiteSpace/>
            <WhiteSpace/>

            <List>
                <List.Item
                    // thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                    arrow="horizontal"
                    onClick={() => {this.context.router.history.push('/my/setting/points')}}
                >
                    积分规则
                </List.Item>

                <List.Item
                    // thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                    onClick={() => {this.context.router.history.push('/my/setting/member')}}
                    arrow="horizontal"
                >
                    会员规则
                </List.Item>
            </List>

            <WhiteSpace/>
            <WhiteSpace/>

            <List>
                <List.Item
                    // thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"
                    onClick={() => {this.context.router.history.push('/my/setting/help')}}
                    arrow="horizontal"
                    
                >
                    帮助
                </List.Item>
            </List>

        </Layout>

    }
}

Setting.contextTypes = {
    router: PropTypes.object.isRequired
};