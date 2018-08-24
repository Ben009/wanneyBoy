<template>
    <mind-dialog
    :title="groupId? '修改用户分组':'新增用户分组'"
    :visible="true"
    dialogSize="mini"
    center
    v-dialogDrag
    :lock-scroll="true"
    @close="handleCancel">
    <el-row class="edit">
      <el-form  label-width="100px">
        <el-form-item label="用户分组名">
          <el-input v-model.trim="message"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="remark"></el-input>
        </el-form-item>
      </el-form>
        <el-button type="primary" @click="handleSubmit" style="margin-top:20px;">保存</el-button>
        <el-button  @click="handleCancel" style="margin-top:20px;">取消</el-button>
    </el-row>
    </mind-dialog>
</template>
<script>
import Vuex from "vuex";
import { ajaxRequest } from "../../util/base";
export default {
  name: "message-group-edit",
  props:{
    userIds:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      message: "",
      remark:'',
    };
  },
  computed: {
    groupId() {
      return this.$store.state.Notification.messageGroup.groupId;
    },
    groupName() {
      return this.$store.state.Notification.messageGroup.groupName;
    },
    gorupRemark(){
      return this.$store.state.Notification.messageGroup.remark
    }
  },
  mounted() {
      this.message = this.groupName;
      this.remark = this.gorupRemark
  },
  methods: {
    handleCancel() {
      if(this.groupId){
        this.$store.commit("SET_MESSAGE", { groupId: null, groupName: null });
      }else{
        this.$emit('back')
      }
    },
    handleSubmit() {
      if (!this.message) {
        this.$message.error("用户分组名称不能为空！");
        return;
      }
      if (this.message && this.message.length > 20) {
        this.$message.error("用户分组名不能超过20个字符!");
      } else {
        let param = {}
        if(this.groupId){
          param = {id:this.groupId,groupName: this.message,remark:this.remark, }
        }else{
          param = {groupName:this.message,remark:this.remark,}
          if(this.userIds.length>0){
            param.userIds = this.userIds.join(',')
          }
        }
        console.log('查询条件')
        this.$store
          .dispatch("judge_groupName_distinct", {id:this.groupId,groupName:this.message})
          .then(res => {
            if (res.msg == "0") {
              if(this.groupId){
                ajaxRequest(
                  "put",
                  "back/group/",
                  param,
                  res => {
                    if (res.code === 200) {
                      this.$message.success("保存成功！");
                      this.handleCancel();
                    }
                  }
                );
              }else{
                ajaxRequest(
                  'post',
                  'back/group/',
                  param,res=>{
                    if(res.code === 200){
                      this.$message.success('保存成功！')
                      this.handleCancel();
                    }
                  }
                )
              }
            } else {
              this.$message.error("用户分组名称重复!");
            }
          });
      }
    }
  }
};
</script>
<style scoped>
.edit {
  text-align: center;
  padding: 0 20px 20px 0;
}
</style>


