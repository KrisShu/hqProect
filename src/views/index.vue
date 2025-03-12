<template>
    <div class="app-container home">
        <!-- <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="search-box">
                    <el-date-picker
                        v-model="value1"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </div>
            </el-col>
        </el-row> -->

        <!-- 统计看板 -->
        <el-row :gutter="20">
            <el-row :span="24">
                <h4><i class="el-icon-pie-chart"></i>统计看板</h4>
            </el-row>
            <el-col v-for="(item, index) in dataBoard" :key="index" :xs="8" :sm="6" :md="4" :lg="4" :xl="4">
                <div class="data-board-item flex-wrap flex-vertical a-center j-center">
                    <p class="value">{{ item.value }}</p>
                    <p class="title">{{ item.title }}</p>
                </div>
            </el-col>
        </el-row>
        <!-- 每月收益 -->
        <el-row :gutter="20">
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
                <bar-chart />
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import LineChart from '@/views/dashboard/LineChart.vue';
    import BarChart from '@/views/dashboard/BarChart.vue';
    const lineChartData = {
        newVisitis: {
            expectedData: [100, 120, 161, 134, 105, 160, 165],
            actualData: [120, 82, 91, 154, 162, 140, 145],
        },
        messages: {
            expectedData: [200, 192, 120, 144, 160, 130, 140],
            actualData: [180, 160, 151, 106, 145, 150, 130],
        },
        purchases: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            actualData: [120, 90, 100, 138, 142, 130, 130],
        },
        shoppings: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            actualData: [120, 82, 91, 154, 162, 140, 130],
        },
    };

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
                        value: 100,
                    },
                    {
                        title: '今日新增',
                        value: 100,
                    },
                    {
                        title: '今日完成',
                        value: 100,
                    },
                    {
                        title: '今日结单4',
                        value: 100,
                    },
                    {
                        title: '今日结单3',
                        value: 100,
                    },
                    {
                        title: '今日结单2',
                        value: 100,
                    },
                    {
                        title: '今日结单2',
                        value: 100,
                    },
                    {
                        title: '今日结单11',
                        value: 100,
                    },
                ],
                lineChartData: lineChartData.newVisitis,
            };
        },
        methods: {},
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
