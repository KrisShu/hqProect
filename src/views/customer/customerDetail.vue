<template>
    <div class="customerDetail app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row>
                    <div class="flex-wrap a-center">
                        <p class="cap-title mr10">单号：{{ baseDetail.orderNumber }}</p>
                        <el-tag :type="orderStateType(baseDetail.orderState)">
                            {{ orderState(baseDetail.orderState) }}</el-tag
                        >
                    </div>

                    <div class="flex-wrap a-center">
                        <p class="text">业务员：{{ baseDetail.salemanUserName }}</p>
                        <p v-show="baseDetail.principalUserName" class="text ml10">
                            接单员：{{ baseDetail.principalUserName }}
                        </p>
                    </div>
                </el-row>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <el-divider content-position="left">基本信息</el-divider>
                    <el-row>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">单号：</div>
                            <div class="vlue-box">{{ baseDetail.orderNumber }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">客户概况：</div>
                            <div class="vlue-box">{{ baseDetail.customerProfiling }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">项目概况：</div>
                            <div class="vlue-box">{{ baseDetail.projectSummaryLable }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">客户微信：</div>
                            <div class="vlue-box">{{ baseDetail.customerWx }}</div>
                        </div>
                        <div class="flex-wrap lable-item" v-if="type === 'customer'">
                            <div class="label-box">交易金额：</div>
                            <div class="vlue-box">
                                <el-link type="primary">{{ baseDetail.totalAmount.toFixed(2) }}</el-link>
                            </div>
                        </div>
                        <div class="flex-wrap lable-item" v-if="type === 'customer'">
                            <div class="label-box"></div>
                            <div class="vlue-box flex-wrap">
                                <el-link type="success" class="mr10"
                                    >已付款：{{ baseDetail.paidAmount.toFixed(2) }}</el-link
                                >
                                <el-link type="danger"
                                    >未付款：{{ (baseDetail.totalAmount - baseDetail.paidAmount).toFixed(2) }}</el-link
                                >
                            </div>
                        </div>

                        <div class="flex-wrap lable-item">
                            <div class="label-box">下单日期：</div>
                            <div class="vlue-box">{{ baseDetail.orderTime }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">交付日期：</div>
                            <div class="vlue-box">{{ baseDetail.releasedTime }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">完成时间：</div>
                            <div class="vlue-box">{{ parseTime(baseDetail.completionTime) || '' }}</div>
                        </div>
                    </el-row>
                    <el-divider content-position="left">系统信息</el-divider>
                    <el-row>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">创建人：</div>
                            <div class="vlue-box">{{ baseDetail.createBy }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">创建时间：</div>
                            <div class="vlue-box">{{ baseDetail.createTime }}</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">更新时间：</div>
                            <div class="vlue-box">{{ baseDetail.updateTime }}</div>
                        </div>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="second">
                    <div class="infinite-list-wrapper" style="overflow: auto">
                        <ul class="infinite-list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                            <li v-for="(item, index) in operationRecord" :key="index" class="list-item">
                                {{ item.createBy }}在{{ item.createTime }}操作{{ item.operatingRecord }}
                            </li>
                        </ul>
                        <p class="loading-noMore" v-if="loading">加载中... <i class="el-icon-loading"></i></p>
                        <p class="loading-noMore" v-if="noMore">没有更多了 <i class="el-icon-potato-strips"></i></p>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import { orderSateMeta, metaToOptions } from '@/utils/meta';
    import API from '@/api/customerApi';
    export default {
        name: 'customerDetail',
        data() {
            return {
                activeName: 'first',
                baseDetail: {},
                type: undefined,
                operationRecord: [],
                pageNum: 1,
                pageSize: 10,

                loading: false,
                total: 0,
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
            noMore() {
                return this.operationRecord.length >= this.total;
            },
            disabled() {
                return this.loading || this.noMore;
            },
        },
        created() {
            // this.$route.params;
            // console.log('接收参数', JSON.parse(this.$route.query.details));
            this.getDetail();
        },
        methods: {
            getDetail() {
                // this.$route.params;
                console.log('接收参数', JSON.parse(this.$route.query.details));
                this.baseDetail = JSON.parse(this.$route.query.details);
                this.type = this.$route.query.type;
                this.fetchRecordList();
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            fetchRecordList() {
                API.recordList({
                    customerOrderId: this.baseDetail.id,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }).then(res => {
                    // this.operationRecord = res.data;
                    console.log('操作记录', res);
                    this.operationRecord = this.operationRecord.concat(res.rows || []);
                    this.total = res.total;
                    this.loading = false;
                });
            },
            load() {
                this.loading = true;
                this.pageNum++;
                this.fetchRecordList();
            },
        },
    };
</script>

<style lang="scss">
    .cap-title {
        font-size: 14px;
    }
    .text {
        font-size: 12px;
    }

    .infinite-list {
        height: 300px;
        padding: 0px;
        margin: 0px;
        list-style: none;
        overflow: auto;
        .list-item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50px;
            color: rgb(125, 188, 252);
            background: rgb(232, 243, 254);
            margin: 10px;
        }
    }
    .loading-noMore {
        text-align: center;
        color: #999;
        font-size: 14px;
    }
</style>
