import request from '@/utils/request';

// 获取业务元数据
export function fetchsalesmanUserList(query) {
    console.log('fetchsalesmanUserList=====', query);
    return request({
        url: '/system/order/salesmanUserList',
        method: 'get',
        params: query,
        headers: {
            jsonGet: true, // 标记为 JSON 格式 GET 请求
        },
    });
}

export function fetchprincipalUserList(query) {
    console.log('fetchsalesmanUserList=====', query);
    return request({
        url: '/system/order/principalUserList',
        method: 'get',
        params: query,
        headers: {
            jsonGet: true, // 标记为 JSON 格式 GET 请求
        },
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
};
