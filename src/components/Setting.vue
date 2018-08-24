<template>
    <div>
      <el-button @click="addColumn">添加字段</el-button>
      <el-table :max-height="QJTableMaxHeight"
        :data="fields"
        border
        style="width: 100%">
        <el-table-column
          label="显示名称"
          width="150px">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.title" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="字段名称"
          width="150px">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.name" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="是否必须"
          width="100px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.required">是</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          label="占位（列）"
          width="100px">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.spacing">
              <el-option v-for="item in [1,2,3]" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="字段类型"
          width="150px">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.type">
              <el-option v-for="(item, index) in ['文本框','日期','下拉框']" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="检索比较符">
          <template slot-scope="scope">
            <el-checkbox-group v-model="scope.row.comparisons">
              <el-checkbox label="0">包含</el-checkbox>
              <el-checkbox label="1">等于</el-checkbox>
              <el-checkbox label="2">大于</el-checkbox>
              <el-checkbox label="3">大于等于</el-checkbox>
              <el-checkbox label="4">小于</el-checkbox>
              <el-checkbox label="5">小于等于</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import Vue from 'vue';

  /* import {Button, Table, TableColumn,  Input, Checkbox} from 'element--ui移除外部引入element';
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);  
  Vue.use(Input);
  Vue.use(Checkbox);*/

  export default {
    name: "setting",
    data(){
      return {
        fields:[
          {
            title:'',
            name:'',
            required:false,
            spacing:3,
            type:0,
            comparisons:[]
          }
        ]
      }
    },
    methods: {
      addColumn(){
        this.fields.push({
          title:'',
          name:'',
          required:false,
          spacing:3,
          type:0,
          comparisons:[]
        })
      }
    }
  }
</script>

<style scoped>

</style>
