<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('sort:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <!--<el-table-column align="center" label="序号" width="80">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-text="getIndex(scope.$index)"> </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" prop="name" label="分类名" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" label="创建时间" width="170">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.createTime}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="primary" icon="edit" @click="showUpdate(scope.$index,'tempSort')">修改</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-collapse  v-model="activeName" accordion>
        <el-collapse-item title="分类" name="1">
          <div v-for="item in list" >{{item}}</div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :rules="rules"  :model="tempSort" ref="tempSort" label-position="left" label-width="60px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="分类" prop="content">
          <el-input type="text"   aria-required="true" v-model="tempSort.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="createLoading" type="success" @click="createSort('tempSort')">创 建</el-button>
        <el-button type="primary" v-else @click="updateSort">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '请输入分类内容', trigger: 'blur' }
          ]
        },
        totalCount: 0, // 分页组件--数据总条数
        list: [], // 表格的数据
        listLoading: false, // 数据加载等待动画
        listQuery: {
          pageNum: 1, // 页码
          pageRow: 50, // 每页条数
          name: ''
        },
        dialogStatus: 'create',
        createLoading: false,
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempSort: {
          id: '',
          name: '',
          level: ''
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
        this.listLoading = true
        this.api({
          url: '/sort/listSort',
          method: 'get',
          params: this.listQuery
        }).then(data => {
          this.listLoading = false
          this.list = data.list
          this.totalCount = data.totalCount
        })
      },
      handleSizeChange(val) {
        // 改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter()
      },
      handleCurrentChange(val) {
        // 改变页码
        this.listQuery.pageNum = val
        this.getList()
      },
      getIndex($index) {
        // 表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },
      showCreate() {
        // 显示新增对话框
        this.tempSort.content = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showUpdate($index, tempSort) {
        // 显示修改对话框
        this.tempSort.id = this.list[$index].id
        this.tempSort.content = this.list[$index].content
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$refs[tempSort].validate((valid) => {
          if (!valid) {
            return false
          }
        })
      },
      createArticle(tempSort) {
        console.log(tempSort)
        this.$refs[tempSort].validate((valid) => {
          if (valid) {
            this.createLoading = true
            // 保存新文章
            this.api({
              url: '/article/addArticle',
              method: 'post',
              data: this.tempSort
            }).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.createLoading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateArticle() {
        // 修改文章
        this.api({
          url: '/article/updateArticle',
          method: 'post',
          data: this.tempSort
        }).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      }
    }
  }
</script>
