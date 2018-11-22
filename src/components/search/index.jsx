import React from "react";
import { Icon, SearchBar, Flex } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.less";

export default class SearchNavBar extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            value: (!this.props.value) ? '' : this.props.value,
        };
    }

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
        // console.log("input: ", this.state.value);

        // const { history } = this.props;
        // const nextLocation = histroy.createLocation({ path, state });
        // histroy.push(nextLocation)
        //TODO: 将搜索框的值传递给父组件 判断页面是否要跳转
        this.context.router.history.push({pathname:'/search', value: this.state.value});
        // history.push({pathname:'search', state: {type:'specialty_name', input: this.state.value}});
    }

    back() {
        if (this.props.dest) {
            this.context.router.history.push(this.props.dest);
        } else {
            history.go(-1)
        }
    }



    render() {

        return <div className="search_header">
            <Flex>
                <Icon type="left" style={{flex:'0 0 10%', color:'darkorange', marginBottom:'0.6rem'}}
                      onClick={() => {this.back()}}/>
                <SearchBar
                    style={{flex:'0 0 82%'}}
                    value={this.state.value}
                    placeholder="搜索"
                    onCancel={this.onCancel.bind(this)}
                    onChange={this.onChange.bind(this)}
                    onSubmit={this.onSubmit.bind(this)}
                />
            </Flex>
        </div>
    }


}

SearchNavBar.contextTypes = {
    router: PropTypes.object.isRequired
};