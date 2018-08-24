<template>
	<div class="applyRefundLayout">
		<apply-by-registration v-if="!registrationValidation || registrationValidation !== 'refund'" type="refund"></apply-by-registration>
		<apply-form v-if="registrationValidation == 'refund'"></apply-form>
	</div>
</template>
<script type="text/javascript">
	import applyByRegistration from './applyByRegistration'
	import applyForm from './applyForm'
	export default {
		name: 'applyRefundLayout',
		computed:{
			registrationValidation(){
				return this.$store.state.Procedure.registrationInfo.type
			}
		},
		components:{
			applyByRegistration,
			applyForm
		},
		destroyed(){
			// 当该组件销毁的时候返回登记号页面
			this.$store.commit('SET_REGISTRATION_INFO',{
        type: ''
      })
		}
	}
</script>
<style type="text/css" lang="scss">

</style>