<template>
  <div>


    <table class="relative-item" :style="{width:divWidth+'px'}">
      <tbody>
      <tr v-for="item in relativeData" @click="handleClick(item)">
        <td v-for="info in moreInfo" style="text-align:left" :style="{width:info.width+'px'}">
          <template v-if="info.nameCode === 'applianceName'">
            <div style="display: flex;"><span><span :style="{color:item.source==7?'orange':'blue'}">{{item.source == 7 ? '[特殊价格]' : item.source == 4 ? '[报价器具]' : ''}}</span>{{item.applianceName}}</span><span>(</span><span :style="{color: item.isVerify === 'N' ? 'red' : 'green'}">{{item.isVerify}}</span><span>)</span></div>
          </template>
          <template v-else>
          {{info.head}}{{item[info.nameCode]}}
          </template>
        </td>
      </tr>
      <tr @click="showMore"><td :colspan="moreInfo.length" style="text-align:center;"><span style="width:100%;">更多>></span></td></tr>
      </tbody>
    </table>

  </div>

</template>

<script>

  import Vue from 'vue' 
  import $ from 'jquery'
  import {ajaxRequest,ajaxSyncRequest} from '../../util/base'
  import MoreList from './MoreList.vue'

  //import { Form, FormItem, Input, Option } from 'element--ui'
  export default {
    name: 'relative-list',
    props: {
      relativeData: {required: true, type: Array},
      columnsInfo: {required: true, type: Object},
      show: {required: true, type: Function},
      setValue: {required: true, type: Function},
      divWidth: {type: Number}
    },
    data () {
      return {
        isShow:0,
        moreInfo:[],
      }
    },
    methods: {
      handleClick(item){
        console.log(item)
        this.setValue(item);
      },
      showMore(){
        this.show();
      }
    },
    mounted(){
      this.moreInfo = this.columnsInfo.moreInfo;
    },
    components:{MoreList}
  }


</script>

<style scoped>

  .relative-item{
    position: absolute;  
    left: 0;
    z-index: 1;
    background: #f1f9ff;
    width: 817px;
    height: 120px;
    overflow: auto;
    display: block;
    margin-bottom:15px;

  }
  .relative-item tr{
    overflow:hidden;
    border:none !important;
  }
  .relative-item tr.active{

  }
  .relative-item tr:hover{
    background: #61bbff;
    color: #fff;
  }
  .relative-item td{
    border-right:none !important;
    width:100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
  }
  .relative-item td span{
    font-size:14px;
    /* width:148px; */
    height:30px;
    line-height:30px;
    float:left;
  }
  ul.relative-item li span:nth-last-of-type{
    border-right:none;
  }
</style>
