import React from 'react';
import './index.less';

export default class Card extends React.PureComponent {
    render() {
        const {children, className, ...others} = this.props;

        return <div className={`card_section ${className ? className : ''}`} {...others}>
            {children}
        </div>
    }
}
