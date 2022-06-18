<template>
  <div class="pub-list">
    <el-form :model="Array.isArray(tableData) ? { tableData: { data: tableData } } : tableData" :ref="tableFormRef">
      <div class="operate-btns">
        <span class='sec-reset-btn'
              type="text"
              v-if="btnsList && btnsList.length"
              :key="btnItem.id"
              v-for="btnItem in btnsList"
              @click="$emit(btnItem.action, $event)">
          {{ btnItem.label }}
        </span>
      </div>
      <el-table
          :ref="tableRef"
          v-loading="loading"
          :data="Array.isArray(tableData) ? tableData : tableData.data"
          @cell-mouse-enter="getAction"
          @cell-mouse-leave="leaveAction"
          :style="{'width': tableWidth}"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
          :show-summary="showSummary"
          :sum-text="sumText"
          :summary-method="summaryMethod"
          :span-method="handleSpanMethod"
          :cell-style="cellStyle"
          :header-cell-style="headerCellStyle"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :border="border"
          :height="height">
        <!-- 是否显示多选框 -->
        <el-table-column
            v-if="showSelection"
            :reserve-selection='reserveSelection'
            :selectable="handleSelection"
            type="selection" width="50" fixed="left"/>
        <!-- 是否显示索引 -->
        <el-table-column type="index" fixed="left" width="50" label="序号" v-if="showIndex"/>
        <el-table-column type="index" :index="typeIndex" width="50" label="序号" v-if="showIndexAdd"/>
        <!-- 循环产生表头数据 -->
        <template v-for="colItem in cols">
          <el-table-column
              :prop="colItem.prop"
              :label="colItem.label"
              :min-width="colItem.width ? colItem.width : ''"
              :key="colItem.prop"
              v-if="!colItem.isSpecialColResult && !colItem.isSpecialColor"
              :resizable="resizable">
            <!-- 表头增加必填标识 * -->
            <template slot="header" slot-scope="scope">
              <span class="star" v-if="colItem.required" style="color: red;">*</span>
              <span class="starName">{{colItem.label}}</span>
            </template>
            <!-- 多级表头 -->
            <template v-if="colItem.children && colItem.children.length > 0">
              <el-table-column
                  v-for="colChildrenItem in colItem.children"
                  :key="colChildrenItem.prop"
                  :prop="colChildrenItem.prop"
                  :label="colChildrenItem.label"
                  :min-width="colChildrenItem.width ? colChildrenItem.width : ''">
                <template slot-scope="scope">
                  <!-- 某一列全部编辑输入框 -->
                  <el-form-item
                      v-if="colChildrenItem.editColumn && colChildrenItem.editParams"
                      :prop="'data.' + scope.$index + '.' + colChildrenItem.prop"
                      :rules="colChildrenItem.editParams.rules || []"
                      :inline-message="true">
                    <el-input
                        v-model="scope.row[colChildrenItem.prop]"
                        :placeholder="colChildrenItem.editParams.placeholder || ''"
                        :maxlength="colChildrenItem.editParams.maxlength"
                        clearable
                    ></el-input>
                  </el-form-item>
                  <!-- 单元格编辑--输入框 -->
                  <el-form-item
                      v-else-if="scope.row.isEdit && colChildrenItem.inputCell"
                      :prop="'data.' + scope.$index + '.' + colChildrenItem.prop"
                      :rules="colChildrenItem.editParams.rules || []"
                      :inline-message="true">
                    <el-input
                        @blur="colChildrenItem.callback ? $emit(colChildrenItem.callback || null, $event, scope.row, scope) : null"
                        v-model="scope.row[colChildrenItem.prop]"
                        :placeholder="colChildrenItem.editParams.placeholder || ''"
                        :maxlength="colChildrenItem.editParams.maxlength"
                        clearable
                    ></el-input>
                  </el-form-item>
                  <!-- 单元格编辑--下拉选择 -->
                  <el-form-item
                      v-else-if="scope.row.isEdit && colChildrenItem.selectCell"
                      :prop="'data.' + scope.$index + '.' + colChildrenItem.prop"
                      :rules="colChildrenItem.editParams.rules || []"
                      :inline-message="true">
                    <el-select
                        v-model="scope.row[colChildrenItem.prop]"
                        :placeholder="colChildrenItem.placeholder"
                        @change="colChildrenItem.callback ? $emit(colChildrenItem.callback || null, $event, scope.row, scope) : null"
                        @visible-change="colChildrenItem.callback ? $emit(colChildrenItem.callback || null, $event, scope.row, scope) : null">
                      <el-option
                          v-for="(optionItem, optionIndex) in scope.row.options || []"
                          :key="optionIndex"
                          :label="optionItem.label"
                          :value="optionItem.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- 单元格编辑--Switch 开关 -->
                  <el-form-item
                      v-else-if="scope.row.isEdit && colChildrenItem.switchCell"
                      :prop="'data.' + scope.$index + '.' + colChildrenItem.prop"
                      :rules="colChildrenItem.editParams.rules || []"
                      :inline-message="true">
                    <el-switch
                        v-model="scope.row[colChildrenItem.prop]"
                        :disabled="colChildrenItem.disabled"
                        @change="colChildrenItem.callback ? $emit(colChildrenItem.callback || null, $event, scope.row, scope.$index) : null"
                        :active-text="colChildrenItem.activeText"
                        :inactive-text="colChildrenItem.inactiveText"
                        :active-color="colChildrenItem.activeColor"
                        :inactive-color="colChildrenItem.inactiveColor">
                    </el-switch>
                  </el-form-item>
                  <!-- 纯文本 格式化时间戳 -->
                  <div v-else>
                    <el-tooltip placement="top" :open-delay="500">
                      <div slot="content">
                        {{ scope.row[colChildrenItem.prop] | formateDate(colChildrenItem.format) }}
                      </div>
                      <div class="tooltip-cell">
                        {{ scope.row[colChildrenItem.prop] | formateDate(colChildrenItem.format) }}
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </template>
            <!-- 表格内 -->
            <template slot-scope="scope">
              <!-- 某一列全部编辑输入框 -->
              <el-form-item
                  v-if="colItem.editColumn && colItem.editParams"
                  :prop="'data.' + scope.$index + '.' + colItem.prop"
                  :rules="colItem.editParams.rules || []"
                  :inline-message="true">
                <el-input
                    v-model="scope.row[colItem.prop]"
                    :placeholder="colItem.editParams.placeholder || ''"
                    :maxlength="colItem.editParams.maxlength"
                    clearable
                ></el-input>
              </el-form-item>
              <!-- 单元格编辑--输入框 -->
              <el-form-item
                  v-else-if="scope.row.isEdit && colItem.inputCell"
                  :prop="'data.' + scope.$index + '.' + colItem.prop"
                  :rules="colItem.editParams.rules || []"
                  :inline-message="true">
                <el-input
                    @blur="colItem.callback ? $emit(colItem.callback || null, $event, scope.row, scope) : null"
                    v-model="scope.row[colItem.prop]"
                    :placeholder="colItem.placeholder || ''"
                    :maxlength="colItem.editParams.maxlength"
                    clearable
                ></el-input>
              </el-form-item>
              <!-- 单元格编辑--下拉选择 -->
              <el-form-item
                  v-else-if="scope.row.isEdit && colItem.selectCell"
                  :prop="'data.' + scope.$index + '.' + colItem.prop"
                  :rules="colItem.editParams.rules || []"
                  :inline-message="true">
                <el-select
                    v-model="scope.row[colItem.prop]"
                    :placeholder="colItem.placeholder"
                    @change="colItem.callback ? $emit(colItem.callback || null, $event, scope.row, scope) : null"
                    @visible-change="colItem.callback ? $emit(colItem.callback || null, $event, scope.row, scope) : null">
                  <el-option
                      v-for="(optionItem, optionIndex) in colItem.options || []"
                      :key="optionIndex"
                      :label="optionItem.label"
                      :value="optionItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 单元格编辑--Switch 开关 -->
              <el-form-item
                  v-else-if="scope.row.isEdit && colItem.switchCell"
                  :prop="'data.' + scope.$index + '.' + colItem.prop"
                  :rules="colItem.editParams.rules || []"
                  :inline-message="true">
                <el-switch
                    v-model="scope.row[colItem.prop]"
                    :disabled="colItem.disabled"
                    @change="colItem.callback ? $emit(colItem.callback || null, $event, scope.row, scope.$index) : null"
                    :active-text="colItem.activeText"
                    :inactive-text="colItem.inactiveText"
                    :active-color="colItem.activeColor"
                    :inactive-color="colItem.inactiveColor">
                </el-switch>
              </el-form-item>
              <!-- 纯文本 格式化时间戳 -->
              <div v-else>
                <el-tooltip placement="top" :open-delay="500">
                  <div slot="content">
                    {{ scope.row[colItem.prop] | formateDate(colItem.format) }}
                  </div>
                  <div class="tooltip-cell">
                    {{ scope.row[colItem.prop] | formateDate(colItem.format) }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <!-- 需要特殊颜色显示字体 -->
          <el-table-column
              v-if="colItem.isSpecialColor"
              :key="colItem.prop"
              v-bind="colItem"
              align="center">
            <template slot-scope="scope">
              <span :class="colItem.isSpecialClass(scope.row[scope.column.property])">{{ scope.row[colItem.prop] }}</span>
            </template>
          </el-table-column>
          <!-- 需要处理返回值 -->
          <el-table-column
              v-if="colItem.isSpecialColResult"
              :key="colItem.prop"
              v-bind="colItem.isCodeTableFormatter ? Object.assign({ formatter: colItem.isCodeTableFormatter }, colItem) : colItem"
              align="center"
              show-overflow-tooltip />
        </template>
        <!-- 操作列 -->
        <el-table-column
            label="操作"
            prop="operate"
            min-width="100">
          <template slot-scope="scope">
            <slot name="operate" :scope="scope"></slot>
          </template>
        </el-table-column>
        <!-- 列表无数据显示图片 -->
        <template slot="empty">
          <div class="table-empty">
            <img src="@/assets/img/table-empty.png" alt="" />
            <p>暂无内容</p>
          </div>
        </template>
      </el-table>
    </el-form>
    <div class="bottom" v-if="bottomShow">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="tableData.pageSize || 5"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes,prev, pager, next, jumper"
          :total="tableData.count || 0"
      />
    </div>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  name: 'PubList',
  props: {
    /* 表格表单ref */
    tableFormRef: {
      type: String,
      default: ''
    },
    // 表格操作按钮
    btnsList: {
      type: Array,
    },
    // 表格数据源
    tableData: {
      type: [Array, Object],
      required: true
    },
    // 表格ref
    tableRef: {
      type: String,
      default: 'tableRef'
    },
    // loading
    loading: {
      type: Boolean,
      default: false
    },
    // 列表宽度
    tableWidth: {
      type: String,
      default: '100%'
    },
    // 是否在表尾显示合计行
    showSummary: {
      type: Boolean,
      default: false
    },
    // 合计行第一列的文本
    sumText: {
      type: String,
      default: '合计'
    },
    // 自定义的合计计算方法
    summaryMethod: {
      type: Function,
    },
    // 合并行或列的计算方法
    handleSpanMethod: {
      type: Function,
    },
    // 单元格的 style 的回调方法
    cellStyle: {
      type: Function,
      default() {
        return () => {};
      }
    },
    // 表头单元格的 style 的回调方法
    headerCellStyle: {
      type: Function,
      default() {
        return () => {};
      }
    },
    // 是否纵边框
    border: {
      type: Boolean,
      default: false
    },
    // 固定表头
    height: {
      type: String,
    },
    // 是否显示索引
    showIndex: {
      type: Boolean,
      default: false
    },
    // 是否显示索引累加
    showIndexAdd: {
      type: Boolean,
      default: false
    },
    // 是否显示多选框
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否在数据更新之后保留之前选中的数据
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 表格列
    cols: {
      type: Array,
      required: true
    },
    // 对应列是否可以通过拖动改变宽度
    resizable: {
      type: Boolean,
      default: false
    },
    // 行操作按钮
    actions: {
      type: Array
    },
    // 行操作按钮
    tableActions: {
      type: Array
    },
    // 行操作按钮
    actionRules: {
      type: Array
    },
    // 是否显示分页
    bottomShow: {
      type: Boolean,
      default: false
    },
    // 当前页数
    currentPage: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      rowIndex: '-1'
    };
  },
  mounted() {

  },
  filters: {
    formateDate(val, formatter) {
      if (!formatter || !val) return val;
      switch (formatter) {
        case 'YYYY-MM-DD':
        case 'YYYY-MM-DD HH:mm:ss':
          return moment(val).format(formatter);
        case 'YYYY-MM':
          return moment(val).format(formatter);
        case 'YYYY-MM-DD HH:mm':
          return moment(val).format(formatter);
        default:
          return val
      }
    }
  },
  methods: {
    typeIndex(index) {
      const tabIndex = index + (this.currentPage - 1) * this.tableData.pageSize + 1
      return tabIndex
    },
    // 当单元格 hover 进入时会触发该事件
    getAction(row, column, cell, event) {
      this.rowIndex = row.rowIndex;
      if (column.label == '操作') {
        this.$emit('getAction', row);
      }
    },
    // 当单元格 hover 退出时会触发该事件
    leaveAction() {
      this.rowIndex = '-1';
    },
    // 切换每页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.$emit('handleSizeChange', val);
    },
    // 切换当前页数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange', val);
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
    // 当某一行被点击时会触发该事件
    rowClick(row, column, event) {
      this.$refs.tableRef.toggleRowSelection(row);
      this.$emit('rowClick', row);
    },
    // 决定这一行的 CheckBox 是否可以勾选
    handleSelection(row, index) {
      return !row.disabled;
    },
    handleAction(index, row, scope) {
      let { route, query, routeName, action, id, iconName } = index;
      if (route) {
        let obj = {};
        if (Array.isArray(query)) {
          query.map((item) => {
            obj[item] = row[item];
          });
        }
        this.$router.push({
          path: route,
          query: obj
        });
        scope._self.$refs[`popover-${scope.$index}`].doClose();
      }
      if (action) {
        this.$emit(action, row, scope || null);
      }
      if (index.id) {
        this.$emit(index.id, row, scope.$index);
      }
    },
  },

  watch: {
    tableData: {
      handler() {
        // 解决表格列变动的抖动问题
        this.$nextTick(() => {
          this.$refs[this.tableRef].doLayout();
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.pub-list {
  .operate-btns {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    span:not(:last-child) {
      margin-right: 6px;

    }
  }
  .el-table {
    td {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
.table-empty {
  padding: 10px;

  img {
    margin-top: 30px;
    width: 227px;
    height: 143px;
  }

  p {
    color: #b4b6c6;
    font-size: 12px;
  }
}
</style>
