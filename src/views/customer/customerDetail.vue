<template>
    <div class="customerDetail app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row>
                    <div class="flex-wrap a-center">
                        <p class="cap-title">单号：xxx</p>
                        <el-tag type="success ml10">标签二</el-tag>
                    </div>

                    <div class="flex-wrap a-center">
                        <p class="text">业务员：张三</p>
                        <p class="text">接单员：李四</p>
                    </div>
                </el-row>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <el-divider content-position="left">基本信息</el-divider>
                    <el-row>
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
                            <div class="label-box">客户微信：</div>
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
                            <div class="label-box">完成时间：</div>
                            <div class="vlue-box">1111</div>
                        </div>
                    </el-row>
                    <el-divider content-position="left">系统信息</el-divider>
                    <el-row>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">创建人：</div>
                            <div class="vlue-box">1111</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">创建时间：</div>
                            <div class="vlue-box">1111</div>
                        </div>
                        <div class="flex-wrap lable-item">
                            <div class="label-box">更新时间：</div>
                            <div class="vlue-box">1111</div>
                        </div>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="操作记录" name="second">配置管理</el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'customerDetail',
        data() {
            return {
                activeName: 'first',
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
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
</style>
