import React from 'react';
import PropTypes from "prop-types";
import {Button, TabBar} from 'antd-mobile';
import "./index.less";

export default class Bottom extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = this.getInitialState();
    }

    componentWillMount() {
        // this.getCartCount(localStorage.getItem("wechatId"));
    }

    getInitialState() {
        // let link = this.getLink() || 'product';
        return {
            selectedTab: ''
        };
    }

    // getLink(){
    //     let links = window.location.hash.match(/(\w+)/g);
    //     if (!links)
    //         return null;
    //     return links[0].toLowerCase();
    // }


    linkTo(link) {
        if (link !== this.state.selectedTab) {
            this.context.router.history.push(link);
            this.setState({
                selectedTab: link
            });
        }
    }



    renderButton() {

        return <div className="putincart">

            <span className="product_footer">
                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#f28b12"
                    barTintColor="#fff"
                >
                    <TabBar.Item
                        key="首页"
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/home.png) center center /  24px 24px no-repeat' }}
                        />}
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/home-fill2.png) center center /  24px 24px no-repeat' }}
                        />}
                        selected={this.state.selectedTab === 'home'}
                        onPress={() => { this.linkTo('/home'); }}
                        data-seed="logId"
                    />
                    <TabBar.Item
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/cart.png) center center /  24px 24px no-repeat' }}
                        />}
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/cart-fill2.png) center center /  24px 24px no-repeat' }}
                        />}
                        key="购物车"
                        badge={this.props.cartNum}
                        selected={this.state.selectedTab === 'cart'}
                        onPress={() => { this.linkTo('/cart'); }}
                    />
                    <TabBar.Item
                        icon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/phone.png) center center /  24px 24px no-repeat' }}
                        />}
                        selectedIcon={<div style={{
                            width: '22px',
                            height: '22px',
                            background: 'url(./images/icons/phone.png) center center /  24px 24px no-repeat' }}
                        />}
                        key="联系卖家"
                        selected={this.state.selectedTab === 'phone'}
                        onPress={()=>{window.location.href="tel:" + "13103361866"}}
                    />
                </TabBar>
            </span>

            <Button type="primary" inline
                    style={{ marginLeft:'35%', marginTop: '4px', marginBottom:'4px', marginRight:'4px', width:'30%', backgroundColor:'darkorange', fontSize:'1rem'}}
                    onClick={()=>{this.props.addToCart()}}>
                加购物车
            </Button>

            <Button type="primary" inline
                    style={{ marginTop: '4px', marginBottom:'4px', marginRight:'4px', width:'30%', backgroundColor:'red', fontSize:'1rem'}}
                    onClick={()=>{this.props.buyImmediately()}}>
                立即购买
            </Button>

        </div>
    }

    render() {
        const button = this.renderButton();

        return <div style={{...this.props.style}}>
            {button}
        </div>
    }
}


Bottom.contextTypes = {
    router: PropTypes.object.isRequired
};