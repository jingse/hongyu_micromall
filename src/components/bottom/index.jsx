import React from 'react';
import "./index.less";

export default class Content extends React.PureComponent {
    render() {
        return <div className="bottom-line">
            {this.props.children}
        </div>
    }
}
