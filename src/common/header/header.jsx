import React from 'react';
import PropTypes from 'prop-types';
import {SearchBar} from 'antd-mobile';
import "./header.less";


export default class Header extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            value: ''
        };
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onCancel(value) {
        this.setState({value: ''});
    }

    onChange(value) {
        this.setState({value: value});
    }

    onSubmit(value) {
        if (this.props.isSearchAgain)
            this.context.router.history.push({pathname: '../searchRedirect', state: this.state.value});
        else
            this.context.router.history.push({pathname: '../search', value: this.state.value});
    }

    render() {

        return <div className="header">
            <SearchBar
                value={this.state.value}
                placeholder="搜索"
                onCancel={this.onCancel}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
            />
        </div>
    }
}
