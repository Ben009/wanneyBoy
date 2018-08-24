<template>
  <div :class="themeColor" v-show="showPopper">
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
      <ul class="el-dropdown-menu el-popper" :class="[size && `el-dropdown-menu--${size}`]" v-show="showPopper">
        <slot></slot>
      </ul>
  </transition>
  </div>
</template>
<script>
  import Popper from '@/common-el/src/utils/vue-popper';
  import store from '@/store'; // vuex仓库
  export default {
    name: 'ElDropdownMenu',

    componentName: 'ElDropdownMenu',

    mixins: [Popper],

    props: {
      visibleArrow: {
        type: Boolean,
        default: true
      },
      arrowOffset: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        size: this.dropdown.dropdownSize
      };
    },

    inject: ['dropdown'],

    created() {
      this.$on('updatePopper', () => {
        if (this.showPopper) this.updatePopper();
      });
      this.$on('visible', val => {
        this.showPopper = val;
      });
    },

    mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$el;
    },
    computed: {
      themeColor() {
        return "custom-" + store.state.admin.themeColor
      },
    },
    watch: {
      'dropdown.placement': {
        immediate: true,
        handler(val) {
          this.currentPlacement = val;
        }
      }
    }
  };
</script>
