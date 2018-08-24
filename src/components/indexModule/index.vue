<!--首页-->
<template>
    <div>
        <div class="main">
            <!-- 通知公告 -->
            <div id="waterFull-left" style="width:32%;float:left;">
                <div class="wrap_one float" style="height:300px;border:1px solid #e6e6e6; ">
                    <div class="tzgg_center">
                        <p><span class="el-icon-njm-sy-sybftzgg">&nbsp;通知公告</span>
                            <span class="more" style="cursor:pointer; font-size:14px;text-align:center;"
                                  @click="showMoreInformation">更多</span>
                        </p>
                        <div>
                            <div class="information_first" v-for="(obj,index) in informationArr" :key="index"
                                 @click="toViewInformation(obj)">
                                <ul class="wrap information_ul">
                                    <li class="tz_list_time">
                                        <div class="date" style="padding:13px 0px;font-family: inherit;">
                                            <span class="year" style="font-size: 40px;">{{obj.day}}</span><br/>
                                            <span class="md">{{obj.month}}-{{obj.year}} </span>
                                        </div>
                                    </li>
                                    <li class="tz_list_news">
                                        <div class="news">
                                            <p class="news_name">{{obj.title}}</p>
                                            <p style="color:#6e6e6e;font-size: 14px;">{{obj.noticeContent}}</p>
                                            <p class="name">发布人：{{obj.author}}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap_one float" ref="Form2" style="height:100%;border:1px solid #e6e6e6; margin-top:10px;"
                     v-if="Form2.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form2.icon">&nbsp;{{Form2.title}}</span></p>
                        <div style="padding:10px;">
                            <div class="rw_first">
                                <ul class="wrap_rw information_ul">
                                    <li v-for="(obj,index) in Form2.arr" :key="index" v-if="obj.number"
                                        :class="{rowStlye: true}">
                                        <div class="date" style="padding:15px 0px;">
                                            <p class="year shuoming" style="padding-bottom:6px;">
                                                <span :class="obj.icon">
                                                        <el-row class="el-sm">
                                                        {{obj.tips}}
                                                        </el-row>
                                                </span>
                                            </p>
                                            <p class="p_one" @click="jump2view(obj)" style="cursor: pointer;">
                                                {{obj.number}}</p>
                                            <p class="p_one p_name">{{obj.title}}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap_one float" ref="Form5" style="height:100%;border:1px solid #e6e6e6;margin-top: 10px; "
                     v-if="Form5.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form5.icon">&nbsp;{{Form5.title}}</span></p>
                        <div style="padding:10px;">
                            <div>
                                <div class="rw_first">
                                    <ul class="wrap_rw information_ul">
                                        <li v-for="(obj,index) in Form5.arr" :key="index" v-if="obj.number"
                                            :class="{rowStlye: true}">
                                            <div class="date" style="padding:15px 0px;">
                                                <p class="year shuoming" style="padding-bottom:6px;">
                                                     <span :class="obj.icon">
                                                        <el-row class="el-sm">
                                                        {{obj.tips}}
                                                        </el-row>
                                                     </span>
                                                </p>
                                                <p class="p_one" style="cursor: pointer" @click="jump2view(obj)">
                                                    {{obj.number}}</p>
                                                <p class="p_one p_name">{{obj.title}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 工作流 -->
            <div id="waterFull-middle" style="width:32%;float:left;margin-left:5px;">
                <div class="wrap_one float" style="height:300px; border:1px solid #e6e6e6;">
                    <div class="tzgg_center">
                        <p><span class="el-icon-njm-sy-sybfgzl">&nbsp;工作流</span></p>

                        <div>
                            <div class="gzl_first">
                                <ul class="wrap information_ul">
                                    <li style="padding: 3px;float:left;">
                                        <div class="date">
                                            <span class="year"><img src="./img/icon-one.png"/></span><br/>
                                        </div>
                                    </li>
                                    <li class="dress">
                                        <div class="news" style="padding:20px 0px;">
                                            <p style="color:#414141;">我的代办</p>
                                            <p style="font-family: 宋体;
                                        font-size: 40px;
                                        line-height: 44px; color: #1e8af9;">25</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="gzl_first">
                                <ul class="wrap information_ul">
                                    <li style="padding: 3px;float:left;">
                                        <div class="date">
                                            <span class="year"><img src="./img/icon-two.png"/></span><br/>
                                        </div>
                                    </li>
                                    <li class="dress">
                                        <div class="news" style="padding:20px 0px;">
                                            <p>我发起的流程</p>
                                            <p style="font-family: 宋体;
                                        font-size: 40px;
                                        line-height: 44px; color: #f86786;">25</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="gzl_first">
                                <ul class="wrap information_ul">
                                    <li style=" padding: 3px;float:left;">
                                        <div class="date">
                                            <span class="year"><img src="./img/icon-three.png"/></span><br/>
                                        </div>
                                    </li>
                                    <li class="dress">
                                        <div class="news" style="padding:20px 0px;">
                                            <p>我审批的流程</p>
                                            <p style="font-family: 宋体;
                                        font-size: 40px;
                                        line-height: 44px; color:#d5b453;">25</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="gzl_first">
                                <ul class="wrap information_ul">
                                    <li style="padding: 3px;float:left;">
                                        <div class="date">
                                            <span class="year"><img src="./img/icon-four.png"/></span><br/>
                                        </div>
                                    </li>
                                    <li class="dress">
                                        <div class="news" style="padding:17px 0px;">
                                            <p>我的交办</p>
                                            <p style="font-family: 宋体;
                                        font-size: 40px;
                                        line-height: 44px; color: #56bc4e;">25</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="wrap_one float" ref="Form3" style="height:100%;border:1px solid #e6e6e6;  margin-top:10px;"
                     v-if="Form3.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form3.icon">&nbsp;{{Form3.title}}</span></p>
                        <div style="padding:10px;">
                            <div>
                                <div class="rw_first">
                                    <ul class="wrap_rw information_ul">
                                        <li v-for="(obj,index) in Form3.arr" :key="index" v-if="obj.number"
                                            :class="{rowStlye: true}">
                                            <div class="date" style="padding:15px 0px;">
                                                <p class="year shuoming" style="padding-bottom:6px;">
                                                     <span :class="obj.icon">
                                                        <el-row class="el-sm">
                                                        {{obj.tips}}
                                                        </el-row>
                                                     </span>
                                                </p>
                                                <p class="p_one" style="cursor: pointer" @click="jump2view(obj)">
                                                    {{obj.number}}</p>
                                                <p class="p_one p_name">{{obj.title}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap_one float" ref="Form6" style="height:100%;border:1px solid #e6e6e6; margin-top:10px;"
                     v-if="Form6.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form6.icon">&nbsp;{{Form6.title}}</span></p>
                        <div style="padding:10px;">
                            <div>
                                <div class="rw_first">
                                    <ul class="wrap_rw information_ul">
                                        <li v-for="(obj,index) in Form6.arr" :key="index" v-if="obj.number"
                                            :class="{rowStlye: true}">
                                            <div class="date" style="padding:15px 0px;">
                                                <p class="year shuoming" style="padding-bottom:6px;">
                                                     <span :class="obj.icon">
                                                        <el-row class="el-sm">
                                                        {{obj.tips}}
                                                        </el-row>
                                                    </span>
                                                </p>
                                                <p class="p_one" style="cursor: pointer" @click="jump2view(obj)">
                                                    {{obj.number}}</p>
                                                <p class="p_one p_name">{{obj.title}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="waterFull-right" style="width:32%;float:left;margin-left:5px;">
                <div class="wrap_one float" ref="Form1" style="height:100%;border:1px solid #e6e6e6;" v-if="Form1.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form1.icon">&nbsp;{{Form1.title}}</span></p>
                        <div style="padding:10px;">
                            <div>
                                <div class="rw_first">
                                    <ul class="wrap_rw information_ul">
                                        <li v-for="(obj,index) in Form1.arr" :key="index" v-if="obj.number"
                                            :class="{rowStlye: true}">
                                            <div class="date" style="padding:15px 0px;">
                                                <p class="year shuoming" style="padding-bottom:6px;">
                                                     <span :class="obj.icon">
                                                        <el-row class="el-sm">
                                                        {{obj.tips}}
                                                        </el-row>
                                                     </span>
                                                </p>
                                                <p class="p_one" @click="jump2view(obj)" style="cursor: pointer">
                                                    {{obj.number}}</p>
                                                <p class="p_one p_name">{{obj.title}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap_one float" ref="Form4" style="height:100%;border:1px solid #e6e6e6; margin-top:10px;"
                     v-if="Form4.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form4.icon">&nbsp;{{Form4.title}}</span></p>
                        <div style="padding:10px;">
                            <div>
                                <div class="rw_first">
                                    <ul class="wrap_rw information_ul">
                                        <li v-for="(obj,index) in Form4.arr" :key="index" v-if="obj.number"
                                            :class="{rowStlye: true}">
                                            <div class="date" style="padding:15px 0px;">
                                                <p class="year shuoming" style="padding-bottom:6px;">
                                                     <span :class="obj.icon">
                                                            <el-row class="el-sm">
                                                            {{obj.tips}}
                                                            </el-row>
                                                     </span>
                                                </p>
                                                <p class="p_one" style="cursor: pointer" @click="jump2view(obj)">
                                                    {{obj.number}}</p>
                                                <p class="p_one p_name">{{obj.title}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap_one float" ref="Form7" style="height:100%;border:1px solid #e6e6e6;margin-top: 10px"
                     v-if="Form7.flag">
                    <div class="tzgg_center">
                        <p><span :class="Form7.icon">&nbsp;{{Form7.title}}</span></p>
                        <div style="padding:10px;">
                            <div>
                                <div class="rw_first">
                                    <ul class="wrap_rw information_ul">
                                        <li v-for="(obj,index) in Form7.arr" :key="index" v-if="obj.number"
                                            :class="{rowStlye: true}">
                                            <div class="date" style="padding:15px 0px;">
                                                <p class="year shuoming" style="padding-bottom:6px;">
                                                    <span :class="obj.icon">
                                                        <el-row class="el-sm">
                                                        {{obj.tips}}
                                                        </el-row>
                                                    </span>
                                                </p>
                                                <p class="p_one" style="cursor: pointer" @click="jump2view(obj)">
                                                    {{obj.number}}</p>
                                                <p class="p_one p_name">{{obj.title}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="items" style="float:left;visibility:hidden"></div>
            <div style="clear: both;"></div>
        </div>
        <notice v-if="id" :infoId="id" :callback="handleCancel"></notice>
    </div>
</template>

<script>
    import {ajaxRequest, ajaxSyncRequest} from '../util/base';
    import $ from 'jquery';
    import notice from './notice/notice';

    export default {
        name: "index",
        data() {
            return {
                informationArr: [],
                missionForm: {flag: false, arr: [], title: '', icon: ''},
                localeMissionForm: {flag: false, arr: [], title: '', icon: ''},
                certificateForm: {flag: false, arr: [], title: '', icon: ''},
                qualityForm: {flag: false, arr: [], title: '', icon: ''},
                marketForm: {flag: false, arr: [], title: '', icon: ''},
                otherForm: {flag: false, arr: [], title: '', icon: ''},
                Form1: {flag: false, arr: [], title: '', icon: ''},
                Form2: {flag: false, arr: [], title: '', icon: ''},
                Form3: {flag: false, arr: [], title: '', icon: ''},
                Form4: {flag: false, arr: [], title: '', icon: ''},
                Form5: {flag: false, arr: [], title: '', icon: ''},
                Form6: {flag: false, arr: [], title: '', icon: ''},
                Form7: {flag: false, arr: [], title: '', icon: ''},
                arr: [],
                tempObj: {},
                id: null
            }
        },
        props: {
            callback: {
                type: Function
            }
        },
        methods: {
            handleCancel: function () {
                this.id = null;
                this.more = false;
            },
            toViewInformation: function (obj) {
                this.id = obj.id;
            },
            showMoreInformation: function () {
                this.$router.push({path: '613'});
            },
            jump2view: function (obj) {
                if (obj.jumpToViewUrl) {
                    console.log(obj.jumpToViewUrl);
                    this.$router.push({path: obj.jumpToViewUrl, query: obj});
                }
            },
            beforeInitTypeData: function () {
                let _self = this;
                //先从本地缓存中读取,缓存中没有则从后台数据库中查询
                const sessionObj = localStorage.getItem("INDEX_DATA");
                if (sessionObj) {
                    _self.initTypeData(JSON.parse(sessionObj));
                } else {
                    ajaxRequest('get', 'back/index/list', {}, res => {
                        localStorage.setItem("INDEX_DATA", JSON.stringify(res.map.INDEX_DATA));
                        _self.initTypeData(res.rows);
                    });
                }
            },
            initTypeData: function (rows) {
                let _self = this;
                $.each(rows, function (index, row) {
                    let title = row.title;
                    let icon = row.icon;
                    switch (title) {
                        case '任务':
                            _self.missionForm.arr = row.missionList;
                            _self.missionForm.title = title;
                            _self.missionForm.icon = icon;
                            _self.arr.push(_self.missionForm);
                            break;
                        case '现场':
                            _self.localeMissionForm.arr = row.localeMissionList;
                            _self.localeMissionForm.title = title;
                            _self.localeMissionForm.icon = icon;
                            _self.arr.push(_self.localeMissionForm);
                            break;
                        case '证书/记录':
                            _self.certificateForm.arr = row.certificateAndRecordList;
                            _self.certificateForm.title = title;
                            _self.certificateForm.icon = icon;
                            _self.arr.push(_self.certificateForm);
                            break;
                        case '质量':
                            _self.qualityForm.arr = row.qualityList;
                            _self.qualityForm.title = title;
                            _self.qualityForm.icon = icon;
                            _self.arr.push(_self.qualityForm);
                            break;
                        case '市场':
                            _self.marketForm.arr = row.marketList;
                            _self.marketForm.title = title;
                            _self.marketForm.icon = icon;
                            _self.arr.push(_self.marketForm);
                            break;
                        case '其它':
                            _self.otherForm.arr = row.otherList;
                            _self.otherForm.title = title;
                            _self.otherForm.icon = icon;
                            _self.arr.push(_self.otherForm);
                            break;
                    }
                });
                _self.initLayOut();
            },
            initLayOut: function () {
                let _self = this;
                for (let i = 0; i < _self.arr.length; i++) {
                    let obj = _self.arr[i];
                    obj.arr.forEach((v, k) => {
                        ajaxRequest("get", "back/" + v.ajaxUrl, {nodePower: v.nodePower}, res => {
                            v.number = res.total;

                            obj.flag = obj.flag || v.number > 0
                            if (obj.flag) {
                                if (!this.tempObj.hasOwnProperty(i)) {
                                    this.tempObj[i] = {
                                        icon: obj.icon,
                                        title: obj.title,
                                        flag: true,
                                        arr: []
                                    };

                                }
                                this.tempObj[i]["arr"].push(v);
                                this["Form" + (i+1)] = this.tempObj[i];
                            }
                        });
                    });
                }
            },
            initInformation: function () {
                let _self = this;
                ajaxRequest("get", "back/notice/getMainNoticeList", {}, res => {
                    if (res.code === 200) {
                        $.each(res.rows, function (k, v) {
                            let obj = {
                                year: v.showTime.substring(0, 4),
                                month: v.showTime.substring(5, 7),
                                day: v.showTime.substring(8, 10),
                                title: v.noticeTitle,
                                author: v.showPersonName,
                                id: v.id
                            };
                            _self.informationArr.push(obj);
                        });
                    }
                });

            }
        }
        ,
        components: {
            notice
        }
        ,
        mounted() {
            this.beforeInitTypeData();
            this.initInformation();

        }
    }
</script>

<style scoped>

    p {
        line-height: 1.4 !important;
    }

    .rowStlye:nth-child(3n) {
        border-right: 1px transparent;
    }

    .rowStlye {
        border-right: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        width: 30%;
    }

    .columnStyle {
        border-bottom: 1px transparent;
    }

    * {
        margin: 0px;
        padding: 0px;
    }

    li {
        list-style: none;
    }

    .wrap .tz_list_time {
        width: 15%;
        line-height: 20px;
        float: left
    }

    .wrap .tz_list_news {
        width: 83%;
        margin-left: 2%;
        clean: both;
    }

    .wrap_one {
        overflow-x: auto;
        background: white;
        box-sizing: border-box;
        break-inside: avoid;
        padding: 5px;
    }

    .information {
    }

    .tzgg_center {
        width: 98%;
        margin: 0 auto;
        overflow: hidden;
    }

    .tzgg_center > p {
        padding: 9px 15px;
        border-bottom: 1px solid #e1e1e1;
    }

    .information_first {
        padding: 6px 0px;
        width: 100%;
        overflow: hidden;
        height: 70px;
        border-bottom: 1px solid #e1e1e1;
    }

    .information_ul {
        height: 100%;
    }

    .date {
        text-align: center;
    }

    .year {
        font-size: 40px;
        color: #a3a3a3;
    }

    .md {
        font-size: 14px;
        position: relative;
        top: 7px;
        color: #bcbcbc;
    }

    .point b {
        transition: all 0.1s linear;
        top: 0;
        left: 0;
    }

    .news p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer
    }

    .news .news_name {
        font-size: 18px;
    }

    .news .name {
        font-size: 12px;
        color: #c5c5c5;
        padding-top: 5px;
    }

    .information {
        height: 298px;
        overflow: hidden;
    }

    .work {
        height: 298px;
        overflow: hidden;
    }

    .gzl_first {
        width: 48.6%;
        overflow: hidden;
        height: 100px;
        float: left;
        border: 1px solid #eee;
        margin-left: 5px;
        margin-top: 15px;
    }

    .rw_first {
        padding: 5px 0px;
        width: 100%;
        overflow: hidden;
        height: 100%;
    }

    .but {
        background: none;
        border: none;
        color: white;
        border-radius: 15px;
        font-size: 16px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        outline: none;
        cursor: pointer
    }

    .but_one {
        background: #fb7a60;
    }

    .but_two {
        background: #3ab9f0;
    }

    .but_three {
        background: #ffa200;
    }

    .but_four {
        background: #a3d273;
    }

    .but .but_one:hover {
        background: red;
    }

    .tishi {
        position: absolute;
        margin-left: 20px;
        cursor: pointer
    }

    .p_one {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
    }

    .p_name {
        font-size: 14px;
        color: #9c9c9c;
    }

    .wrap_rw li {
        float: left;
    }

    .tzgg_center .more {
        float: right;
        border: 1px solid #ccc;
        padding: 2px 10px 2px 10px;
        font-size: 14px;
        border-radius: 1em;
    }

    .tzgg_center .more:hover {
        border: 1px solid #62c4f5;
        color: #62c4f5;
    }

    .information_first:hover {
        color: #62c4f5;
        border-right: 1px solid #62c4f5;
    }

    .MetaCenter .float {
        margin-top: 5px;
        break-inside: avoid;
    }

    .shuoming {
        border: none !important;
        /*color: #56BC4E !important;*/
        /*font-size: 16px !important;*/
    }

    .shuoming::after {
        content: "";
        width: 35px;
        height: 40px;
        z-index: 999;
    }

    .el-sm {
        background: #ffffff;
        position: absolute;
        z-index: 999;
        -webkit-box-shadow: 1px 7px 33px -9px #969696;
        box-shadow: 1px 7px 33px -9px #969696;
        border: 1px solid #56bc4e8c;
        border-radius: 5px;
        color: dimgrey;
        width: 120px;
        word-break: break-all;
        margin-top: 18px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming .el-sm {
        display: none;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .dress {
    }

    /*.wrap_one {*/
    /*height: 525px;*/
    /*border: 1px solid #e6e6e6;*/
    /*}*/

    @media screen and (max-width: 1500px) {
        .gzl_first {
            width: 97%;
        }
    }

    @media screen and (min-width: 1500px) {
        .gzl_first {
            width: 46.6%;
        }
    }

    @media screen and (max-width: 1500px) {
        .dress {
            margin-left: 120px;
        }
    }

    @media screen and (min-width: 1500px) {
        .dress {
            margin-left: 20px;
        }
    }

</style>
