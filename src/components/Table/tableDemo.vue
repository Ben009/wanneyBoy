<template>
  <div>
    <!-- 高级查询条件 -->
    <mind-condition ref="dataWhere" op-code="findUser"  ></mind-condition>
    <!-- 查询调用按钮 -->
    <div style="text-align:center;margin:10px 0px;">
      <el-button type="primary" round @click="findBtn" class="el-icon-search" style="border-radius:3px;">查询</el-button>
      <el-button type="warning" round @click="emptyCondition" class="el-icon-info" style="border-radius:3px;">&nbsp;清空</el-button> 
      <el-select size="mini" title="查询模板"  v-model="isDefModule" placeholder="请选择" @change="changeModule">
            <el-option
              v-for="(item,index) in modules"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
      </el-select>
      <el-button size="mini"  type="primary" icon="el-icon-setting" @click="personalSetting" class="but-dc">个性化设置</el-button>
      <el-button type="primary" @click="findBtn(true)" class="el-icon-download but-dc">导出</el-button>  
      <el-button size="mini"  type="primary"  @click="printHtmls()" class="but-dc">HTML打印案例</el-button>
      <el-button size="mini"  type="primary"  @click="handleCancel('mini',true)" class="but-dc">小弹窗</el-button>
      <el-button size="mini"  type="primary"  @click="handleCancel('mid',true)" class="but-dc">中等弹窗</el-button>
      <el-button size="mini"  type="primary"  @click="handleCancel('large',true)" class="but-dc">大弹窗</el-button>
      <el-button size="mini"  type="primary"  @click="handleCancel('more',true)" class="but-dc">多层弹窗</el-button>
    </div>
    <!-- TODO 案例 通用查询组件 -->
    <mind-datagrid ref="dataShow"  op-code="findUser" :callBack="callBack" :ckbox="ckbox" :autoWidth="false" >
        <template slot="status" slot-scope="scope"  >
              <span style="color:red;">{{scope.row.status}}</span>-111
        </template> 
        <template slot="certificateFlag" slot-scope="scope"  >
              <span v-if='scope.row.certificateFlag=="1"' style="color:red;">{{scope.row.certificateFlag}}</span>
              <span v-else>{{scope.row.certificateFlag}}</span>
        </template> 
        <template>
          <el-table-column   label="操作" fixed="right" width="58px" >
                <template slot-scope="scope">
                  <el-button @click="btnClick(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline" title="编辑"></i></el-button>
                </template>
          </el-table-column>
        </template>
    </mind-datagrid>
    <mind-dialog :title="'小弹窗'" :visible="dialogs.mini" otherCode  dialogSize="mini" center v-dialogDrag  @close="handleCancel('mini',false)">
      <p>小弹窗：在弹窗中设置'dialogSize="mini" center v-dialogDrag'；</p>
      <p>dialogSize:弹窗大小：mini小弹窗，mid中等弹窗，large大弹窗；</p>
      <p>v-dialogDrag：标题拖动指令；</p>
      <p>center：内容居中显示。</p>
      <p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>
