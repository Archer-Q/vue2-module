<template>
  <div class="pub-tree">
    <el-tree
        :data="treeData"
        ref="tree"
        :indent="0"
        :props="defaultProps"
        current-node-key="1"
        node-key="id"
        @node-click="nodeClick"
        :default-expand-all="defaultExpandAll"
        :default-expanded-keys="defaultExpandedKeys"
        :show-checkbox="showCheckbox"
        :default-checked-keys="defaultCheckedKeys"
        :check-on-click-node="checkOnClickNode"
        :accordion="isAccordion"
        :icon-class="iconClass"
        :empty-text="emptyText"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              type="text"
              icon="el-icon-delete"
              circle
              v-if="!data.children || !data.children.length"
              @click="remove(node, data)"
          />
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'pubTree',
  props: {
    treeData: {
      type: Array,
      default: []
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    // 默认展开的节点的 key 的数组
    defaultExpandedKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 节点是否可被选择
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 默认勾选的节点的 key 的数组
    defaultCheckedKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
    checkOnClickNode: {
      type: Boolean,
      default: false
    },
    // 手风琴模式---是否每次只打开一个同级树节点展开
    isAccordion: {
      type: Boolean,
      default: false
    },
    // 自定义树节点的图标
    iconClass: {
      type: String,
      default: ''
    },
    // 内容为空的时候展示的文本
    emptyText: {
      type: String,
      default: '暂无数形数据'
    },
  },
  data() {
    return {
      defaultOpen: require('@/assets/images/open-tree.png'),
      defaultClose: require('@/assets/images/close-tree.png'),
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    };
  },
  mounted() {
  },
  created() {

  },
  methods: {
    // 点击节点
    nodeClick(data, checked, node) {
      data.open = !data.open;
      this.$emit('nodeClick', data)
    },
    // 删除节点
    remove(node, data) {
      this.$emit('removeNode', { node: node, data: data })
    },

  },
  watch: {}
};
</script>
<style lang="scss">
.pub-tree {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .el-tree {
    overflow-y: auto;
    height: 100%;
    padding: 10px 10px 10px 0;
    .el-tree-node {
      padding-left: 16px;
      position: relative;
    }

    .el-tree-node {
      position: relative;
      padding-left: 16px;
    }

    .el-tree-node__content {
      //margin-top: 10px;
    }

    .el-tree-node__children {
      padding-left: 16px;
    }

    .el-tree-node:before {
      content: "";
      position: absolute;
      width: 1px;
      height: 100%;
      top: -26px;
      left: -3px;
      border-left: 1px dashed #c0c4cc;
    }

    .el-tree-node:last-child::before {
      height: 38px;
    }

    .el-tree-node::after {
      content: '';
      width: 24px;
      height: 0;
      position: absolute;
      left: -3px;
      top: 12px;
      border-width: 1px;
      border-top: 1px dashed #c0c4cc;
    }

    & > .el-tree-node::after {
      border-top: none;
    }

    & > .el-tree-node::before {
      border-left: none;
    }

    .el-tree-node__expand-icon {
      font-size: 14px;
      color: #c0c4cc;

      &.is-leaf {
        color: transparent;
      }
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      //padding-right: 8px;
    }

    // 减少末级节点与连接线的距离
    .is-leaf {
      padding: 0;
      background: none;
    }

    // 去除节点展开、闭合时小三角旋转
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    // 去除小三角
    .el-icon-caret-right:before {
      content: "";
    }

    // 有子节点闭合时图标[+]
    .el-tree-node__expand-icon.el-icon-caret-right {
      content: '';
      background: url('../../assets/images/close-tree.png') no-repeat center center;
      display: block;
      width: 26px;
      height: 26px;
    }

    //有子节点展开时图标[+]
    .expanded.el-tree-node__expand-icon.el-icon-caret-right {
      content: '';
      background: url('../../assets/images/open-tree.png') no-repeat center center;
      display: block;
      width: 26px;
      height: 26px;
    }

    // 末级节点去除图标
    .is-leaf.el-tree-node__expand-icon.el-icon-caret-right {
      padding: 0;
      background: none;
      width: 12px;
    }
    .el-button--text {
      color: #00B1A0;
    }
  }
}
</style>
