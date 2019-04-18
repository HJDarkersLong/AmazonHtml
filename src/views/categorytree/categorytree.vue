<template>
  <div class="app-container">
    <el-button type="primary" icon="plus" @click="appendEvent('','','topData')">添加顶级节点</el-button>
    <el-aside width="300px" style="padding: 15px; width: 1000px">
      <el-tree
        ref="eventCategoryTree"
        :data="eventCategoryTree"
        :props="defaultProps"
        node-key="id"
        highlight-current
        default-expand-all
        :render-content="renderContent"
        :expand-on-click-node="false">
      </el-tree>
    </el-aside>

    <!--新增事件节点分类弹窗-->
    <el-dialog
      title="新增事件分类"
      width="25%"
      class="add-event-dialog"
      :visible.sync="addEventdialogVisible"
      size="tiny">
      <el-form ref="addEventForm" :model="addEventForm" :rules="addEventNodeRules">
        <el-form-item label="分类名称" prop="categoryName" >
          <el-input v-model="addEventForm.categoryName"></el-input>
        </el-form-item>
        <!--<el-form-item label="分类标识" prop="categoryFlag">
          <el-input v-model="addEventForm.categoryFlag"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer" >
      <el-button @click="addEventFormCancleBtn('addEventForm')">取 消</el-button>
      <el-button type="primary" @click="addEventFormSubmitBtn('addEventForm')">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
    import TreeRender from '@/components/tree_render2'
    export default {
      name: 'categorytree',
      data() {
        return {
          addEventNodeRules: {
            categoryName: [
              { required: true, message: '请输入公告内容', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ]
          },
          // 树组件的数据
          eventCategoryTree: [ ],
          defaultProps: {
            children: 'children',
            label: 'label'
          },

          /* 触发的当前的节点，放到全局，方便调用 */
          triggerCurrenNodeData: {},
          /* 触发的当前节点 */
          triggerCurrenNode: {},
          /* 新增事件弹窗的输入框数据 */
          addEventdialogVisible: false,
          addEventForm: {
            categoryName: ''
          }
        }
      },
      created() {
        this.getList()
      },
      methods: {
        getList() {
          // 查询列表
          if (!this.hasPerm('sort:list')) {
            return
          }
          this.api({
            url: '/sort/listSort',
            method: 'get',
            params: this.listQuery
          }).then(data => {
            console.log(data)
            this.eventCategoryTree = data
          })
        },
        /* 渲染函数 */
        renderContent(h, { node, data, store }) {
          let that = this// 指向vue
          return h(TreeRender, {
            props: {
              NODE: node,
              DATA: data,
              STORE: store
            },
            on: {
              // 新增
              Append: (s, d, n) => that.appendEvent(s, d, n),
              // 删除节点
              Delete: (s, d, n) => that.removeEvent(s, d, n),
              // 查看
              WatchInfo: (s, d, n) => that.changeMainRegion(s, d, n)
            }
          }
          )
        },
        /* 树形控件添加节点，添加弹窗出现 */
        appendEvent(s, d, n) {
          this.addEventdialogVisible = true
          this.triggerCurrenNodeData = d
          this.triggerCurrenNode = n
        },
        /* 树形控件删除节点 */
        removeEvent(s, d, n) {
          const parent = n.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(data => data.id === d.id)
          console.log(index, '索引')
          console.log('删除节点id==>' + d.id + 'level ==>' + n.level )
          let dataGet={
            typeid: d.id, // 当前节点typeid
            level: n.level // 要删除的节点的层级为当前节点层级
          }
          this.$confirm('确定要删除该节点吗？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.api({
              url: '/sort/delSort',
              method: 'get',
              params: dataGet
            }).then((res) => {
              console.log(res)
              // children.splice(index, 1)
              this.getList()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        // 取消添加
        addEventFormCancleBtn() {
          this.addEventdialogVisible = false
        },
        /* 节点新增，新增树形菜单事件分类弹窗，提交按钮 */
        addEventFormSubmitBtn(formname) {
          this.$refs[formname].validate((valid) => {
            if (valid) {
              console.log('验证成功')
              /* 获取当前input上输入的文字 */
              let dataPost={
                name: this.addEventForm.categoryName.trim(),
                // id: this.addEventForm.categoryFlag.trim(),
                parentId: this.triggerCurrenNodeData.id, // 当前节点id
                level: this.triggerCurrenNode ==='topData' ? 1 : (this.triggerCurrenNode.level + 1) // 要添加的节点的层级为当前节点层级+1
              }
              this.api({
                url: '/sort/addSort',
                method: 'post',
                params: dataPost
              }).then(data => {
                // console.log(data)
                // let result = data
                // if (result.level === '1') {
                //   this.eventCategoryTree.push(result)
                //   this.addEventdialogVisible = false
                // } else {
                //   /* 点击弹窗的确定按钮可以得到输入的数据，作为新的节点名称插入 */
                //   /* 如果没有子节点，就创建一个子节点插入 */
                //   if (!this.triggerCurrenNodeData.children) {
                //     this.$set(this.triggerCurrenNodeData, 'children', [])
                //   };
                //   // 如果已有子节点，就把返回的数据push进去，插入到树形数据中
                //   this.triggerCurrenNodeData.children.push(result)
                //   /* 关闭弹窗，重置输入框 */
                //   this.addEventdialogVisible = false
                //   this.$refs[formname].resetFields()
                //   /* 刷新树形菜单 */
                //   // this.getDictionarytTree();
                // }
                this.addEventdialogVisible = false
                this.getList()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }).catch((e) => {
                console.log('请求失败', e)
              })
            } else {
              console.log('验证未通过')
              return false
            }
          })
        }
      }
    }
</script>

<style scoped>
  .el-scrollbar__thumb {
    display: none;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
