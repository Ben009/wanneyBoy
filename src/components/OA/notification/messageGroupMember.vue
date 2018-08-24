<template>
    <mind-dialog
    title="组成员管理"
    :visible="true"
    dialogSize="mid"
    center
    v-dialogDrag
    :lock-scroll="true"
    @close="handleCancel">
    <div>
      <!-- <div class="mb10 title" style="margin-left:40px;">部门选择</div> -->
      <div class="flex session-select justify-center mb10" style="width:59%;display:inline-block;text-align:left">
          <label class="mr10 session-label">部门 :</label>
          <el-select v-model="departId" placeholder="请选择" size="small" @change="getDepartMember()" style="width:70%;">
              <el-option
                  v-for="item in departList"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id">
              </el-option>
              </el-select>
      </div>
      <div class="mb10 title" style="width:40%;display:inline-block;text-align:left">已选择人员 <el-button type="warning" @click="clear">清空</el-button> </div>
    </div>
        <el-row class="edit">
            <div class="dialogBox session" style="width: 60%;">
                <el-table :data="departMember" :max-height="QJTableMaxHeight" ref="table" border stripe  style="width: 100%"  @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="40">
                    </el-table-column>
                    <el-table-column  prop="userName"  label="人员名称" align="center" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dialogBox detail" style="width: 40%;">
                <div>
                    <div v-for="(item,index) in memberChecked" :key="index" class="flex justify-center mb10" >
                        <div class="readyPost">{{item.userName}}</div>
                        <el-button @click="deleteMember(item)" size="small" type="primary">移除</el-button>
                    </div>
                </div>
            </div>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">返 回</el-button>
	    </span>
    </mind-dialog>
</template>
<script>
import Vuex from "vuex";
import { ajaxRequest } from "../../util/base";
export default {
  name: "message-group-member",
  data() {
    return {
      //当前已选中部门
      currentDepartId: null,
      // 部门的数据
      departId: "",
      departList: [],
      departMember: [],
      //已选中人员
      memberChecked: []
    };
  },
  computed: {
    groupId() {
      return this.$store.state.Notification.messageMember.groupId;
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      // 获取当前收件组成员数据
      ajaxRequest(
        "get",
        "back/group/getUserIdsByGroupId",
        { groupId: parseInt(this.groupId) },
        res => {
          this.memberChecked = res;
        }
      );
      // 获取部门数据
      ajaxRequest("get", "back/depart/retrieve", { isDelete: 0 }, res => {
        if (res.code === 200) {
          this.departList = res.rows;
        }
      });
    },
    handleCancel() {
      this.$store.commit("SET_MEMBER", null);
    },
    // 获取部门下人员数据
    getDepartMember() {
      this.currentDepartId = this.departId;
      let tempArray = [];
      ajaxRequest(
        "get",
        "back/user/listUserByDeptId/" + this.departId,
        {},
        res => {
          this.departMember = res.rows;
          if (this.memberChecked && this.memberChecked.length) {
            this.departMember.forEach(temp => {
              this.memberChecked.forEach(val => {
                if (val.id?val.id == temp.id:val.userId == temp.id) {
                  tempArray.push(temp);
                }
              });
            });
            this.$nextTick(() => {
              this.toggleSelection(tempArray);
            });
          }
        }
      );
    },
    // 选择部门人员
    handleSelectionChange(val) {
      if (this.memberChecked && this.memberChecked.length) {
        let tempMemberCheck = Object.assign([], this.memberChecked);
        this.memberChecked.forEach((temp, index) => {
          if (temp.departId == this.currentDepartId) {
            let tempMemberArray = val.find((value, inx, arr) => {
              return temp.id?value.id == temp.id:value.id == temp.userId;
            });
            if (!tempMemberArray) {
              tempMemberCheck = tempMemberCheck.filter(val => {
                  return val.id !==temp.id
              });
            }
          }
        });
        this.memberChecked = Object.assign([], tempMemberCheck);
      }
      let hash = {
          distinct:{}
      };
      val.forEach(val => {
        this.memberChecked.push(val);
      });
      this.memberChecked = this.memberChecked.reduce(function(item, next) {
        // 此处需要一个如果名称重复进行判断id是否相同的算法
        hash[next.id]
          ? ""
          : (()=>{
              hash[next.id] = true;
              item.push(next);
              
          })() ;

        return item;
      }, []);
    },
    // 删除已选中人员
    deleteMember(temp) {
      let tempDeleteArray = [];
      if (temp.departId == this.currentDepartId) {
        this.memberChecked.forEach((val, index) => {
          if (val.departId == this.currentDepartId) {
            tempDeleteArray.push(val);
          }
        });
        tempDeleteArray = tempDeleteArray.filter(val => {
          return temp.id !== val.id;
        });
        this.$nextTick(() => {
          this.toggleSelection(tempDeleteArray)
        })
      } else {
        this.memberChecked = this.memberChecked.filter(val => {
          return val.id !== temp.id;
        });
      }
    },
    //转态反转
    toggleSelection(rows) {
      if (rows) {
        this.$refs.table.clearSelection();
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    // 保存
    handleSubmit() {
        let idsArr = []
        this.memberChecked.forEach((item,index)=>{
            if(item.id){
                console.log('id')
                idsArr.push(item.id)
            }
            if(item.userId){
                console.log('userId')
                idsArr.push(item.userId)
            }
        })
        ajaxRequest('post','back/group/addGroupPerson',{
            groupId:this.groupId,
            userIds:idsArr.join(',')},res=>{
            if(res.code===200){
                this.$message.success('保存成功!');
                this.handleCancel();
            }
        })
    },
    // 清空已选择用户
    clear(){
      for(let i = 0 ; i < this.memberChecked.length ; i++){
          this.memberChecked = [];
          this.toggleSelection();
      }
    }
  }
};
</script>
<style scoped>
.mb10 {
  margin-bottom: 10px;
}
.justify-center {
  justify-content: center;
}
.dialogBox {
  border: 1px solid #ccc;
  /* min-height: 250px;
  max-height: 470px; */
  height: 42vh;
  overflow: auto;
  text-align: center;
  padding: 10px;
  margin-right: 10px;
  font-size: 12px;
}
.dialogBox .title {
  font-size: 14px;
}
.el-select {
  width: 90px;
}

.el-select {
  width: 120px;
}
.session-label {
  line-height: 30px;
}
.permissions-check {
  margin-left: 30px;
  margin-bottom: 5px;
  text-align: left;
}
.session-check {
  margin-left: 20px;
  margin-bottom: 5px;
  text-align: left;
}
.el-button {
  padding: 5px 15px;
  margin-left: 10px;
}
.readyPost {
  width: 100px;
}
.edit {
  display: flex;
}
</style>

