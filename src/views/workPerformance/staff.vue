<template>
    <div class="app-container inglist-wrap">
        <el-row class="searchBox mb20 flex-wrap a-center" v-show="showSearch">
            <el-col class="flex-box flex-wrap a-center" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">月份：</div>
                </div>
                <div class="vlue-box">
                    <el-date-picker v-model="queryParams.year_month" type="month" placeholder="选择月">
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
        <el-table show-summary v-loading="loading" :data="dataList">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column fixed label="ID" prop="id" width="120" />
            <el-table-column label="姓名" align="userName" prop="name" />
            <el-table-column label="负责的客户" align="center" prop="roleKey">
                <template slot="header" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="都以本月结单了的客户计算" placement="top-start">
                        <span><i class="el-icon-question"></i></span>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="实际金额总数" align="center" prop="amount"> </el-table-column>
            <el-table-column label="提成比例" align="center" prop="commissionRate">
                <template slot-scope="scope">
                    <el-link @click="changeCommissionRate(scope.row)" type="primary" icon="el-icon-edit">
                        {{ scope.row.commissionRate }}%
                    </el-link>
                </template>
            </el-table-column>
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
        <el-dialog :title="title" :visible.sync="centerDialogVisible" width="30%" center>
            <el-form :model="dataForm" status-icon :rules="rules" ref="dataForm" class="demo-dataForm">
                <el-form-item label="" prop="value">
                    <el-input type="text" v-model="dataForm.value">
                        <template slot="append">{{ unit }}</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
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
            const reg = /^\d+(\.\d{1,2})?$/;
            const validateValue = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入内容'));
                } else {
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确格式'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                // 遮罩层
                loading: false,
                showSearch: true,
                // 角色表格数据
                dataList: [
                    {
                        name: 'test',
                        money: 1000,
                        roleId: 1,
                    },
                ],
                total: 0,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    type: 2,
                    year_month: undefined,
                },
                centerDialogVisible: false,
                dataForm: {
                    value: '',
                },
                rules: {
                    value: [{ validator: validateValue, trigger: 'blur' }],
                },
                title: '修改基本工资',
            };
        },
        created() {
            // this.getList();
        },
        methods: {
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
                console.log(this.queryParams.year_month);
                this.queryParams.pageNum = 1;
                // this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.queryParams.pageNum = 1;
                this.queryParams.year_month = undefined;
                this.handleQuery();
            },
            changeMoneny(val) {
                this.centerDialogVisible = true;
                this.unit = '元';
                this.title = '修改基础工资';
                // this.$prompt('请填写基础工资', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     inputValue: val,
                //     inputPattern: /^\d+(\.\d{1,2})?$/,
                //     inputErrorMessage: '请填写正确的格式',
                // })
                //     .then(({ value }) => {
                //         this.$message({
                //             type: 'success',
                //             message: '你的邮箱是: ' + value,
                //         });
                //     })
                //     .catch(() => {
                //         this.$message({
                //             type: 'info',
                //             message: '取消输入',
                //         });
                //     });
            },
            changeCommissionRate(val) {
                this.$prompt('请填写绩效比例', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: val,
                    inputPattern: /^\d+(\.\d{1,2})?$/,
                    inputErrorMessage: '请填写正确的格式',
                })
                    .then(({ value }) => {
                        this.$message({
                            type: 'success',
                            message: '你的邮箱是: ' + value,
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消输入',
                        });
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
</style>
