import React from 'react';
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import {WhiteSpace, Card, WingBlank} from 'antd-mobile';
import pointsApi from "../../../../../api/points.jsx";

export default class Member extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            memberRules: '',
        }
    }

    componentWillMount() {
        this.requestMemberRules();
    }

    requestMemberRules() {
        pointsApi.getSystemSetting('会员规则', (rs) => {
            if (rs && rs.success) {
                this.setState({
                    memberRules: rs.obj.settingValue,
                });
            }
        });
    }


    render() {
        return <Layout>

            <Navigation title="会员规则" left={true}/>

            <WhiteSpace/>

            <Card>
                <WhiteSpace/>
                <WhiteSpace/>
                <WingBlank>
                    {this.state.memberRules}
                </WingBlank>
            </Card>


        </Layout>
    }

}