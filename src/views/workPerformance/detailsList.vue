<template>
    <div class="app-container">
        <el-row class="search-box mb20 flex-wrap flex-hh" v-show="showSearch">
            <el-row class="w100">
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">单号：</div>
                    </div>
                    <div class="vlue-box">
                        <el-input
                            v-model="queryParams.order_number"
                            placeholder="请输入内容"
                            clearable
                            style="width: 240px"
                        />
                    </div>
                </el-col>
                <el-col class="flex-box flex-wrap" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                    <div class="label-box">
                        <div class="lael-input">分类：</div>
                    </div>
                    <div class="vlue-box">
                        <el-select class="w100" v-model="queryParams.paymentType" placeholder="请选择分类" clearable>
                            <el-option
                                v-for="(item, index) in paymentTypeList"
                                :key="index"
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
                        <div class="lael-input">日期：</div>
                    </div>
                    <div class="vlue-box">
                        <el-date-picker
                            v-model="queryParams.time"
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
        <el-row class="mb8">
            <div class="flex-wrap">
                <p class="lable-wrap flex-wrap">
                    <span class="lable">总计：</span>
                    <span class="value">{{ totalData.money || 0 }}元</span>
                </p>
            </div>

            <el-divider><i class="el-icon-s-operation"></i></el-divider>
        </el-row>
        <el-table v-loading="loading" :data="dataList">
            <el-table-column fixed label="单号" prop="orderNumber" />
            <el-table-column fixed label="分类" prop="paymentType">
                <template slot-scope="scope">
                    <span>{{ paymentTypeName(scope.row.paymentType) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="参与计算的收款" align="center" prop="money" />
            <!-- <el-table-column label="提成比例" align="center" prop="commissionRate" /> -->
            <el-table-column label="时间" align="center" prop="createTime" />
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
    import API from '@/api/workPerformanceApi';
    import { fetchDictType } from '@/api/commApi';
    export default {
        name: 'detailsList',

        data() {
            return {
                showSearch: true,
                loading: false,
                dataList: [],
                total: 0,
                queryParams: {
                    userId: this.$route.query?.userId ? Number(this.$route.query.userId) : undefined,
                    year: this.$route.query.year,
                    month: this.$route.query.month,
                    type: Number(this.$route.query.type),
                    orderNumber: '',
                    time: [],
                    startTime: undefined,
                    endTime: undefined,
                    paymentType: '',
                    pageNum: 1,
                    pageSize: 10,
                },
                paymentTypeList: [],
                totalData: {
                    money: 0,
                },
            };
        },
        computed: {
            paymentTypeName() {
                return value => {
                    const item = this.paymentTypeList.find(item => item.dictValue == value);
                    return item ? item.dictLabel : '';
                };
            },
        },
        created() {
            this.getList();
            this.initPaymentType();
        },
        methods: {
            initPaymentType() {
                fetchDictType('payment_type').then(res => {
                    const result = res.data;
                    this.paymentTypeList = result.filter(item => item.dictValue != -1);
                });
            },
            handleQuery() {
                this.queryParams.pageNum = 1;

                this.queryParams.startTime = this.queryParams.time[0] || undefined;
                this.queryParams.endTime = this.queryParams.time[1] || undefined;
                this.getList();
            },
            resetQuery() {
                this.queryParams.orderNumber = '';
                this.queryParams.time = [];
                this.queryParams.startTime = undefined;
                this.queryParams.endTime = undefined;
                this.queryParams.paymentType = undefined;
                this.queryParams.pageNum = 1;
                this.queryParams.pageSize = 10;
                this.getList();
            },
            getList() {
                this.loading = true;
                this.getTotal();
                API.fetchDetail(this.queryParams).then(res => {
                    this.dataList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },
            getTotal() {
                API.fetchDetailTotal(this.queryParams).then(res => {
                    this.totalData = res?.data || { money: 0 };
                });
            },
        },
    };
</script>

<style lang="scss">
    .lable-wrap {
        margin-right: 20px;
        align-items: center;
        .lable {
            font-size: 12px;
            color: #484848;
            margin-right: 10px;
        }
        .value {
            font-size: 18px;
            color: #336ad9;
        }
    }
</style>
