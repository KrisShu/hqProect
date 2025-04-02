<template>
    <div class="app-container">
        <el-row class="search-box mb20 flex-wrap a-center" v-show="showSearch">
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
            <el-col class="flex-box flex-wrap a-center" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">时间：</div>
                </div>
                <div class="vlue-box">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="queryParams.create_time"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </div>
            </el-col>

            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="dataList">
            <el-table-column fixed label="单号" prop="orderNumber" />
            <el-table-column label="参与计算的收款" align="center" prop="money" />
            <el-table-column label="提成比例" align="center" prop="commissionRate" />
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
    export default {
        name: 'detailsList',

        data() {
            return {
                showSearch: true,
                loading: false,
                dataList: [],
                total: 0,
                queryParams: {
                    userId: Number(this.$route.query.userId),
                    year: this.$route.query.year,
                    month: this.$route.query.month,
                    type: Number(this.$route.query.type),
                    orderNumber: '',
                    create_time: '',
                    pageNum: 1,
                    pageSize: 10,
                },
            };
        },
        created() {
            this.getList();
        },
        methods: {
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            resetQuery() {
                this.queryParams.orderNumber = '';
                this.queryParams.create_time = '';
                this.queryParams.pageNum = 1;
                this.queryParams.pageSize = 10;
                this.getList();
            },
            getList() {
                this.loading = true;
                API.fetchDetail(this.queryParams).then(res => {
                    this.dataList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },
        },
    };
</script>

<style></style>
