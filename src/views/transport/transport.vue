<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate('tempTransport')" v-if="hasPerm('transport:add')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex">
      <div class="country" style="position: relative">
        <el-input style="width: 150px;" @focus="showCountryDialog" @blur="hideCountryDialog" v-model="queryParams.name"
                  clearable placeholder="国家名称"></el-input>
        <div class="country-components" v-if="showCountry" style="width: 800px">
          <ul class="filter-tabar clearfix">
            <li
              style="text-align: center; padding: 0 14px ;float: left;padding-bottom: 14px; margin: 0 8px; margin-bottom: -1px; position: relative"
              v-for="(item,index) in countryListKey" :class="{active:upCountryListIndex==index}"
              @mouseover="upCountryListKey(index)">{{item}}
            </li>
          </ul>
          <div class="city-content">
            <ul v-for="item in upCountryList" class="clearfix">
              <label>{{item.ckey}}</label>
              <li v-for="ritem in item.countryList" @click="selectDepCity(ritem)">{{ritem.airportName}}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="block" style="width: 150px;margin-left: 20px">
        <span class="demonstration"></span>

      </div>
      <el-select style="width: 150px;margin-left: 20px" v-model="queryParams.status" placeholder="商品状态">
        <el-option style="height:40px;" key="" label="无" value=""></el-option>
        <el-option style="height:40px;" key="待定" label="待定" value="1"></el-option>
        <el-option style="height:40px;" key="上架" label="上架" value="2"></el-option>
        <el-option style="height:40px;" key="下架" label="下架" value="3"></el-option>
        <el-option style="height:40px;" key="屏蔽" label="屏蔽" value="4"></el-option>
        <el-option style="height:40px;" key="删除" label="删除" value="5"></el-option>
      </el-select>
    </div>
      <br/>

      <!--信息展示-->
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
                highlight-current-row>
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="contryName" label="国家名称"></el-table-column>
        <el-table-column align="center" prop="minWeight" label="最小重量/kg"></el-table-column>
        <el-table-column align="center" prop="maxWeight" label="最大重量/kg"></el-table-column>
        <el-table-column align="center" prop="operCost" label="操作费/票"></el-table-column>
        <el-table-column align="center" prop="freightPrice" label="运费单价/kg"></el-table-column>
        <el-table-column align="center" prop="transTypeid" label="运输方式id"></el-table-column>
        <el-table-column align="center" prop="serviceDay" label="送达天数"></el-table-column>
        <el-table-column align="center" prop="TrackFlag" label="跟踪"></el-table-column>
        <el-table-column align="center" :formatter="dateFormat" prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column align="center" label="商品状态">
          <template slot-scope="scope">
            {{getStatusInfo(list[scope.$index].status)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理" v-if="hasPerm('goods:update')">
          <template slot-scope="scope">
            <el-button type="info" @click="showInfo(scope.$index,'tempGoods')">查看</el-button>
            <el-button type="primary" style="margin-top:5px;margin-left: 0px"
                       @click="showUpdate(scope.$index,'tempGoods')">修改
            </el-button>
          </template>
        </el-table-column>

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
        <el-form class="small-space" :rules="rules" ref="tempTransport" :model="tempTransport" label-position="left"
                 label-width="150px"
                 style='display:flex;flex-wrap:wrap;width: 85%; margin-left:50px;'>
          <!--第一列-->
          <el-col :span="6">
            <el-form-item label=" 商品名称：" prop="name">
              <el-input :readonly="inputReadOnly" type="text" aria-required="true"
                        v-model="tempTransport.name"></el-input>
            </el-form-item>

            <el-form-item label=" 中文名称：" prop="cn_name">
              <el-input :readonly="inputReadOnly" type="text" aria-required="true"
                        v-model="tempTransport.cn_name"></el-input>
            </el-form-item>
          </el-col>

          <!--第二列-->
          <el-col :span="6">
            <el-form-item label="商品状态：">
              <el-select :disabled=inputReadOnly v-model="tempTransport.status" placeholder="请选择">
                <!--<el-option style="height:50px;" v-for="(value,key) in goodsStatusEnums" :key="key" :label="key" :value="key"></el-option>-->
                <el-option v-for="item in goodsStatusEnums" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品描述：" prop="description">
              <el-input :readonly="inputReadOnly" type="textarea" rows="4"
                        v-model="tempTransport.description"></el-input>
            </el-form-item>
          </el-col>

          <!--第三列-->
          <el-col :span="6">

            <el-form-item label="英文名称：">
              <el-input :readonly="inputReadOnly" type="text" v-model="tempTransport.en_name"></el-input>
            </el-form-item>
            <el-form-item label="标签编号：">
              <el-input :readonly="inputReadOnly" type="text" v-model="tempTransport.tag_no"></el-input>
            </el-form-item>

          </el-col>

          <!--第四列-->

          <el-col :span="6">

            <el-form-item label="pcl商品编号：">
              <el-input :readonly="inputReadOnly" type="text" v-model="tempTransport.pcl_no"></el-input>
            </el-form-item>
            <el-form-item label="  别名：">
              <el-input :readonly="inputReadOnly" type="text" v-model="tempTransport.other_name"></el-input>
            </el-form-item>

          </el-col>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" v-if="dialogStatus=='create' || dialogStatus=='update'">取 消
          </el-button>
          <el-button v-if="dialogStatus=='create'" :loading="createLoading" type="success"
                     @click="createGoods('tempTransport')">创 建
          </el-button>
          <el-button v-if="dialogStatus=='update'" type="primary" @click="updateGoods('tempTransport')">修 改</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import fecha from 'fecha'
  import countryData from './country'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        upCountryList: [],
        showCountry: false,
        selectedOptions: [], // 下拉筛选框
        createLoading: false,
        inputReadOnly: true, // 是否允许修改，查看和修改时使用
        queryParams: {},
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
        tempTransport: {
          id: '',
          contryName: '',
          minWeight: '',
          maxWeight: '',
          operCost: '',
          freightPrice: '',
          transTypeid: '',
          serviceDay: '',
          TrackFlag: '',
          updateTime: '',
          createTime: '',
          status: '',
          memo: '',
          domains: [{
            value: ''
          }]
        },
        rules: {
          contryName: [
            { required: true, message: '请输入国家名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          minWeight: [
            { required: true, message: '请输入最小重量/kg', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          maxWeight: [
            { required: true, message: '请输入最大重量/kg', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          operCost: [
            { required: true, message: '请输入操作费/票', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          freightPrice: [
            { required: true, message: '请输入运费单价/kg', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          transTypeid: [
            { required: true, message: '请输入运输方式', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          TrackFlag: [
            { required: true, message: '是否可以跟踪', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      this.countryListKey = ['热门城市', 'ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRSTU', 'VWYZ', '港澳台']
      this.countryList = countryData
    },
    methods: {
      upCountryListKey(index) {
        this.upCountryListIndex = index
        this.upCountryList = this.countryList[index]
        console.log(this.upCountryList)
      },
      hideCountryDialog() {
        this.showCountry = false
      },
      showCountryDialog() {
        this.showCountry = true
      },
      // 筛选下拉框的change事件
      handleChangeCascader(value) {
        debugger
        console.log(value)
        this.queryParams.catrgoryArray = value + ''
      },
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
      showCreate(tempTransport) {
        this.inputReadOnly = false // 设置input框可以输入
        this.createLoading = false
        // this.getGoodsStatus()
        // 显示新增对话框
        this.usedImageInfo = []
        this.tempTransport.id = ''
        this.tempTransport.contryName = ''
        this.tempTransport.minWeight = ''
        this.tempTransport.maxWeight = ''
        this.tempTransport.operCost = ''
        this.tempTransport.freightPrice = ''
        this.tempTransport.transTypeid = ''
        this.tempTransport.serviceDay = ''
        this.tempTransport.TrackFlag = ''
        this.tempTransport.updateTime = ''
        this.tempTransport.createTime = ''
        this.tempTransport.status = ''
        this.tempTransport.memo = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      showInfo($index, tempGoods) {
        // 显示详情对话框
        this.inputReadOnly = true // 设置input框不可输入
        this.goodsInfo($index)
        this.usedImageInfo = []
        // 为了解决pic_address字段这个数组只有一个元素而且是空字符的情况
        if (this.list[$index].pic_address.length === 0 ||
          (this.list[$index].pic_address.length === 1 && this.list[$index].pic_address[0] === '')) {

        } else {
          for (let i = 0; i < this.list[$index].pic_address.length; i++) {
            this.usedImageInfo.push({ name: '图片', url: this.list[$index].pic_address[i] })
          }
        }
        this.dialogStatus = 'info'
        this.dialogFormVisible = true
        this.$refs[tempGoods].validate((valid) => {
        })
      },
      showUpdate($index, tempGoods) {
        this.inputReadOnly = false // 设置input框可以输入
        // 展示修改对话框
        this.usedImageInfo = []
        this.goodsInfo($index)
        // 为了解决pic_address字段这个数组只有一个元素而且是空字符的情况
        if (this.list[$index].pic_address.length === 0 ||
          (this.list[$index].pic_address.length === 1 && this.list[$index].pic_address[0] === '')) {
        } else {
          for (let i = 0; i < this.list[$index].pic_address.length; i++) {
            this.usedImageInfo.push({ name: '图片', url: this.list[$index].pic_address[i] })
          }
        }
        this.tempGoods.id = this.list[$index].id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$refs[tempGoods].validate((valid) => {
        })
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
      dateFormat(row, column, cellValue, index) {
        return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD HH:mm:ss') : ''
      }
    }
  }
</script>
<style>
  .country {
    position: relative;
  }

  .country-components {
    z-index: 1;
    position: absolute;
    width: 400px;
    /*height: 200px;*/
    box-shadow: 0 0 4px 0 rgba(117, 117, 117, 0.5);
    border-radius: 2px;
    padding: 20px 21px;
    background-color: white;
  }

  .clearfix {

  &
  :after {
    content: '';
    display: block;
    clear: both;
  }

  }
  li {
    list-style: none;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  .filter-tabar {
    border-bottom: 1px solid #d7d7d7;
    cursor: pointer;

  li {
    text-align: center;
    padding: 0 14px;
    float: left;
    padding-bottom: 14px;
    font-size: 14px;
    margin: 0 8px;
    margin-bottom: -1px;
    position: relative;

  &
  .active {
    border-bottom: 1px solid #ff7362;
  }

  }
  }
  /**
      局部修改样式输入框左边文字右对齐
   */
  .el-form--label-left .el-form-item__label {
    text-align: right;
  }

  .el-upload--picture-card {
    border: 0px dashed #c0ccda;
  }

  /*弹窗弹出显示在靠上方位置*/
  .el-dialog {
    margin-top: auto !important;
  }
</style>
