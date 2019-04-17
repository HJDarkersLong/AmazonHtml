<!-- tree_render component -->
<template>
    <span class="tree-expand">
        <span class="tree-label" v-show="DATA.isEdit">
            <el-input @click.stop.native="nodeEditFocus"
                      @blur="nodeEditPass(STORE,DATA,NODE)"
                      @keyup.enter.native="nodeEditPass(STORE,DATA,NODE)"
                      class="edit" size="mini" autofocus
                      :ref="'treeInput'+DATA.id"
                      v-model="DATA.name"></el-input>
        </span>
        <span v-show="!DATA.isEdit"
              :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']"
              :ref="'treeLabel'+DATA.id">
            <span>{{DATA.name}}</span>
        </span>
        <span class="tree-btn" v-show="!DATA.isEdit">
            <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
            <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
            <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
        </span>
    </span>
</template>
<script>
  export default {
    props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
    methods: {
      nodeAdd(s, d, n) { // 新增
        this.$emit('nodeAdd', s, d, n)
      },
      nodeEdit(s, d, n) { // 编辑
        d.isEdit = true
        this.$nextTick(() => {
          this.$refs['treeInput'+d.id].$refs.input.focus()
        })
        this.$emit('nodeEdit', s, d, n)
      },
      nodeDel(s, d, n) { // 删除
        this.$emit('nodeDel', s, d, n)
      },
      nodeEditPass(s, d, n) {
        d.isEdit = false
      },
      nodeEditFocus() {}
    }
  }
</script>
<style>
  .tree-expand .tree-label.tree-new{
    font-weight:600;
  }
  .expand-tree .is-current>.el-tree-node__content .tree-btn,
  .expand-tree .el-tree-node__content:hover .tree-btn{
    display: inline-block;
  }
</style>
