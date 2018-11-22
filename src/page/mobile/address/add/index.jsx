import React from 'react';
import { InputItem, TextareaItem, WhiteSpace, Toast, List } from 'antd-mobile';
import Card from "../../../../components/card/index.jsx";
import Submit from "../../../../components/submit/index.jsx";
import Navigation from "../../../../components/navigation/index.jsx"
import addressApi from "../../../../api/address.jsx";
import PropTypes from "prop-types";

const wechatId = localStorage.getItem("wechatId");

export default class AddAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            // province: '',
            // city: '',
            address: '',
            detail: ''
        };
    }

    addUserAddress() {
        const address = {
            "wechat_id": wechatId,
            "receiverName": this.state.name,
            "receiverAddress": this.state.address,
            "receiverMobile": this.state.phone,
            "isDefaultReceiverAddress": false,
        };

        addressApi.addAddress(address, (rs)=>{
            if(rs && rs.success) {
                Toast.info(rs.msg, 1);
                // this.context.router.history.push("/address");
                history.go(-1);
            }
        });
    }

    onReceiverNameChange = (value) =>{
        this.setState({
            name: value,
        });
    };

    onReceiverMobileChange = (value) => {
        this.setState({
            phone: value.replace(/\s+/g,""),
        });
    };

    onReceiverAddressChange = (value) => {
        this.setState({
            address: value,
        });
    };

    onReceiverAddressDetailChange = (value) => {
        this.setState({
            detail: value,
        });
    };

    render(){
        return <div>

            <Navigation title="添加地址" left={true} backLink="/address"/>
            <WhiteSpace/>

            <Card>
                <InputItem placeholder="姓名" onChange={this.onReceiverNameChange}>收货人</InputItem>
                <InputItem type="phone" placeholder="手机号码" onChange={this.onReceiverMobileChange}>联系方式</InputItem>
                <InputItem placeholder="填写详细地址" onChange={this.onReceiverAddressChange}>收货地址</InputItem>
                {/*<Picker extra="请选择(可选)"*/}
                        {/*data={district}*/}
                        {/*title="Areas"*/}
                        {/*{...getFieldProps('district', {*/}
                            {/*initialValue: ['340000', '341500', '341502'],*/}
                        {/*})}*/}
                        {/*onOk={e => console.log('ok', e)}*/}
                        {/*onDismiss={e => console.log('dismiss', e)}*/}
                {/*>*/}
                    {/*<List.Item arrow="horizontal">所在地区</List.Item>*/}
                {/*</Picker>*/}
                {/*<TextareaItem title="详细地址" rows={3} placeholder="填写详细的楼层或房间号信息" onChange={this.onReceiverAddressDetailChange}/>*/}
            </Card>
            <Submit>
                <div onClick={()=>{this.addUserAddress()}}>确认添加</div>
            </Submit>
        </div>
    }
}

AddAddress.contextTypes = {
    router: PropTypes.object.isRequired
};
