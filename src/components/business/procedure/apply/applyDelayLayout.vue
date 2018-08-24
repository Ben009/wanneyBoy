<template>
	<div class="applyDelayLayout">
		<apply-by-registration v-if="!registrationValidation"></apply-by-registration>
		<apply-form v-if="registrationValidation" ></apply-form>
	</div>
</template>
<script type="text/javascript">
	import applyByRegistration from './applyByRegistration'
	import applyForm from './applyForm'
	export default {
		name: 'applyDelayLayout',
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
<style type="text/css">

</style>