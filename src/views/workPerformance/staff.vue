<template>
    <div class="app-container inglist-wrap">
        <el-row class="searchBox mb20 flex-wrap a-center" v-show="showSearch">
            <el-col class="flex-box flex-wrap a-center" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">月份：</div>
                </div>
                <div class="vlue-box">
                    <el-date-picker
                        value-format="yyyy-M"
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
            <el-col :span="1.5">
                <el-button
                    v-hasPermi="['workPerformance:staff:rules']"
                    type="primary"
                    plain
                    icon="el-icon-s-finance"
                    size="mini"
                    @click="handleRules"
                >
                    绩效规则
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 表格 -->
        <el-table show-summary :summary-method="summaryMethod" v-loading="loading" :data="dataList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <!-- <el-table-column fixed label="ID" prop="id" width="120" /> -->
            <el-table-column label="姓名" align="center" prop="userName" />
            <el-table-column label="负责的客户" align="center" prop="num">
                <template slot="header" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="都以本月结单了的客户计算" placement="top-start">
                        <span>负责的客户<i class="el-icon-question"></i></span>
                    </el-tooltip>
                </template>

                <template slot-scope="scope">
                    <el-link @click="handelDetails(scope.row)" type="primary" icon="el-icon-user">
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
        <!-- 绩效规则 -->
        <el-dialog :close-on-click-modal="false" title="绩效规则" :visible.sync="rulesVisible" width="40%" center>
            <el-form ref="performanceForm" :model="performanceForm" label-width="100px">
                <div v-for="(item, index) in performanceForm.performanceList" :key="index" class="rule-item">
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                            <el-form-item
                                :label="index === 0 ? '金额范围：' : ''"
                                :prop="'performanceList.' + index + '.minMoney'"
                                :rules="performanceRules.minMoney"
                            >
                                <el-input v-model="item.minMoney" placeholder="起始金额" type="number">
                                    <!-- <template slot="prepend">￥</template> -->
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
                            <el-form-item
                                class="endAmount"
                                :prop="'performanceList.' + index + '.maxMoney'"
                                :rules="performanceRules.maxMoney"
                            >
                                <el-input v-model="item.maxMoney" placeholder="结束金额" type="number">
                                    <!-- <template slot="prepend">￥</template> -->
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="20" :sm="20" :md="7" :lg="7" :xl="7">
                            <el-form-item
                                :label="index === 0 ? '提成比例：' : ''"
                                :prop="'performanceList.' + index + '.commissionRate'"
                                :rules="performanceRules.commissionRate"
                                class="ratio"
                            >
                                <el-input v-model="item.commissionRate" placeholder="比例">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="4" :sm="4" :md="3" :lg="3" :xl="3">
                            <el-button
                                v-if="index !== performanceForm.performanceList.length - 1"
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                @click="removeRule(index)"
                            >
                            </el-button>
                            <el-button v-else type="primary" icon="el-icon-plus" circle @click="addRule"> </el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRules">取 消</el-button>
                <el-button type="primary" @click="saveRules">确 定</el-button>
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
            // 验证金额范围的规则 - 起始金额
            const validateStartAmount = (rule, value, callback) => {
                let index = 0;
                try {
                    const matches = rule.field.match(/\d+/);
                    index = matches ? parseInt(matches[0]) : 0;
                } catch (err) {
                    console.error('Parse index error:', err);
                    callback(new Error('验证规则错误'));
                    return;
                }

                const item = this.performanceForm.performanceList[index];

                if (value === '' || value === null) {
                    callback(new Error('请输入起始金额'));
                    return;
                }

                const numValue = parseFloat(value);
                if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                    callback(new Error('请输入正确的金额格式(最多两位小数)'));
                    return;
                }

                // 检查与上一行的关系
                if (index > 0) {
                    const prevItem = this.performanceForm.performanceList[index - 1];
                    if (prevItem.maxMoney && numValue < parseFloat(prevItem.maxMoney)) {
                        callback(new Error('起始金额必须大于上一行的结束金额'));
                        return;
                    }
                }

                callback();
            };
            // 验证金额范围的规则 - 结束金额
            const validateEndAmount = (rule, value, callback) => {
                let index = 0;
                try {
                    const matches = rule.field.match(/\d+/);
                    index = matches ? parseInt(matches[0]) : 0;
                } catch (err) {
                    console.error('Parse index error:', err);
                    callback(new Error('验证规则错误'));
                    return;
                }
                const item = this.performanceForm.performanceList[index];

                if (value === '' || value === null) {
                    callback(new Error('请输入结束金额'));
                    return;
                }

                if (!/^\d+(\.\d{0,2})?$/.test(value)) {
                    callback(new Error('请输入正确的金额格式(最多两位小数)'));
                    return;
                }

                // 检查与当前行起始金额的关系
                if (item.minMoney && parseFloat(value) <= parseFloat(item.minMoney)) {
                    callback(new Error('结束金额必须大于起始金额'));
                    return;
                }

                callback();
            };
            // 验证比例的规则
            const validateRatio = (rule, value, callback) => {
                if (value === '' || value === null) {
                    callback(new Error('请输入比例'));
                } else if (!/^(100|[1-9]?\d)$/.test(value)) {
                    callback(new Error('请输入0-100的正整数'));
                } else {
                    callback();
                }
            };
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
                    type: 2, //业务员2
                    year_month: this.parseTime(new Date(), '{y}-{m}'),
                    // year_month: undefined,
                },
                centerDialogVisible: false,
                dataForm: {
                    value: '',
                },
                rules: {
                    value: '',
                    // value: [{ validator: validateValue, trigger: 'blur' }],
                },
                title: '修改基本工资',
                unit: '元',
                performanceRules: {
                    minMoney: [{ required: true, validator: validateStartAmount, trigger: ['blur', 'change'] }],
                    maxMoney: [{ required: true, validator: validateEndAmount, trigger: ['blur', 'change'] }],
                    commissionRate: [{ required: true, validator: validateRatio, trigger: 'blur' }],
                },
                performanceForm: {
                    performanceList: [], // 绩效规则列表
                },

                rulesVisible: false,
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
                this.formatDate();
                API.fetchList(this.queryParams).then(res => {
                    this.dataList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                });
            },

            /** 搜索按钮操作 */
            handleQuery() {
                console.log(this.queryParams.year_month);
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.pageNum = 1;
                this.queryParams.year_month = this.parseTime(new Date(), '{y}-{m}');
                // this.queryParams.year = undefined;
                // this.queryParams.month = undefined;
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
                            console.log('this.dataForm', this.dataForm);
                            console.log('this.queryParams', this.queryParams);
                            apiPromise = API.editBasicWage({
                                basicWage: this.dataForm.value,
                                id: this.dataForm.id,
                                year: this.queryParams.year,
                                month: this.queryParams.month,
                                type: this.queryParams.type,
                                userId: this.dataForm.userId,
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
            handleRules() {
                this.fetchRulesListEvent();
                this.rulesVisible = true;

                if (this.performanceForm.performanceList.length <= 0) {
                    this.performanceForm.performanceList = [
                        {
                            minMoney: '',
                            maxMoney: '',
                            commissionRate: '',
                        },
                    ];
                }
            },
            // 添加规则
            addRule() {
                if (this.performanceForm.performanceList.length >= 10) {
                    this.$message.warning('最多添加10条规则');
                    return;
                }
                // 获取上一条规则的结束金额
                const lastRule = this.performanceForm.performanceList[this.performanceForm.performanceList.length - 1];
                const startAmount = lastRule ? parseFloat(lastRule.maxMoney) : 0;

                this.performanceForm.performanceList.push({
                    minMoney: startAmount || '',
                    maxMoney: '',
                    commissionRate: '',
                });
            },
            async fetchRulesListEvent() {
                let res = await API.fetchRulesList();
                console.log('res', res);
                if (res.code !== 200) {
                    this.$message.error(res.msg);
                    return;
                }

                this.performanceForm.performanceList = res.rows;
            },

            // 删除规则
            removeRule(index) {
                this.performanceForm.performanceList.splice(index, 1);
            },

            // 验证并保存规则
            saveRules() {
                // 这里添加保存逻辑
                this.$refs.performanceForm.validate(valid => {
                    if (valid) {
                        // 额外验证整体的连续性
                        let isValid = true;
                        for (let i = 0; i < this.performanceForm.performanceList.length - 1; i++) {
                            const currentEnd = parseFloat(this.performanceForm.performanceList[i].maxMoney);
                            const nextStart = parseFloat(this.performanceForm.performanceList[i + 1].minMoney);
                            if (nextStart < currentEnd) {
                                isValid = false;
                                this.$message.error(`第${i + 2}行的起始金额必须大于第${i + 1}行的结束金额`);
                                break;
                            }
                        }

                        if (isValid) {
                            // 执行保存操作
                            console.log('验证通过，可以保存', this.performanceForm.performanceList);
                            API.editRules(this.performanceForm.performanceList).then(res => {
                                if (res.code === 200) {
                                    this.$message.success('保存成功');
                                    this.rulesVisible = false;
                                    this.getList();
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    } else {
                        this.$message.error('请检查表单填写是否正确');
                        return false;
                    }
                });
            },
            cancelRules() {
                this.rulesVisible = false;
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
</style>
