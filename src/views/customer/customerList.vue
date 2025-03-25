<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-row class="search-box flex-wrap flex-hh mb20" v-show="showSearch">
            <el-row class="w100">
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">单号：</div>
                    </div>
                    <div class="vlue-box">
                        <el-input
                            v-model="queryParams.orderNumber"
                            placeholder="请输入内容"
                            clearable
                            style="width: 240px"
                        />
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">接单微信号：</div>
                    </div>
                    <div class="vlue-box">
                        <el-input
                            v-model="queryParams.sourceWx"
                            placeholder="请输入内容"
                            clearable
                            style="width: 240px"
                        />
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">客户概况：</div>
                    </div>
                    <div class="vlue-box">
                        <el-input
                            v-model="queryParams.customerProfiling"
                            placeholder="请输入内容"
                            clearable
                            style="width: 240px"
                        />
                    </div>
                </el-col>
            </el-row>

            <el-row class="w100">
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
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
                                v-for="(dict, index) in $store.getters.salesmanUserList"
                                :key="index"
                                :label="dict.userName"
                                :value="dict.userId"
                            />
                        </el-select>
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
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
                                v-for="(dict, index) in $store.getters.principalUserList"
                                :key="index"
                                :label="dict.userName"
                                :value="dict.userId"
                            />
                        </el-select>
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">状态：</div>
                    </div>
                    <div class="vlue-box">
                        <el-select
                            v-model="queryParams.orderState"
                            placeholder="请选择状态"
                            clearable
                            style="width: 240px"
                        >
                            <el-option
                                v-for="dict in statusOptions"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">项目概况：</div>
                    </div>
                    <div class="vlue-box">
                        <el-select
                            v-model="queryParams.projectSummaryDictCode"
                            placeholder="请选择项目概况"
                            style="width: 240px"
                        >
                            <el-option
                                v-for="item in $store.getters.projectSummaryList"
                                :key="item.dictValue"
                                :label="item.dictLabel"
                                :value="item.dictValue"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
            <el-row class="w100">
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <div class="label-box">
                        <div class="lael-input">下单日期：</div>
                    </div>
                    <div class="vlue-box">
                        <el-date-picker
                            v-model="queryParams.OrderTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <div class="label-box">
                        <div class="lael-input">交付日期：</div>
                    </div>
                    <div class="vlue-box">
                        <el-date-picker
                            v-model="queryParams.ReleasedTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </div>
                </el-col>
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
                    v-hasPermi="['customer:CustomerList:add']"
                    >新增</el-button
                >
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="customerOrderList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column fixed label="单号" prop="orderNumber" width="120" />
            <el-table-column label="客户概况" align="center" prop="customerProfiling" width="250" />
            <el-table-column label="项目概况" align="center" prop="projectSummaryLable" width="250" />

            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <el-tag :type="orderStateType(scope.row.orderState)">
                        {{ orderState(scope.row.orderState) }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column label="交易金额" align="center" prop="totalAmount" width="120" />
            <el-table-column label="已付款" align="center" prop="paidAmount" width="120" />
            <el-table-column label="未付款" align="center" prop="roleId" width="120">
                <template slot-scope="scope">
                    {{ (scope.row.totalAmount - scope.row.paidAmount).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column sortable label="下单日期" align="center" prop="orderTime" width="150" />
            <el-table-column sortable label="交付日期" align="center" prop="releasedTime" width="150" />
            <el-table-column label="接单微信" prop="sourceWx" />
            <el-table-column label="业务员" prop="salemanUserName" />
            <el-table-column label="负责人" prop="principalUserName" />

            <el-table-column
                fixed="right"
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                width="200"
            >
                <template slot-scope="scope">
                    <!-- 按钮权限

                        详情：所有
                        编辑：所有                        已结单不能编辑

                        删除：所有角色                    未派单的状态才能点击删除
                        完成: 负责人管理员、业务管理员    已派单的状态才能点击已完成
                    取消完成：负责人管理员、业务管理员    已完成的状态才能点击取消完成
                        追加：负责人管理员、业务管理员    只有结单的不能追加
                        结单：负责人管理员、业务管理员    客户订单已完成状态才能点击结单
                        派单：负责人管理员、业务管理员    客户订单未派单状态才能点击派单

                    -->
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">
                        详情
                    </el-button>
                    <el-button
                        v-show="scope.row.orderState != 5"
                        v-hasPermi="['customer:CustomerList:edit']"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                    >
                        编辑
                    </el-button>
                    <el-button
                        v-show="scope.row.orderState == 2"
                        v-hasPermi="['customer:CustomerList:delete']"
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                    >
                        删除
                    </el-button>

                    <el-button
                        v-show="scope.row.orderState == 3"
                        v-hasPermi="['customer:CustomerList:complete']"
                        size="mini"
                        type="text"
                        icon="el-icon-finished"
                        @click="handleCompelete(scope.row)"
                    >
                        完成
                    </el-button>
                    <el-button
                        v-show="scope.row.orderState == 4"
                        v-hasPermi="['customer:CustomerList:cancel']"
                        size="mini"
                        type="text"
                        icon="el-icon-circle-close"
                        @click="handleCancel(scope.row)"
                    >
                        取消
                    </el-button>

                    <el-button
                        v-show="scope.row.orderState != 5"
                        v-hasPermi="['customer:CustomerList:concat']"
                        size="mini"
                        type="text"
                        icon="el-icon-circle-plus-outline"
                        @click="handleOrder('additionalAmount', scope.row)"
                    >
                        追加
                    </el-button>
                    <el-button
                        v-show="scope.row.orderState == 4"
                        size="mini"
                        type="text"
                        icon="el-icon-circle-check"
                        @click="handleOrder('finish', scope.row)"
                        v-hasPermi="['customer:CustomerList:finish']"
                    >
                        结单
                    </el-button>
                    <el-button
                        v-show="scope.row.orderState == 2"
                        size="mini"
                        type="text"
                        icon="el-icon-top-right"
                        @click="handleOrder('send', scope.row)"
                        v-hasPermi="['customer:CustomerList:send']"
                    >
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
            <el-form ref="customerForm" :model="customerForm" :rules="customerFormRules" label-width="100px">
                <el-form-item label="客户概况" prop="customerProfiling">
                    <el-input v-model="customerForm.customerProfiling" placeholder="请输入客户概况" />
                </el-form-item>
                <el-form-item label="项目概况" prop="projectSummaryDictCode">
                    <el-select
                        v-model="customerForm.projectSummaryDictCode"
                        placeholder="请选择对应的项目概况"
                        clearable
                        class="w100"
                    >
                        <el-option
                            v-for="item in $store.getters.projectSummaryList"
                            :key="item.dictValue"
                            :label="item.dictLabel"
                            :value="item.dictValue"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户微信" prop="customerWx">
                    <el-input v-model="customerForm.customerWx" placeholder="请输入客户微信" />
                </el-form-item>
                <el-form-item label="交易金额" prop="totalAmount">
                    <el-input-number
                        class="w100"
                        v-model="customerForm.totalAmount"
                        controls-position="right"
                        :precision="2"
                        :step="1"
                        :min="0"
                        :max="5000"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="已付款" prop="paidAmount">
                    <el-input-number
                        class="w100"
                        v-model="customerForm.paidAmount"
                        controls-position="right"
                        :precision="2"
                        :step="1"
                        :min="0"
                        :max="50000"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="未付款" prop="finalPayment">
                    <el-input-number
                        class="w100"
                        :value="finalPayment"
                        controls-position="right"
                        :precision="2"
                        :step="1"
                        :min="0"
                        :max="50000"
                        disabled
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="下单日期" prop="orderTime">
                    <el-date-picker
                        class="w100"
                        v-model="customerForm.orderTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="交付时间" prop="releasedTime">
                    <el-date-picker
                        class="w100"
                        v-model="customerForm.releasedTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="接单微信" prop="sourceWx">
                    <el-input v-model="customerForm.sourceWx" placeholder="请输入接单微信" />
                </el-form-item>
                <!-- 管理员才有当前项选择；业务员就是新建客户的人 -->
                <el-form-item label="业务员" prop="salesmanUserId">
                    <el-select
                        class="w100"
                        v-model="customerForm.salesmanUserId"
                        placeholder="请选择对应的业务员"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in $store.getters.salesmanUserList"
                            :key="index"
                            :label="item.userName"
                            :value="item.userId"
                        >
                            <!-- {{ item.userId }} -->
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
                    <div class="vlue-box">{{ detailsForm.customerProfiling }}</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">项目概况：</div>
                    <div class="vlue-box">{{ detailsForm.projectSummaryLable }}</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">状态：</div>
                    <div class="vlue-box">{{ orderState(detailsForm.orderState) }}</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">交易金额：</div>
                    <div class="vlue-box">
                        <el-link type="primary">{{ detailsForm.totalAmount }}</el-link>
                    </div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box"></div>
                    <div class="vlue-box flex-wrap">
                        <el-link type="success" class="mr10">已付款：{{ detailsForm.paidAmount }}</el-link>
                        <el-link type="danger">未付款：{{ finalPayment_detailsForm }}</el-link>
                    </div>
                </div>

                <div class="flex-wrap lable-item">
                    <div class="label-box">下单日期：</div>
                    <div class="vlue-box">{{ detailsForm.orderTime }}</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">交付日期：</div>
                    <div class="vlue-box">{{ detailsForm.releasedTime }}</div>
                </div>
                <div class="flex-wrap lable-item">
                    <div class="label-box">接单微信：</div>
                    <div class="vlue-box">{{ detailsForm.sourceWx }}</div>
                </div>

                <el-form-item label="负责人：">
                    <el-select
                        class="w100"
                        v-model="detailsForm.principalUserId"
                        placeholder="请选择负责人"
                        :disabled="isPrincipal"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in principalUserList"
                            :key="index"
                            :label="item.userName"
                            :value="item.userId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="title == '追加'">
                    <el-form-item label="追加金额：">
                        <el-input-number
                            class="w100"
                            v-model="detailsForm.amount"
                            controls-position="right"
                            :precision="2"
                            :step="1"
                            :min="-50000"
                            :max="50000"
                        ></el-input-number>
                    </el-form-item>
                </template>
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
    import { orderSateMeta, metaToOptions } from '@/utils/meta';
    import { fetchprincipalUserList } from '@/api/commApi';

    export default {
        name: 'customerList',
        data() {
            return {
                // 遮罩层
                loading: true,
                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                customerOrderList: [],
                // 弹出层标题
                title: '',
                // 是否显示弹出层
                open: false,
                // 是否显示弹出层（数据权限）
                openDataScope: false,
                // 数据范围选项

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
                    projectSummaryDictCode: undefined, //项目概况
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
                },

                customerForm: {
                    customerProfiling: undefined, //客户概况
                    projectSummaryDictCode: undefined, //项目概况
                    projectSummaryLable: undefined, //项目概况
                    customerWx: undefined, //客户微信
                    totalAmount: undefined, //交易金额
                    paidAmount: undefined, //已付款
                    finalPayment: undefined, //未付款
                    orderTime: undefined, //下单日期
                    releasedTime: undefined, //交付日期
                    sourceWx: undefined, //接单微信
                    salesmanUserId: undefined, //业务员
                    remark: undefined, //备注
                }, //客户数据
                customerFormRules: {
                    customerProfiling: [{ required: true, message: '客户概况不能为空', trigger: 'blur' }],
                    projectSummaryDictCode: [{ required: true, message: '请选择对应的项目概况', trigger: 'change' }],

                    totalAmount: [{ required: true, message: '请输入交易金额', trigger: 'blur' }],

                    orderTime: [{ required: true, message: '请选择下单日期', trigger: 'change' }],
                    releasedTime: [{ required: true, message: '请选择交付日期', trigger: 'change' }],
                    sourceWx: [{ required: true, message: '请输入接单微信', trigger: 'blur' }],
                },
                detailsForm: {
                    orderNumber: undefined, //单号
                    customerProfiling: undefined, //客户概况
                    projectSummaryLable: undefined, //项目概况
                    orderState: undefined, //状态
                    totalAmount: undefined, //交易金额
                    paidAmount: undefined, //已付款

                    orderTime: undefined, //下单日期
                    releasedTime: undefined, //交付日期
                    sourceWx: undefined, //接单微信
                    salesmanUserId: undefined, //业务员
                    remark: undefined, //备注
                    amount: undefined, //追加金额
                }, //结单&派单数据
                isPrincipal: false, //是否禁用负责人
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
                        label: '已结单',
                    },
                ],
                principalUserList: [], //负责人列表
            };
        },
        computed: {
            // 未付款
            finalPayment() {
                const total = Number(this.customerForm.totalAmount) || 0;
                const paid = Number(this.customerForm.paidAmount) || 0;
                return (total - paid)?.toFixed(2); // 保留两位小数
            },
            finalPayment_detailsForm() {
                const total = Number(this.detailsForm.totalAmount) || 0;
                const paid = Number(this.detailsForm.paidAmount) || 0;
                return (total - paid)?.toFixed(2); // 保留两位小数
            },
            orderState() {
                return value => {
                    return this.statusOptions.find(item => item.value == value)?.label;
                };
            },
            orderStateType() {
                return value => {
                    if (value == 2) {
                        return 'warning';
                    } else if (value == 3) {
                        return 'danger';
                    } else if (value == 4) {
                        return 'success';
                    } else if (value == 5) {
                        return 'info';
                    }
                };
            },
            orderSateOptions() {
                console.log('orderSateMeta', metaToOptions(orderSateMeta));
                return metaToOptions(orderSateMeta);
            },
        },
        created() {
            this.getList();
            // this.testGet();
        },
        methods: {
            testGet() {
                API.testUser({
                    userId: 1,
                    keyWord: '测试',
                }).then(res => {
                    console.log(res);
                });
            },
            initprincipalUserList() {
                fetchprincipalUserList({
                    keyWord: undefined,
                }).then(res => {
                    console.log('333333333', res);
                    this.principalUserList = res.rows;
                });
            },
            getList() {
                this.loading = true;
                API.fetchList(this.queryParams).then(res => {
                    this.customerOrderList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;

                this.queryParams.startOrderTime = this.queryParams.OrderTime?.[0] || undefined;
                this.queryParams.endOrderTime = this.queryParams.OrderTime?.[1] || undefined;

                this.queryParams.startReleasedTime = this.queryParams.ReleasedTime?.[0] || undefined;
                this.queryParams.endReleasedTime = this.queryParams.ReleasedTime?.[1] || undefined;

                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.OrderTime = [];
                this.queryParams.ReleasedTime = [];

                this.queryParams.orderNumber = undefined;
                this.queryParams.sourceWx = undefined;
                this.queryParams.customerProfiling = undefined;
                this.queryParams.salesmanUserId = undefined;
                this.queryParams.principalUserId = undefined;
                this.queryParams.orderState = undefined;
                this.queryParams.startOrderTime = undefined;
                this.queryParams.endOrderTime = undefined;
                this.queryParams.startReleasedTime = undefined;
                this.queryParams.endReleasedTime = undefined;
                this.queryParams.projectSummaryDictCode = undefined;

                this.queryParams.pageNum = 1;

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
                console.log('当前的用户id', this.$store.state.user.id);
                let currid = this.$store.state.user.id;

                this.customerForm.salesmanUserId =
                    this.$store.getters.salesmanUserList.find(item => item.userId == currid)?.userId ?? undefined;
                // let _this = this;
                // const id =
                // this.$store.getters.salesmanUserList.forEach(item => {
                //     console.log(
                //         'itemitemitem',
                //         item.userId,
                //         this.$store.state.user.id,
                //         item.userId == _this.$store.state.user.id,
                //     );

                //     if (item.userId == this.$store.state.user.userId) {
                //         // this.customerForm.salesmanUserId = item.userId;
                //         console.log('7887878');
                //     }

                // });
                // console.log('id', id);
                console.log('this.customerForm.salesmanUserId', this.customerForm.salesmanUserId);
                this.open = true;
                this.title = '添加客户';
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                this.customerForm = Object.assign({}, row, {
                    projectSummaryDictCode: String(row.projectSummaryDictCode),
                });
                this.open = true;
                this.title = '编辑客户';
            },
            handleOrder(type, row) {
                this.initprincipalUserList();
                this.detailsForm = Object.assign({}, row, {
                    totalAmount: row.totalAmount?.toFixed(2),
                    paidAmount: row.paidAmount?.toFixed(2) || 0,
                    principalUserId: row.principalUserId
                        ? row.principalUserId
                        : type == 'send'
                        ? undefined
                        : '暂无负责人',

                    remark: undefined,
                    amount: undefined,
                });

                this.title = type == 'finish' ? '结单' : type == 'send' ? '派单' : '追加';
                this.openDataScope = true;
                this.isPrincipal = type !== 'send';
            },

            // 取消按钮（数据权限）
            cancelDataScope() {
                this.openDataScope = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.customerForm = {
                    customerProfiling: undefined, //客户概况
                    projectSummaryDictCode: undefined, //项目概况
                    projectSummaryLable: undefined, //项目概况
                    customerWx: undefined, //客户微信
                    totalAmount: undefined, //交易金额
                    paidAmount: undefined, //已付款
                    finalPayment: undefined, //未付款
                    orderTime: undefined, //下单日期
                    releasedTime: undefined, //交付日期
                    sourceWx: undefined, //接单微信
                    salesmanUserId: undefined, //业务员
                    remark: undefined, //备注
                };
                this.resetForm('customerForm');
            },
            // 保存新增和编辑客户订单
            submitForm: function () {
                this.$refs['customerForm'].validate(valid => {
                    if (valid) {
                        if (this.customerForm.id != undefined) {
                            // this.form.menuIds = this.getMenuAllCheckedKeys();
                            // updateRole(this.form).then(response => {
                            //     this.$modal.msgSuccess('修改成功');
                            //     this.open = false;
                            //     this.getList();
                            // });
                            API.editOrder(this.customerForm).then(res => {
                                this.$modal.msgSuccess('修改成功');
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            this.customerForm.projectSummaryLable = this.$store.getters.projectSummaryList.find(
                                item => item.dictValue == this.customerForm.projectSummaryDictCode,
                            ).dictLabel;
                            API.addOrder(this.customerForm).then(res => {
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
                if (this.title == '结单') {
                    const params = {
                        id: this.detailsForm.id,

                        remark: this.detailsForm.remark,
                    };
                    API.statementOfAccount(params).then(res => {
                        this.$modal.msgSuccess('结单成功');
                        this.openDataScope = false;
                        this.getList();
                    });
                } else if (this.title == '派单') {
                    if (this.detailsForm.principalUserId == undefined) {
                        this.$modal.msgError('请选择派单人员');
                        return;
                    }
                    const params = {
                        id: this.detailsForm.id,
                        principalUserId: this.detailsForm.principalUserId,
                        remark: this.detailsForm.remark,
                    };
                    API.sendOrder(params).then(res => {
                        this.$modal.msgSuccess('派单成功');
                        this.openDataScope = false;
                        this.getList();
                    });
                } else if (this.title == '追加') {
                    if (this.detailsForm.amount == undefined) {
                        this.$modal.msgError('请输入追加金额');
                        return;
                    }
                    const params = {
                        id: this.detailsForm.id,
                        amount: this.detailsForm.amount,
                        remark: this.detailsForm.remark,
                    };
                    API.additionalAmount(params).then(res => {
                        this.$modal.msgSuccess('追加成功');
                        this.openDataScope = false;
                        this.getList();
                    });
                }
            },

            handleDetail(row) {
                this.$router.push({
                    path: '/customer/CustomerDetail',
                    query: {
                        details: JSON.stringify(row),
                        type: 'customer',
                    },
                });
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                this.$modal
                    .confirm('是否确认删除？')
                    .then(function () {
                        return API.removeOrder(row.id);
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('删除成功');
                    })
                    .catch(() => {});
            },
            handleCompelete(row) {
                this.$modal
                    .confirm('是否完成此客户的订单？')
                    .then(function () {
                        return API.completeOrder({ id: row.id });
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('操作成功');
                    })
                    .catch(() => {});
            },
            handleCancel(row) {
                this.$modal
                    .confirm('是否取消完成此客户的订单？')
                    .then(function () {
                        return API.cancelOrder({ id: row.id });
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('操作成功');
                    })
                    .catch(() => {
                        console.log('取消');
                    });
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
            font-weight: 500;
        }
        .vlue-box {
            flex: 1;
            flex-shrink: 0;
            font-size: 14px;
            color: #606266;
        }
    }
    .el-dialog__header {
        background-color: aliceblue;
    }
</style>
