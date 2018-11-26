import React from 'react';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import MediaQuery from 'react-responsive';

import Help from './pc/help.jsx';
import Home from './mobile/home/index.jsx';
import Cart from "./mobile/cart/index.jsx";
import My from "./mobile/my/index.jsx";
import Search from "./mobile/search/index.jsx";

import redirect from "./mobile/product/redirect.jsx";
import searchRedirect from "./mobile/search/searchRedirect.jsx";


import Product from "./mobile/product/index.jsx";
import Recommend from "./mobile/home/recommend/index.jsx";
import Payment from "./mobile/cart/payment/index.jsx";
import PayResult from "./mobile/cart/payment/result/index.jsx";
import CouponChoose from "./mobile/cart/payment/coupon/index.jsx";
import Order from "./mobile/my/order/index.jsx";
import OrderDetail from "./mobile/my/order/detail/index.jsx";
import Address from "./mobile/address/index.jsx";
import AddAddress from "./mobile/address/add/index.jsx";
import EditAddress from "./mobile/address/edit/index.jsx";
import Category from "./mobile/home/category/index.jsx";
import Tag from "./mobile/home/tag/index.jsx";
import Sales from "./mobile/home/sales/index.jsx";
import SalesDetail from "./mobile/home/sales/detail/index.jsx";
import SalesGroup from "./mobile/home/sales_group/index.jsx";
import SalesGroupDetail from "./mobile/home/sales_group/detail/index.jsx";
import SalesGroupProducts from "./mobile/home/sales_group/detail/products/index.jsx";
import Recharge from "./mobile/home/recharge/index.jsx";
import CouponBalance from "./mobile/home/recharge/payment/index.jsx";
import HomeCoupon from "./mobile/home/coupon/index.jsx";
import Coupon from "./mobile/my/coupon/index.jsx";
import Balance from "./mobile/my/balance/index.jsx";
import BalancePurchase from "./mobile/my/balance/purchase/index.jsx";
import BalanceRecords from "./mobile/my/balance/records/index.jsx";
import BalanceRecharge from "./mobile/my/balance/recharge/index.jsx";
import DisposableCoupon from "./mobile/my/disposableCoupon/index.jsx";
import ProfitShare from "./mobile/my/merchant/index.jsx";
import Setting from "./mobile/my/setting/index.jsx";
import TelManage from "./mobile/my/setting/tel/index.jsx";
import vipAddress from "./mobile/my/setting/vipAddress/index.jsx";
import MyHelp from "./mobile/my/setting/help/index.jsx";
import TelBinding from "./mobile/my/tel/index.jsx";

import Points from "./mobile/my/setting/points/index.jsx";
import Member from "./mobile/my/setting/member/index.jsx";
import ExchangePoints from "./mobile/my/points/exchange/index.jsx";
import ExchangeRecords from "./mobile/my/points/records/index.jsx";
import MyPoints from "./mobile/my/points/index.jsx";

import RefundApply from "./mobile/my/order/refund/index.jsx";
import RefundDetail from "./mobile/my/order/refund/detail/index.jsx";
import Logistic from "./mobile/my/order/logistic/index.jsx";
import CommentOn from "./mobile/my/order/comment/index.jsx";

export default class App extends React.Component {
    
    render(){
        return <div>
            <MediaQuery query='(min-device-width: 992px)'>
                <Help />
            </MediaQuery>
            <MediaQuery query='(max-device-width: 992px)'>
                <Router>
                    <Switch>
                        <Route component={Home} path='/home' exact />
                        <Route component={Cart} path='/cart' exact />
                        <Route component={My} path='/my' exact />

                        <Route component={Category} path='/home/category' exact/>
                        <Route component={Tag} path='/home/tag' exact/>
                        <Route component={Sales} path='/home/sales' exact/>
                        <Route component={SalesDetail} path='/home/sales/detail' exact/>
                        <Route component={SalesGroup} path='/home/sales_group' exact/>
                        <Route component={SalesGroupDetail} path='/home/sales_group/detail' exact/>
                        <Route component={SalesGroupProducts} path='/home/sales_group/detail/products' exact/>
                        <Route component={Recharge} path='/home/recharge' exact/>
                        <Route component={CouponBalance} path='/home/recharge/payment' exact/>
                        <Route component={HomeCoupon} path='/home/coupon' exact/>
                        <Route component={Recommend} path='/home/recommend' exact/>

                        <Route component={Search} path='/search'/>
                        <Route component={searchRedirect} path='/searchRedirect'/>
                        <Route component={Product} path='/product/:id'/>
                        <Route component={redirect} path='/redirect'/>

                        <Route component={Payment} path='/cart/payment' exact/>
                        <Route component={PayResult} path='/cart/payment/result' exact/>
                        <Route component={CouponChoose} path='/cart/payment/coupon' exact/>
                        <Route component={Address} path='/address' exact/>
                        <Route component={AddAddress} path='/address/add' exact/>
                        <Route component={EditAddress} path='/address/edit' exact/>

                        <Route component={Order} path='/my/order' exact/>
                        <Route component={OrderDetail} path='/my/order/detail' exact/>

                        <Route component={Coupon} path='/my/coupon' exact/>
                        <Route component={Balance} path='/my/balance' exact/>
                        <Route component={BalancePurchase} path='/my/balance/purchase' exact/>
                        <Route component={BalanceRecords} path='/my/balance/records' exact/>
                        <Route component={BalanceRecharge} path='/my/balance/recharge' exact/>

                        <Route component={DisposableCoupon} path='/my/coupon/disposable' exact/>
                        <Route component={ProfitShare} path='/my/merchant' exact/>

                        <Route component={MyPoints} path='/my/points' exact/>
                        <Route component={ExchangePoints} path='/my/points/exchange' exact/>
                        <Route component={ExchangeRecords} path='/my/points/records' exact/>

                        <Route component={TelBinding} path='/my/tel' exact/>
                        <Route component={Setting} path='/my/setting' exact/>
                        <Route component={TelManage} path='/my/setting/tel' exact/>
                        <Route component={MyHelp} path='/my/setting/help' exact/>
                        <Route component={vipAddress} path='/my/setting/vipAddress' exact/>
                        <Route component={TelBinding} path='/my/tel' exact/>
                        <Route component={Points} path='/my/setting/points' exact/>
                        <Route component={Member} path='/my/setting/member' exact/>

                        <Route component={RefundApply} path='/my/order/refund' exact/>
                        <Route component={RefundDetail} path='/my/order/refund/detail' exact/>

                        <Route component={Logistic} path='/my/order/logistic' exact/>
                        <Route component={CommentOn} path='/my/order/comment' exact/>
                        <Redirect to="/home" />
                    </Switch>
                </Router>
            </MediaQuery>
        </div>
    }
}
