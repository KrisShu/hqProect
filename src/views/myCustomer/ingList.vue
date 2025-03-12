<template>
    <div class="app-container inglist-wrap">
        <el-row class="search-box flex-wrap flex-hh mb20" v-show="showSearch">
            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <el-select v-model="queryParams.option1" @change="optionSelectChange('value1')">
                        <el-option label="单号" :value="1"> </el-option>
                        <el-option label="接单微信号" :value="2"> </el-option>
                        <el-option label="客户概况" :value="3"> </el-option>
                        <el-option label="接单员" :value="4"> </el-option>
                    </el-select>
                </div>
                <div class="vlue-box">
                    <el-input
                        v-model="queryParams.value1"
                        placeholder="请输入内容"
                        clearable
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                    />
                </div>
            </el-col>

            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">业务员：</div>
                </div>
                <div class="vlue-box">
                    <el-select v-model="queryParams.status" placeholder="请选择业务员" clearable style="width: 240px">
                        <el-option
                            v-for="dict in staffOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </div>
            </el-col>
            <el-col class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <div class="lael-input">状态：</div>
                </div>
                <div class="vlue-box">
                    <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px">
                        <el-option
                            v-for="dict in statusOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                    </el-select>
                </div>
            </el-col>

            <el-row class="flex-box flex-wrap" :xs="12" :sm="12" :md="12" :lg="12" :xl="6">
                <div class="label-box">
                    <el-select v-model="queryParams.option3">
                        <el-option label="下单日期" :value="1"> </el-option>
                        <el-option label="交付日期" :value="2"> </el-option>
                    </el-select>
                </div>
                <div class="vlue-box">
                    <el-date-picker
                        v-model="queryParams.value3"
                        style="width: 240px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </div>
            </el-row>

            <el-row class="mt20 flex-wrap search-btn w100">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-row>
        </el-row>
        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="roleList">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column fixed label="单号" prop="roleId" width="120" />
            <el-table-column label="客户概况" align="center" prop="roleName" width="250" />
            <el-table-column label="项目概况" align="center" prop="roleKey" width="250" />

            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-value="0"
                        inactive-value="1"
                        @change="handleStatusChange(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="下单日期" align="center" prop="roleId" width="150" />
            <el-table-column label="交付日期" align="center" prop="roleId" width="150" />
            <el-table-column label="接单微信" prop="roleId" />
            <el-table-column label="业务员" prop="roleId" />
            <el-table-column label="负责人" prop="roleId" />
            <el-table-column label="创建日期" prop="roleId" />

            <el-table-column
                fixed="right"
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                width="200"
            >
                <template slot-scope="scope" v-if="scope.row.roleId !== 1">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleCompelete(scope.row)">
                        完成
                    </el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">
                        设置优先级
                    </el-button> -->
                </template>
            </el-table-column>
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
    export default {
        name: 'ingList',
        components: {},
        data() {
            return {
                // 遮罩层
                loading: false,
                showSearch: true,
                // 角色表格数据
                roleList: [],
                total: 0,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    option1: 1,
                    value1: undefined,
                    option2: 1,
                    value2: undefined,
                    option3: 1,
                    value3: [],
                    status: undefined,
                },
                statusOptions: [{}],
                staffOptions: [
                    {
                        value: '1',
                        label: '张三',
                    },
                    {
                        value: '2',
                        label: '李四',
                    },
                    {
                        value: '3',
                        label: '王五',
                    },
                ],
            };
        },
        methods: {
            getList() {
                this.loading = true;
                listRole(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.roleList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            },
            optionSelectChange(key) {
                this.queryParams[key] = undefined;
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = [];
                this.resetForm('queryForm');
                this.handleQuery();
            },
            handleCompelete() {
                this.$modal
                    .confirm('是否完成此客户的订单？')
                    .then(function () {
                        return delRole(roleIds);
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess('已完成');
                    })
                    .catch(() => {});
            },
        },
    };
</script>

<style></style>
