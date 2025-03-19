import { login, logout, getInfo } from '@/api/login';
import { fetchsalesmanUserList, fetchprincipalUserList, fetchDictType } from '@/api/commApi';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { isHttp, isEmpty } from '@/utils/validate';
import defAva from '@/assets/images/profile.jpg';

const user = {
    state: {
        token: getToken(),
        id: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
        salesmanUserList: [], // 业务员元数据
        principalUserList: [], // 负责人元数据
        projectSummaryList: [], // 项目状态元数据
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_ID: (state, id) => {
            state.id = id;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions;
        },
        SET_SALESMAN_USER_LIST: (state, salesmanUserList) => {
            state.salesmanUserList = salesmanUserList;
        },
        SET_PRINCIPAL_USER_LIST: (state, principalUserList) => {
            state.principalUserList = principalUserList;
        },
        SET_STATUS_LIST: (state, statusList) => {
            state.statusList = statusList;
        },
        SET_PROJECT_SUMMARY_LIST: (state, projectSummaryList) => {
            state.projectSummaryList = projectSummaryList;
        },
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim();
            const password = userInfo.password;
            const code = userInfo.code;
            const uuid = userInfo.uuid;
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid)
                    .then(res => {
                        setToken(res.token);
                        commit('SET_TOKEN', res.token);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo()
                    .then(res => {
                        const user = res.user;
                        let avatar = user.avatar || '';
                        if (!isHttp(avatar)) {
                            avatar = isEmpty(avatar) ? defAva : process.env.VUE_APP_BASE_API + avatar;
                        }
                        if (res.roles && res.roles.length > 0) {
                            // 验证返回的roles是否是一个非空数组
                            commit('SET_ROLES', res.roles);
                            commit('SET_PERMISSIONS', res.permissions);
                        } else {
                            commit('SET_ROLES', ['ROLE_DEFAULT']);
                        }
                        commit('SET_ID', user.userId);
                        commit('SET_NAME', user.userName);
                        commit('SET_AVATAR', avatar);
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 获取系统元数据
        GetSysMetaList({ commit }) {
            return new Promise((resolve, reject) => {
                Promise.all([
                    fetchsalesmanUserList({ keyWord: undefined }),
                    fetchprincipalUserList({ keyWord: undefined }),
                    fetchDictType('project_summary'),
                ])
                    .then(([salesmanUserList, principalUserList, projectSummaryList]) => {
                        // console.log('salesmanUserList----------------', salesmanUserList);
                        commit('SET_SALESMAN_USER_LIST', salesmanUserList.rows);
                        commit('SET_PRINCIPAL_USER_LIST', principalUserList.rows);
                        commit('SET_PROJECT_SUMMARY_LIST', projectSummaryList.data);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token)
                    .then(() => {
                        commit('SET_TOKEN', '');
                        commit('SET_ROLES', []);
                        commit('SET_PERMISSIONS', []);
                        removeToken();
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                removeToken();
                resolve();
            });
        },
    },
};

export default user;
