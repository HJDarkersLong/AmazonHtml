<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('goods:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="商品名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="cn_name" label="中文名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="en_name" label="英文名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="pcl_no" label="pcl商品编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="sku_no" label="sku货品编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="other_name" label="别名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="cn_customs_name" label="中文报关名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="en_customs_name" label="英文报关名称" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="hs_code" label="海关编码" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="category_no" label="分类编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="tag_no" label="标签编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="brand_no" label="品牌编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="business_dev_user_no" label="业务开发员" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="buy_qus_user_no" label="采购询价员" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="buy_user_no" label="采购员" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="length" label="长(cm)" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="width" label="宽(cm)" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="height" label="高(cm)" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="weight" label="重量(kg)" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="body_weight_5000" label="材积重/5000(L*W*H))" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="body_weight_6000" label="材积重/6000(L*W*H))" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="base_price" label="成本价格(分)" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="sale_price" label="销售价格(分)" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="pic_address" label="图片地址" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="description" label="产品描述" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="easy_discription" label="产品简要描述" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="key_code" label="关键词" style="width: 60px;"></el-table-column>
      <el-table-column align="center"  label="商品状态" style="width: 60px;">
        <template slot-scope="scope">
          {{getStatusInfo(list[scope.$index].status)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="create_by" label="创建人" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="create_date" label="创建时间" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="update_by" label="更新人" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="update_date" label="更新时间" style="width: 60px;"></el-table-column>

      <!--<el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.update_date}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('goods:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" width="85%" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :rules="rules" :model="tempGoods" label-position="left" label-width="150px" style='display:flex;flex-wrap:wrap;width: 85%; margin-left:50px;'>
        <el-col :span="6">
          <el-form-item  label=" 商品名称"  prop="name" >
            <el-input clearable type="text" aria-required="true" v-model="tempGoods.name"> </el-input>
          </el-form-item>

          <el-form-item label=" 中文名称">
            <el-input type="text" v-model="tempGoods.cn_name"> </el-input>
          </el-form-item>

          <el-form-item label="英文名称">
            <el-input type="text" v-model="tempGoods.en_name"> </el-input>
          </el-form-item>

          <el-form-item label="pcl商品编号">
            <el-input type="text" v-model="tempGoods.pcl_no"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item style="margin-left: 2px"label="sku货品编号">
            <el-input type="text" v-model="tempGoods.sku_no"> </el-input>
          </el-form-item>

          <el-form-item label="  别名">
            <el-input type="text" v-model="tempGoods.other_name"> </el-input>
          </el-form-item>
          <el-form-item label="中文报关名称">
            <el-input type="text" v-model="tempGoods.cn_customs_name"> </el-input>
          </el-form-item>

          <el-form-item label="英文报关名称">
            <el-input type="text" v-model="tempGoods.en_customs_name"> </el-input>
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item label="中文报关名称">
            <el-input type="text" v-model="tempGoods.cn_customs_name"> </el-input>
          </el-form-item>

          <el-form-item label="英文报关名称">
            <el-input type="text" v-model="tempGoods.en_customs_name"> </el-input>
          </el-form-item>

          <el-form-item label="海关编码">
            <el-input type="text" v-model="tempGoods.hs_code"> </el-input>
          </el-form-item>
          <el-form-item label="分类编号">
            <el-input type="text" v-model="tempGoods.category_no"> </el-input>
          </el-form-item>
        </el-col>


        <el-col :span="6">
          <el-form-item label="标签编号">
            <el-input type="text" v-model="tempGoods.tag_no"> </el-input>
          </el-form-item>

          <el-form-item label="品牌编号">
            <el-input type="text" v-model="tempGoods.brand_no"> </el-input>
          </el-form-item>

          <el-form-item label="业务开发员">
            <el-input type="text" v-model="tempGoods.business_dev_user_no"> </el-input>
          </el-form-item>

          <el-form-item label="采购询价员">
            <el-input type="text" v-model="tempGoods.buy_qus_user_no"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="采购员">
            <el-input type="text" v-model="tempGoods.buy_user_no"> </el-input>
          </el-form-item>

          <el-form-item label="长(cm)">
            <el-input type="text" v-model="tempGoods.length"> </el-input>
          </el-form-item>

          <el-form-item label="宽(cm)">
            <el-input type="text" v-model="tempGoods.width"> </el-input>
          </el-form-item>

          <el-form-item label="高(cm)">
            <el-input type="text" v-model="tempGoods.height"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="重量(kg)">
            <el-input type="text" v-model="tempGoods.weight"> </el-input>
          </el-form-item>

          <el-form-item label="材积重/5000(L*W*H))">
            <el-input type="text" v-model="tempGoods.body_weight_5000"> </el-input>
          </el-form-item>

          <el-form-item label="材积重/6000(L*W*H))">
            <el-input type="text" v-model="tempGoods.body_weight_6000"> </el-input>
          </el-form-item>

          <el-form-item label="成本价格(分)">
            <el-input type="text" v-model="tempGoods.base_price"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="销售价格(分)">
            <el-input type="text" v-model="tempGoods.sale_price"> </el-input>
          </el-form-item>

          <el-form-item label="图片地址">
            <el-input type="text" v-model="tempGoods.pic_address"> </el-input>
          </el-form-item>

          <el-form-item label="产品描述">
            <el-input type="text" v-model="tempGoods.description"> </el-input>
          </el-form-item>

          <el-form-item label="产品简要描述">
            <el-input type="text" v-model="tempGoods.easy_discription"> </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="关键词">
            <el-input type="text" v-model="tempGoods.key_code"> </el-input>
          </el-form-item>

          <el-form-item label="商品状态">
            <el-select v-model="tempGoods.status" placeholder="请选择">
              <!--<el-option style="height:50px;" v-for="(value,key) in goodsStatusEnums" :key="key" :label="key" :value="key"></el-option>-->
              <el-option style="height:50px;"  key="1" label="待定" value="1"></el-option>
              <el-option style="height:50px;"  key="2" label="上架" value="2"></el-option>
              <el-option style="height:50px;"  key="3" label="下架" value="3"></el-option>
              <el-option style="height:50px;"  key="4" label="屏蔽" value="4"></el-option>
              <el-option style="height:50px;"  key="5" label="删除" value="5"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注">
            <el-input type="text" v-model="tempGoods.remarks"> </el-input>
          </el-form-item>
        </el-col>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createGoods">创 建</el-button>
        <el-button type="primary" v-else @click="updateGoods">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        totalCount: 0, // 分页组件--数据总条数
        list: [], // 表格的数据
        listLoading: false, // 数据加载等待动画
        listQuery: {
          pageNum: 1, // 页码
          pageRow: 50, // 每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加商品'
        },
        status: [],
        goodsStatusEnums: {},
        tempGoods: {
          id: '',
          name: '',
          cn_name: '',
          en_name: '',
          pcl_no: '',
          sku_no: '',
          other_name: '',
          cn_customs_name: '',
          en_customs_name: '',
          hs_code: '',
          category_no: '',
          tag_no: '',
          brand_no: '',
          business_dev_user_no: '',
          buy_qus_user_no: '',
          buy_user_no: '',
          length: '',
          width: '',
          height: '',
          weight: '',
          body_weight_5000: '',
          body_weight_6000: '',
          base_price: '',
          sale_price: '',
          pic_address: '',
          description: '',
          easy_discription: '',
          key_code: '',
          status: '',
          create_by: '',
          create_date: '',
          update_by: '',
          update_date: '',
          remarks: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /*
          Created By HJ on 2019-12-29 17:12:34
          function:真无语的前端框架还是我不会用
      */
      getStatusInfo(status) {
        switch (status) {
          case 1 : return '待定'
          case 2 : return '上架'
          case 3 : return '下架'
          case 4 : return '屏蔽'
          case 5 : return '删除'
        }
      },
      getList() {
        // 查询列表
        if (!this.hasPerm('goods:list')) {
          return
        }
        this.listLoading = true
        this.api({
          url: '/goods/listGoods',
          method: 'get',
          params: this.listQuery
        }).then(data => {
          console.log(data)
          this.listLoading = false
          this.list = data.list
          this.totalCount = data.totalCount
        })
      },
      getGoodsStatus() {
        this.api({
          url: '/goods/getGoodsStatus',
          method: 'get'
        }).then(data => {
          this.goodsStatusEnums = data.goodsStatusEnums
        }).catch(e => {
          console.log(e)
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
        // this.getGoodsStatus()
        // 显示新增对话框
        this.tempGoods.id =''
        this.tempGoods.name =''
        this.tempGoods.cn_name =''
        this.tempGoods.en_name =''
        this.tempGoods.pcl_no =''
        this.tempGoods.sku_no =''
        this.tempGoods.other_name =''
        this.tempGoods.cn_customs_name =''
        this.tempGoods.en_customs_name =''
        this.tempGoods.hs_code =''
        this.tempGoods.category_no =''
        this.tempGoods.tag_no =''
        this.tempGoods.brand_no =''
        this.tempGoods.business_dev_user_no =''
        this.tempGoods.buy_qus_user_no =''
        this.tempGoods.buy_user_no =''
        this.tempGoods.length =''
        this.tempGoods.width =''
        this.tempGoods.height =''
        this.tempGoods.weight =''
        this.tempGoods.body_weight_5000 =''
        this.tempGoods.body_weight_6000 =''
        this.tempGoods.base_price =''
        this.tempGoods.sale_price =''
        this.tempGoods.pic_address =''
        this.tempGoods.description =''
        this.tempGoods.easy_discription =''
        this.tempGoods.key_code =''
        this.tempGoods.status =''
        this.tempGoods.create_by =''
        this.tempGoods.create_date =''
        this.tempGoods.update_by =''
        this.tempGoods.update_date =''
        this.tempGoods.remarks =''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        // 显示修改对话框
        this.tempGoods.id = this.list[$index].id
        this.tempGoods.content = this.list[$index].content
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      createGoods() {
        /**
         * 获取用户id当做创建人
         */
        this.tempGoods.create_by = this.$store.state.user.userId

        // 保存
        this.api({
          url: '/goods/addGoods',
          method: 'post',
          data: this.tempGoods
        }).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      },
      updateGoods() {
        this.tempGoods.update_by = this.$store.state.user.userId
        // 修改文章
        this.api({
          url: '/goods/updateGoods',
          method: 'post',
          data: this.tempGoods
        }).then(() => {
          this.getList()
          this.dialogFormVisible = false
        })
      }
    }
  }
</script>
<style >
  /**
      局部修改样式输入框左边文字右对齐
   */
  .el-form--label-left .el-form-item__label {
    text-align: right;
  }
</style>
