<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <!--<el-form-item>-->
        <!--<el-button type="primary" icon="plus" @click="showCreate('tempTransport')" v-if="hasPerm('transport:add')">添加-->
        <!--</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div style="display: flex">
      <!--<div class="country" style="position: relative">-->
      <!--<el-input style="width: 150px;" @focus="showCountryDialog" @blur="hideCountryDialog" v-model="queryParams.name"-->
      <!--clearable placeholder="国家名称"></el-input>-->
      <!--<div class="country-components" v-if="showCountry" style="width: 800px">-->
      <!--<ul class="filter-tabar clearfix">-->
      <!--<li-->
      <!--style="text-align: center; padding: 0 14px ;float: left;padding-bottom: 14px; margin: 0 8px; margin-bottom: -1px; position: relative"-->
      <!--v-for="(item,index) in countryListKey" :class="{active:upCountryListIndex==index}"-->
      <!--@mouseover="upCountryListKey(index)">{{item}}-->
      <!--</li>-->
      <!--</ul>-->
      <!--<div class="city-content">-->
      <!--<ul v-for="item in upCountryList" class="clearfix">-->
      <!--<label>{{item.ckey}}</label>-->
      <!--<li v-for="item in item.countryList" @click="selectDepCity(item)">{{item.airportName}}</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->

      <!--<div class="block" style="width: 150px;margin-left: 20px">
        <span class="demonstration"></span>

      </div>-->
      <el-input style="width: 150px;;margin-left: 20px"   v-model="queryParams.contry_name"
                clearable placeholder="国家"></el-input>
      <el-input style="width: 150px;;margin-left: 20px"   v-model="queryParams.weight"
        clearable placeholder="重量/kg"></el-input>
      <el-button type="primary" icon="plus" style="margin-left: 20px" @click="queryTransportCost" >查询 </el-button>
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
      <el-table-column align="center" prop="contry_name" label="国家名称"></el-table-column>
      <el-table-column align="center" prop="freight_price" label="运费单价(元)"></el-table-column>
      <el-table-column align="center" prop="oper_cost" label="操作费(元)/票"></el-table-column>
      <el-table-column align="center" prop="transPrice" label="运费总价(元)"></el-table-column>
      <el-table-column align="center" label="运输方式">
        <template slot-scope="scope"  >
          {{getTrabsType(list[scope.$index].trans_type_id)}}
        </template>
      </el-table-column>
      <el-table-column align="center"  label="跟踪">
        <template slot-scope="scope"  >
          {{(list[scope.$index].track_flag == 1 ? '是':'否')}}
        </template>
      </el-table-column>
      <el-table-column align="center" :formatter="dateFormat" prop="update_time" label="更新时间"></el-table-column>

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

  </div>
</template>
<script>
  import fecha from 'fecha'
  import countryData from './country'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        transportCostList: {}, // 运费试算结果
        transTypeList: {}, // 物流种类list
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
          contry_name: '',
          min_weight: '',
          max_weight: '',
          oper_cost: '',
          freight_price: '',
          trans_type_id: '',
          service_day: '',
          Track_flag: '',
          update_time: '',
          create_time: '',
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
      this.getTransTypeList()
    },
    mounted() {
      this.countryListKey = ['热门城市', 'ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRSTU', 'VWYZ', '港澳台']
      this.countryList = countryData
    },
    methods: {
      queryTransportCost () {
        this.listQuery.contry_name = this.queryParams.contry_name
        this.listQuery.weight = this.queryParams.weight
        if (!this.listQuery.contry_name || !this.listQuery.contry_name) {
          alert('请输入重量和国家后计算~')
          return
        }
        this.api({
          url: '/transport/findTransBaseList',
          method: 'get',
          params: this.listQuery
        }).then(data => {
          console.log(data)
          this.list = data.list
          this.totalCount = data.totalCount
        })
      },
      // 获取物流名字
      getTrabsType (transId) {
        for (let i = 0; i<this.transTypeList.length; i++) {
          if (this.transTypeList[i].id === transId) {
            return this.transTypeList[i].name
          }
        }
      },
      // 获取物流种类list
      getTransTypeList() {
        // 查询列表
        if (!this.hasPerm('goods:list')) {
          return
        }
        this.api({
          url: '/transport/listAllTransType',
          method: 'get',
          params: this.listQuery
        }).then(data => {
          console.log('获取物流种类')
          console.log(data)
          this.transTypeList = data
          this.totalCount = data.totalCount
        })
      },
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
          url: '/transport/listTransport',
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
