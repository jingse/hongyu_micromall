import React from 'react';
import List from '../../../../common/list/list.jsx';
import './index.less';


export default class Search extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            searchValue: (!this.props.location.value) ? localStorage.getItem("searchCondition") : this.props.location.value,
        };
    }

    componentWillMount() {
        localStorage.setItem("searchCondition", this.state.searchValue);
    }

    render() {
        return <List funcName="getSpecialtyListSearching"
                     name="搜索"
                     anotherValue={this.state.searchValue}
                     fixedValue="specialty_name"
                     isSearchAgain={true}
        />
    }
}