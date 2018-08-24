import dataGrid from './src/main';

/* istanbul ignore next */
dataGrid.install = function(Vue) {
  Vue.component(dataGrid.name, dataGrid);
};

export default dataGrid;