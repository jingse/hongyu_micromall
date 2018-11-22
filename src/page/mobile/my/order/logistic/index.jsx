import React from "react";
import { Card, Flex, WhiteSpace, Steps } from "antd-mobile";
import Layout from "../../../../../common/layout/layout.jsx";
import Navigation from "../../../../../components/navigation/index.jsx";
import logistic_data from "../../../../../static/mockdata/order_logistic.js"; //mock假数据

const Step = Steps.Step;

export default class Logistic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logistic:[],
        };
    }

    componentDidMount() {
        this.requestData();
    }

    requestData() {
        setTimeout(() => {
            const data = logistic_data;
            this.setState({
                logistic: data,
            });
        }, 100);
    }


    render() {

        const content = this.state.logistic.logistic_val && this.state.logistic.logistic_val.map((item, index) => {
            if (index === 0) {
                return <Step key={index} title={item.logistic_info}
                             icon={<img src='./images/icons/向上-橘色.png'/>} description={item.logistic_description} />
            } else if ((index + 1) === this.state.logistic.logistic_val.length) {
                return <Step key={index} title={item.logistic_info}
                             icon={<img src='./images/icons/圆点.png'/>} description={item.logistic_description} />
            } else {
                return <Step key={index} title={item.logistic_info}
                             icon={<img src='./images/icons/向上-灰色.png'/>} description={item.logistic_description} />
            }
        });

        return <Layout header={false} footer={false}>

            <Navigation title="物流详情" left={true}/>
            <WhiteSpace/>

            <Card>
                <Flex>
                    <Flex.Item style={{flex:'0 0 30%', padding:'1rem'}}>
                        <img src={this.state.logistic.cover_img} style={{width:'80%', border:'1px solid #eee'}}/>
                    </Flex.Item>
                    <Flex.Item style={{textAlign:'left', fontSize:'0.4rem', flex:'0 0 70%'}}>
                        <div style={{color:'darkorange', fontSize:'0.8rem'}}>{this.state.logistic.logistic_state}</div>
                        <WhiteSpace/>
                        <div style={{color:'#999'}}>{this.state.logistic.delivery_firm}：{this.state.logistic.logistic_number}</div>
                        <WhiteSpace/>
                        <div style={{color:'#999'}}>官方电话：<span style={{color:'blue'}}>{this.state.logistic.delivery_tel}</span></div>
                    </Flex.Item>
                </Flex>
            </Card>

            <WhiteSpace/>

            <Card style={{padding:'0.5rem'}}>
                <div>
                    <Flex>
                        <Flex.Item style={{flex:'0 0 30%', textAlign:'end'}}>
                            <img src="./images/icons/地址-物流.png"/>
                        </Flex.Item>
                        <Flex.Item style={{color:'#999', fontSize:'0.4rem', lineHeight:'1.2rem'}}>
                            [收货地址] {this.state.logistic.logistic_ship_address}
                        </Flex.Item>
                    </Flex>
                </div>

                <WhiteSpace/>
                <WhiteSpace/>

                <div style={{marginLeft:'25%', marginTop:'1rem'}}>
                    <Steps size="small" current={1}>
                        {content}
                    </Steps>
                </div>

            </Card>

        </Layout>

    }
}
