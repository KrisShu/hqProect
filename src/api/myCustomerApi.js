import request from '@/utils/request';

//首页
export function fetchList(data) {
    return request({
        url: '/system/order/myList',
        method: 'post',
        data: data,
    });
}
export default {
    fetchList,
};
