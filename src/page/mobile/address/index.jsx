import React from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {Toast, WhiteSpace} from 'antd-mobile';
import Card from "../../../components/card/index.jsx";
import Submit from "../../../components/submit/index.jsx";
import Navigation from "../../../components/navigation/index.jsx"
import addressApi from "../../../api/address.jsx";
import './index.less';


export default class Address extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            shipData: [],
            isLoading: true,
            clear: false,
        };
    }

    componentWillMount() {
        console.groupCollapsed("地址列表页");
        this.requestAddressList();
    }

    componentWillUnmount() {
        console.groupEnd();
    }

    requestAddressList() {

        addressApi.getAddressList(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const shipData = rs.obj;

                if (!shipData.length) {
                    this.setState({
                        shipData: shipData,
                    });
                    Toast.info('您还没有地址，去添加一个吧！', 1);
                } else {
                    this.setState({
                        shipData: shipData,
                    });
                }
            }
        });
    }

    checkDefaultAddress(defaultAddress, item) {
        if (defaultAddress) {
            return <span style={{color: 'darkorange'}}>
                {/*<input type="checkbox" id="check1" style={{marginRight:'0.8rem'}}  />*/}
                <label htmlFor="check1">默认地址</label>
            </span>
        }
        return <span>
            <input type="checkbox" id="check1" checked={this.state.clear}
                   style={{marginRight: '0.8rem'}}
                   onClick={() => {
                       this.setState({clear: false});
                       if (!this.state.clear) {
                           this.changeDefaultAddress(item);
                       }
                   }}/>
                <label htmlFor="check1">设为默认</label>
            </span>
    }

    deleteAddress(id) {
        addressApi.deleteAddress(id, (rs) => {
            if (rs && rs.success) {
                console.log("删除地址返回",rs.msg,JSON.parse(localStorage.getItem("chooseAddress")).id);
                if (localStorage.hasOwnProperty("chooseAddress")) {
                    console.log("1111")
                    if(JSON.parse(localStorage.getItem("chooseAddress")).id == id){
                        console.log("1112")
                        localStorage.removeItem("chooseAddress")
                    }
                }
                this.requestAddressList();
            }
        });
    }

    changeDefaultAddress(item) {
        console.log(item);
        const address = {
            "id": item.id,
            "wechat_id": item.wechat_id,
            "receiverName": item.receiverName,
            "receiverAddress": item.receiverAddress,
            "receiverMobile": item.receiverMobile,
            "isDefaultReceiverAddress": !item.isDefaultReceiverAddress,
        };

        addressApi.editAddress(address, (rs) => {
            if (rs && rs.success) {
                console.log("rs.msg: ", rs.msg);
                Toast.info("修改默认地址成功！");
                this.requestAddressList();
            }
        });
    }

    chooseAddress(item) {
        console.log("url: ", window.location.href.split('#'));
        const curUrl = window.location.href.split('#')[1];

        //如果是设置页面进入的地址页面，不做任何操作
        //如果是支付页面进入的地址页面，选择了地址后就返回支付页面
        if (curUrl === "/payment/address") {
            localStorage.setItem("chooseAddress", JSON.stringify(item));
            history.go(-1)
        }
    }


    linkTo(link) {
        this.context.router.history.push(link);
    }

    render() {

        const content = this.state.shipData && this.state.shipData.map((item, index) => {
            return <Card className="address_card" key={index}>
                <div className="address_card_underline" onClick={() => {
                    this.chooseAddress(item)
                }}>
                    <div className="addr_name">收货人：{item.receiverName}</div>
                    <div className="addr_phone">{item.receiverMobile.replace(/\s+/g, "")}</div>
                    <div className="addr_detail">地址：{item.receiverAddress}</div>
                </div>
                <div className="address_card_edit">
                    {this.checkDefaultAddress(item.isDefaultReceiverAddress, item)}

                    <img src="./images/icons/删除.png" style={{float: 'right', width: '4%', marginLeft: "3rem"}}
                         onClick={() => {
                             this.deleteAddress(item.id)
                         }}/>

                    <Link to={{pathname: window.location.href.split('#')[1] + '/edit', state: item}}>
                        <img src="./images/icons/编辑.png" style={{float: 'right', width: '4%', marginLeft: "3rem"}}/>
                    </Link>
                </div>
            </Card>
        });

        return <div>

            {/*<Navigation title="选择收货地址" left={true} back={this.linkTo('/cart/payment')}/>*/}
            <Navigation title="选择收货地址" left={false}/>
            <WhiteSpace/>

            {content}

            <Submit onClick={() => {
                this.linkTo(window.location.href.split('#')[1] + '/add')
            }}>添加新地址</Submit>
        </div>
    }
}
