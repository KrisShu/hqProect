import request from '@/utils/request';

//首页
export function fetchList(data) {
    return request({
        url: '/system/order/list',
        method: 'post',
        data: data,
    });
}
// 新增客户订单
export function addOrder(data) {
    return request({
        url: '/system/order/add',
        method: 'post',
        data: data,
    });
}
// 编辑客户订单
export function editOrder(data) {
    return request({
        url: '/system/order/edit',
        method: 'post',
        data: data,
    });
}
// 删除
export function removeOrder(ids) {
    return request({
        url: `/system/order/remove/${ids}`,
        method: 'delete',
    });
}
// 派单
export function sendOrder(data) {
    return request({
        url: '/system/order/sendOrder',
        method: 'post',
        data: data,
    });
}
// 收款
export function additionalAmount(data) {
    return request({
        url: '/system/order/additionalAmount',
        method: 'post',
        data: data,
    });
}
// 退款
export function refund(data) {
    return request({
        url: '/system/order/refund',
        method: 'post',
        data: data,
    });
}

//结单
export function statementOfAccount(data) {
    return request({
        url: '/system/order/statementOfAccount',
        method: 'post',
        data: data,
    });
}
// 订单完成
export function completeOrder(data) {
    return request({
        url: '/system/order/complete',
        method: 'post',
        data: data,
    });
}

// 取消完成
export function cancelOrder(data) {
    return request({
        url: '/system/order/cancel',
        method: 'post',
        data: data,
    });
}

// 详情-操作记录
export function recordList(data) {
    return request({
        url: '/system/record/list',
        method: 'post',
        data: data,
    });
}

export function testUser(data) {
    return request({
        url: '/system/order/testUser',
        method: 'get',
        rawParams: data,
    });
}
// 佣金计算
export function royaltyCalculation(data) {
    return request({
        url: '/system/order/royaltyCalculation',
        method: 'post',
        data: data,
    });
}

// 佣金计算
export function getRoyaltyCalculation(data) {
    return request({
        url: '/system/order/getRoyaltyCalculation',
        method: 'post',
        data: data,
    });
}

export function fecthTotal(data) {
    return request({
        url: '/system/order/total',
        method: 'post',
        data: data,
    });
}

export default {
    fetchList,
    addOrder,
    editOrder,
    removeOrder,
    sendOrder,
    additionalAmount,
    statementOfAccount,
    completeOrder,
    cancelOrder,
    recordList,
    testUser,
    royaltyCalculation,
    getRoyaltyCalculation,
    fecthTotal,
    refund,
};
