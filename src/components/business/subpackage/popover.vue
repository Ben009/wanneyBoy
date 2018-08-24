<template>
  <el-popover trigger="hover" placement="bottom">
    <div>
      <el-table :max-height="QJTableMaxHeight"
        :data="tableData"
        border
        style="width: 100%">

        <el-table-column
          v-for="item in columnsInfo"
          :prop="item.nameCode"
          :label="item.title">
        </el-table-column>

      </el-table>
    </div>
    <div slot="reference" class="name-wrapper">
      <span ref="refer" @click="doSomethingElse(rowInfo)">{{rowInfo[showContent]}}</span>
    </div>
  </el-popover>
</template>
<script>
  import {ajaxRequest} from '../../util/base'
  export default{
    name:'popover',
    props:{
      rowInfo:{required:true,type:Object},  //当前行数据
      sqlName:{required:true},               //后台查询需信息
      sqlSeg:{required:true},               //后台查询需信息
      url:{required:true,type:String},      //查询url
      columnsInfo:{required:true,type:Array}, //展示表格的信息
      showContent:{required:true},
    },
    data(){
      return{
        tableData:[]
      }
    },
    methods:{
      doSomethingElse(value){
        this.$emit('doSomethingElse',value);
      }
    },
    mounted(){
      // ajaxRequest('get',this.url,{[this.sqlName]:this.sqlSeg},(res)=>{
      //   if(res.code==200){
        let res = [
            {
                "id": 234,
                "checkFee": 1,
                "outLibraryDate": "2018-06-05 T06:19:01.000+0000",
                "repairFee": 2,
                "partsFee": 2,
                "transportFee": 2,
                "additionalFee": 2,
                "otherFee": 2,
                "subcontractFee": 2
            }
        ]
          // this.tableData=res.rows;
          this.tableData=res;
        // }
      // })
    }
  }
</script>

