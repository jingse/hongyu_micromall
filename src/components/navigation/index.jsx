import React from 'react';
import "./index.less";
import { Link } from 'react-router-dom';
import { NavBar, Icon, Popover } from 'antd-mobile';
import PropTypes from "prop-types";

const Item = Popover.Item;
const myImg = src => <img src={`./images/navigation/${src}.svg`} className="am-icon am-icon-xs" alt="" />;


export default class Navigation extends React.Component {

    state = {
        visible: false,
        selected: '',
    };

    onSelect = (opt) => {
        // console.log(opt.props.value);
        this.setState({
            visible: false,
            selected: opt.props.value,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };

    isSame(curPath, targetPath, title) {
        if (targetPath === curPath) {
            return <div style={{color:'black'}}>{title}</div>
        }
        return <Link to={targetPath} style={{color:'black'}}>{title}</Link>
    }

    backOperation() {
        if (!this.props.backLink) {
            return history.go(-1)
        }
        return this.linkTo(this.props.backLink)
    }

    linkTo(link) {
        this.context.router.history.push(link);
    }

    render() {

        const leftIcon = () => {
            if (this.props.left === true) {
                return <Icon type="left" onClick={()=>{this.backOperation()}}/>
            }
            return null
        };

        return <NavBar
            mode="light"
            icon={leftIcon()}
            // onLeftClick={() => history.go(-1)}
            rightContent={
                <Popover overlayClassName="fortest"
                         overlayStyle={{ color: 'currentColor' }}
                         visible={this.state.visible}
                         overlay={[
                             (<Item key="4" value="home" icon={myImg('home')} data-seed="logId">
                                 {/*<Link to='/home' style={{color:'black'}}>首页</Link>*/}
                                 {this.isSame(this.props.curPath, '/home', '首页')}
                             </Item>),
                             (<Item key="5" value="cart" icon={myImg('cart')} style={{ whiteSpace: 'nowrap' }}>
                                 {/*<Link to='/cart' style={{color:'black'}}>购物车</Link>*/}
                                 {this.isSame(this.props.curPath, '/cart', '购物车')}
                             </Item>),
                             (<Item key="6" value="mine" icon={myImg('my')}>
                                 <span style={{ marginRight: 5 }}>
                                     {/*<Link to='/my' style={{color:'black'}}>我的</Link>*/}
                                     {this.isSame(this.props.curPath, '/my', '我的')}
                                 </span>
                             </Item>),
                         ]}
                         align={{
                             overflow: { adjustY: 0, adjustX: 0 },
                             offset: [-10, 0],
                         }}
                         onVisibleChange={this.handleVisibleChange}
                         onSelect={this.onSelect}
                >
                    <div style={{
                        height: '100%',
                        padding: '0 15px',
                        marginRight: '-15px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    >
                        <Icon type="ellipsis" />
                    </div>
                </Popover>
            }
        >{this.props.title}</NavBar>
    }
}

Navigation.contextTypes = {
    router: PropTypes.object.isRequired
};

