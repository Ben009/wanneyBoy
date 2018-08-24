import Tree from '../packages/tree/index.js';
import Table from '../packages/table/index.js';
import Select from '../packages/select/index.js';
import Input from '../packages/input/index.js';
import Checkbox from '../packages/checkbox/index.js';
import Uploadfile from '../packages/upfile/index.js';
import UpImage from '../packages/upimage/index.js';
import Tablebase from '../packages/table-base/index.js';
import Pagination from '../packages/pagination/index.js'; 
import Dialog from '../packages/dialog/index.js';
import DataGrid from '../packages/datagrid/index.js';
import MindCondition from '../packages/conditions/index.js';
import GlobalTootips from '../packages/Tootips/index.js'

const components = [
	Tree,
	Table,
	Tablebase,
	Select,
	Input,
	Checkbox,
	Uploadfile,
	UpImage,
	Pagination, 
	Dialog,
	DataGrid,
	MindCondition,
	GlobalTootips
]

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
	version: '1.0.0',
	install,
	Tree,
	Table,
	Tablebase,
	Select,
	Input,
	Checkbox,
	Uploadfile,
	UpImage,
	Pagination, 
	Dialog,
	DataGrid,
	MindCondition,
	GlobalTootips
}

module.exports.default = module.exports;
