import React from "react";
import {Card, Flex, List, SegmentedControl, WhiteSpace} from "antd-mobile";
import Layout from "../../../../common/layout/layout.jsx";
import Navigation from "../../../../components/navigation/index.jsx";
import couponApi from "../../../../api/coupon.jsx";
import DateManager from "../../../../manager/DateManager.jsx";

const Item = List.Item;
const Brief = Item.Brief;


export default class DisposableCoupon extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {
            type: "使用记录",
            coupons: [],
            couponUnused: [],
            couponRecords: [],
            couponExpired: [],
        }
    }

    componentWillMount() {
        this.requestDisposableCoupons();
    }

    requestDisposableCoupons() {
        couponApi.getDisposableCoupons(localStorage.getItem("wechatId"), (rs) => {
            if (rs && rs.success) {
                const coupons = rs.obj;
                this.setState({
                    coupons
                });
                this.checkUnused();
            }
        });
    }

    checkUnused() {
        console.log("coupons", this.state.coupons);
        this.state.coupons && this.state.coupons.map((item, index) => {
            if (item.state === 1) {
                this.setState({
                    couponRecords: this.state.couponRecords.concat(item)
                });
            } else if (item.state === 0) {
                this.setState({
                    couponUnused: this.state.couponUnused.concat(item)
                });
            } else if (item.state === 3) {
                this.setState({
                    couponExpired: this.state.couponExpired.concat(item)
                });
            } else {

            }

        });

        console.log("unused", this.state.couponUnused);
        console.log("used", this.state.couponRecords);
    }


    onValueChange = (value) => {
        this.setState({
            type: value
        });
        console.log(value);
    };

    getRecordsContent() {
        return this.state.couponRecords && this.state.couponRecords.map((item, index) => {
            return <Flex key={index} style={{textAlign: 'center'}}>
                <Flex.Item style={{padding: '0.5rem'}}>{DateManager.getDate(new Date(item.useTime))}</Flex.Item>
                <Flex.Item>满￥{item.couponCondition}可用</Flex.Item>
                <Flex.Item>￥{item.sum}</Flex.Item>
            </Flex>
        });
    }

    isSuperimposed(isSuperimposed) {
        if (isSuperimposed)
            return <a style={{fontSize: '0.4rem', color: 'darkorange'}}>叠</a>
    }

    getUnusedContent() {
        return this.state.couponUnused && this.state.couponUnused.map((item, index) => {
            return <Item key={index} multipleLine
                         onClick={() => {
                         }}
                         extra={"￥" + item.sum}
            >
                <span>
                    满{item.couponCondition}可用 {this.isSuperimposed(item.canOverlay)}
                </span>
                {/*<Brief>{DateManager.getDate(new Date(item.issueTime))} - {DateManager.getDate(new Date(item.expireTime))}</Brief>*/}
                <Brief>{DateManager.getDate(new Date(item.expireTime))}到期</Brief>
            </Item>
        });
    }

    getExpiredContent() {
        return this.state.couponExpired && this.state.couponExpired.map((item, index) => {
            return <Item key={index} multipleLine
                         onClick={() => {
                         }}
                         extra={"￥" + item.sum}
            >
                <span>
                    满{item.couponCondition}可用 {this.isSuperimposed(item.canOverlay)}
                </span>
                {/*<Brief>{DateManager.getDate(new Date(item.issueTime))} - {DateManager.getDate(new Date(item.expireTime))}</Brief>*/}
                <Brief>{DateManager.getDate(new Date(item.expireTime))}到期</Brief>
            </Item>
        });
    }


    getContent(type) {
        console.log("type", type);
        if (type === "使用记录") {
            return <Card>
                <Flex style={{textAlign: 'center', background: '#F7F7F7'}}>
                    <Flex.Item style={{padding: '0.5rem'}}>使用时间</Flex.Item>
                    <Flex.Item>使用条件</Flex.Item>
                    <Flex.Item>电子券</Flex.Item>
                </Flex>
                <WhiteSpace/>

                {this.getRecordsContent()}
            </Card>
        } else {
            return <div>
                <List renderHeader={() => <div>
                    <div className="iconH iconH_inline icon_ticket" style={{margin: '0 5', height: '16'}}/>
                    未使用</div>}>
                    {this.getUnusedContent()}
                </List>
                <List renderHeader={() => <div>
                    <div className="iconH iconH_inline icon_ticket" style={{margin: '0 5', height: '16'}}/>
                    已过期</div>}>
                    {this.getExpiredContent()}
                </List>
            </div>
        }
    }

    render() {
        console.log("this.state.coupons", this.state.coupons);
        const content = this.getContent(this.state.type);

        return <Layout>

            <Navigation title="一次性电子券" left={true}/>

            <SegmentedControl
                values={['使用记录', '我的券']}
                onValueChange={this.onValueChange}
            />

            {content}

        </Layout>
    }

}