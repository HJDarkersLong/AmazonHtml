<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate('tempGoods')" v-if="hasPerm('goods:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex">
      <el-input style="width: 150px;" :onchange="getListWithParams" v-model="queryParams.name" clearable placeholder="商品名称"></el-input>
      <el-input style="width: 150px;margin-left: 20px" v-model="queryParams.sku_no" clearable placeholder="sku货品编号"></el-input>
      <div class="block" style="width: 150px;margin-left: 20px">
        <span class="demonstration"></span>
        <el-cascader
          change-on-select
          clearable
          placeholder="分类"
          :options="eventCategoryTree"
          :show-all-levels="false"
          @change="handleChangeCascader"
          v-model="queryParams.categoryArray"
        >
        </el-cascader>
      </div>
      <el-select style="width: 150px;margin-left: 20px" v-model="queryParams.status" placeholder="商品状态">
        <el-option style="height:40px;" key="" label="无" value=""></el-option>
        <el-option style="height:40px;" key="待定" label="待定" value="1"></el-option>
        <el-option style="height:40px;" key="上架" label="上架" value="2"></el-option>
        <el-option style="height:40px;" key="下架" label="下架" value="3"></el-option>
        <el-option style="height:40px;" key="屏蔽" label="屏蔽" value="4"></el-option>
        <el-option style="height:40px;" key="删除" label="删除" value="5"></el-option>
      </el-select>
      <div class="block" style="width: 400px;margin-left: 20px">
        <!--<span class="demonstration"></span>-->
        <el-date-picker
          v-model="queryParams.timerange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="最后修改开始日期"
          end-placeholder="最后修改结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </div>
    </div>
    <br/>

    <!--信息展示-->
    <el-table  :data="list" v-loading.body="listLoading"  element-loading-text="拼命加载中" border fit
               highlight-current-row>
      <el-table-column align="center" label="序号" >
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" header-align="center" prop="pic_address" label="图片地址" >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="hover">
            <img :src="list[scope.$index].pic_address[0]" min-width="300" height="300"/>
            <img slot="reference" :src="list[scope.$index].pic_address[0]" :alt="list[scope.$index].pic_address[0]"
                 style="max-height: 200px;max-width: 200px">
          </el-popover>
          <!--<img min-width="70" height="70" :src="list[scope.$index].pic_address" class="image">-->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="商品名称" ></el-table-column>
      <el-table-column align="center" prop="sku_no" label="sku货品编号" ></el-table-column>
      <el-table-column align="center" prop="base_price" label="成本价格(分)" ></el-table-column>
      <el-table-column align="center" prop="sale_price" label="销售价格(分)" ></el-table-column>
      <el-table-column align="center" label="商品状态" >
        <template slot-scope="scope">
          {{getStatusInfo(list[scope.$index].status)}}
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormat" prop="update_date" label="更新时间"></el-table-column>
      <el-table-column align="center" label="管理"  v-if="hasPerm('goods:update')">
        <template slot-scope="scope">
          <el-button type="info" @click="showInfo(scope.$index,'tempGoods')">查看</el-button>
          <el-button type="primary" style="margin-top:5px;margin-left: 0px" @click="showUpdate(scope.$index,'tempGoods')">修改</el-button>
        </template>
      </el-table-column>
      <!--注释其他参数展示-->
      <!--<el-table-column align="center" prop="cn_name" label="中文名称" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="en_name" label="英文名称" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="pcl_no" label="pcl商品编号" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="other_name" label="别名" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="cn_customs_name" label="中文报关名称" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="en_customs_name" label="英文报关名称" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="hs_code" label="海关编码" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="category_no" label="分类编号" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="tag_no" label="标签编号" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="brand_no" label="品牌编号" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="business_dev_user_no" label="业务开发员" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="buy_qus_user_no" label="采购询价员" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="buy_user_no" label="采购员" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="length" label="长(cm)" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="width" label="宽(cm)" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="height" label="高(cm)" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" label="长宽高" width="145%">
        <template slot-scope="scope">
          ({{(list[scope.$index].length)}})x({{(list[scope.$index].width)}})x({{(list[scope.$index].height)}})
        </template>
      </el-table-column>-->

      <!--<el-table-column align="center" prop="weight" label="重量(kg)" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="body_weight_5000" label="材积重/5000(L*W*H))" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="body_weight_6000" label="材积重/6000(L*W*H))" width="70%"></el-table-column>-->

      <!--<el-table-column align="center" prop="description" label="产品描述" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" prop="easy_discription" label="产品简要描述" width="70%"></el-table-column>-->
      <!--<el-table-column align="center" prop="key_code" label="关键词" width="70%"></el-table-column>-->

      <!--<el-table-column align="center" prop="create_by" label="创建人" style="width: 60px;"></el-table-column>-->
      <!--<el-table-column align="center" :formatter="dateFormat" prop="create_date" label="创建时间"></el-table-column>-->
      <!--<el-table-column align="center" prop="update_by" label="更新人" style="width: 60px;"></el-table-column>-->


      <!--<el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.update_date}}</span>
        </template>
      </el-table-column>-->

    </el-table>

    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!--编辑和详情页面-->
    <el-dialog :title="textMap[dialogStatus]" width="85%" :visible.sync="dialogFormVisible">
      <!--分类弹框-->
      <el-dialog
        lazy
        width="30%"
        title="选择分类"
        :visible.sync="sortVisible"
        append-to-body>
        <el-aside width="300px" style="padding: 15px">
          <!--check-strictly   父节点不相关联子节点-->
          <!--@check-change="handleClick"  当前节点变化时处理事件-->
          <el-tree
            show-checkbox
            ref="eventCategoryTree"
            :data="eventCategoryTree"
            node-key="id"
            highlight-current
            default-expand-all
            check-strictly
            :expand-on-click-node="false"
            @check-change="checkChange" >
          </el-tree>

        </el-aside>
        <el-button @click="getCheckedNodes">确定</el-button>
      </el-dialog>
      <el-form class="small-space" :rules="rules" ref="tempGoods" :model="tempGoods" label-position="left" label-width="150px"
               style='display:flex;flex-wrap:wrap;width: 85%; margin-left:50px;'>
        <!--第一列-->
        <el-col :span="6">
          <el-form-item label=" 商品名称：" prop="name">
            <el-input :readonly="inputReadOnly" type="text" aria-required="true" v-model="tempGoods.name"></el-input>
          </el-form-item>

          <el-form-item label=" 中文名称：" prop="cn_name">
            <el-input :readonly="inputReadOnly" type="text" aria-required="true" v-model="tempGoods.cn_name"></el-input>
          </el-form-item>

          <el-form-item label="sku货品编号：" prop="sku_no">
            <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.sku_no"></el-input>
          </el-form-item>

          <el-form-item label="中文报关名称：" prop="cn_customs_name">
            <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.cn_customs_name"></el-input>
          </el-form-item>

          <el-form-item label="英文报关名称：" prop="en_customs_name">
            <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.en_customs_name"></el-input>
          </el-form-item>

          <el-form-item label="海关编码：" prop="hs_code">
            <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.hs_code"></el-input>
          </el-form-item>

          <el-form-item label="分类：" prop="category_name">
            <div style="display: flex;">
              <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.category_name"></el-input>
              <el-button type="primary" :disabled = inputReadOnly  @click="sortVisible = true">选择</el-button>
            </div>

          </el-form-item>

          <el-form-item label="重量(kg)：" prop="weight">
            <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.weight"></el-input>
          </el-form-item>

          <el-form-item label="关键词：" prop="key_code">
            <el-input :readonly="inputReadOnly"  type="text" aria-required="true" v-model="tempGoods.key_code"></el-input>
          </el-form-item>
        </el-col>

        <!--第二列-->
        <el-col :span="6">
          <el-form-item label="商品状态：">
            <el-select  :disabled = inputReadOnly  v-model="tempGoods.status" placeholder="请选择">
              <!--<el-option style="height:50px;" v-for="(value,key) in goodsStatusEnums" :key="key" :label="key" :value="key"></el-option>-->
              <el-option v-for="item in goodsStatusEnums" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品描述：" prop="description">
            <el-input :readonly="inputReadOnly"  type="textarea" rows="4" v-model="tempGoods.description"></el-input>
          </el-form-item>

          <el-form-item  v-for="(domain, index) in tempGoods.domains" :label="'链接' + (index+1)" :key="domain.key" :prop="'domains.' + index + '.value'" >
            <div style="display: flex">
              <el-input type="url" :readonly="inputReadOnly"  style="font-size: 9px" v-model="domain.value"></el-input><i class="el-icon-delete" v-if="dialogStatus=='update' || dialogStatus=='create'" @click.prevent="removeDomain(domain) "></i>
            </div>

          </el-form-item>

          <el-form-item>
            <!--<el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>-->
            <el-button   v-if="dialogStatus=='update' || dialogStatus=='create'"  @click="addDomain">新增采购链接</el-button>
            <!--<el-button @click="resetForm('dynamicValidateForm')">重置</el-button>-->
          </el-form-item>



        </el-col>

        <!--第三列-->
        <el-col :span="6">

          <el-form-item label="英文名称：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.en_name"></el-input>
          </el-form-item>
          <el-form-item label="标签编号：">
            <el-input :readonly="inputReadOnly" type="text" v-model="tempGoods.tag_no"></el-input>
          </el-form-item>

          <el-form-item label="品牌编号：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.brand_no"></el-input>
          </el-form-item>

          <el-form-item label="业务开发员：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.business_dev_user_no"></el-input>
          </el-form-item>

          <el-form-item label="采购询价员：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.buy_qus_user_no"></el-input>
          </el-form-item>

          <el-form-item label="采购员：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.buy_user_no"></el-input>
          </el-form-item>

          <el-form-item label="长(cm)：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.length"></el-input>
          </el-form-item>

          <el-form-item label="宽(cm)：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.width"></el-input>
          </el-form-item>

          <el-form-item label="高(cm)：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.height"></el-input>
          </el-form-item>



        </el-col>

        <!--第四列-->

        <el-col :span="6">




          <el-form-item label="pcl商品编号：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.pcl_no"></el-input>
          </el-form-item>



          <el-form-item label="  别名：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.other_name"></el-input>
          </el-form-item>

          <el-form-item label="材积重(L*W*H)/5000">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.body_weight_5000"></el-input>
          </el-form-item>

          <el-form-item label="材积重(L*W*H)/6000">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.body_weight_6000"></el-input>
          </el-form-item>

          <el-form-item label="成本价格(分)：">
            <el-input :readonly="inputReadOnly"  type="number" v-model="tempGoods.base_price"></el-input>
          </el-form-item>

          <el-form-item label="销售价格(分)：">
            <el-input :readonly="inputReadOnly"  type="text" v-model="tempGoods.sale_price"></el-input>
          </el-form-item>



          <el-form-item label="备注：">
            <el-input :readonly="inputReadOnly"  type="textarea" rows="4" placeholder="请输入内容" :rows="2" v-model="tempGoods.remarks"></el-input>
          </el-form-item>

          <el-form-item label="产品简要描述：">
            <el-input :readonly="inputReadOnly"  type="textarea" rows="4" v-model="tempGoods.easy_discription"></el-input>
          </el-form-item>




          <!-- <el-form-item prop="email" label="渠道链接"   >
             <el-input v-model="tempGoods.channel_links"></el-input>v-if="dialogStatus=='create'
           </el-form-item>-->



        </el-col>

        <el-form-item  label="图片地址：">
          <!--<el-input type="text" v-model="tempGoods.pic_address"> </el-input>-->
          <el-upload
            accept="image/jpeg,image/gif,image/png"
            action="/api/upload/uploadPic"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            :file-list="this.usedImageInfo"
          >
            <i v-if="dialogStatus=='update' || dialogStatus=='create'" class="el-icon-plus"></i>
          </el-upload>
          <el-dialog  :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" v-if="dialogStatus=='create' || dialogStatus=='update'">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="createLoading" type="success" @click="createGoods('tempGoods')">创 建</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="updateGoods('tempGoods')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import fecha from 'fecha'
  import { Message } from 'element-ui'
  export default {
    data() {
      return {
        selectedOptions: [], // 下拉筛选框
        treeTemp: 0, // 编辑选择分类的时候，计数
        eventCategoryTree: [ ], // 分类组件的树
        createLoading: false,
        inputReadOnly: true, // 是否允许修改，查看和修改时使用
        queryParams: {},
        usedImageInfo: [],
        dialogImageUrl: '', // 图片上传相关
        dialogVisible: false, // 图片上传相关
        totalCount: 0, // 分页组件--数据总条数
        list: [], // 表格的数据
        listLoading: false, // 数据加载等待动画
        listQuery: {
          pageNum: 1, // 页码
          pageRow: 50, // 每页条数
          name: '',
          sku_no: '',
          status: '',
          beginTime: '',
          endTime: '',
          categoryArray: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        sortVisible: false,
        textMap: {
          update: '编辑',
          create: '添加商品',
          info: '查看'
        },
        status: [],
        goodsStatusEnums: [{
          value: '1',
          label: '待定'
        }, {
          value: '2',
          label: '上架'
        }, {
          value: '3',
          label: '下架'
        }, {
          value: '4',
          label: '屏蔽'
        }, {
          value: '5',
          label: '删除'
        }],
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
          category_name: '',
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
          pic_address: [],
          description: '',
          easy_discription: '',
          key_code: '',
          status: '',
          create_by: '',
          create_date: '',
          update_by: '',
          update_date: '',
          remarks: '',
          channel_links: '',
          domains: [{
            value: ''
          }]
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          cn_name: [
            { required: true, message: '请输入中文名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          sku_no: [
            { required: true, message: '请输入sku货品编号', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          cn_customs_name: [
            { required: true, message: '请输入中文报关名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          en_customs_name: [
            { required: true, message: '请输入英文报关名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          hs_code: [
            { required: true, message: '请输入海关编码', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          category_no: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          weight: [
            { required: true, message: '请输入重量', trigger: 'blur' }
          ],
          key_code: [
            { required: true, message: '请输入关键词', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ]
        },
        // 日期控件相关参数
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    watch: {
      queryParams: {
        handler: function () {
          this.listQuery.name = this.queryParams.name
          this.listQuery.sku_no = this.queryParams.sku_no
          this.listQuery.status = this.queryParams.status
          this.listQuery.categoryArray = this.queryParams.catrgoryArray
          if (this.queryParams.timerange) {
            this.listQuery.beginTime = this.queryParams.timerange[0]
            this.listQuery.endTime = this.queryParams.timerange[1]
          } else {
            this.listQuery.beginTime = ''
            this.listQuery.endTime = ''
          }
          this.getList()
        },
        deep: true
      }
    },
    created() {
      this.getList()
      this.getSortList()
    },
    methods: {
      // 筛选下拉框的change事件
      handleChangeCascader(value) {
        console.log(value)
        this.queryParams.catrgoryArray = value + ''
      },
      checkChange(data, checked, node) {
        this.treeTemp++
        if (this.treeTemp%2 === 0) {
          if (checked) {
            this.$refs.eventCategoryTree.setCheckedNodes([])
            this.$refs.eventCategoryTree.setCheckedNodes([data])

            // 交叉点击节点
          } else {
            this.$refs.eventCategoryTree.setCheckedNodes([])
            // 点击已经选中的节点，置空
          }
        }
      },
      getCheckedNodes() {
        console.log('获取节点')
        console.log(this.$refs.eventCategoryTree.getCheckedNodes())
        this.tempGoods.category_no = this.$refs.eventCategoryTree.getCheckedNodes()[0].id
        this.tempGoods.category_name = this.$refs.eventCategoryTree.getCheckedNodes()[0].label
        console.log('分类编号：'+ this.tempGoods.category_no + '分类名称：' + this.tempGoods.category_name)
        this.sortVisible = false
      },
      addDomain() {
        if (this.tempGoods.domains.length <5) {
          this.tempGoods.domains.push({
            value: ''
          })
        } else {
          alert('渠道链接个数过多！')
        }
      },
      removeDomain(item) {
        var index = this.tempGoods.domains.indexOf(item)
        if (index !== -1) {
          this.tempGoods.domains.splice(index, 1)
        }
      },
      /*
          Created By HJ on 2019-12-29 17:12:34
          function:真无语的前端框架还是我不会用
      */
      getStatusInfo(status) {
        switch (status) {
          case 1 :
            return '待定'
          case 2 :
            return '上架'
          case 3 :
            return '下架'
          case 4 :
            return '屏蔽'
          case 5 :
            return '删除'
        }
      },
      /*
          Created By HJ on 2019-30-18 14:30:39
          function : 获取分类列表
      */
      getSortList() {
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
      /*
          Created By HJ on 2019-42-09 09:42:17
          function: 直接查询，不带筛选条件
      */
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
      getListWithParams(val) {
        // 查询列表
        if (!this.hasPerm('goods:list')) {
          return
        }
        this.listLoading = true
        this.api({
          url: '/goods/listGoodsWithParams',
          method: 'get',
          params: [this.listQuery, val]
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
      showCreate(tempGoods) {
        this.inputReadOnly = false // 设置input框可以输入
        this.createLoading = false
        // this.getGoodsStatus()
        // 显示新增对话框
        this.usedImageInfo=[]
        this.tempGoods.id = ''
        this.tempGoods.name = ''
        this.tempGoods.cn_name = ''
        this.tempGoods.en_name = ''
        this.tempGoods.pcl_no = ''
        this.tempGoods.sku_no = ''
        this.tempGoods.other_name = ''
        this.tempGoods.cn_customs_name = ''
        this.tempGoods.en_customs_name = ''
        this.tempGoods.hs_code = ''
        this.tempGoods.category_no = ''
        this.tempGoods.category_name = ''
        this.tempGoods.tag_no = ''
        this.tempGoods.brand_no = ''
        this.tempGoods.business_dev_user_no = ''
        this.tempGoods.buy_qus_user_no = ''
        this.tempGoods.buy_user_no = ''
        this.tempGoods.length = 0
        this.tempGoods.width = 0
        this.tempGoods.height = 0
        this.tempGoods.weight = 0
        this.tempGoods.body_weight_5000 = 0
        this.tempGoods.body_weight_6000 = 0
        this.tempGoods.base_price = 0
        this.tempGoods.sale_price = 0
        this.tempGoods.pic_address = []
        this.tempGoods.domains=[]
        this.tempGoods.description = ''
        this.tempGoods.easy_discription = ''
        this.tempGoods.key_code = ''
        this.tempGoods.status = ''
        this.tempGoods.create_by = ''
        this.tempGoods.create_date = ''
        this.tempGoods.update_by = ''
        this.tempGoods.update_date = ''
        this.tempGoods.remarks = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // this.$refs[tempGoods].validate((valid) => {})
      },
      showInfo($index, tempGoods) {
        // 显示详情对话框
        this.inputReadOnly = true // 设置input框不可输入
        this.goodsInfo($index)
        this.usedImageInfo=[]
        // 为了解决pic_address字段这个数组只有一个元素而且是空字符的情况
        if (this.list[$index].pic_address.length ===0 ||
          (this.list[$index].pic_address.length === 1 && this.list[$index].pic_address[0]==='')) {

        } else {
          for (let i=0; i<this.list[$index].pic_address.length; i++) {
            this.usedImageInfo.push({ name: '图片', url: this.list[$index].pic_address[i] })
          }
        }
        this.dialogStatus = 'info'
        this.dialogFormVisible = true
        this.$refs[tempGoods].validate((valid) => {})
      },
      showUpdate($index, tempGoods) {
        this.inputReadOnly = false // 设置input框可以输入
        // 展示修改对话框
        this.usedImageInfo=[]
        this.goodsInfo($index)
        // 为了解决pic_address字段这个数组只有一个元素而且是空字符的情况
        if (this.list[$index].pic_address.length ===0 ||
          (this.list[$index].pic_address.length === 1 && this.list[$index].pic_address[0]==='')) {
        } else {
          for (let i=0; i<this.list[$index].pic_address.length; i++) {
            this.usedImageInfo.push({ name: '图片', url: this.list[$index].pic_address[i] })
          }
        }
        this.tempGoods.id = this.list[$index].id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$refs[tempGoods].validate((valid) => {})
      },
      goodsInfo($index) {
        this.tempGoods.id = this.list[$index].id
        this.tempGoods.name = this.list[$index].name
        this.tempGoods.cn_name = this.list[$index].cn_name
        this.tempGoods.en_name = this.list[$index].en_name
        this.tempGoods.pcl_no = this.list[$index].pcl_no
        this.tempGoods.sku_no = this.list[$index].sku_no
        this.tempGoods.other_name = this.list[$index].other_name
        this.tempGoods.cn_customs_name = this.list[$index].cn_customs_name
        this.tempGoods.en_customs_name = this.list[$index].en_customs_name
        this.tempGoods.hs_code = this.list[$index].hs_code
        this.tempGoods.category_no = this.list[$index].category_no
        this.tempGoods.category_name = this.list[$index].category_name
        this.tempGoods.tag_no = this.list[$index].tag_no
        this.tempGoods.brand_no = this.list[$index].brand_no
        this.tempGoods.business_dev_user_no = this.list[$index].business_dev_user_no
        this.tempGoods.buy_qus_user_no = this.list[$index].buy_qus_user_no
        this.tempGoods.buy_user_no = this.list[$index].buy_user_no
        this.tempGoods.length = this.list[$index].length
        this.tempGoods.width = this.list[$index].width
        this.tempGoods.height = this.list[$index].height
        this.tempGoods.weight = this.list[$index].weight
        this.tempGoods.body_weight_5000 = this.list[$index].body_weight_5000
        this.tempGoods.body_weight_6000 = this.list[$index].body_weight_6000
        this.tempGoods.base_price = this.list[$index].base_price
        this.tempGoods.sale_price = this.list[$index].sale_price
        this.tempGoods.pic_address = this.list[$index].pic_address
        this.tempGoods.description = this.list[$index].description
        this.tempGoods.easy_discription = this.list[$index].easy_discription
        this.tempGoods.key_code = this.list[$index].key_code
        this.tempGoods.status = parseInt(this.list[$index].status)
        this.tempGoods.create_by = this.list[$index].create_by
        this.tempGoods.create_date = this.list[$index].create_date
        this.tempGoods.update_by = this.list[$index].update_by
        this.tempGoods.update_date = this.list[$index].update_date
        this.tempGoods.remarks = this.list[$index].remarks
        this.tempGoods.domains = this.list[$index].domains
      },
      createGoods(tempGoods) {
        this.$refs[tempGoods].validate((valid) => {
          if (valid) {
            /**
             * 获取用户id当做创建人
             */
            this.createLoading = true
            this.tempGoods.create_by = this.$store.state.user.userId
            // 保存
            this.api({
              url: '/goods/addGoods',
              method: 'post',
              data: this.tempGoods
            }).then((msg) => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            })
            this.createLoading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      updateGoods(tempGoods) {
        this.$refs[tempGoods].validate((valid) => {
          if (valid) {
            this.tempGoods.update_by = this.$store.state.user.userId
            // 修改文章
            this.api({
              url: '/goods/updateGoods',
              method: 'post',
              data: this.tempGoods
            }).then(() => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.getList()
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 处理图片上传插件
      handleRemove(file, fileList) {
        this.tempGoods.pic_address = []
        console.log(file, fileList)
        for (let i=0; i<fileList.length; i++) {
          this.tempGoods.pic_address.push(fileList[i].url)
        }
        console.log(this.tempGoods.pic_address)
      },
      handlePictureCardPreview(file) {
        // this.dialogImageUrl = file.url
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      uploadSuccess: function (response, file, fileList) {
        console.log('上传文件成功response' + response)
        console.log('上传文件成功file' + file)
        console.log('上传文件成功fileList' + fileList)
        // response：即为后端传来的数据，这里我返回的是图片的路径
        if (this.tempGoods.pic_address.length === 0 ||
          (this.tempGoods.pic_address.length === 1 && this.tempGoods.pic_address[0]==='')) {
          this.tempGoods.pic_address = response
        } else {
          this.tempGoods.pic_address = this.tempGoods.pic_address + ',' + response
        }
      },
      dateFormat(row, column, cellValue, index) {
        return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD HH:mm:ss') : ''
      }
    }
  }
</script>
<style>
  /**
      局部修改样式输入框左边文字右对齐
   */
  .el-form--label-left .el-form-item__label {
    text-align: right;
  }
  .el-upload--picture-card{
    border: 0px dashed #c0ccda;
  }
  /*解决编辑页面图片放大遮罩问题*/
  .v-modal {
    z-index: 2000 !important;
  }
  /*弹窗弹出显示在靠上方位置*/
  .el-dialog{
    margin-top: auto !important;
  }
  /*采购链接删除标志的垂直显示*/
  .el-icon-delete{
    line-height: 40px;
  }
</style>
