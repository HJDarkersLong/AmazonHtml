<template>
  <div class="app-container">
  <el-button @click="handleAddTop">添加顶级节点</el-button>
  <el-tree @node-click="handleNodeClick"
           ref="expandMenuList" class="expand-tree"
           v-if="isLoadingTree"
           :data="setTree"
           node-key="id"
           highlight-current
           :props="defaultProps"
           :expand-on-click-node="false"
           :render-content="renderContent"
           :default-expanded-keys="defaultExpandKeys"></el-tree>
  </div>
</template>
<script>
  import TreeRender from '@/components/tree_render'
  import api from '@/resource/api'
  export default {
    name: 'sort',
    data() {
      return {
        maxexpandId: api.maxexpandId, // 新增节点开始id
        non_maxexpandId: api.maxexpandId, // 新增节点开始id(不更改)
        isLoadingTree: false, // 是否加载节点树
        setTree: api.treelist, // 节点树数据
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultExpandKeys: []// 默认展开节点列表
      }
    },
    mounted() {
      this.initExpand()
    },
    methods: {
      initExpand() {
        // isLoadingTree用意也是在此
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id)
        })
        this.isLoadingTree = true
      },
      handleAddTop() {
        this.setTree.push({
          id: ++this.maxexpandId,
          name: '新增节点',
          pid: '',
          isEdit: false,
          children: []
        })
      },
      renderContent(h, { node, data, store }) {
        let that = this// 指向vue
        return h(TreeRender, {
          props: {
            DATA: data, // 节点数据
            NODE: node, // 节点内容
            STORE: store, // 完整树形内容
            maxexpandId: that.non_maxexpandId
          },
          on: {// 绑定方法
            nodeAdd: (s, d, n) => that.handleAdd(s, d, n),
            nodeEdit: (s, d, n) => that.handleEdit(s, d, n),
            nodeDel: (s, d, n) => that.handleDelete(s, d, n)
          }
        })
      },
      handleAdd(s, d, n) { // 增加节点
        console.log(s, d, n)
        if (n.level >=6) {
          this.$message.error('最多只支持五级！')
          return false
        }
        // 添加数据
        d.children.push({
          id: ++this.maxexpandId,
          name: '新增节点',
          pid: d.id,
          isEdit: false,
          children: []
        })
        // 展开节点
        if (!n.expanded) {
          n.expanded = true
        }
      },
      handleEdit(s, d, n) { // 编辑节点
        console.log(s, d, n)
      },
      handleDelete(s, d, n) { // 删除节点
        console.log(s, d, n)
        let that = this
        // 有子级不删除
        if (d.children && d.children.length !== 0) {
          this.$message.error('此节点有子级，不可删除！')
          return false
        } else {
          // 删除操作
          let delNode = () => {
            let list = n.parent.data.children || n.parent.data
            // 节点同级数据，顶级节点时无children
            let _index = 99999// 要删除的index
            list.map((c, i) => {
              if (d.id == c.id) {
                _index = i
              }
            })
            let k = list.splice(_index, 1)
            // console.log(_index,k)
            this.$message.success('删除成功！')
          }
          let isDel = () => {
            that.$confirm('是否删除此节点？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
            }).catch(() => {
              return false
            })
          }
          // 新增节点直接删除，否则要通过请求数据删除
          d.id > this.non_maxexpandId ? delNode() : isDel()
        }
      },
      handleNodeClick(d, n, s) { // 点击节点
        d.isEdit = false// 放弃编辑状态
      }
    }
  }
</script>

<style scoped>

</style>
