<template>
  <div>
    <pub-list
      border
      :actions="activeActions"
      ref="formRef"
      :tableFormRef="tableFormRef"
      :cols="colsData"
      :current-page="currentPage"
      :table-data="tableData"
      @getAction="handleStatusFilter"
      @handleDetail="handleDetail"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      :checkStatus="checkStatus"
    />
  </div>
</template>
<script>
import PubList from "@/components/pubList";
export default {
  name: "Index",
  components: {
    PubList
  },
  data() {
    return {
      colsData: [
        {
          prop: 'name',
          label:"姓名",
        },
        {
          prop: 'sex',
          label:"性别",
          isSpecialColResult: true,
          isCodeTableFormatter: (val) => {
            if (val.sex == 1) {
              return '男'
            }else{
              return '女'
            }
          }
        },
        {
          prop: 'age',
          label:"年纪",
          format: 'YYYY-MM-DD',
          isSpecialColor: true,
          isSpecialClass: (val) => {
            if (val == 1654760753) {
              return 'color-red'
            }
          }
        },
        {
          prop: 'status',
          label:"状态",
        }
      ],
      tableData: {
        data: [
          {name: '小明', sex: '1', age: 1654760753, status: 1},
          {name: '小花', sex: '2', age: 1654760754, status: 2},
          {name: '小天', sex: '1', age: 1654760755, status: 3},
          {name: '小明-1', sex: '1', age: 1654760753, status: 1},
          {name: '小花-1', sex: '2', age: 1654760754, status: 2},
          {name: '小天-1', sex: '1', age: 1654760755, status: 3},
        ],
        pageSize: 1
      },
      activeActions: [],
      actions: [
        {
          id: 'detail',
          name: '详情',
          action: 'handleDetail',
          permission: 110,
          iconName: 'icon-zidongshengcheng'
        },
        {
          id: 'edit',
          name: '编辑',
          action: 'handleEdit',
          permission: 111,
          iconName: 'icon-bianji'
        },
        {
          id: 'delete',
          name: '删除',
          action: 'handleDelete',
          permission: 110,
          iconName: 'icon-shanchu'
        },
      ],
      tableFormRef: "tableFormRef",
      currentPage: 1,
      pageSize: 5,
      permissionData: ['status'],
    }
  },
  mounted() {
    this.activeActions = this.actions;
  },
  methods: {
    checkStatus(row) {
      switch (row.permission) {
        case 110:
          return row.status == 1;
        case 111:
          row.status == 2;
        default:
          break;
      }
    },
    handleStatusFilter(row) {
      let activeActionsArr = [];
      switch (row.status) {
        case 1:
          activeActionsArr = ['详情', '编辑', '删除'];
          break;
        case 2:
          activeActionsArr = ['详情', '编辑'];
          break;
        case 3:
          activeActionsArr = ['详情', '删除'];
          break;
      }
      this.activeActions = this.actions.filter(
          (item) => activeActionsArr.indexOf(item.name) > -1
      )
    },
    handleDetail() {

    },
    handleEdit() {

    },
    handleDelete() {

    },
  },
}
</script>
<style lang="scss"></style>
