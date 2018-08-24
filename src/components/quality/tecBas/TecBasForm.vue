<template>
  <div>111111111111111</div>
</template>

<script>
import Vue from 'vue'
import vuex from 'vuex'

// 引入封装的ajax控件
import {ajaxRequest, ajaxProxyRequest, formatDate} from '../../util/base'
// 引入jquery
import $ from 'jquery'
// 引入右击事件 可自行绑定到输入框
import rightclick from '../../../directives/rightcilck'
import rightClick from '../../../mixins/FormRightClick'
import TecBasListForSelect from './TecBasListForSelect'

// --从element  中引入表单控件
/* import {
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
  Upload
} from 'element--ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload) */
// 声明消息提示控件
// Vue.prototype.$confirm=

const defaults = {
  controlled: 1,
  status: 0
}
export default {
  name: 'tecBasForm',
  data: function () {
    let releaseDateValidator = (rule, value, callback) => {
      if (value !== '') {
        if (this.form.implementationDate) {
          if (value > this.form.implementationDate) {
            callback(new Error('发布日期不能大于实施日期!'))
            return
          }
        }
        if (this.form.expireDate) {
          if (value > this.form.expireDate) {
            callback(new Error('发布日期不能大于作废日期!'))
            return
          }
        }
        callback()
      } else {
        callback()
      }
    }
    let implementationDateValidator = (rule, value, callback) => {
      if (value !== '') {
        let thisDay = new Date().format('YYYY-MM-DD')
        if (this.form.releaseDate) {
          if (value < this.form.releaseDate) {
            callback(new Error('实施日期不能小于发布日期!'))
            return
          }
          if (thisDay < value) {
            this.form.status = 2
          }
        }
        if (this.form.expireDate) {
          if (value > this.form.expireDate) {
            callback(new Error('实施日期不能大于作废日期!'))
            return
          }
          if (thisDay > this.form.expireDate) {
            this.form.status = 1
          } else if (thisDay > value) {
            this.form.status = 0
          }
        }
        callback()
      } else {
        callback()
      }
    }
    let expireDateValidator = (rule, value, callback) => {
      if (value !== '') {
        let thisDay = new Date().format('YYYY-MM-DD')
        if (this.form.releaseDate) {
          if (value < this.form.releaseDate) {
            callback(new Error('作废日期不能小于发布日期!'))
            return
          }
          if (thisDay < this.form.implementationDate) {
            this.form.status = 2
          }
        }
        if (this.form.implementationDate) {
          if (value < this.form.implementationDate) {
            callback(new Error('作废日期不能小于实施日期!'))
            return
          }
          if (thisDay > value) {
            this.form.status = 1
          } else if (thisDay > this.form.implementationDate) {
            this.form.status = 0
          }
        }
        callback()
      } else {
        callback()
      }
    }
    let statusValidator = (rule, value, callback) => {
      if (value === 0) {
        let thisDay = new Date().format('YYYY-MM-DD')
        if (this.form.implementationDate) {
          if (this.form.implementationDate > thisDay) {
            callback(new Error('技术依据未到实施日期'))
            return
          }
        }
        if (this.form.expireDate) {
          if (this.form.expireDate < thisDay) {
            callback(new Error('依据依据已过作废日期'))
            return
          }
        }
      }
      callback()
    }
    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        // 校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
        name: [{type: 'string', required: true, message: '技术依据名称'}, {
          max: 200,
          message: '最多输入200个字符',
          trigger: 'blur'
        }],
        nameE: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
        basisNo: [{max: 100, message: '最多输入100个字符', trigger: 'blur'}],
        basisNoE: [{max: 100, message: '最多输入100个字符', trigger: 'blur'}],
        location: [{max: 100, message: '最多输入100个字符', trigger: 'blur'}],
        releaseDate: [{validator: releaseDateValidator, trigger: 'blur'}],
        implementationDate: [{validator: implementationDateValidator, trigger: 'blur'}],
        expireDate: [{validator: expireDateValidator, trigger: 'blur'}],
        status: [{validator: statusValidator, trigger: 'blur'}],
        profession: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
        author: [{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
        amount: [{message: '请输入数字', type: 'number', trigger: 'blur'}],
        price: [{message: '请输入数字', type: 'number', trigger: 'blur'}],
        pagination: [{max: 100, message: '最多输入100个字符', trigger: 'blur'}],
        remark: [{max: 100, message: '最多输入100个字符', trigger: 'blur'}],
        department: [{required: true, message: '所属部门不能为空', trigger: 'blur'}]
        //          description: [{type: 'string', required: true, message: '角色描述不能为空'}]
      },
      paramObj: this.$route.query,
      loading: false,
      remoteOptions: [],
      basisTypes: [],
      basisStatus: [],
      departments: [],
      annexs: '',
      fileList: [],
      limitNumb: 4, // 附件上传个数限制,
      tecBasSubs: [{tecBasName: '', basisSId: null, sort: 1}],
      selectTecBasFlag: false,
      tecBasIds: [],
      index: 0,
      row: {}
    }
  },
  created () {
    // // 部门列表
    // ajaxProxyRequest('get', '/njmind/findParam/departmentList', {}, function (res) {
    //   this.departments = res.list
    // }.bind(this))
    // // debugger;
    // ajaxProxyRequest('get', '/njmind/findParam/basisType', {}, function (res) {
    //   // debugger;
    //   this.basisTypes = res.list
    // }.bind(this))
    // ajaxProxyRequest('get', '/njmind/findParam/basisStatus', {}, function (res) {
    //   // debugger;
    //   this.basisStatus = res.list
    // }.bind(this))
  },
  components: {
    TecBasListForSelect
  },
  mounted () {
    // 页面渲染完成后，ajax请求加载数据
    // this.remoteMethod()
  },
  directives: {rightclick},
  mixins: [rightClick],
  methods: {
    // 方法定义
    disabledReleaseDate: function (time) {
      if (this.form.implementationDate) {
        return new Date(this.form.implementationDate).getTime() < time.getTime()
      }
      if (this.form.expireDate) {
        return new Date(this.form.expireDate).getTime() < time.getTime()
      }
      return false
    },
    disabledExpireDate: function (time) {
      if (this.form.implementationDate) {
        return new Date(this.form.implementationDate).getTime() > time.getTime()
      }
      if (this.form.releaseDate) {
        return new Date(this.form.releaseDate).getTime() > time.getTime()
      }
      return false
    },
    disabledImplementationDate: function (time) {
      if (this.form.releaseDate && this.form.expireDate) {
        return new Date(this.form.releaseDate).getTime() > time.getTime() || time.getTime() > new Date(this.form.expireDate).getTime()
      }
      if (this.form.releaseDate) {
        return new Date(this.form.releaseDate).getTime() > time.getTime()
      }
      if (this.form.expireDate) {
        return new Date(this.form.expireDate).getTime() < time.getTime()
      }
      return false
    },
    selectTecBas: function (flag, index) {
      this.tecBasIds = []
      for (let i = 0; i < this.tecBasSubs.length; i++) {
        let tecBas = this.tecBasSubs[i]
        if (tecBas.basisSId != null) {
          this.tecBasIds[this.tecBasIds.length] = tecBas.basisSId
        }
      }
      if (this.form.id != null && this.form.id != '') {
        this.tecBasIds[this.tecBasIds.length] = this.form.id
      }
      this.selectTecBasFlag = flag
      this.index = index == null ? 0 : index
    },
    recheckTecBas: function () {
      this.tecBasSubs[this.index] = {tecBasName: '', basisSId: null}
      this.tecBasIds = []
      for (let i = 0; i < this.tecBasSubs.length; i++) {
        let tecBas = this.tecBasSubs[i]
        if (tecBas.basisSId != null) {
          this.tecBasIds[this.tecBasIds.length] = tecBas.basisSId
        }
      }
      if (this.form.id != null && this.form.id != '') {
        this.tecBasIds[this.tecBasIds.length] = this.form.id
      }
      return this.tecBasIds
    },
    checkRow (row, index) {
      let tecTemp = {tecBasName: row.name, basisSId: row.id, sort: index + 1, basisId: this.form.id}
      this.tecBasSubs[index] = tecTemp
    },
    callBack (file, list) {
      this.fileList = list
    },
    handleCancel () {
      if (this.form.id && this.form.id != '') {
        this.$router.back(-1)
      } else {
        try {
          this.form = $.extend({}, defaults, this.data || {})
          this.tecBasSubs = [{tecBasName: null, basisSId: null, sort: null, basisId: null}]
          this.fileList = []
          this.$refs.upload.deleteFile()
        } catch (e) {
        }
      }
    },
    handleSubmit: function () {
      // -- 表单提交处理 --
      let _this = this
      let annexs = ''
      if (this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          annexs = this.fileList[i].id + ',' + annexs
        }
      }
      if (annexs != '') {
        annexs = annexs.substring(0, annexs.length - 1)
        _this.form.annexs = annexs
      }
      let arr = []
      $(this.tecBasSubs).each(function (index) {
        if (_this.tecBasSubs[index].basisSId != null && _this.tecBasSubs[index].basisSId != '') {
          arr[index] = _this.tecBasSubs[index]
        }
      })
      if (arr.length > 0) {
        this.form.tecBasSubStr = JSON.stringify(arr)
      }
      this.$refs.form.validate((valid) => { // 校验成功则回调提交数据
        if (valid) {
          var httpMethod// http请求方式
          delete this.form.addTime
          delete this.form.updateTime
          if (this.form.releaseDate) {
            this.form.releaseDate = formatDate(this.form.releaseDate, 'YYYY-MM-DD')
          }
          if (this.form.implementationDate) {
            this.form.implementationDate = formatDate(this.form.implementationDate, 'YYYY-MM-DD')
          }
          if (this.form.expireDate) {
            this.form.expireDate = formatDate(this.form.expireDate, 'YYYY-MM-DD')
          }
          if (this.form.purchaseDate) {
            this.form.purchaseDate = formatDate(this.form.purchaseDate, 'YYYY-MM-DD')
          }
          if (!this.form.id || this.form.id == '') { // 新增 注意:通过id是否存在来判断是新增还是编辑
            httpMethod = 'post'
          } else { // 更新
            httpMethod = 'put'
          }
          delete this.form.tecBasSubs
          this.$confirm('确认保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest(httpMethod, 'back/tecBas/', this.form, (res) => {
              if (res.code == 200) {
                this.$message.success('保存成功')
                this.handleCancel()
              } else {
                this.$message.error('保存失败')
              }
            })
          })
        } else {
          return false
        }
      })
    },

    remoteMethod: function () {
      if (this.paramObj && this.paramObj.id) {
        ajaxRequest('get', 'back/tecBas/', {id: this.paramObj.id}, (data) => {
          if (data.code == 200) {
            data = data.daoResult
            for (let key in data) {
              if (data[key] == null) {
                delete data[key]
              }
            }
            delete data.addTime
            delete data.updateTime
            this.form = data
            if (this.form.annexs) {
              this.$refs.upload.loadAttacheIds(this.form.annexs)
            }
            if (data.tecBasSubs.length > 0) {
              this.tecBasSubs = data.tecBasSubs
            }
          }
        })
      }
    },
    addTecBasSub () {
      this.tecBasSubs.push({tecBasName: '', basisSId: null})
    },
    removeTecBasSub (tecBas) {
      var index = this.tecBasSubs.indexOf(tecBas)
      if (index !== -1) {
        this.tecBasSubs.splice(index, 1)
      }
      if (this.tecBasSubs.length == 0) {
        this.tecBasSubs.push({tecBasName: '', basisSId: null, sort: 1})
      } else {
        let _this = this
        $(_this.tecBasSubs).each(function (index) {
          _this.tecBasSubs[index].sort = index + 1
        })
      }
    }
  }
}
</script>

<style type="text/css" lang="scss">
  .baseDetaildark {
    border: 1px solid #14a7fb !important;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .custom-1d74b7 .el-col-8 {
    width: 25%;
  }
</style>
