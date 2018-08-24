import uploadfile from './src/main';

/* istanbul ignore next */
uploadfile.install = function(Vue) {
  Vue.component(uploadfile.name, uploadfile);
};

export default uploadfile;