// author:huangli
import Vue from 'vue';
export default {
    data(){
      return{
        modules:[],//模板列表
        isDefModule:'',//默认模板
        loading:true,
      }
    },
    methods: {
      /**
       * [findBtn 查询按钮调用和导出功能]
       * @param  {[boolean]} down [是否导出查询到的数据]
       * @return {[type]}      [description]
       */
      findBtn(down){
        this.$refs.usersWhere.sendParams((wheres)=>{
            //调用usersDataGrid查询
            this.$refs.users.findPageInfo(wheres,down);
        });
      },

      /**
       * [emptyCondition 清空按钮 清空查询条件]
       * @return {[type]} [description]
       */
      emptyCondition(){//
        this.$refs.usersWhere.emptyCondition();
      },

      /**
       * [personalSetting 打开个性化设置弹窗]
       * @return {[type]} [description]
       */
      personalSetting(){//个性化设置
        this.$refs.usersWhere.settingShow(true,(personalSet)=>{
          //当个性化设置打开后如果有参数变动会回调
          this.$refs.users.changeFilter(null,personalSet);
          this.modules=personalSet.content;
          this.isDefModule=personalSet.isDefModule;
        });
      },

      /**
       * [changeModule 切换个性化设置模板]
       * @param  {[type]} value [模板的name]
       * @return {[type]}       [description]
       */
      changeModule(value){
        this.$refs.users.changeFilter(value,null);
      },

      /**
       * [getPersonSet 获取个性化设置模板]
       * @return {[type]} [description]
       */
      getPersonSet(){
        let userId = localStorage.getItem("userId"),
            moduleType = this.opCode;
        this.$store.dispatch('findPersonalSet',{res:{userId:userId,moduleType:moduleType,isDelete:0},opcode:this.opCode}).then(res=>{

          this.loading = false;
        });
      },

      /**
       * [asyncInitFunction 异步加载流程 初始化操作]
       * @return {[type]} [description]
       */
      async asyncInitFunction(){
        await Promise.all([this.getPersonSet()])
      },
    },
    created() {
      this.asyncInitFunction();
    },
    destroyed() {
      // 如果组件销毁了则清除vuex中的对应的状态值
      this.$store.commit('CLEARDATA',{opcode: this.opcode})
    },
}
