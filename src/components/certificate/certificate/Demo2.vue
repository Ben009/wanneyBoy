<template>
	<div>
	</div>
</template>
<script >
import Vue from "vue";
import ExcelUtil from '../../../mixins/ExcelUtil.js';
export default {
  mixins:[ExcelUtil],
  name: "test-excel",
  data() {
    return {
      activeLabel: "E:\\TestDocuments\\test12.xlsx"
    };
  },
  components: {
  },
  
 
};
</script>

<style scoped>
.test {
  margin-top: 20px;
}
</style>