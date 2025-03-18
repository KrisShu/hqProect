import request from '@/utils/request';

// 获取业务元数据
export function fetchsalesmanUserList(data) {
    return request({
        url: '/system/order/salesmanUserList',
        method: 'post',
        data: data,
    });
}

export function fetchprincipalUserList(data) {
    return request({
        url: '/system/order/principalUserList',
        method: 'post',
        data: data,
    });
}
// 获取元数据
export function fetchDictType(query) {
    return request({
        url: `/system/dict/data/type/${query}`,
        method: 'get',
    });
}

// export function listUser(query) {
//   return request({
//     url: '/system/user/list',
//     method: 'get',
//     params: query
//   })
// }

export default {
    fetchsalesmanUserList,
    fetchprincipalUserList,
    fetchDictType,
};
