<template>
    <div class="app-container inglist-wrap">
        <el-row class="search-box flex-wrap flex-hh mb20" v-show="showSearch">
            <el-row class="w100">
                <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
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
                <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
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
                <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
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
                <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
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
                <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
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

                <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="8" :xl="6">
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
        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="ingList">
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
            <el-table-column label="下单日期" align="center" prop="orderTime" width="150" />
            <el-table-column label="交付日期" align="center" prop="releasedTime" width="150">
                <template slot-scope="scope">
                    <div>
                        <span>{{ scope.row.releasedTime }}</span>
                        <el-tag
                            effect="dark"
                            v-if="new Date(scope.row.releasedTime) < new Date()"
                            type="danger"
                            size="mini"
                            >最紧急
                        </el-tag>
                        <el-tag
                            effect="dark"
                            v-else-if="(new Date(scope.row.releasedTime) - new Date()) / (1000 * 60 * 60) <= 12"
                            type="warning"
                            size="mini"
                        >
                            非常紧急
                        </el-tag>
                        <el-tag
                            effect="dark"
                            v-else-if="(new Date(scope.row.releasedTime) - new Date()) / (1000 * 60 * 60) <= 24"
                            type="success"
                            size="mini"
                        >
                            紧急
                        </el-tag>
                        <el-tag effect="dark" v-else type="info" size="mini">正常</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="接单微信" prop="sourceWx" />
            <el-table-column label="业务员" prop="salemanUserName" />
            <el-table-column label="负责人" prop="principalUserId" />
            <el-table-column label="创建日期" prop="createTime" />

            <el-table-column
                fixed="right"
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                width="200"
            >
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.orderState == 3"
                        size="mini"
                        type="text"
                        icon="el-icon-finished"
                        @click="handleCompelete(scope.row)"
                    >
                        完成
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
    </div>
</template>

<script>
    import API from '@/api/myCustomerApi';
    import API2 from '@/api/customerApi';
    import { orderSateMeta, metaToOptions } from '@/utils/meta';
    export default {
        name: 'ingList',
        components: {},
        data() {
            return {
                // 遮罩层
                loading: false,
                showSearch: true,
                ingList: [],
                total: 0,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    orderState: 3, //待完成
                    orderNumber: undefined, //单号
                    customerProfiling: undefined, //客户概况
                    projectSummaryDictCode: undefined, //项目概况
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
            };
        },
        computed: {
            orderSateOptions() {
                return metaToOptions(orderSateMeta);
            },
            orderState() {
                return value => {
                    return this.orderSateOptions.find(item => item.value == value)?.label;
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
        },
        created() {
            console.log('created');
            this.getList();
        },
        methods: {
            getList() {
                this.loading = true;
                API.fetchList(this.queryParams).then(res => {
                    this.ingList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },
            optionSelectChange(key, valueKey) {
                if (key == 'orderNumber') {
                    this.queryParams.sourceWx = undefined;
                    this.queryParams.customerProfiling = undefined;
                } else if (key == 'sourceWx') {
                    this.queryParams.orderNumber = undefined;
                    this.queryParams.customerProfiling = undefined;
                } else if (key == 'customerProfiling') {
                    this.queryParams.orderNumber = undefined;
                    this.queryParams.sourceWx = undefined;
                } else if (key == 'OrderTime') {
                    this.queryParams.ReleasedTime = undefined;
                } else if (key == 'ReleasedTime') {
                    this.queryParams.OrderTime = undefined;
                }

                this.queryParams[key] = this.queryParams[valueKey];
                console.log('this.queryParams', this.queryParams[key]);
            },
            /** 搜索按钮操作 */
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
                this.queryParams.startOrderTime = undefined;
                this.queryParams.endOrderTime = undefined;
                this.queryParams.startReleasedTime = undefined;
                this.queryParams.endReleasedTime = undefined;
                this.queryParams.projectSummaryDictCode = undefined;

                this.queryParams.pageNum = 1;

                this.handleQuery();
            },
            handleCompelete(row) {
                this.$modal
                    .confirm('是否完成此客户的订单？')
                    .then(function () {
                        return API2.completeOrder({ id: row.id });
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
                        return API2.cancelOrder({ id: row.id });
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('操作成功');
                    })
                    .catch(() => {
                        console.log('取消');
                    });
            },
        },
    };
</script>

<style></style>
