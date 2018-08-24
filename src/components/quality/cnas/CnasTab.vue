<template>
  <div class="CnasTab">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基础信息" name="cnasForm">
        <cnas-form :callback="setCnasId" :getParentId="getCnasId"></cnas-form>
      </el-tab-pane>
      <el-tab-pane label="参量信息" name="characteristicForm" :disabled="!isDisabled">
        <characteristic-form :getParentId="getCnasId"></characteristic-form>
      </el-tab-pane>
      <el-tab-pane label="参数信息" name="paramInfoForm" :disabled="!isDisabled">
        <param-info-form :getParentId="getCnasId"></param-info-form>
      </el-tab-pane>
      <el-tab-pane v-if="cnasId" name="back">
        <el-button slot="label" @click='back' type="warning" plain>返回</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CnasForm from './CnasForm'
import CharacteristicForm from './CharacteristicForm'
import ParamInfoForm from './ParamInfoForm'
export default {
  name: 'cnasTab',
  props: {
    getParentId: {
      type: Function
    }
  },
  data () {
    return {
      activeName: 'cnasForm',
      id: this.$route.query ? this.$route.query.id : null,
      cnasId: this.$route.query ? this.$route.query.id : null
    }
  },
  computed: {
    isDisabled () {
      return this.id
    }
  },
  methods: {
    setCnasId (id) {
      this.id = id
    },
    getCnasId () {
      return this.id
    },
    back () {
      this.$router.back(-1)
    }
  },
  components: {
    ParamInfoForm,
    CharacteristicForm,
    CnasForm
  },
  mounted () {
    if (this.cnasId) {
      this.id = this.cnasId
    }
  }
}
</script>

<style lang="scss" scoped>
  .CnasTab{
    margin-bottom:20px;
    .wd100{
      width:100px;
    }
    .mt20{
      margin-top:20px;
    }
    .mb20{
      margin-bottom:20px;
    }
    .textCenter{
      text-align:center;
    }
    .el-tabs--card{
      .el-tabs__header{
        border-bottom:none
      }
    }
  }
</style>
