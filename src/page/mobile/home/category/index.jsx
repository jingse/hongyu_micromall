import React from 'react';
import List from '../../../../common/list/list.jsx';
import "./index.less";


export default class Category extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            categoryId: null,
        };
    }

    componentWillMount() {
        if (!this.props.location.categoryId) {
            this.setState({
                categoryId: localStorage.getItem("categoryId")
            });
        } else {
            this.setState({
                categoryId: this.props.location.categoryId
            });
            localStorage.setItem("categoryId", this.props.location.categoryId);
            localStorage.setItem("categoryName", this.props.location.category);
        }
    }


    render() {
        return <List funcName="getCategoryList"
                     name={(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}
                     anotherValue={this.state.categoryId}
        />
    }
}