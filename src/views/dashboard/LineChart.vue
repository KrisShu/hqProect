<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
    import * as echarts from 'echarts';
    require('echarts/theme/macarons'); // echarts theme
    import resize from './mixins/resize';

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
                default: '350px',
            },
            autoResize: {
                type: Boolean,
                default: true,
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
                    this.setOptions(val);
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
                this.setOptions(this.chartData);
            },
            setOptions(expectedData) {
                this.chart.setOption({
                    xAxis: {
                        length: 12,
                        data: [
                            '一月',
                            '二月',
                            '三月',
                            '四月',
                            '五月',
                            '六月',
                            '七月',
                            '八月',
                            '九月',
                            '十月',
                            '十一月',
                            '十二月',
                        ],
                        boundaryGap: false,
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            align: 'right',
                            // interval: 0,
                            // rotate: 45, // 旋转45度
                        },
                    },
                    grid: {
                        left: 10,
                        right: 10,
                        bottom: 20,
                        top: 30,
                        containLabel: true,
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                        },
                        padding: [5, 10],
                    },
                    yAxis: {
                        axisTick: {
                            show: false,
                        },
                    },
                    legend: {
                        data: ['金额'],
                    },
                    series: [
                        {
                            name: '金额',
                            itemStyle: {
                                normal: {
                                    color: '#3888fa',
                                    lineStyle: {
                                        color: '#3888fa',
                                        width: 2,
                                    },
                                },
                            },
                            smooth: false,
                            type: 'line',
                            data: expectedData,
                            animationDuration: 2800,
                            animationEasing: 'cubicInOut',
                        },
                        // {
                        //     name: 'actual',
                        //     smooth: false,
                        //     type: 'line',
                        //     itemStyle: {
                        //         normal: {
                        //             color: '#3888fa',
                        //             lineStyle: {
                        //                 color: '#3888fa',
                        //                 width: 2,
                        //             },
                        //             areaStyle: {
                        //                 color: '#f3f8ff',
                        //             },
                        //         },
                        //     },
                        //     data: actualData,
                        //     animationDuration: 2800,
                        //     animationEasing: 'quadraticOut',
                        // },
                    ],
                });
            },
        },
    };
</script>
