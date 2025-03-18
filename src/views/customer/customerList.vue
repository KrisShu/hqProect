<template>
    <div class="app-container">
        <!-- 查询条件 -->
        {{ $store.getters.name }}
        <el-row class="search-box flex-wrap flex-hh mb20" v-show="showSearch">
            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <el-select
                        v-model="queryParams.option1"
                        @change="
                            e => {
                                optionSelectChange(e, 'value1');
                            }
                        "
                    >
                        <el-option label="单号" value="orderNumber"> </el-option>
                        <el-option label="接单微信号" value="sourceWx"> </el-option>
                        <el-option label="客户概况" value="customerProfiling"> </el-option>
                    </el-select>
                </div>
                <div class="vlue-box">
                    <el-input v-model="queryParams.value1" placeholder="请输入内容" clearable style="width: 240px" />
                </div>
            </el-col>

            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">业务员：</div>
                </div>
                <div class="vlue-box">
                    <el-select
                        v-model="queryParams.salesmanUserId"
                        placeholder="请选择业务员"
                        clearable
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in $store.getters.salesmanUserList"
                            :key="dict.userId"
                            :label="dict.userName"
                            :value="dict.userId"
                        />
                    </el-select>
                </div>
            </el-col>
            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">负责人：</div>
                </div>
                <div class="vlue-box">
                    <el-select
                        v-model="queryParams.principalUserId"
                        placeholder="请选择负责人"
                        clearable
                        style="width: 240px"
                    >
                        <el-option
                            v-for="dict in $store.getters.principalUserList"
                            :key="dict.userId"
                            :label="dict.userName"
                            :value="dict.userId"
                        />
                    </el-select>
                </div>
            </el-col>
            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">状态：</div>
                </div>
                <div class="vlue-box">
                    <el-select v-model="queryParams.orderState" placeholder="请选择状态" clearable style="width: 240px">
                        <el-option
                            v-for="dict in statusOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </div>
            </el-col>

            <el-row class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <el-select
                        v-model="queryParams.option3"
                        @change="
                            e => {
                                optionSelectChange(e, 'value3');
                            }
                        "
                    >
                        <el-option label="下单日期" value="OrderTime"> </el-option>
                        <el-option label="交付日期" value="ReleasedTime"> </el-option>
                    </el-select>
                </div>
                <div class="vlue-box">
                    <el-date-picker
                        v-model="queryParams.value3"
                        style="width: 240px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </div>
            </el-row>

            <el-row class="mt20 flex-wrap search-btn w100">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-row>
        </el-row>
        <!-- 操作栏 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['system:role:add']"
                    >新增</el-button
                >
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column fixed label="单号" prop="orderNumber" width="120" />
            <el-table-column label="客户概况" align="center" prop="customerProfiling" width="250" />
            <el-table-column label="项目概况" align="center" prop="projectSummaryLable" width="250" />

            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    {{ scope.row.orderState }}
                </template>
            </el-table-column>
            <el-table-column label="交易金额" align="center" prop="totalAmount" width="120" />
            <el-table-column label="已付款" align="center" prop="paidAmount" width="120" />
            <el-table-column label="未付款" align="center" prop="roleId" width="120" />
            <el-table-column sortable label="下单日期" align="center" prop="startOrderTime" width="150" />
            <el-table-column sortable label="交付日期" align="center" prop="startReleasedTime" width="150" />
            <el-table-column label="接单微信" prop="sourceWx" />
            <el-table-column label="业务员" prop="salemanUserName" />
            <el-table-column label="负责人" prop="principalUserId" />

            <el-table-column
                fixed="right"
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                width="200"
            >
                <template slot-scope="scope" v-if="scope.row.roleId !== 1">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">
                        详情
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">
                        编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">
                        删除
                    </el-button>

                    <el-button size="mini" type="text" icon="el-icon-finished" @click="handleCompelete(scope.row)">
                        完成
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-circle-plus-outline"
                        @click="handleDelete(scope.row)"
                    >
                        追加
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-circle-check"
                        @click="handleOrder('finish', scope.row)"
                    >
                        结单
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-top-right" @click="handleOrder('send', scope.row)">
                        派单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改客户 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="customerForm" :rules="rules" label-width="100px">
                <el-form-item label="客户概况" prop="customerInfo">
                    <el-input v-model="customerForm.customerInfo" placeholder="请输入客户概况" />
                </el-form-item>
                <el-form-item label="项目概况" prop="peojectInfo">
                    <el-select
                        v-model="customerForm.peojectInfo"
                        value-key=""
                        placeholder="请选择对应的项目概况"
                        clearable
                        class="w100"
                    >
                        <el-option
                            v-for="item in projectOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户微信" prop="wechat">
                    <el-input v-model="customerForm.wechat" placeholder="请输入客户微信" />
                </el-form-item>
                <el-form-item label="交易金额" prop="num">
                    <el-input-number
                        class="w100"
                        v-model="customerForm.num"
                        controls-position="right"
                        :precision="2"
                        :step="1"
                        :min="0"
                        :max="5000"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="已付款" prop="roleName">
                    <el-input-number
                        class="w100"
                        v-model="customerForm.payMoney"
                        controls-position="right"
                        :precision="2"
                        :step="1"
                        :min="0"
                        :max="5000"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="下单日期" prop="createTime">
                    <el-date-picker
                        class="w100"
                        v-model="customerForm.createTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交付时间" prop="completeTime">
                    <el-date-picker
                        class="w100"
                        v-model="customerForm.completeTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="接单微信" prop="staffWechat">
                    <el-input v-model="customerForm.staffWechat" placeholder="请输入接单微信" />
                </el-form-item>

                <el-form-item label="业务员">
                    <el-select class="w100" v-model="customerForm.staffId" placeholder="请选择对应的业务员" clearable>
                        <el-option
                            v-for="item in staffOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input
                        class="w100"
                        v-model="customerForm.remark"
                        type="textarea"
                        placeholder="请输入内容"
                        :rows="2"
                        maxlength="300"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 结单&派单弹窗 -->
        <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
            <el-form :model="detailsForm" label-width="100px">
                <div class="flex-wrap lable-item">
                    <div class="label-box">单号：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">客户概况：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">项目概况：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">状态：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">交易金额：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box"></div>
                    <div class="vlue-box flex-wrap">
                        <div>已付款：</div>
                        <div>未付款：</div>
                    </div>
                </div>

                <div class="flex-wrap lable-item">
                    <div class="label-box">下单日期：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">交付日期：</div>
                    <div class="vlue-box">1111</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">接单微信：</div>
                    <div class="vlue-box">1111</div>
                </div>

                <el-form-item label="负责人：">
                    <el-select
                        class="w100"
                        v-model="detailsForm.principal"
                        placeholder="请选择负责人"
                        :disabled="isPrincipal"
                        clearable
                    >
                        <el-option
                            v-for="item in staffOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="detailsForm.remark" type="textarea" :rows="2" maxlength="300" show-word-limit />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataScope">确 定</el-button>
                <el-button @click="cancelDataScope">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import API from '@/api/customerApi';
    import commApi from '@/api/commApi';
    import {
        listRole,
        getRole,
        delRole,
        addRole,
        updateRole,
        dataScope,
        changeRoleStatus,
        deptTreeSelect,
    } from '@/api/system/role';

    export default {
        name: 'Role',
        dicts: ['sys_normal_disable'],
        data() {
            return {
                // 遮罩层
                loading: true,
                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                // 角色表格数据
                roleList: [],
                // 弹出层标题
                title: '',
                // 是否显示弹出层
                open: false,
                // 是否显示弹出层（数据权限）
                openDataScope: false,
                // 数据范围选项
                dataScopeOptions: [
                    {
                        value: '1',
                        label: '全部数据权限',
                    },
                    {
                        value: '2',
                        label: '自定数据权限',
                    },
                    {
                        value: '3',
                        label: '本部门数据权限',
                    },
                    {
                        value: '4',
                        label: '本部门及以下数据权限',
                    },
                    {
                        value: '5',
                        label: '仅本人数据权限',
                    },
                ],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    option1: 'orderNumber',
                    value1: undefined,

                    option3: 'OrderTime',
                    value3: [],
                    status: undefined,

                    orderNumber: undefined, //单号
                    customerProfiling: undefined, //客户概况
                    projectSummaryLable: undefined, //项目概况
                    orderState: undefined, //状态
                    startOrderTime: undefined, //下单日期
                    endOrderTime: undefined, //下单日期
                    OrderTime: [],
                    principalUserId: undefined, //负责人
                    startReleasedTime: undefined, //交付日期
                    endReleasedTime: undefined, //交付日期
                    ReleasedTime: [], //交付日期
                    sourceWx: undefined, //接单微信号
                    salesmanUserId: undefined, //业务员

                    // id: undefined,
                    // orderNumber: undefined,
                    // customerProfiling: undefined,
                    // projectSummaryDictCode: undefined,
                    // projectSummaryLable: undefined,
                },

                customerForm: {}, //客户数据
                detailsForm: {}, //结单&派单数据
                isPrincipal: false, //是否禁用负责人
                staffOptions: [
                    {
                        value: '1',
                        label: '张三',
                    },
                    {
                        value: '2',
                        label: '李四',
                    },
                    {
                        value: '3',
                        label: '王五',
                    },
                ],
                projectOptions: [
                    {
                        value: '1',
                        label: '项目1',
                    },
                    {
                        value: '2',
                        label: '项目2',
                    },
                    {
                        value: '3',
                        label: '项目3',
                    },
                ],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '今天',
                            onClick(picker) {
                                picker.$emit('pick', new Date());
                            },
                        },
                        {
                            text: '昨天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            },
                        },
                    ],
                },
                statusOptions: [
                    // 2: 未派单, 3: 已派单, 4: 已完成, 5: 结接单
                    {
                        value: 2,
                        label: '未派单',
                    },
                    {
                        value: 3,
                        label: '已派单',
                    },
                    {
                        value: 4,
                        label: '已完成',
                    },
                    {
                        value: 5,
                        label: '接单',
                    },
                ],
                // 表单校验
                rules: {
                    customerInfo: [{ required: true, message: '客户概况不能为空', trigger: 'blur' }],
                    peojectInfo: [{ required: true, message: '请选择对应的项目概况', trigger: 'change' }],
                    num: [{ required: true, message: '请输入正确的交易金额', trigger: 'blur' }],
                    completeTime: [{ required: true, message: '请选择交付时间', trigger: 'change' }],
                    createTime: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
                    staffWechat: [{ required: true, message: '请输入接单人员的微信', trigger: 'blur' }],
                },
            };
        },
        created() {
            this.getList();
            // this.fetchsalesmanUserList();
        },
        methods: {
            // fetchsalesmanUserList() {
            //     commApi.fetchprincipalUserList({ keyWord: undefined }).then(res => {
            //         console.log('res.data----------------获取系统元数据', res.rows);
            //         // this.salesmanUserList = res.data;
            //     });
            // },
            /** 查询角色列表 */
            getList() {
                this.loading = true;
                // listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                //     this.roleList = response.rows;
                //     this.total = response.total;
                //     this.loading = false;
                // });
                API.fetchList(this.queryParams).then(res => {
                    this.roleList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },
            optionSelectChange(key, valueKey) {
                console.log('key', key, valueKey);
                this.queryParams[key] = this.queryParams[valueKey];
            },

            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = [];
                this.resetForm('queryForm');
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.roleId);
                this.single = selection.length != 1;
                this.multiple = !selection.length;
            },

            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                // this.getMenuTreeselect();
                this.open = true;
                this.title = '添加客户';
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const roleId = row.roleId || this.ids;
                this.open = true;
                this.title = '编辑客户';
            },
            handleOrder(type, row) {
                this.title = type == 'finish' ? '结单' : '派单';
                this.openDataScope = true;
                this.isPrincipal = type == 'finish';
            },

            // 取消按钮（数据权限）
            cancelDataScope() {
                this.openDataScope = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.customerForm = {
                    customerInfo: undefined,
                    peojectInfo: undefined,
                    wechat: undefined,
                    num: undefined,
                    payMoney: undefined,
                    createTime: undefined,
                    completeTime: undefined,
                    staffId: undefined,
                    staffWechat: undefined,
                    remark: undefined,
                };
                this.resetForm('form');
            },

            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.roleId != undefined) {
                            this.form.menuIds = this.getMenuAllCheckedKeys();
                            updateRole(this.form).then(response => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            this.form.menuIds = this.getMenuAllCheckedKeys();
                            addRole(this.form).then(response => {
                                this.$modal.msgSuccess('新增成功');
                                this.open = false;
                                this.getList();
                            });
                        }
                    }
                });
            },
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            /** 提交按钮（数据权限） */
            submitDataScope: function () {
                if (this.form.roleId != undefined) {
                    this.form.deptIds = this.getDeptAllCheckedKeys();
                    dataScope(this.form).then(response => {
                        this.$modal.msgSuccess('修改成功');
                        this.openDataScope = false;
                        this.getList();
                    });
                }
            },

            handleDetail(row) {
                this.$router.push({
                    path: '/customer/CustomerDetail',
                    query: {
                        id: row.roleId,
                    },
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const roleIds = row.roleId || this.ids;
                this.$modal
                    .confirm('是否确认删除？')
                    .then(function () {
                        return delRole(roleIds);
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('删除成功');
                    })
                    .catch(() => {});
            },
            handleCompelete() {
                this.$modal
                    .confirm('是否完成此客户的订单？')
                    .then(function () {
                        return delRole(roleIds);
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('已完成');
                    })
                    .catch(() => {});
            },
            /** 导出按钮操作 */
            handleExport() {
                this.download(
                    'system/role/export',
                    {
                        ...this.queryParams,
                    },
                    `role_${new Date().getTime()}.xlsx`,
                );
            },
        },
    };
</script>

<style lang="scss">
    .lable-item {
        align-items: center;
        .label-box {
            width: 100px;
            padding-right: 12px;
            font-size: 14px;
            color: #606266;
            line-height: 36px;
            text-align: right;
            flex-shrink: 0;
        }
        .vlue-box {
            flex: 1;
            flex-shrink: 0;
        }
    }
    .el-dialog__header {
        background-color: aliceblue;
    }
</style>
