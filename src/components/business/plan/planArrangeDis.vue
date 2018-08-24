<template>
    <el-tabs type="border-card" v-model="activeName" label-width="120px" @tab-click="handleClick">
        <el-tab-pane label="非自排" name="NoSelfarrange">
            <planArrageDisDetail :key="renderKey1" :isSelfarrange="isSelfarrange"></planArrageDisDetail>
        </el-tab-pane>
        <el-tab-pane label="自排" name="Selfarrange">
            <planArrageDisDetail :key="renderKey2" :isSelfarrange="isSelfarrange"></planArrageDisDetail>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import Vue from 'vue';

    import planArrageDisDetail from './planArrageDisDetail';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import ElButton from "@/common-el/packages/button/src/button";

    /*     import {
            Button,
            Checkbox,
            CheckboxGroup,
            Col,
            Form,
            FormItem,
            Input,
            Radio,
            RadioGroup,
            Row,
            Autocomplete
        } from 'element--ui';
        Vue.use(Form);
        Vue.use(FormItem);
        Vue.use(Input);
        Vue.use(Button);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(RadioGroup);
        Vue.use(Radio);
        Vue.use(CheckboxGroup);
        Vue.use(Checkbox);
        Vue.use(Autocomplete); */

    Vue.use(planArrageDisDetail);

    export default {
        components: {ElButton, planArrageDisDetail},
        data() {
            return {
                activeName: 'NoSelfarrange',
                isSelfarrange: '1',
                renderKey1: 1,
                renderKey2: 1,
            };
        },

        mounted() {
            console.log(this.$route.query);
            if (this.$route.query.title.indexOf("自排") !== -1) {
                this.activeName = 'Selfarrange';
            } else {
                this.activeName = 'NoSelfarrange';
            }
        },
        methods: {
            handleClick(tab, event) {
                if (tab.name == "" || tab.name == "NoSelfarrange") {
                    this.isSelfarrange = '1';
                    this.renderKey1 = !this.renderKey1;
                } else {
                    this.isSelfarrange = '0';
                    this.renderKey2 = !this.renderKey2;
                }
            }
        }
    };
</script>

<style scoped>

</style>
