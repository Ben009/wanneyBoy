<!--新增tab可以在外面引用这个模块的时候添加ref=tab, 然后调用方法this.$refs.tab.handleTabsAdd-->

<script>
  import Vue from 'vue';
  import vueBus from 'vue-bus';
  import $ from 'jquery';
  Vue.use(vueBus);

/*   import {Tabs, TabPane} from 'element--ui';
  Vue.use(Tabs);
  Vue.use(TabPane); */

  export default {
    name: 'tabs',

    data() {
      return {
        editableTabsValue: null,
        editableTabs: [],  //所有tabs数据 [{name:'1',title:'标签1',content:'<p/>'}]
        tabIndex:'',
        show:0
      }
    },
    methods: {
      handleSwitchPane(v) {
        this.editableTabsValue=v;
      },
      handleTabsRemove(targetName) {
        /*移除tab标签 通过pane.name*/

        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;

        /*找到删除后的下一个标签*/
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;  //修改当前标签name
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);  //存放所有tabs的数组中去掉需移除的标签对象
        /** <Tabs ref="tab" @closePanel="父级方法对象"/> */
        this.$emit('closePanel',targetName); //父组件删掉对应关系
      },
      handleTabsAdd(panel) {//pane需要传title和content
        this.editableTabs.push(panel);
        this.editableTabsValue = panel.name;
      },
      handleRemove(){
        /*关闭本页标签*/
        this.handleTabsRemove(this.tabIndex);
        this.show=0;
      },
      handleFilterRemove(){
        /*关闭非本页的所有标签*/
        let temp = [].concat(this.editableTabs);
        let arr = temp.filter(tab => tab.name !== this.tabIndex);
        let info = temp.filter(tab => tab.name == this.tabIndex)[0];
        arr.forEach(v => this.$emit('closePanel',v.name));
        this.editableTabs=[];
        this.editableTabs.push(info); //tabs数组仅存放当前标签的对象
        this.editableTabsValue = this.tabIndex;
        this.show=0;
      }
    },

    render(h) {
      let panes=this.editableTabs.map( pane => {
        return (
          <el-tab-pane
            key={pane.name}
            label={pane.title}
            name={pane.name}
            class='pane_inner'
          >
            <pane.content src={pane.surl} />
          </el-tab-pane>
        )
       /**
        * <pane.content/> 传值
        * <pane.content  param={} />
        * 在子对象中加入接收 props:{
            param:{}
          }
        */
      });
      return (
        <div class='tab'>
          <el-tabs ref="tab" class='pane_out' value={this.editableTabsValue}  on-input={this.handleSwitchPane}  type="card" closable on-tab-remove={this.handleTabsRemove} >
            {panes}
          </el-tabs>
          <ul ref="tab_menu" class={[this.show?'show':'','menu'].join(' ')}><li on-click={this.handleRemove}>关闭页面</li><li on-click={this.handleFilterRemove}>关闭其他页面</li></ul>
      </div>
      )
    },

    mounted(){
      const _this = this;

      /*右键事件*/
      $('.tab').on("contextmenu",'.el-tabs__header .el-tabs__nav>div',function(event){
        _this.show=1;
        console.log($(this))
        let eventX=event.clientX, eventY=event.clientY;
        let left= eventX-200, top= eventY-65;
        _this.tabIndex=this.getAttribute('id').split('-')[1];
        //console.log(this.getAttribute('id'))
        _this.$refs.tab_menu.style.left=left+'px';
        _this.$refs.tab_menu.style.top=top+'px';
        return false
      });
      document.addEventListener('click',()=>{this.show=0})

      let tabContentBox=this.$refs.tab.$el.getElementsByClassName('el-tabs__content')[0];
      console.log(tabContentBox);
      tabContentBox.style="position:absolute;top:40px;right:0;bottom:0px;left:0;"

    }
  }
</script>

<style scoped>
  .tab{
    position:relative;
    height:100%;
  }
  .pane_inner{
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    overflow-y: auto;
  }
  .tab .el-tabs .el-tabs__content{
    position: absolute;
    top: 75px;
    bottom: 0;
    left: 19px;
    right: 0;
  }
 .tab .el-tab-pane{
    height:100%;
  }
  .tab ul.menu{
    width: 100px;
    padding: 5px 10px;
    border: 2px #409EFF solid;
    position: absolute;
    background: #fff;
    z-index: 10;
    display: none;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    box-shadow: 3px 3px 5px #888888;
  }
  .tab ul.menu.show{
    display:block;
  }
  .tab ul.menu li{
    height:20px;
    line-height:20px;
    font-size:12px;
    cursor: pointer;
  }
  .tab ul.menu li:hover{
    color:#3094E0;
  }
</style>
