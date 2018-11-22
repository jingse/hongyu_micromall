import React from 'react';
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import Submit from "../../../../../components/submit/index.jsx";
import {WhiteSpace, Card, InputItem, Toast,ActivityIndicator} from 'antd-mobile';
import { createForm } from 'rc-form';
import pointsApi from "../../../../../api/points.jsx";

class ExchangePoints extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            animating:false,
            point:0
        }
    }
    componentWillMount(){
        this.setState({point:this.props.location.points})
    }

    exchangeAvailablePoints() {
        if (!this.props.form.getFieldValue('number')) {
            Toast.info("请先输入要兑换的积分！", 1);
            return
        }

        if (this.props.form.getFieldValue('number') === '0') {
            Toast.info("请输入大于0的积分值！", 1);
            return
        }

        if (this.props.form.getFieldValue('number') > this.state.point) {
            Toast.info("请输入小于可用积分的值！", 1);
            return
        }

        if (this.props.form.getFieldValue('number') % 10 !== 0) {
            Toast.info("请输入10的倍数！", 1);
            return
        }

        pointsApi.exchangePoints(localStorage.getItem("wechatId"), this.props.form.getFieldValue('number'), (rs) => {
            console.log("兑换结果：", rs);
            if (rs && rs.success) {
                Toast.info(rs.msg);
                this.setState({ point: this.state.point - this.props.form.getFieldValue('number'),animating: !this.state.animating });
            }
            else
                this.setState({ animating: !this.state.animating });
        });
        this.setState({ animating: !this.state.animating });
    }


    render() {
        const { getFieldProps } = this.props.form;

        return <Layout>

            <Navigation title="积分兑换" left={true}/>

            <WhiteSpace/>

            <Card>
                <InputItem editable={false} value={(!this.state.point || this.state.point === 0) ? '0' : this.state.point}>可用积分：</InputItem>
                <InputItem editable={false} value="10积分 = 1元">兑换规则：</InputItem>
                <InputItem
                    {...getFieldProps('number')}
                    type="number"
                    placeholder="输入要兑换的积分(须是10的倍数)"
                >要兑换：</InputItem>
            </Card>

            <Submit onClick={() => {this.exchangeAvailablePoints()}}>
                兑换
            </Submit>
            <ActivityIndicator
                toast
                text="加载中..."
                animating={this.state.animating}
              />
        </Layout>
    }

}


const ExchangePointsWrapper = createForm()(ExchangePoints);
export default ExchangePointsWrapper;