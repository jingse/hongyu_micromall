/*管理订单所有的按钮*/
import React from "react";
import {Button, Modal} from "antd-mobile";
const alert = Modal.alert;


const orderButtonStyle = {marginRight: '4%', fontSize: '0.7rem'};  //订单列表页的按钮的样式基本都是这样，除了评价按钮
const orderDetailButtonStyle = {
    marginLeft: '65%', marginTop: '4px', marginBottom: '4px', marginRight: '10%',
    width: '25%', backgroundColor: 'white', fontSize: '0.8rem'
};
const evaluateOrderButtonStyle = {marginRight: '4%', fontSize: '0.7rem', width: '5rem'};


// 按钮-去付款
export const PayButton = (props) => {
    const style = props.isDetail ? orderDetailButtonStyle : orderButtonStyle;
    return <Button type="ghost" inline size="small" style={style}
                   onClick={props.payAction}>
        去付款
    </Button>
};

// 按钮-取消订单
export const CancelOrderButton = (props) => {
    const style = props.isDetail ? orderDetailButtonStyle : orderButtonStyle;
    return <Button type="ghost" inline size="small" style={style}
                   onClick={() => alert('取消订单', '您确定要取消吗？', [
                       { text: '取消', onPress: () => {} },
                       { text: '确认', onPress: () => props.cancelOrderAction },
                   ])}>
        取消订单
    </Button>
};

// 按钮-确认收货
export const ConfirmReceiveButton = (props) => {
    const style = props.isDetail ? orderDetailButtonStyle : orderButtonStyle;
    return <Button type="ghost" inline size="small" style={style}
                   onClick={() => alert('确认收货', '您确认要收货吗？', [
                       { text: '取消', onPress: () => {} },
                       { text: '确认', onPress: () => props.confirmReceiveAction },
                   ])}>
        确认收货
    </Button>
};

// 按钮-评价
export const EvaluateOrderButton = (props) => {
    const style = props.isDetail ? orderDetailButtonStyle : evaluateOrderButtonStyle;
    return <Button type="ghost" inline size="small" style={style}
                    onClick={props.evaluateOrderAction}>
        评价
    </Button>
};

// 按钮-查看详情
export const ViewOrderDetailButton = (props) => {
    return <Button type="ghost" inline size="small" style={orderButtonStyle}
                   onClick={props.viewOrderDetailAction}>
        查看详情
    </Button>
};

// 按钮-申请退款
export const ApplyForRefundButton = (props) => {
    return <Button type="ghost" inline size="small" style={orderDetailButtonStyle}
                   onClick={props.applyForRefundAction}>
        申请退款
    </Button>
};