import Tablebase from './src/main';

/* istanbul ignore next */
Tablebase.install = function(Vue) {
  Vue.component(Tablebase.name, Tablebase);
};

export default Tablebase;