<p>注：弹窗标签必须是mind-dialog。</p>


    </mind-dialog>
    <mind-dialog :title="'中等弹窗'" :visible="dialogs.mid"  dialogSize="mid" center v-dialogDrag  @close="handleCancel('mid',false)">
      <p>小弹窗：在弹窗中设置'dialogSize="mid" center v-dialogDrag'；</p>
      <p>dialogSize:弹窗大小：mini小弹窗，mid中等弹窗，large大弹窗；</p>
      <p>v-dialogDrag：标题拖动指令；</p>
      <p>center：内容居中显示。</p>
      <p>注：弹窗标签必须是mind-dialog。</p>
    </mind-dialog>
    <mind-dialog :title="'大弹窗'" :visible="dialogs.large"  dialogSize="large" center v-dialogDrag  @close="handleCancel('large',false)">
      <p>小弹窗：在弹窗中设置'dialogSize="large" center v-dialogDrag'；</p>
      <p>dialogSize:弹窗大小：mini小弹窗，mid中等弹窗，large大弹窗；</p>
      <p>v-dialogDrag：标题拖动指令；</p>
      <p>center：内容居中显示。</p>
      <p>注：弹窗标签必须是mind-dialog。</p>
    </mind-dialog>
    <mind-dialog :title="'多层窗'" :visible="dialogs.more"  dialogSize="large" center v-dialogDrag  @close="handleCancel('more',false)">
      <p>多层嵌套弹窗，在嵌套的弹窗（第二层及以上）中写入属性:appendToBody="true"，即可解决遮罩层的问题</p>
      第二层弹窗：<el-button size="mini"  type="primary"  @click="handleCancel('more_2',true)" class="but-dc">第二层弹窗</el-button>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <mind-dialog :title="'第二层弹窗'" :visible="dialogs.more_2" :appendToBody="true"  dialogSize="mid" center v-dialogDrag  @close="handleCancel('more_2',false)">
        <p>我是第二层弹窗</p>
        第三层弹窗：<el-button size="mini"  type="primary"  @click="handleCancel('more_3',true)" class="but-dc">第三层弹窗</el-button>
        <mind-dialog :title="'第三层弹窗'" :visible="dialogs.more_3" :appendToBody="true"  dialogSize="mini" center v-dialogDrag  @close="handleCancel('more_3',false)">
          <p>我是第三层弹窗</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </mind-dialog>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </mind-dialog>
    </mind-dialog>
  </div>
</template>
<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import MindDialog from "../../common/packages/dialog/src/component.vue";

  export default {
    components: {MindDialog},
    name: "table-demo",
      data(){
          return {
            ckbox:false,//是否多选 显示checkbox
            roleId:"ddd",
            dialogs:{mini:false,mid:false, large:false, more:false, more_2:false, more_3:false},
            modules:[],//模板列表
            isDefModule:'',//默认模板
          }
      },
      methods:{
        printHtmls(){
          //以全局混入
          this.printHtml("example",{key1:"参数1",key2:"参数2",key3:"参数3",key4:"参数4"});
        },
          /** 行操作列按钮 */
          btnClick(row){
            this.$msgbox(JSON.stringify(row));
          },
          /**【1】查询按钮调用 down 是否下载参数 */
          findBtn(down){
            this.$refs.dataWhere.sendParams((wheres)=>{
                //调用dataDataGrid查询
                // 该处可以手动增加相关后补参数
	              // wheres["参数1"]="补充参数"
                //console.log("回调传入参数：",wheres);
                this.$refs.dataShow.findPageInfo(wheres,down);
            });
          },
          /**【2】清空查询条件 */
          emptyCondition(){//
            this.$refs.dataWhere.emptyCondition();
          },
          /**【3】打开个性化设置 */
          personalSetting(){//个性化设置
            this.$refs.dataWhere.settingShow(true,(personalSet,wheres)=>{
              //当个性化设置打开后如果有参数变动会回调
              //console.log("设置后回调：",res);
              this.$refs.users.changeFilter(null,personalSet,wheres);
              this.modules=personalSet.content;
              this.isDefModule=personalSet.isDefModule;
            });
          },
          /**【4】模板变换 */
          changeModule(value){
            //console.log("模板变更",value);
            this.$refs.dataShow.changeFilter(value,null);
          },
          /**【5】回调 可以单datagrid使用  */
          callBack(type,param1,param2){
            if(type=='modules'){
              this.modules=param1;
              this.isDefModule=param2;
            }else{
              //console.log("回调接收参数",param1);
            }
          },

          
          /** 弹窗案例 */
          handleCancel(type,val) {
            this.dialogs[type] = val;
          }
      },
      destroyed(){
        this.$store.commit('CLEARDATA',{opcode:'findUser'})
      },
      mounted(){

      }
  }



</script>

<style>
.but-dc{background:none!important; border-color:#afafaf!important; color:#797979!important;}
.but-dc:hover{border-color:#d0d0d0!important;}

</style>
