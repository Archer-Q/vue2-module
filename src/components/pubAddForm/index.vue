<template>
  <div class="pub-add-form">
    <slot name="title"></slot>
    <el-form
        class="search-form"
        :model="addForm"
        :ref="formRef"
        :size="size"
        :label-suffix="labelSuffix ? ': ' : ''"
        inline>
      <el-row type="flex" :gutter="gutter" class="search-form-row">
        <el-col
            v-for="(item, index) in addFormData"
            :key="index"
            :span="item.colSpan || 8"
        >
          <el-form-item
              class="search-form-item"
              :label="item.label"
              :label-width="labelWidth"
              :prop="item.name"
              :rules="[
              {
                required: item.required || false,
                message: ' ',
                trigger:
                  item.type === 'select' ||
                  item.type === 'date' ||
                  item.type === 'month' ||
                  item.type === 'checkbox'
                  ? 'change' : 'blur'
              },
              ...(item.rules || [])
            ]"
          >
            <!-- 时间日期选择器 -->
            <el-date-picker
                v-if="
                item.type === 'date' ||
                item.type === 'month' ||
                item.type === 'year' ||
                item.type === 'datetime' ||
                item.type === 'daterange' ||
                item.type === 'datetimerange' ||
                item.type === 'monthrange'
              "
                v-model="addForm[item.name]"
                :type="item.type"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
                :format="item.format"
                value-format="timestamp"
                :picker-options="item.pickerOptions"
                :range-separator="item.rangeSeparator"
                :start-placeholder="item.startPlaceholder || `开始${item.type === 'daterange' ? '日期' : '时间'}`"
                :end-placeholder="item.endPlaceholder || `结束${item.type === 'daterange' ? '日期' : '时间'}`"
                @change="handleChangeDate($event, item.name)"
            ></el-date-picker>
            <!-- 下拉选择 -->
            <el-select
                v-else-if="item.type === 'select'"
                v-model="addForm[item.name]"
                :placeholder="item.placeholder || '请选择'"
                :disabled="item.disabled"
                :multiple="item.multiple"
                :filterable="item.filterable"
                :remote="item.remote"
                :remote-method="(query) => remoteMethod(query, item.action || null)"
                :loading="item.loading"
                clearable
                @change="handleSelect($event, item.name)"
            >
              <el-option
                  v-for="(optionItem, optionIndex) in item.options || defaultOptions"
                  :key="optionIndex"
                  :label="optionItem.label"
                  :value="optionItem.value"
              ></el-option>
            </el-select>
            <!-- 多选框 -->
            <el-checkbox
                v-else-if="item.type === 'checkbox'"
                v-model="addForm[item.name]"
                style="float: left"
            />
            <!-- 多行文本框 -->
            <el-input
                v-else-if="item.type === 'textarea'"
                v-model="addForm[item.name]"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
                :rows="1"
                :autosize="{ minRows: 3, maxRows: 5 }"
                type="textarea"
                clearable
            />
            <!-- 文本框 -->
            <el-input
                v-model="addForm[item.name]"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
                :maxlength="item.maxlength"
                clearable
                v-else
                @change="changeInput($event, item.name)"
                @clear="clearInput($event, item.name)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="bottom-bar" v-if="bottomBarVisable">
      <el-button size="mini" v-for="(btnItem, index) in searchBtnList" :key="btnItem.label + index" :type="btnItem.type || ''" @click="$emit(btnItem.action, $event)">{{ btnItem.label }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pubAddForm',
  props: {
    // 传入的表单数据
    title: {
      type: String,
    },
    // 传入的表单数据
    addFormData: {
      type: Array, // 数组里每一项是对象，对象属性有两个colId,colInfo [{colId: **, colInfo: {}}]
      required: true,
    },
    // 表单数据回调
    addForm: {
      type: Object,
      required: true,
      default: []
    },
    /* 表单ref */
    formRef: {
      type: String,
      default: 'addForm'
    },
    // 表单域标签的宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 表单域标签的后缀
    labelSuffix: {
      type: Boolean,
      default: false
    },
    // 表单内组件的尺寸
    size: {
      type: String,
      default: 'small'
    },
    // 表单栅格间隔
    gutter: {
      type: [String, Number],
      default: 0
    },
    // 栅格占据的列数
    colSpan: {
      type: [String, Number],
      default: 0
    },
    // 底部标签栏是否可见
    bottomBarVisable: {
      type: Boolean,
      default: false
    },
    // 查询按钮名称
    searchBtnList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      defaultOptions: [
        {
          label: '默认选项一',
          value: 0
        },
        {
          label: '默认选项二',
          value: 1
        },
        {
          label: '默认选项三',
          value: 2
        }
      ],
    }
  },
  mounted() {
  },
  methods: {
    // 支持远程搜索的下拉框
    remoteMethod(query, action) {
      this.$emit(action, query);
    },
    // 下拉选择
    handleSelect(val, name) {
      this.$emit('handleChange', val, name);
    },
    // input改变值
    changeInput(val, name){
      this.$emit('changeInput', val, name);
    },
    // input clear清除事件
    clearInput(val, name){
      this.$emit('clearInput', val, name);
    },
    //时间选择
    handleChangeDate(val, name){
      this.$emit('handleChangeDate', val, name);
    },
  },
  watch: {

  }
}
</script>
<style lang="scss">
.pub-add-form {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 10px;
  .el-form-item__label {
    color: #3e4855;
    font-weight: 400 !important;
  }
  .search-form {
    padding: 0;
    .search-form-row {
      /* 格栅flex布局允许换行 */
      flex-wrap: wrap;
      .search-form-item {
        display: flex;
        width: 100%;
        height: 40px;
        text-align: left;
        margin-bottom: 10px;
        .el-form-item__content {
          flex: 1;
          //max-width: 200px;

          .el-input {
            width: auto;
            max-width: initial;
          }
          /* 支持远程搜索的下拉框 */
          .select-search {
            width: 100%;
          }
          /* 日期选择器-默认 */
          .date-picker {
            width: 100%;
          }
          .date-range-picker {
            float: left;
            max-width: 512px;
          }
        }
      }
    }
  }
  .bottom-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    .el-button--primary {
      background-color: #2dcaab;
      border-color: #2dcaab;
      &:hover, &:active {
        background: #2dcaab;
        border-color: #2dcaab;
      }
    }
  }
}
</style>
