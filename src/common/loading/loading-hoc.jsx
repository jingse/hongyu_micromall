import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

function hoc(ComponentClass) {
    return class HOC extends ComponentClass {
        render() {
            if (!this.state.isLoading) {
                return super.render()
            }
            return <div>
            	<ActivityIndicator animating toast text="Loading..."/>
            </div>
        }
    }
}

export default hoc;
