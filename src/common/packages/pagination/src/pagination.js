import Pager from './pager.vue';
import ElSelect from '@/common-el/packages/select';
import ElOption from '@/common-el/packages/option';
import ElInput from '@/common-el/packages/input';
import Locale from '@/common-el/src/mixins/locale';
import { valueEquals } from '@/common-el/src/utils/util';

export default {
  name: 'mindPagination',

  props: {
    pageSize: {
      type: Number,
      default: 10
    },

    small: Boolean,

    total: Number,

    pageCount: Number,

    pagerCount: {
      type: Number,
      validator(value) {
        return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1;
      },
      default: 7
    },

    currentPage: {
      type: Number,
      default: 1
    },

    layout: {
      //default: 'prev, pager, next, jumper, ->, total'
      default: 'firstp,prev, jumper,next,lastp,sizes,countpage,total'
    },

    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100];
      }
    },

    popperClass: String,
    firstText: {type: String, default:"首页"},
    lastText:{type: String, default:"末页"},
    prevText: {type: String, default:""},
    nextText: {type: String, default:""},

    background: Boolean, 
    disabled: Boolean,
    /** 分页下部是否显示间距  */
    marginBottom:  {type: Boolean, default:true},
  },

  data() {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0,
      lastEmittedPage: -1,
      userChangePageSize: false
    };
  },

  render(h) {
    let template = this.marginBottom? (<div style="margin-bottom:50px;" class={['el-pagination', {
      'is-background': this.background,
      'el-pagination--small': this.small
    }] }></div> ): (<div class={['el-pagination', {
      'is-background': this.background,
      'el-pagination--small': this.small
    }] }></div>); 
    const layout = this.layout || '';
    if (!layout) return;
    const TEMPLATE_MAP = {
      firstp:<firstp></firstp>,//首页
      lastp:<lastp ></lastp>,//末页  
      prev: <prev></prev>,
      jumper: <jumper></jumper>,
      pager: <pager currentPage={ this.internalCurrentPage } pageCount={ this.internalPageCount } pagerCount={ this.pagerCount } on-change={ this.handleCurrentChange } disabled={ this.disabled }></pager>,
      next: <next></next>,
      sizes: <sizes pageSizes={ this.pageSizes }></sizes>,
      slot: <my-slot></my-slot>,
      total: <total></total>,
      countpage: <countpage></countpage>    
};
    const components = layout.split(',').map((item) => item.trim());
    const rightWrapper = <div class="el-pagination__rightwrapper"></div>;
    let haveRightWrapper = false;

    template.children = template.children || [];
    rightWrapper.children = rightWrapper.children || [];
    components.forEach(compo => {
      if (compo === '->') {
        haveRightWrapper = true;
        return;
      }

      if (!haveRightWrapper) {
        template.children.push(TEMPLATE_MAP[compo]);
      } else {
        rightWrapper.children.push(TEMPLATE_MAP[compo]);
      }
    });

    if (haveRightWrapper) {
      template.children.unshift(rightWrapper);
    }

    return template;
  },

  components: {
    MySlot: {
      render(h) {
        return (
          this.$parent.$slots.default
            ? this.$parent.$slots.default[0]
            : ''
        );
      }
    },
    Firstp:{//首页
      render(h) {
        return (
          <button
            type="button"
            class={['btn-prev', { disabled: this.$parent.disabled || this.$parent.internalCurrentPage <= 1 }]}
            on-click={ this.$parent.firstp }>
            {
              this.$parent.firstText
                ? <span>{ this.$parent.firstText }</span>
                : <i class="el-icon el-icon-limit-left"></i>
            }
          </button>
        );
      }
    },
    Lastp:{//末页
      methods: {
        handleKeyup({ keyCode, target }) {
          if (keyCode === 13 && this.oldValue && target.value !== this.oldValue) {
            this.handleChange(target.value);
          }
        },
      },
      render(h) {
        return (
          <button
            type="button"
            class={[ 'btn-next',
              { disabled: this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            ]}
            on-click={ this.$parent.lastp }>
            {
              this.$parent.lastText
                ? <span>{ this.$parent.lastText }</span>
                : <i class="el-icon el-icon-limit-right"></i>
            }
          </button>
        );
      }
    },
    Prev: {//上页
      render(h) {
        return (
          <button style="width: 28px; height: 28px; border-radius: 2em; border: 1px solid #c0c4cc;"
            type="button" 
            class={['btn-prev', { disabled: this.$parent.disabled || this.$parent.internalCurrentPage <= 1 }]}
            on-click={ this.$parent.prev }>
            {
              this.$parent.prevText
                ? <span>{ this.$parent.prevText }</span>
                : <i class="iconfont el-icon-arrow-left"></i>
            }
          </button>
        );
      }
    },

    Next: {//下页
      render(h) {
        return (
          <button style="width: 28px; height: 28px; border-radius: 2em; border: 1px solid #c0c4cc;"
            type="button"
            class={[
              'btn-next',
              { disabled: this.$parent.disabled || this.$parent.internalCurrentPage === this.$parent.internalPageCount || this.$parent.internalPageCount === 0 }
            ]}            on-click={ this.$parent.next }>
            {
              this.$parent.nextText
                ? <span>{ this.$parent.nextText }</span>
                : <i class="iconfont el-icon-arrow-right"></i>
            }
          </button>
        );
      }
    },
    countpage:{
      render(h) {
        return (
          <span class="el-pagination__countpage" style="margin-top:3px; margin-left:5px;">/共{Math.ceil(this.$parent.total / this.$parent.internalPageSize)}页</span>
        );
      }
    },
    Sizes: {
      mixins: [Locale],

      props: {
        pageSizes: Array
      },

      watch: {
        pageSizes: {
          immediate: true,
          handler(newVal, oldVal) {
            if (valueEquals(newVal, oldVal)) return;
            if (Array.isArray(newVal)) {
              this.$parent.internalPageSize = newVal.indexOf(this.$parent.pageSize) > -1
                ? this.$parent.pageSize
                : this.pageSizes[0];
            }
          }
        }
      },

      render(h) {
        return (
          <span class="el-pagination__sizes" style="margin-top:3px;">
            <el-select
              value={ this.$parent.internalPageSize * 1 }
              popperClass={ this.$parent.popperClass || '' }
              on-input={ this.handleChange }
              autoWidth={ true }              
              disabled={ this.$parent.disabled }>
              {
                this.pageSizes.map(item =>
                  <el-option
                    value={ item * 1 }
                    label={ item + this.t('el.pagination.pagesize') }>
                  </el-option>
                )
              }
            </el-select>
          </span>
        );
      },

      components: {
        ElSelect,
        ElOption
      },

      methods: {
        handleChange(val) {
          if (val !== this.$parent.internalPageSize) {
            this.$parent.internalPageSize = val = parseInt(val, 10);
            this.$parent.userChangePageSize = true;
            this.$parent.$emit('size-change', val);
          }
        }
      }
    },

    Jumper: {
      mixins: [Locale],

      data() {
        return {
          oldValue: null
        };
      },

      components: { ElInput },

      watch: {
        '$parent.internalPageSize'() {
          this.$nextTick(() => {
            this.$refs.input.$el.querySelector('input').value = this.$parent.internalCurrentPage;
          });
        }
      },

      methods: {
        handleFocus(event) {
          this.oldValue = event.target.value;
        },
        handleBlur({ target }) {
          this.resetValueIfNeed(target.value);
          this.reassignMaxValue(target.value);
        },
        handleKeyup({ keyCode, target }) {
          if (keyCode === 13 && this.oldValue && target.value !== this.oldValue) {
            this.handleChange(target.value);
          }
        },
        handleChange(value) {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value);
          this.$parent.emitChange();
          this.oldValue = null;
          this.resetValueIfNeed(value);
        },
        resetValueIfNeed(value) {
          const num = parseInt(value, 10);
          if (!isNaN(num)) {
            if (num < 1) {
              this.$refs.input.$el.querySelector('input').value = 1;
            } else {
              this.reassignMaxValue(value);
            }
          }
        },
        reassignMaxValue(value) {
          if (+value > this.$parent.internalPageCount) {
            this.$refs.input.$el.querySelector('input').value = this.$parent.internalPageCount;
          }
        }
      },

      render(h) {
        return (
          <span class="el-pagination__jump">
            { this.t('el.pagination.goto') }
            <el-input
              class="el-pagination__editor is-in-pagination"
              min={ 1 }
              max={ this.$parent.internalPageCount }
              value={ this.$parent.internalCurrentPage }
              domPropsValue={ this.$parent.internalCurrentPage }
              type="number"
              ref="input"
              disabled={ this.$parent.disabled }
              nativeOnKeyup={ this.handleKeyup }
              onChange={ this.handleChange }
              onFocus={ this.handleFocus }
              onBlur={ this.handleBlur }/>
            { this.t('el.pagination.pageClassifier') }
          </span>
        );
      }
    },

    Total: {
      mixins: [Locale],

      render(h) {
        return (
          typeof this.$parent.total === 'number'
            ? <span style="font-weight: normal; margin-left: 10px;margin-top: 2px;"> <span style="color:#3094e0;position:relative;top:-3px; font-size:14px;" class="el-pagination__total">{ this.t('el.pagination.total', { total: this.$parent.total }) }</span></span>
            : ''
        );
      }
    },
    Pager
  },

  methods: {
    handleCurrentChange(val) {
      this.internalCurrentPage = this.getValidCurrentPage(val);
      this.userChangePageSize = true;
      this.emitChange();
    },
    firstp() {
      if (this.disabled) return;
      this.internalCurrentPage = this.getValidCurrentPage(1);
      this.userChangePageSize = true;
      this.emitChange();
    },    
    prev() {
      if (this.disabled) return;
      const newVal = this.internalCurrentPage - 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('prev-click', this.internalCurrentPage);
      this.emitChange();
    },

    next() {
      if (this.disabled) return;
      const newVal = this.internalCurrentPage + 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('next-click', this.internalCurrentPage);
      this.emitChange();
    },
    lastp() {
      if (this.disabled) return;
      const newVal=Math.ceil(this.total / this.internalPageSize);
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
      this.$emit('next-click', this.internalCurrentPage);
      this.emitChange();
    }, 
    getValidCurrentPage(value) {
      value = parseInt(value, 10);

      const havePageCount = typeof this.internalPageCount === 'number';

      let resetValue;
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1;
      } else {
        if (value < 1) {
          resetValue = 1;
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount;
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1;
      } else if (resetValue === 0) {
        resetValue = 1;
      }

      return resetValue === undefined ? value : resetValue;
    },

    emitChange() {
      this.$nextTick(() => {
        if (this.internalCurrentPage !== this.lastEmittedPage || this.userChangePageSize) {
          this.$emit('current-change', this.internalCurrentPage);
          this.lastEmittedPage = this.internalCurrentPage;
          this.userChangePageSize = false;
        }
      });
    }
  },

  computed: {
    internalPageCount() {
      if (typeof this.total === 'number') {
        return Math.ceil(this.total / this.internalPageSize);
      } else if (typeof this.pageCount === 'number') {
        return this.pageCount;
      }
      return null;
    }
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
        this.internalCurrentPage = val;
      }
    },

    pageSize: {
      immediate: true,
      handler(val) {
        this.internalPageSize = isNaN(val) ? 10 : val;
        console.log(this.internalPageSize,'this.internalPageSize')
      }
    },

    internalCurrentPage: {
      immediate: true,
      handler(newVal, oldVal) {
        newVal = parseInt(newVal, 10);

        /* istanbul ignore if */
        if (isNaN(newVal)) {
          newVal = oldVal || 1;
        } else {
          newVal = this.getValidCurrentPage(newVal);
        }

        if (newVal !== undefined) {
          this.internalCurrentPage = newVal;
          if (oldVal !== newVal) {
            this.$emit('update:currentPage', newVal);
          }
        } else {
          this.$emit('update:currentPage', newVal);
        }
        this.lastEmittedPage = -1;
      }
    },

    internalPageCount(newVal) {
      /* istanbul ignore if */
      const oldPage = this.internalCurrentPage;
      if (newVal > 0 && oldPage === 0) {
        this.internalCurrentPage = 1;
      } else if (oldPage > newVal) {
        this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        this.userChangePageSize && this.emitChange();
      }
      this.userChangePageSize = false;
    }
  }
};
