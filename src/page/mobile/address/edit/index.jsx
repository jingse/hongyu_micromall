import React from 'react';
import {InputItem, Toast, WhiteSpace} from 'antd-mobile';
import Card from "../../../../components/card/index.jsx";
import Submit from "../../../../components/submit/index.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import addressApi from "../../../../api/address.jsx";
import PropTypes from "prop-types";


export default class EditAddress extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            province: '',
            // city: '',
            detail: '',
            isDefault: false,
        };
    }

    componentWillMount() {
        const address = this.props.location.state;
        // if(address){
        this.setState({
            name: address.receiverName,
            phone: address.receiverMobile,
            province: address.receiverAddress,
            detail: address.receiverAddress,
            isDefault: address.isDefaultReceiverAddress,
        });
        // }
        // else
        // history.back();
    }

    editAddress() {
        if(this.state.name==""||this.state.province==""||this.state.phone==""){
            Toast.info("您有信息未填写", 1);
        }
        else{
            const address = {
                "id": this.props.location.state.id,
                "wechat_id": localStorage.getItem("wechatId"),
                "receiverName": this.state.name,
                "receiverAddress": this.state.province,
                "receiverMobile": this.state.phone,
                "isDefaultReceiverAddress": this.state.isDefault,
            };
    
            addressApi.editAddress(address, (rs) => {
                if (rs && rs.success) {
                    // console.log("rs.msg: ", rs.msg);
                    Toast.info(rs.msg, 1);
                    history.go(-1);
                    // this.context.router.history.push("/address");
                }
            });
        }
    }

    onReceiverNameChange = (value) => {
        this.setState({
            name: value,
        });
    };

    onReceiverMobileChange = (value) => {
        this.setState({
            phone: value.replace(/\s+/g, ""),
        });
    };

    onReceiverAddressChange = (value) => {
        this.setState({
            province: value,
        });
    };

    // onReceiverAddressDetailChange = (value) => {
    //     this.setState({
    //         detail: value,
    //     });
    // };


    render() {
        return <div>

            <Navigation title="编辑地址" left={true} backLink="/address"/>
            <WhiteSpace/>

            <Card>
                <InputItem placeholder="姓名" defaultValue={this.state.name} clear
                           onChange={this.onReceiverNameChange}>收货人</InputItem>
                <InputItem placeholder="手机号码" type="phone" defaultValue={this.state.phone} clear
                           onChange={this.onReceiverMobileChange}>联系方式</InputItem>
                <InputItem placeholder="填写详细地址" defaultValue={this.state.province} clear
                           onChange={this.onReceiverAddressChange}>收货地址</InputItem>
                {/*<TextareaItem title="详细地址" rows={3} defaultValue={this.state.detail} clear onChange={this.onReceiverAddressDetailChange}/>*/}
            </Card>
            <Submit onClick={() => {
                this.editAddress()
            }}>
                确认
            </Submit>
        </div>
    }
}

EditAddress.contextTypes = {
    router: PropTypes.object.isRequired
};
