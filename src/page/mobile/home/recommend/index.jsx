import React from 'react';
import List from '../../../../common/list/list.jsx';
import "./index.less";


export default class RecommendProducts extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <List funcName="getRecommendList"
                     name="推荐产品"
                     anotherValue=""
        />
    }
}