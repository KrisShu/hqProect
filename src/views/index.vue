<template>
    <div class="app-container home">
        <!-- 统计看板 -->
        <el-row :gutter="20" v-hasRole="['admin', 'manager', 'salesmanManager', 'writerManager']">
            <el-row :span="24">
                <h4><i class="el-icon-pie-chart"></i>统计看板</h4>
            </el-row>
            <el-col v-for="(item, index) in dataBoard" :key="index" :xs="8" :sm="6" :md="4" :lg="4" :xl="4">
                <div class="data-board-item flex-wrap flex-vertical a-center j-center">
                    <p class="value">{{ item.value }} {{ item.unit }}</p>
                    <p class="title">{{ item.title }}</p>
                </div>
            </el-col>
        </el-row>
        <!-- 每月收益 -->
        <el-row :gutter="20" v-hasRole="['admin', 'manager', 'salesmanManager', 'writerManager']">
            <el-row :span="24">
                <h4><i class="el-icon-data-line"></i>每月收益</h4>
            </el-row>
            <el-col :span="24">
                <line-chart :chart-data="lineChartData" />
            </el-col>
        </el-row>
        <!-- 客户 -->
        <el-row :gutter="20">
            <el-row :span="24">
                <h4><i class="el-icon-user"></i>客户</h4>
            </el-row>
            <el-col :span="24">
                <bar-chart :chart-data="barChartData" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import API from '@/api/mainApI';
    import LineChart from '@/views/dashboard/LineChart.vue';
    import BarChart from '@/views/dashboard/BarChart.vue';

    export default {
        name: 'Index',
        components: {
            LineChart,
            BarChart,
        },
        data() {
            return {
                dataBoard: [
                    {
                        title: '累计客户',
                        value: null,
                        id: 0,
                    },
                    {
                        title: '今日新增',
                        value: null,
                        id: 1,
                    },
                    {
                        title: '今日完成',
                        value: null,
                        id: 2,
                    },
                    {
                        title: '今日结单',
                        value: null,
                        id: 3,
                    },
                    {
                        title: '本周新增',
                        value: null,
                        id: 4,
                    },
                    {
                        title: '本周完成',
                        value: null,
                        id: 5,
                    },
                    {
                        title: '本周结单',
                        value: null,

                        id: 6,
                    },
                    {
                        title: '本月新增',
                        value: null,
                        id: 7,
                    },
                    {
                        title: '本月完成',
                        value: null,
                        id: 8,
                    },
                    {
                        title: '本月结单',
                        value: null,
                        id: 9,
                    },
                    {
                        title: '累计金额',
                        value: null,
                        id: 10,
                        unit: '元',
                    },
                    {
                        title: '今日金额',
                        value: null,
                        id: 11,
                        unit: '元',
                    },
                    {
                        title: '今日定金',
                        value: null,
                        id: 12,
                        unit: '元',
                    },
                    {
                        title: '今日结单金额',
                        value: null,
                        id: 13,
                        unit: '元',
                    },
                ],
                lineChartData: [],
                barChartData: [],
            };
        },
        created() {
            this.fetchDashboardStatistics();
            this.fetchMonthlyEarningsStatistics();
            this.fetchCustomerStatistics();
        },
        methods: {
            //

            fetchDashboardStatistics() {
                API.fetchDashboardStatistics().then(res => {
                    if (res.code === 200) {
                        this.dataBoard[0].value = res.data.totalCustomers || 0; //累计客户
                        this.dataBoard[1].value = res.data.todayNewCustomers || 0; //今日新增
                        this.dataBoard[2].value = res.data.todayCompletedOrders || 0; //今日完成
                        this.dataBoard[3].value = res.data.todayClosedOrders || 0; //今日结单
                        this.dataBoard[4].value = res.data.weekNewCustomers || 0; //本周新增
                        this.dataBoard[5].value = res.data.weekCompletedOrders || 0; //本周完成
                        this.dataBoard[6].value = res.data.weekClosedOrders || 0; //本周结单
                        this.dataBoard[7].value = res.data.monthNewCustomers || 0; //本月新增
                        this.dataBoard[8].value = res.data.monthCompletedOrders || 0; //本月完成
                        this.dataBoard[9].value = res.data.monthClosedOrders || 0; //本月结单
                        this.dataBoard[10].value = res.data.totalRevenue || 0; //累计金额
                        this.dataBoard[11].value = res.data.todayAmount || 0; //今日金额
                        this.dataBoard[12].value = res.data.todayDeposit || 0; //今日定金
                        this.dataBoard[13].value = res.data.todaySettlement || 0; //今日结单金额
                    }
                });
            },
            fetchMonthlyEarningsStatistics() {
                API.fetchMonthlyEarningsStatistics().then(res => {
                    console.log('333333333', res);
                    if (res.code === 200) {
                        const resData = res.rows;
                        // 创建月份映射
                        const monthMap = {
                            一月: 1,
                            二月: 2,
                            三月: 3,
                            四月: 4,
                            五月: 5,
                            六月: 6,
                            七月: 7,
                            八月: 8,
                            九月: 9,
                            十月: 10,
                            十一月: 11,
                            十二月: 12,
                        };

                        // 按月份排序并提取earnings
                        const earningsArray = resData
                            .sort((a, b) => monthMap[a.month] - monthMap[b.month]) // 根据月份映射排序
                            .map(row => row.earnings); // 提取earnings值

                        this.lineChartData = earningsArray;
                        console.log('this.lineChartData', earningsArray);
                    }
                });
            },
            fetchCustomerStatistics() {
                API.fetchCustomerStatistics().then(res => {
                    this.barChartData = res.data;
                });
            },
        },
    };
</script>

<style scoped lang="scss">
    .home {
        .data-board-item {
            width: 100%;
            height: 100px;
            background-color: aliceblue;
            height: 100px;
            color: #303133;
            border-radius: 8px;
            -webkit-box-shadow: 0 4px 8px 0 #999;
            box-shadow: 0 4px 8px 0 #999;
            border-radius: 8px;
            cursor: pointer;
            box-sizing: border-box;
            margin-bottom: 20px;
            &:hover {
                background-color: #b6d1f8;
            }
            .title {
                font-size: 16px;
                font-weight: 700;
            }
        }
    }
</style>
