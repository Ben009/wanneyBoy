<!-- 文件审批归档弹窗 -->
<template>
    <mind-dialog
            :title="'归档类型选择'"
            :visible="true"
            dialogSize="mini"
            center
            v-dialogDrag
            @close="handleCancel">

        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
            <el-row>
                <el-col :span="30">
                    <el-form-item label="归档类别">
                        <el-select v-model="form.type" value-key="name" placeholder="请选择">
                            <el-option v-for="item in arr"
                                       :value="item.code"
                                       :key="item.code"
                                       :label="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
        </span>
    </mind-dialog>

</template>

<script>
    import Vue from 'vue'
 
/*     import {
        Button,
        Checkbox,
        CheckboxGroup,
        Col, 
        Form,
        FormItem,
        Input,
        InputNumber, 
        Radio,
        RadioGroup,
        Row, 
    } from 'element--ui'
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox);  */
    // 引入封装的ajax控件
    import {formatDate} from '../../util/base'
    // 引入jquery
    import $ from 'jquery'

    export default {
        name: 'placeOnFile',
        data() {
            return {
                form: {},
                arr: [{name: '体系文件', code: 0}, {name: '下载中心', code: 1}],
                rules: {}
            }
        },
        props: {
            data: {
                type: String
            },
            callback: {
                type: Function
            }
        },
        mounted() {
            console.log(this.data);
        },
        methods: {
            handleSubmit: function () {
                let param = this.form.type;
                if (param) {
                    this.$message.error("请选择一个类别");
                } else {
                    this.callback(param);
                }
            },
            handleCancel: function () {
                this.callback();
            }
        }
    }
</script>

<style scoped>

</style>
