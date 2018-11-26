import React from 'react';
import PropTypes from 'prop-types';
import {Flex, SearchBar} from 'antd-mobile';
import "./header.less";
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: ''
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    onCancel(value){
        this.setState({
            value: ''
        });
    }

    onChange(value){
        this.setState({
            value: value
        });
    }

    onSubmit(value){
        if (this.props.isSearchAgain) {
            this.context.router.history.push({pathname: '../searchRedirect', state: this.state.value});
        } else {
            this.context.router.history.push({pathname: '../search', value: this.state.value});
        }
    }

    render(){
        // if (this.props.isSearchAgain) {
        //     return <div className="header">
        //         <Link to={{pathname:'/search/redirect', state: this.state.value}}/>
        //     </div>
        //
        //
        // } else {
        //     return <div className="header">
        //         <SearchBar
        //         value={this.state.value}
        //         placeholder="搜索"
        //         onCancel={this.onCancel.bind(this)}
        //         onChange={this.onChange.bind(this)}
        //         onSubmit={this.onSubmit.bind(this)}
        //     />
        //     </div>
        // }

        return <div className="header">
            <SearchBar
                value={this.state.value}
                placeholder="搜索"
                onCancel={this.onCancel.bind(this)}
                onChange={this.onChange.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
            />
            </div>
    }
}
