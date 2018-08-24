import mindUpImage from './src/main';

/* istanbul ignore next */
mindUpImage.install = function(Vue) {
  Vue.component(mindUpImage.name, mindUpImage);
};

export default mindUpImage;