import GlobalTootips from './src/main';

/* istanbul ignore next */
GlobalTootips.install = function(Vue) {
  Vue.component(GlobalTootips.name, GlobalTootips);
};

export default GlobalTootips;