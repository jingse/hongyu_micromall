import React from 'react';
import {WingBlank, Flex} from 'antd-mobile';

export default class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const data = this.props.data;
        let active = {};
        for (let i in data) {
            Object.assign(active, {'active': data[i].options[0]});
        }
        return {
            active
        };
    }

    clickSelector(featureName, option) {
        this.setState({
            active: Object.assign(this.state.active, {['active']: option})
        });
        this.props.selectorText(this.state.active);
    }

    generateDataSet() {
        return this.props.data.map((data, index) => {
            const optionsData = data.options.map((option, key) => {
                let className = "select_item";
                if (this.state.active['active'].id === option.id) {
                    className += " select_active";
                }
                return <div className={className}
                            key={index + key}
                            onClick={() => {
                                this.clickSelector('active', option);
                            }}
                >
                    {option.option_name}
                </div>
            });

            return <Flex wrap="wrap" className="content_select" key={index}>
                <Flex.Item>
                    {/*<header>{data.feature_name}</header>*/}
                    {optionsData}
                </Flex.Item>
            </Flex>
        });
    }


    render() {
        const dataSet = this.generateDataSet();

        return <div className="">
            <WingBlank size="lg">
                {dataSet}
            </WingBlank>
        </div>
    }

}