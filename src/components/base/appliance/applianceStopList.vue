<template>
<div>
	<template v-if="mainShow">
			<!-- 高级查询条件 -->
			<mind-condition ref="applianceWhere" :op-code="opCode" ></mind-condition>
			<!-- 查询调用按钮 -->
			<div style="display: flex;justify-content: space-between;">
        <span style="width: 150px">&nbsp;</span>
				<div style="display: inline-block;text-align: center">
					<el-button type="primary"  @click="findBtn" class="el-icon-search">查询</el-button>
          <el-button type="primary" @click="findBtn(true)" class="el-icon-download">导出</el-button>
					<el-button type="warning"  @click="emptyCondition" class="el-icon-info">清空</el-button>
				</div>
        <span style="float: right">
          <el-select size="mini"  v-model="isDefModule" placeholder="请选择" @change="changeModule">
            <el-option
              v-for="(item,index) in modules"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
        </el-select>
          <el-button type="primary" size="mini" round @click="personalSetting(1)" class="el-icon-setting">个性化设置</el-button>
        </span>
			</div>
			<!-- TODO 案例 通用查询组件 -->
			<mind-datagrid ref="applianceList"  :op-code="opCode" :findUrl="findUrl"  :downUrl="downUrl" :callBack="callBack" setTabH="setHeightForRetS">
					<template>
						<el-table-column   label="操作" fixed="right"  width="80px">
									<template slot-scope="scope">
										<el-button v-if="scope.row.status=='2'"  v-mindPopover="{message:'确定恢复启用?',success:handleRecover.bind(this,[scope.row])}" type="text"  size="small" style="padding:0;font-size:18px;"><i
										class="el-icon-circle-check-outline" title="恢复"></i></el-button>
									</template>
						</el-table-column>
					</template>
			</mind-datagrid>
		</template>
  <template v-else>
    <applianceEdit  :data="edit" :callback="handleEditCallback" ></applianceEdit>
  </template>
</div>
</template>
<script>
import Vue from "vue";
import applianceEdit from "./applianceEdit";
import { ajaxRequest} from '../../util/base'
export default {
  name: "appliance-stop-list",
  components: {
    applianceEdit
  },
  data() {
    return {
      mainShow: true,
      edit: null,
      opCode: "findApplianceStopPage",
      modules:[],//模板列表
      isDefModule:'',//默认模板
      findUrl:'/back/appliance/getApplianceStopList/',
      downUrl:'/back/appliance/getApplianceStopListForDown/',
    };
  },
  methods: {
     /** 查询按钮调用 */
          findBtn(down){
            this.$refs.applianceWhere.sendParams((wheres)=>{
                //调用usersDataGrid查询
                //console.log("回调传入参数：",wheres);
                this.$refs.applianceList.findPageInfo(wheres,down);
            });
          },
          /** 调用  查询 */
          findwhere(down){
             let wheres={
               id:$("#dddd").val(),
               roleId:this.roleId
             };
             this.$refs.applianceList.findPageInfo(wheres,down);
          },
          /** 打开个性化设置 */
          personalSetting(){//个性化设置
            this.$refs.applianceWhere.settingShow(true,(personalSet)=>{
              //当个性化设置打开后如果有参数变动会回调
              //console.log("设置后回调：",res);
              this.$refs.applianceList.changeFilter(null,personalSet);
              this.modules=personalSet.content;
              this.isDefModule=personalSet.isDefModule;
            });
          },
          /** 清空查询条件 */
          emptyCondition(){//
            this.$refs.applianceWhere.emptyCondition();
          },
          /** 回调 可以单datagrid使用  */
          callBack(type,param1,param2){
            if(type=='modules'){
              this.modules=param1;
              this.isDefModule=param2;
            }else{
              //console.log("回调接收参数",param1);
            }
          },
          /** 模板变换 */
          changeModule(value){
            //console.log("模板变更",value);
            this.$refs.applianceList.changeFilter(value,null);
          },
      handleRecover(data) {
        let _this = this;
        ajaxRequest("put", "back/appliance/handleRecover", {id:data[0].id}, function(res) {
          if (res.code === 200) {
            _this.$message.success("恢复成功");
            _this.findBtn();
          } else {
            _this.$message.error("恢复失败");
          }
        });
      },
    handleEdit(rowInfo) {
      // 改了页面的显示数据
      this.mainShow = false;
      this.edit = rowInfo || {};
    },
    // 传入子页面的回调函数
    handleEditCallback() {
      this.edit = null;
      this.mainShow = true;
    },

  },
  mounted() {
    this.findBtn();
  },
};
</script>

<style scoped>
.flex-one {
  flex: 1;
}
.flex {
  display: flex;
	margin: 20px 0;
}
.custom-input {
  width: 200px;
  height: 32px;
}
.custom-input .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.custom-input .el-input-group__append {
  padding: 0 10px;
}
/* 在容器的底部预留空间，否则整个页面有一种紧迫感 */
.container {
  padding-bottom: 50px;
}
.position{
	width: 100%;
	text-align: center;
}

.el-icon-setting {
  background: none !important;
  border: none !important;
  color: #3094e0 !important;
}
.el-icon-setting:hover {
  color: #3094e0 !important;
}
</style>
