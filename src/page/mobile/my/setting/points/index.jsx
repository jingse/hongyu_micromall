import React from 'react';
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import {WhiteSpace, Card, WingBlank} from 'antd-mobile';
import pointsApi from "../../../../../api/points.jsx";

export default class Points extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            pointsRules: '',
        }
    }

    componentWillMount() {
       this.requestPointsRules();
    }

    requestPointsRules() {
        pointsApi.getSystemSetting('积分规则', (rs) => {
            if (rs && rs.success) {
                this.setState({
                    pointsRules: rs.obj.settingValue,
                });
            }
        });
    }

    render() {
        return <Layout>

            <Navigation title="积分规则" left={true}/>

            <WhiteSpace/>

            <Card>
                <WhiteSpace/>
                <WhiteSpace/>
                <WingBlank>
                    {this.state.pointsRules}
                </WingBlank>
            </Card>


        </Layout>
    }

}