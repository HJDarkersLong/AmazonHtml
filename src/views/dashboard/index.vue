<template>
  <div class="dashboard-container">
      <!--<img style="margin: 40px" src="/src/assets/images/welcome.jpg">-->
    <el-table :data="dashBoard"  border fit
              highlight-current-row>
      <el-table-column  align="center" label="公告" >
        <template slot-scope="scope" >
          <span v-text="dashBoard[scope.$index].content"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="170">
        <template slot-scope="scope">
          <span>{{dashBoard[scope.$index].createTime}}</span>
        </template>
      </el-table-column>
    </el-table>
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
