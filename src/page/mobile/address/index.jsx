import React from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import { Toast, WhiteSpace } from 'antd-mobile';
import Card from "../../../components/card/index.jsx";
import Submit from "../../../components/submit/index.jsx";
import Navigation from "../../../components/navigation/index.jsx"
import addressApi from "../../../api/address.jsx";
// import ship_data from "../../../static/mockdata/user_ship_address.js";   //mock假数据
import './index.less';
//add 注释
// const wechatId = parseInt(localStorage.getItem("wechatId"));

export default class Address extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            shipData: [],
            isLoading: true,
            clear: false,
        };
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount() {
        this.requestAddressList();
    }

    requestAddressList() {
        console.log("请求地址列表");
        addressApi.getAddressList(localStorage.getItem("wechatId"), (rs) => {
            if(rs && rs.success) {
                const shipData = rs.obj;

                if (!shipData.length) {
                    // Toast.offline('您还没有地址，去添加一个吧！', 1, ()=>{
                    //     this.linkTo('address/add');
                    // });
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
            return <span style={{color:'darkorange'}}>
                {/*<input type="checkbox" id="check1" style={{marginRight:'0.8rem'}}  />*/}
                <label htmlFor="check1">默认地址</label>
            </span>
        }
        return <span>
            <input type="checkbox" id="check1" checked={this.state.clear}
                   style={{marginRight:'0.8rem'}}
                   onClick={()=>{
                       this.setState({clear: false});
                       if (!this.state.clear) {
                           this.changeDefaultAddress(item);
                       }
                   }}/>
                <label htmlFor="check1">设为默认</label>
            </span>
    }

    deleteAddress(id) {
        addressApi.deleteAddress(id, (rs)=>{
            if (rs && rs.success) {
                console.log(rs.msg);
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

        addressApi.editAddress(address, (rs)=>{
            if(rs && rs.success) {
                console.log("rs.msg: ", rs.msg);
                Toast.info("修改默认地址成功！");
                this.requestAddressList();
            }
        });
    }

    chooseAddress(item) {
        if(this.props.location.state.fromSet === 'set')
            return;
        console.log("item", item);
        localStorage.setItem("chooseAddress", JSON.stringify(item));
        history.go(-1)
        // this.linkTo("/cart/payment");
    }

    linkTo(link) {
        this.context.router.history.push(link);
    }
    
    render(){

        // const content = this.state.shipData && this.state.shipData.map((item, index) => {
        //     return <Card className="address_card" key={index}>
        //         <div className="address_card_underline">
        //             <div className="addr_name">{item.name}</div>
        //             <div className="addr_phone">{item.tel}</div>
        //             <div className="addr_detail">{item.ship_address}</div>
        //         </div>
        //         <div className="address_card_edit">
        //             <input type="checkbox" id="check1" style={{marginRight:'0.8rem'}}  />
        //             <label htmlFor="check1">默认地址</label>
        //             {/*<img src="./images/icons/删除.png" style={{float: 'right', width:'4%'}}/>*/}
        //             <div className="addr_delete">删除</div>
        //             <Link to={{pathname:'/address/edit'}}>
        //                 {/*<img src="./images/icons/编辑.png" style={{float: 'right', width:'4%'}}/>*/}
        //                 <div className="addr_edit">编辑</div>
        //             </Link>
        //         </div>
        //     </Card>
        // });

        const content = this.state.shipData && this.state.shipData.map((item, index) => {
            return <Card className="address_card" key={index}>
                <div className="address_card_underline" onClick={()=>{this.chooseAddress(item)}}>
                    <div className="addr_name">收货人：{item.receiverName}</div>
                    <div className="addr_phone">{item.receiverMobile.replace(/\s+/g,"")}</div>
                    <div className="addr_detail">地址：{item.receiverAddress}</div>
                </div>
                <div className="address_card_edit">
                    {/*<input type="checkbox" id="check1" style={{marginRight:'0.8rem'}}  />*/}
                    {this.checkDefaultAddress(item.isDefaultReceiverAddress, item)}

                    <img src="./images/icons/删除.png" style={{float: 'right', width:'4%', marginLeft: "3rem"}}
                         onClick={()=>{this.deleteAddress(item.id)}}/>
                    {/*<div className="addr_delete">删除</div>*/}
                    <Link to={{pathname:'/address/edit', state: item}}>
                        <img src="./images/icons/编辑.png" style={{float: 'right', width:'4%', marginLeft: "3rem"}}/>
                        {/*<div className="addr_edit">编辑</div>*/}
                    </Link>
                </div>
            </Card>
        });

        return <div>

            {/*<Navigation title="选择收货地址" left={true} back={this.linkTo('/cart/payment')}/>*/}
            <Navigation title="选择收货地址" left={true} />
            <WhiteSpace/>

            {content}

            <Submit onClick={()=>{this.linkTo('address/add')}}>添加新地址</Submit>
        </div>
    }
}
