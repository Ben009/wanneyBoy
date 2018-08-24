<template>
	<div class="certificateAduitResult">
		<certificate-table slug="result"></certificate-table>
	</div>
</template>
<script type="text/javascript">
	import certificateTable from './certificateTableComp/certificateAuditTable'
	export default {
		name: 'certificateAduit',
		data(){
			return {
			}
		},
		methods:{
		},
		components:{
			certificateTable
		}
	}
</script>
<style type="text/css">
	.flex{
		display: flex;
	}
</style>