/*管理订单状态映射*/

function checkDetailState(orderState) {
    switch (orderState) {
        case 0:
            return "待付款";
        case 1:
            return "待审核";
        case 2:
            return "待出库";
        case 3:
            return "待发货";
        case 4:
            return "待收货";
        case 5:
            return "已收货";
        case 6:
            return "已完成";
        case 7:
            return "已取消";
        case 8:
            return "待确认";
        case 9:
            return "待退货";
        case 10:
            return "待入库";
        case 11:
            return "待退款";
        case 12:
            return "已退款";
    }
}

function checkOrder(tab) {
    switch (tab) {
        case 0:
            return "";
        case 1:
            return "待付款";
        case 2:
            return "待发货";
        case 3:
            return "待收货";
        case 4:
            return "待评价";
        case 5:
            return "退款";
    }
}

// function checkState(orderState) {
//     if (orderState === 0) {
//         return "待付款"
//     } else if (orderState === 1 || orderState ===2 || orderState ===3) {
//         return "待发货"
//     } else if (orderState === 4 || orderState === 7) {
//         return "待收货"
//     } else if (orderState === 5 || orderState === 6) {
//         return "待评价"
//     } else if (orderState === 8 || orderState === 9 || orderState === 10 || orderState === 11) {
//         return "退款"
//     } else {
//         return null
//     }
// }

const OrderManager = {
    checkDetailState,
    checkOrder,
};

export default OrderManager;