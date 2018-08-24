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
          <el-button type="primary" @click="exportExcleBtn" class="el-icon-download">导出</el-button>
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
			<mind-datagrid ref="applianceList"  :op-code="opCode" :findUrl="findUrl" :downUrl="downUrl" :callBack="callBack" setTabH="setHeightForRetS">
        <template slot="statusName" slot-scope="scope"  >
          <span v-if="scope.row.status=='2'" style="color:red;">{{scope.row.statusName}}</span>
          <span v-else>{{scope.row.statusName}}</span>
        </template>
        <template slot="categoryCode" slot-scope="scope"  >
          {{scope.row.categoryName}}({{scope.row.categoryCode}})
        </template>
        <template>
						<el-table-column   label="操作" fixed="right"  width="80px">
									<template slot-scope="scope">
										<el-button @click="handleEdit(scope.row)" type="text" size="small" style="padding:0;font-size:18px;"><i
										class="el-icon-edit-outline" title="编辑"></i></el-button>
										<el-button  v-mindPopover="{message:'确定删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}" type="text"  size="small" style="padding:0;font-size:18px;"><i
										class="el-icon-delete" title="删除"></i></el-button>
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
  name: "appliance-list",
  components: {
    applianceEdit
  },
  data() {
    return {
      mainShow: true,
      edit: null,
      opCode: "findAppliancePage",
      modules:[],//模板列表
      isDefModule:'',//默认模板
      findUrl:'/back/appliance/getApplianceList/',
      downUrl:'/back/appliance/getApplianceListForDown/',
    };
  },
  methods: {
    //查询按钮调用
    findBtn() {
      this.$refs.applianceWhere.sendParams(wheres => {
        //调用usersDataGrid查询
        //console.log("回调传入参数：", wheres);
        this.$refs.applianceList.findPageInfo(wheres);
      });
    },
    //导出按钮调用
    exportExcleBtn() {
      this.$refs.applianceWhere.sendParams(wheres => {
        //调用usersDataGrid查询
        //console.log("回调传入参数：", wheres);
        this.$refs.applianceList.findPageInfo(wheres,true);
      });
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
    //删除事件
    handleDelete(data) {
      let _this = this;
      ajaxRequest("put", "back/appliance/", {id:data[0].id,isDelete:1}, function(res) {
        if (res.code === 200) {
          _this.$message.success("删除成功");
          _this.findBtn();
        } else {
          _this.$message.error("删除失败");
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
      let _this = this;
      Vue.nextTick(function () {
        _this.findBtn();
      })
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
