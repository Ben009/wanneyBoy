
<script>
//证书单独显示cerificate.html指向 certApp 嵌入的该组件

import Vue from 'vue';
export default {
        name:'mycontent',
        props:['content'],
        render: function(h) {
           /*  for(var i = 0; i < this.content.length; i++) {
                console.log("mycontent",this.content[i]);
                this.coms.push(h(this.content[i], {}))
            } */
            return h('div', {},  [h(this.content, {})])
        },
};

</script>
