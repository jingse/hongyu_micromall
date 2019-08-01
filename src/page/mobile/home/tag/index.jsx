import React from 'react';
import List from '../../../../common/list/list.jsx';


export default class Tag extends React.Component {
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
        return <List funcName="getTagList"
                     name={(!this.props.location.category) ? localStorage.getItem("categoryName") : this.props.location.category}
                     anotherValue={this.state.categoryId}
        />
    }
}