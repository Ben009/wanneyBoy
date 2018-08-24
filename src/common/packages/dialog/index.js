import mindDialog from './src/component';

/* istanbul ignore next */
mindDialog.install = function(Vue) {
  Vue.component(mindDialog.name, mindDialog);
};

export default mindDialog;
