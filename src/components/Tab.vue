<!--新增tab可以在外面引用这个模块的时候添加ref=tab, 然后调用方法this.$refs.tab.handleTabsAdd-->

<script>
  import Vue from 'vue';
  
  import Demo from './Table/demo1';
/* 
  import {Tabs, TabPane} from 'element--ui移除外部引入element';
  Vue.use(Tabs);
  Vue.use(TabPane); */


  export default {
    name: 'tab',
    components: {Demo},
    render(h) {
      let panes=this.editableTabs.map( pane => {
        return (
          <el-tab-pane
            key={pane.name}
            label={pane.title}
            name={pane.name}
          >
            <pane.content />
          </el-tab-pane>
        )
      });
      return (
        <el-tabs value={this.editableTabsValue} on-input={this.handleSwitchPane} type="card" closable on-edit={this.handleTabsRemove}>
          {panes}
        </el-tabs>
      )
    },
    data() {
      return {
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: Demo
        }, {
          title: 'Tab 2',
          name: '2',
          content: Demo
        }],
        tabIndex: 2
      }
    },
    methods: {
      handleSwitchPane(v) {
        this.editableTabsValue=v;
      },
      handleTabsRemove(targetName, action) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
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

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
      handleTabsAdd(pane) {//pane需要传title和content
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          ...pane,
          name: newTabName,
        });
        this.editableTabsValue = newTabName;
      }
    }
  }
</script>

<style scoped>

</style>
