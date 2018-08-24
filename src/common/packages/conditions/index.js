import mindCondition from './src/Retrieve';

/* istanbul ignore next */
mindCondition.install = function(Vue) {
  Vue.component(mindCondition.name, mindCondition);
};

export default mindCondition;