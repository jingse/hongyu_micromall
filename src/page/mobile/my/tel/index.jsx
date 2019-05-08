import React from 'react';
import {Button, Flex, InputItem, Toast, WhiteSpace} from 'antd-mobile';
import Card from "../../../../components/card/index.jsx";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import myApi from "../../../../api/my.jsx";
import PropTypes from "prop-types";


export default class TelBinding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //wechat_id: 1,
            phone: '',
            code: '',
            delay: false,
            timer: 60,
            siv: null
        };
        this.validatePhone = this.validatePhone.bind(this);
    }

    validatePhone() {
        const phone = this.state.phone.replace(/\s+/g, "");
        console.log("phone", phone);
        myApi.validatePhone(phone, (rs) => {
            console.log("rs", rs);
            if (rs && rs.success) {
                Toast.info("发送成功，注意查收", 1);
                console.log(rs);
                // this.setState({delay:true},()=>{
                //     setTimeout(() => {
                //         this.setState({delay:false})
                //     }, 1000*30);
                // })
                let siv = setInterval(() => {
                    this.setState({timer: this.state.timer - 1, delay: true, siv: siv}, () => {
                        if (this.state.timer === 0) {
                            clearInterval(siv);
                            this.setState({delay: false, timer: 60})
                        }
                    });
                }, 1000);

            } else {
                Toast.info(rs.msg);
                console.log(rs);
                // let siv = setInterval(() => {
                //     this.setState({ timer: this.state.timer-1, delay: true,siv:siv }, () => {
                //         if (this.state.timer === 0) {
                //             clearInterval(siv);
                //             this.setState({ delay: false })
                //         }
                //     });
                // }, 1000);
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.siv);
    }

    bindTel(wechatId, phone, code) {
        console.log("code", code);
        myApi.bindPhoneOrTel(wechatId, phone, code, (rs) => {
            if (rs && rs.success) {
                console.log(rs);
                localStorage.setItem("bindPhone", this.state.phone.replace(/\s+/g, ""));
                Toast.info(rs.msg, 1);
                // history.back();
            } else {
                Toast.info(rs.msg, 1);
            }
        });
    }

    render() {

        let wechat_id = localStorage.getItem("wechatId");
        console.log('wechat_id', wechat_id)

        return <Layout header={false} footer={false}>

            <Navigation title="绑定手机" left={true}/>
            <WhiteSpace/>

            {/*<Card>*/}
            {/*<InputItem placeholder="11位手机号" type = "phone">手机号</InputItem>*/}

            {/*<Flex>*/}
            {/*<Flex.Item style={{flex:'0 0  70%'}}>*/}
            {/*<InputItem type="number" placeholder="请填写获取的激活码">激活码</InputItem>*/}
            {/*</Flex.Item>*/}
            {/*<Flex.Item>*/}
            {/*<Button type="primary" inline size="small" style={{ marginRight: '4px' }}>获取激活码</Button>*/}
            {/*</Flex.Item>*/}
            {/*</Flex>*/}

            {/*</Card>*/}

            {/*<Button type="primary" style={{ marginLeft:'4px', marginRight: '4px' }}>绑定手机</Button>*/}

            <Card>
                <InputItem placeholder="11位手机号" type="phone" onChange={(val) => {
                    this.setState({phone: val})
                }}>手机号</InputItem>

                <Flex>
                    <Flex.Item style={{flex: '0 0  70%'}}>
                        <InputItem type="number" placeholder="请填写获取的激活码" onChange={(val) => {
                            this.setState({code: val})
                        }}>激活码</InputItem>
                    </Flex.Item>
                    <Flex.Item>
                        <Button disabled={this.state.delay} type="primary" inline size="small"
                                style={{marginRight: '4px'}} onClick={this.validatePhone}>
                            {this.state.delay === false ? '获取激活码' : '重新发送(' + this.state.timer + ')'}
                        </Button>
                    </Flex.Item>
                </Flex>

            </Card>

            <Button type="primary" style={{marginLeft: '4px', marginRight: '4px'}}
                    onClick={() => {
                        this.bindTel(wechat_id, this.state.phone.replace(/\s+/g, ""), this.state.code);
                        this.context.router.history.push('/my');
                    }}>
                绑定手机
            </Button>

        </Layout>
    }
}

TelBinding.contextTypes = {
    router: PropTypes.object.isRequired
};
