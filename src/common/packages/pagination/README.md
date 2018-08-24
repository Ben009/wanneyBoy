# mind-pagination
> A mind-pagination component for Vue.js.


### Attributes
| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
| small | 是否使用小型分页样式 | Boolean | — | false |
| page-size | 每页显示条目个数 | Number | — | 10 |
| total | 总条目数 | Number | — | - |
| page-count | 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性 | Number | — | - |
| current-page | 当前页数 | Number | — | 1 |
| layout | 组件布局，子组件名用逗号分隔| String | `sizes`, `prev`, `pager`, `next`, `jumper`, `->`, `total` | 'prev, pager, next, jumper, ->, total'  |
| page-sizes | 每页显示个数选择器的选项设置 | Number[] | — |  [10, 20, 30, 40, 50, 100] |

| first-text | 首页文字描述 | String | — |''|   例如 "首页"
| last-text | 尾页文字描述 | String | — |''|   例如 "末页"
| prev-text | 上一页文字描述 | String | — |''|   例如 "上页"  
| next-text | 下一页文字描述 | String | — |''|   例如 "下页" 


### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| size-change | pageSize 改变时会触发 | 每页条数`size` |
| current-change | currentPage 改变时会触发 | 当前页`currentPage` |


### 项目中直接使用即可 无需引入，该控件已经全局引入
TODO 案例 分页控件说明
<mind-pagination
            first-text="首页" last-text="末页"
            prev-text="上页"  next-text="下页" 
            layout=" sizes,firstp,prev, jumper,countpage, next,lastp,total"   
            :current-page="page"
            :page-size="rows"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange">
</mind-pagination>


methods: {
      handlePageSizeChange (size) {
        this.page = Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
}