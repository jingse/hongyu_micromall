import React from 'react';
import PropTypes from "prop-types";
import Layout from "../../../common/layout/layout.jsx";
import Card from "../../../components/card/index.jsx";
import Navigation from "../../../components/navigation/index.jsx"
import {ActivityIndicator, Flex, SwipeAction, Toast, WhiteSpace} from 'antd-mobile';
import {createForm} from 'rc-form';
import cartApi from "../../../api/cart.jsx";
import proApi from "../../../api/product.jsx";
import './index.less';
import {getServerIp} from "../../../config.jsx";

let items = [];  //为了传递给下个界面
let stock = 0;

class Cart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: [],
            num: 0,
            editId: 0,
            chooseAll: false,

            totalPrice: 0,
            priceResult: [],
            cartData: [],
            cartItems: [],
            cartListCount: 0,

            style: null,
            startTime: 0,
            endTime: 0,
            canDelete: false,
            visible: [],
            showEdit: [],
            swipeoutDisabled: false,
            animating: false,

            presents: [],
            payM: 0,
            payP: 0,
        };
    }

    componentWillMount() {
        this.setState({animating: !this.state.animating});

        // window.onpopstate = function(event) {this.console.log("event",event)}
        // console.log("window.history",window.onpopstate)
        // history.back();

        this.requestCartList();
        this.closeNav();

        for (let i = 0; i < this.state.cartListCount; i++) {
            this.state.checkbox[i] = false;
            this.state.visible[i] = false;
        }
        this.setState({
            checkbox: this.state.checkbox,
            visible: this.state.visible,
        });

        localStorage.removeItem("inputBalance");
    }

    componentDidMount() {
        this.closeTimer = setTimeout(() => {
            this.setState({animating: !this.state.animating});
        }, 500);
    }

    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }

    requestCartList() {
        console.log("cart wechatid", localStorage.getItem("wechatId"));
        cartApi.getCartItemsList(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const cartData = rs.obj;

                this.setState({
                    cartData: cartData,
                    cartListCount: cartData.length,
                });
                localStorage.setItem("cartCount", rs.obj.length);
            }
        });
    }

    requestTotalPrice(cartItems) {
        console.log("requestTotalPrice");
        cartApi.getTotalPriceInCart(cartItems, (rs) => {
            console.log("拿到总价：", rs);
            if (rs && rs.success) {
                const price = rs.obj.totalMoney;

                let presents = [];
                rs.obj.promotions && rs.obj.promotions.map((item, index) => {
                    if (item.promotion && JSON.stringify(item.promotion) !== '{}') {
                        if (item.promotion.promotionRule === "满赠") {
                            item.promotionCondition && item.promotionCondition.map((pre, index2) => {
                                pre.promotionId = item.promotionId;
                                presents.push(pre);
                            });
                        }
                    }
                });

                console.log("赠品：", presents);

                this.setState({
                    totalPrice: price,
                    priceResult: rs.obj,
                    presents: presents,
                    payM: rs.obj.finalMoney,
                    payP: rs.obj.promotionMoney,
                });
            }
        });
        console.log("price", this.state.totalPrice);
    }

    changeItemQuantity(id, quantity) {
        cartApi.editItemsCountInCart(id, quantity, (rs) => {
            if (rs && rs.success) {
                console.log(rs.msg);
                //更新购物车列表
                this.requestCartList();
            }
        });
    }

    deleteCartItem(id) {
        cartApi.deleteItemsInCart(id, (rs) => {
            if (rs && rs.success) {
                console.log(rs.msg);
                //更新购物车列表
                this.requestCartList();
            }
        });
    }

    closeNav() {
        const style = {width: 0};
        this.setState({style});
    }

    setEditId(id) {
        this.setState({
            editId: id,
        });
    }

    getDefaultNum(num) {
        this.setState({
            num: num,
        });
    }

    onChange = (val) => {
        this.setState({
            num: val,
        });
    };


    findItemIndex(cartItem) {
        let cartItemIndex = -1;
        this.state.cartItems && this.state.cartItems.map((item, index) => {
            if (item.id === cartItem.id) {
                cartItemIndex = index;
                // console.log("cartItemIndex", cartItemIndex);
            }
        });
        return cartItemIndex
    }

    getPayCount() {
        let payCount = 0;
        for (let i = 0; i < this.state.cartListCount; i++) {
            if (this.state.checkbox[i]) {
                payCount++;
            }
        }
        return payCount;
    }

    checkPayCount() {
        if (this.getPayCount() === 0)
            Toast.info('您还没有选择宝贝哦！', 1);
        else
            this.linkTo('/cart/payment');
    }

    falseShowEdit(index) {
        let tem = [];
        tem[index] = false;
        this.setState({
            showEdit: tem,
            swipeoutDisabled: false
        });
    }

    trueShowEdit(index) {
        let tem = [];
        tem[index] = true;
        this.setState({
            showEdit: tem,
            swipeoutDisabled: true
        });
    }

    isChooseAll() {
        for (let i = 0; i < this.state.cartListCount; i++) {
            if (!this.state.checkbox[i])
                return false;
        }
        return true;
    }

    chooseAll() {
        if (this.state.chooseAll) {
            for (let i = 0; i < this.state.cartListCount; i++) {
                this.state.checkbox[i] = true;
            }
            items = this.state.cartData;
            this.state.cartItems = this.state.cartData.concat();
            this.requestTotalPrice(this.state.cartData);
        } else {
            for (let i = 0; i < this.state.cartListCount; i++) {
                this.state.checkbox[i] = false;
            }
            this.state.cartItems = [];
            items = [];
            this.setState({
                totalPrice: 0,
                payM: 0,
                payP: 0,
            });
        }
        this.setState({
            checkbox: this.state.checkbox,
            cartItems: this.state.cartItems,
        });
    }

    addNum = (val) => {
        console.log('stock', stock);
        this.setState({
            num: (val + 1) <= stock ? val + 1 : stock,
        });
        if (val == stock)
            Toast.info("没有更多库存", 0.5)
    };
    minusNum = (val) => {
        this.setState({
            num: (val - 1) > 1 ? val - 1 : 1,
        });
    };

    linkTo(link) {
        // console.log("items", items);
        // console.log("priceresult", this.state.priceResult);
        this.context.router.history.push({
            pathname: link,
            products: items,
            price: this.state.priceResult,
            presents: this.state.presents,
            origin:'cart',
        });
    }

    getStock(id) {
        proApi.getSpecialtySpecificationDetailBySpecificationID(id, (rs) => {
            if (!rs.success) {
                console.log('error');
                return
            }
            if (rs && rs.success) {
                stock = rs.obj[0].inbound;
            }
        });
    }


    render() {
        console.log("this.state.cartData", this.state.cartData);
        const content = this.state.cartData && this.state.cartData.map((item, index) => {

            // 普通商品
            return <div key={index}>
                <Card className="cart_card" key={index}>
                    <SwipeAction
                        autoClose
                        disabled={this.state.swipeoutDisabled}
                        right={[
                            {
                                text: '编辑',
                                onPress: () => {
                                    console.log("item", item);
                                    this.trueShowEdit(index);
                                    this.getDefaultNum(item.quantity);
                                    this.getStock(item.specialtySpecificationId);
                                },
                                style: {backgroundColor: '#ddd', color: 'white', width: '100%'},
                            },
                            {
                                text: '删除',
                                onPress: () => this.deleteCartItem(item.id),
                                style: {backgroundColor: '#F4333C', color: 'white', width: '100%'},
                            },
                        ]}
                    >
                        <Flex className="cart_card_container cart_card_underline">

                            <input type="checkbox" checked={this.state.checkbox[index]} onChange={() => {
                                this.state.checkbox[index] = !this.state.checkbox[index];
                                if (this.state.checkbox[index]) {
                                    this.state.cartItems.push(this.state.cartData[index]);
                                } else {
                                    this.state.cartItems.splice(this.findItemIndex(item), 1);
                                }
                                this.state.chooseAll = this.isChooseAll();
                                this.setState({
                                    checkbox: this.state.checkbox,
                                    chooseAll: this.state.chooseAll,
                                    cartItems: this.state.cartItems,
                                });
                                items = this.state.cartItems;
                                this.requestTotalPrice(this.state.cartItems);
                            }} style={{width: '50%'}}/>

                            <div className="cart_card_img">
                                <img src={"http://" + getServerIp() + item.iconURL.mediumPath}
                                     style={{height: '4rem'}}/>
                            </div>

                            <Flex.Item style={{flex: '0 0 50%'}}>
                                <div style={{display: this.state.showEdit[index] === true ? 'none' : 'block'}}>
                                    <div className="title_text">{item.name}</div>
                                    <div className="commodity_prop">{item.specification}</div>
                                    <div className="price_text">￥{item.curPrice}</div>
                                </div>
                                <div style={{display: this.state.showEdit[index] === true ? 'block' : 'none'}}>
                                    <div className="step1">
                                        <div className="add_minus" onClick={() => {
                                            this.minusNum(this.state.num)
                                        }}
                                             style={{
                                                 backgroundImage: 'url(./images/icons/minus.png)',
                                                 backgroundRepeat: 'no-repeat',
                                                 backgroundPosition: 'center'
                                             }}>
                                        </div>
                                        <div className="value">
                                            {this.state.num}
                                        </div>
                                        <div className="add_minus" onClick={() => {
                                            this.addNum(this.state.num)
                                        }}
                                             style={{
                                                 backgroundImage: 'url(./images/icons/add.png)',
                                                 backgroundRepeat: 'no-repeat',
                                                 backgroundPosition: 'center'
                                             }}>
                                        </div>
                                    </div>
                                </div>
                            </Flex.Item>

                            <Flex.Item style={{flex: '0 0 20%'}}>
                                <div style={{display: this.state.showEdit[index] === true ? 'none' : 'block'}}>
                                    <div style={{fontColor: "#ccc", fontSize: '0.8rem', display: 'block'}}>
                                        x {item.quantity}
                                    </div>
                                </div>
                                <div style={{display: this.state.showEdit[index] === true ? 'block' : 'none'}}>
                                    <div style={{
                                        flex: '0 0 30%', backgroundColor: 'darkorange', color: 'white',
                                        fontSize: '0.6rem', textAlign: 'center'
                                    }}
                                         onClick={() => {
                                             this.setEditId(item.id);
                                             this.changeItemQuantity(item.id, this.state.num);
                                             this.falseShowEdit(index);
                                             stock = 0;
                                         }}>

                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="xs"/>
                                        <WhiteSpace size="xs"/>
                                        完成
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="lg"/>
                                        <WhiteSpace size="xs"/>
                                    </div>
                                </div>
                            </Flex.Item>
                        </Flex>
                    </SwipeAction>
                </Card>
            </div>
        });

        return <Layout footer={true} cartcount={this.state.cartListCount}>

            <Navigation title={"购物车(" + this.state.cartListCount + ")"} curPath='/cart' left={false}/>

            <WhiteSpace/>

            {content}

            <WhiteSpace size="lg"/>
            <WhiteSpace size="lg"/>

            <div className="putincart cart_summary">
                <div className="secondary_btn" style={{width: '70%'}}>
                    <Flex wrap='nowrap'>
                        <Flex.Item style={{flex: '0 0 20%', marginLeft: '0.8rem'}}>
                            <input type="checkbox" checked={this.state.chooseAll} onChange={() => {
                                this.state.chooseAll = !this.state.chooseAll;
                                this.setState({chooseAll: this.state.chooseAll});
                                this.chooseAll();
                            }}/>
                            <a style={{color: 'darkorange', marginLeft: "5px", wordBreak: 'break-word'}}>全选</a>
                        </Flex.Item>
                        <Flex.Item style={{flex: '0 0 70%', marginRight: "1px", textAlign: 'center', height: 'auto'}}>
                            <div>
                                <div style={{height: '2rem', lineHeight: '2rem', fontSize: '1rem'}}>
                                    合计：<a style={{color: 'darkorange', wordBreak: 'break-word'}}>￥{this.state.payM}</a>
                                </div>
                                <div style={{height: '1rem', lineHeight: '1rem', fontSize: '0.5rem'}}>
                                    总额：<a
                                    style={{color: 'darkorange', wordBreak: 'break-word'}}>￥{this.state.totalPrice}</a>
                                    <span style={{marginLeft: '0.5rem'}}>立减：<a style={{
                                        color: 'darkorange',
                                        wordBreak: 'break-word'
                                    }}>￥{this.state.payP}</a></span>
                                </div>
                            </div>
                        </Flex.Item>
                        {/* <Flex.Item style={{flex:'0 0 30%',marginRight:"1px",fontSize:'0.8rem'}}>
                            优惠：<a style={{color:'darkorange',wordBreak:'break-word'}}>￥{this.state.payP}</a>
                        </Flex.Item> */}
                    </Flex>
                </div>
                <div className="primary_btn" style={{width: '30%'}}
                     onClick={() => {
                         this.checkPayCount()
                     }}>
                    <div style={{textAlign: 'center'}}> 去结算:（{this.getPayCount()}）
                    </div>
                </div>
            </div>
            <ActivityIndicator
                toast
                text="Loading..."
                animating={this.state.animating}
            />
        </Layout>
    }
}

const BasicInputExampleWrapper = createForm()(Cart);
export default BasicInputExampleWrapper;

Cart.contextTypes = {
    router: PropTypes.object.isRequired
};