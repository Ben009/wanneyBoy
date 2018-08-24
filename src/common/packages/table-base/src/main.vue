<template>
	<table class="myStyleTable myResuleTable" cellpadding="1" cellspacing="1" border="1" style="margin-bottom: 3px;width:100%">
    <caption style="line-height: normal">已安排委托单</caption>
		<!--  注意可以循环输出colgroup  -->
		<colgroup>
			<col v-for="(item,  index) in theads" :key="index" :width="item['width']" />
		</colgroup>
    <thead>
			<tr>
				<th v-for="(item,  index) in theads" :key="index" style="text-align: center">{{item['title']}}</th>
			</tr>
    </thead>
    <tbody>
      <tr v-for="(item,  index) in tbodys" :key="index" >
		<td  v-for=" (itemtd,  index) in srot_td(item) " :key="index" >
            <input v-if="!itemtd['show']" type="button" value="" style="width: 25px" class="glyphicon btn btn-xs btn-info" onclick="showOrHide(this,'${zdxx.ZDBH}')">
			<span v-if="itemtd['show']" style="text-align: center" >{{itemtd['value']}}</span>
        </td>
      </tr>
                        <!-- <tr class="qjTable" style="display: none">
                            <td colspan="9">
                                <table style="width: 80%;" align="center" class="myStyleTable myResuleTable"
                                       cellpadding="0" cellspacing="0">
                                    <tr>style="background-color: #f8f8f8"
                                        <td class="td20" style="text-align: center"><strong>器具名称</strong></td>
                                        <td class="td20" style="text-align: center"><strong>型号规格</strong></td>
                                        <td class="td20" style="text-align: center"><strong>数量</strong></td>
                                        <td class="td10" style="text-align: center"><strong>检测方式</strong></td>
                                        <td class="td10" style="text-align: center"><strong>执行人</strong></td>
                                        <td class="td10" style="text-align: center"><strong>工作量</strong></td>
                                        <td class="td10" style="text-align: center"><strong>操作</strong></td>
                                    </tr>
                                    <c:forEach var="qj" items="${zdxx.QJLIST}" begin="0"
                                               end="${fn:length(zdxx.QJLIST)}">
                                        <tr>
                                            <td style="text-align: center">${qj.QJMC}</td>
                                            <td style="text-align: center">${qj.XHGG}</td>
                                            <td style="text-align: center">${qj.TS}</td>
                                            <td style="text-align: center">${qj.SFXCJC=='2'?"带回":"现场"}</td>
                                            <td style="text-align: center">${qj.JDY}</td>
                                            <td style="text-align: center">${qj.ESTIMATEGZL}</td>
                                            <td style="text-align: center">
                                                <button class='btn btn-primary btn-mar btn-xs'
                                                        onclick="toUpdateQJ('${qj.XH}','${zdxx.ZDBH}',1)">器具详情
                                                </button>
                                                    <button class='btn btn-danger btn-mar btn-xs'
                                                            onclick="deleteQj('${qj.XH}','${qj.SFXD}','${zdxx.ZDBH}')">删除
                                                    </button>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </table>
                            </td>
                        </tr> -->
          <tr v-show="noRows">
              <td colspan="9">暂无数据</td>
          </tr>
    </tbody>
</table>
		
</template>
<script type="text/javascript">
	import Vue from 'vue'  
	export default {
		name: 'mindTableBase',
		data(){
			return {
				data:{
					noRows:false
				}
			}
		},
		props:{
			theads:{
				type:Array,
				require:true
			},
			tbodys:{
				type:Array,
				require:true
			},
			rowkey:{},
		},
		computed:{
			 
		},
		mounted(){
			// this.theads=[
			// 			{width:30,title:'',name:'f_btn',show:false},
			// 			{width:30,title:'委托单号',name:'ZDBH',show:true},
			// 			{width:30,title:'计划时间',name:'REAL_JHSJ',show:true},
			// 			{width:30,title:'带队人',name:'DDR',show:true},
			// 			{width:30,title:'车辆',name:'CLQK',show:true},
			// 			{width:30,title:'司机',name:'SJ',show:true},
			// 			{width:30,title:'说明',name:'SM',show:true},
			// 			{width:30,title:'安排时间',name:'ARRANGE_TIME',show:true},
			// 			{width:30,title:'操作',name:'l_btn',show:true},
			// 		];
			// this.tbodys=[{ZDBH:"1",REAL_JHSJ:"E",DDR:"T",CLQK:"QW",SJ:"RR",SM:"UU",ARRANGE_TIME:"AA"},   
			// 						{ZDBH:"2",REAL_JHSJ:"E",DDR:"T",CLQK:"E",SJ:"YY",SM:"FF",ARRANGE_TIME:"AA"},   
			// 						{ZDBH:"3",REAL_JHSJ:"E",DDR:"T",CLQK:"Y",SJ:"YY",SM:"FF",ARRANGE_TIME:"AA"},   
			// 						{ZDBH:"4",REAL_JHSJ:"E",DDR:"WE",CLQK:"YT",SJ:"TT",SM:"FF",ARRANGE_TIME:"DD"},   
			// 						{ZDBH:"4",REAL_JHSJ:"W",DDR:"W",CLQK:"Y",SJ:"UU",SM:"FF",ARRANGE_TIME:"DD"},   
			// 						{ZDBH:"5",REAL_JHSJ:"W",DDR:"E",CLQK:"U",SJ:"UU",SM:"FF",ARRANGE_TIME:"FF"},   
			// 						];
		},
		methods:{
			srot_td(tds){
				//debugger;
				let back_tds=[];
				for(let i=0;i< this.theads.length;i++){
					back_tds[i]={value:tds[this.theads[i]['name']],show:this.theads[i]['show']};
				}
				if(back_tds.length>0){
					this.noRows=false;
				}else{
					this.noRows=true;
				}
				return back_tds;
			}
		}
	}
</script>