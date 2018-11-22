import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar } from 'antd-mobile';
import "./header.less";

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
        this.context.router.history.push({pathname: '../search', value: this.state.value});
    }

    render(){
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
