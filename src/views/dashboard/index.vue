<template>
  <div class="dashboard-container">
    <div style="width: 50%;margin-top:30px;margin-left: 25%;text-align: center " class="block">
      <el-carousel  height="300px">
        <el-carousel-item v-for="item in dashBoard" :key="item">
          <h2>{{ item.content }}</h2>
          <h3>{{ item.createTime }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!--<div class="block">-->
      <!--<span class="demonstration">Click 指示器触发</span>-->
      <!--<el-carousel trigger="click" height="150px">-->
        <!--<el-carousel-item v-for="item in 4" :key="item">-->
          <!--<h3>{{ item }}</h3>-->
        <!--</el-carousel-item>-->
      <!--</el-carousel>-->
    <!--</div>-->
      <!--<img style="margin: 40px" src="/src/assets/images/welcome.jpg">-->
    <!--<el-table :data="dashBoard"  border fit-->
              <!--highlight-current-row>-->
      <!--<el-table-column  align="center" label="公告" >-->
        <!--<template slot-scope="scope" >-->
          <!--<span v-text="dashBoard[scope.$index].content"> </span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="时间" width="170">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{dashBoard[scope.$index].createTime}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
  </div>
</template>
<script>
  import fecha from 'fecha'
  export default {
    name: 'dashboard',
    data() {
      return {
        dashBoard: []
      }
    },
    created() {
      this.listArticle5Count()
    },
    methods: {
      listArticle5Count() {
        this.api({
          url: '/article/listArticle5Count',
          method: 'get',
          params: this.listQuery
        }).then(data => {
          console.log(data)
          this.dashBoard = data
        })
      },
      dateFormat(row, column, cellValue, index) {
        return cellValue ? fecha.format(new Date(cellValue), 'YYYY-MM-DD hh:mm:ss') : ''
      }
    }
  }
</script>
<style>
  .el-table__body{
    height: 800px;
  }
</style>
<style>
  .el-carousel__item h2 {
    width: 80%;
    text-align: center;
    color: #475669;
    font-size: 20px;
    opacity: 0.75;
    line-height: 50px;
    margin-left: 10%;
  }
  .el-carousel__item h3 {
    text-align: center;
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
