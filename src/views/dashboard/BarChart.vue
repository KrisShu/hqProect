<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
    import * as echarts from 'echarts';
    require('echarts/theme/macarons'); // echarts theme
    import resize from './mixins/resize';

    const animationDuration = 6000;

    export default {
        mixins: [resize],
        props: {
            className: {
                type: String,
                default: 'chart',
            },
            width: {
                type: String,
                default: '100%',
            },
            height: {
                type: String,
                default: '300px',
            },
            chartData: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                chart: null,
            };
        },
        watch: {
            chartData: {
                deep: true,
                handler(val) {
                    this.initChart();
                },
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart();
            });
        },
        beforeDestroy() {
            if (!this.chart) {
                return;
            }
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons');

                this.chart.setOption({
                    legend: {
                        data: ['新增', '完成', '结单'],
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    grid: {
                        top: 10,
                        left: '2%',
                        right: '2%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    dataset: {
                        // dimensions: ['product', '新增', '完成', '结单'],
                        // source: [
                        //     { product: '一月', 新增: 43.3, 完成: 85.8, 结单: 93.7 },
                        //     { product: '二月', 新增: 83.1, 完成: 73.4, 结单: 55.1 },
                        //     { product: '三月', 新增: 83.1, 完成: 73.4, 结单: 55.1 },
                        // ],
                        source: this.chartData,
                    },
                    xAxis: [
                        {
                            type: 'category',
                        },
                    ],
                    yAxis: [{}],
                    series: [
                        {
                            type: 'bar',
                        },
                        {
                            type: 'bar',
                        },
                        {
                            type: 'bar',
                        },
                    ],
                });
            },
        },
    };
</script>
