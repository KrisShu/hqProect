<template>
    <div class="app-container inglist-wrap">
        <el-row class="searchBox mb20 flex-wrap a-center" v-show="showSearch">
            <el-col class="flex-box flex-wrap a-center" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">月份：</div>
                </div>
                <div class="vlue-box">
                    <el-date-picker
                        :clearable="false"
                        v-model="queryParams.year_month"
                        type="month"
                        placeholder="选择月"
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
        <!-- 表格 -->
        <el-table show-summary :summary-method="summaryMethod" v-loading="loading" :data="dataList">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column fixed label="ID" prop="id" width="120" />
            <el-table-column label="姓名" align="center" prop="userName" />
            <el-table-column label="负责的客户" align="center" prop="num">
                <template slot="header" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="都以本月结单了的客户计算" placement="top-start">
                        <span>负责的客户<i class="el-icon-question"></i></span>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <el-link @click="handelDetails(scope.row)" type="primary" icon="el-icon-edit">
                        {{ scope.row.num }}
                    </el-link>
                </template>
            </el-table-column>

            <el-table-column label="实际金额总数" align="center" prop="amount"> </el-table-column>
            <!-- <el-table-column label="提成比例" align="center" prop="commissionRate">
                <template slot-scope="scope">
                    <el-link @click="changeCommissionRate(scope.row)" type="primary" icon="el-icon-edit">
                        {{ scope.row.commissionRate }}%
                    </el-link>
                </template>
            </el-table-column> -->
            <el-table-column label="基础工资" prop="basicWage">
                <template slot-scope="scope">
                    <el-link @click="changeMoneny(scope.row)" type="primary" icon="el-icon-edit">
                        {{ scope.row.basicWage }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="提成金额" prop="commissionAmount" />
            <el-table-column label="总工资" prop="salary" />
        </el-table>
        <!-- 分页 -->
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
        <el-dialog
            :close-on-click-modal="false"
            :title="title"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
            @close="closeAfter"
        >
            <el-form :model="dataForm" status-icon :rules="rules" ref="dataForm" class="demo-dataForm">
                <el-form-item label="" prop="value">
                    <el-input type="text" v-model="dataForm.value">
                        <template slot="append">{{ unit }}</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelForm">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import API from '@/api/workPerformanceApi';
    export default {
        name: 'ingList',
        components: {},
        data() {
            return {
                // 遮罩层
                loading: false,
                showSearch: true,
                // 角色表格数据
                dataList: [],
                total: 0,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    type: 3, //负责人3
                    year_month: this.parseTime(new Date(), '{y}-{m}'),
                },
                centerDialogVisible: false,
                dataForm: {
                    value: '',
                },
                rules: {
                    value: '',
                },
                title: '修改基本工资',
                unit: '元',
            };
        },
        created() {
            this.getList();
        },
        methods: {
            validateValue(rule, value, callback) {
                const reg = /^\d+(\.\d{1,2})?$/;
                // console.log('rule', rule);
                if (!value) {
                    return callback(new Error('请输入内容'));
                } else {
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确格式'));
                    } else {
                        callback();
                    }
                }
            },
            validateValue2(rule, value, callback) {
                const reg2 = /^(100|[1-9]?[0-9])$/;
                if (!value) {
                    return callback(new Error('请输入内容'));
                } else {
                    if (!reg2.test(value)) {
                        callback(new Error('请输入正确格式'));
                    } else {
                        callback();
                    }
                }
            },
            getList() {
                this.loading = true;
                API.fetchList(this.queryParams).then(res => {
                    this.dataList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },

            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                const newArr = this.queryParams.year_month ? this.queryParams.year_month.split('-') : '';
                if (newArr) {
                    this.queryParams.year = newArr[0];
                    this.queryParams.month = newArr[1].replace(/^0+/, ''); // 示例: '003' → '3'
                } else {
                    this.queryParams.year = undefined;
                    this.queryParams.month = undefined;
                }
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.pageNum = 1;
                this.queryParams.year_month = this.parseTime(new Date(), '{y}-{m}');
                this.handleQuery();
            },
            changeMoneny(data) {
                this.dataForm = Object.assign({}, data, {
                    value: data.basicWage,
                });

                this.centerDialogVisible = true;
                this.unit = '元';
                this.title = '修改基础工资';
                this.rules.value = [{ validator: this.validateValue, trigger: 'blur' }];
            },
            changeCommissionRate(data) {
                this.dataForm = Object.assign({}, data, {
                    value: data.commissionRate,
                });

                this.centerDialogVisible = true;
                this.unit = '%';
                this.title = '修改提成比例';
                this.rules.value = [{ validator: this.validateValue2, trigger: 'blur' }];
            },
            closeAfter() {
                this.$refs.dataForm.clearValidate();
            },
            cancelForm() {
                this.centerDialogVisible = false;
            },
            submitForm() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        let apiPromise;
                        if (this.title === '修改提成比例') {
                            apiPromise = API.editCommissionRate({
                                commissionRate: this.dataForm.value,
                                id: this.dataForm.id,
                            });
                        } else if (this.title === '修改基础工资') {
                            this.formatDate();
                            apiPromise = API.editBasicWage({
                                basicWage: this.dataForm.value,
                                id: this.dataForm.id,
                                year: this.queryParams.year,
                                month: this.queryParams.month,
                                type: this.queryParams.type,
                            });
                        }

                        apiPromise.then(res => {
                            this.$modal.msgSuccess('修改成功');
                            this.getList();
                            this.centerDialogVisible = false;
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            summaryMethod(param) {
                const { columns, data } = param;

                console.log('columns, data', columns, data);
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (column.property === 'num' || column.property === 'amount') {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    }
                });
                return sums;
            },
            formatDate() {
                const newArr = this.queryParams.year_month ? this.queryParams.year_month.split('-') : '';
                if (newArr) {
                    this.queryParams.year = newArr[0];
                    this.queryParams.month = newArr[1].replace(/^0+/, ''); // 示例: '003' → '3'
                } else {
                    this.queryParams.year = undefined;
                    this.queryParams.month = undefined;
                }
            },
            // 查看具体详情
            handelDetails(item) {
                this.formatDate();
                this.$router.push({
                    path: '/workPerformance/detailsList',
                    query: {
                        userId: item.userId,
                        year: this.queryParams.year,
                        month: this.queryParams.month,
                        type: this.queryParams.type,
                    },
                });
            },
        },
    };
</script>

<style lang="scss">
    .searchBox {
        background-color: aliceblue;
        padding: 20px;
        .lael-input {
            font-size: 14px;
            line-height: 36px;
            text-align: right;
        }
    }

    .endAmount {
        .el-form-item__content {
            margin-left: 10px !important;
            position: relative;
            &:before {
                content: '-';
                display: inline-block;

                position: absolute;
                top: 0px;
                left: -10px;
            }
        }
    }
    .ratio {
        .el-input-group--append {
            .el-input-group__append {
                padding: 0 2px !important;
            }
        }
    }
</style>
