KindEditor.plugin('njmindFontInsert', function(K) {
	var self = this, name = 'njmindFontInsert';
	self.clickToolbar(name, function(){
		function chunk(arr, size) {
		  var arr2=[];
		  for(var i=0;i<arr.length;i=i+size){
		    arr2.push(arr.slice(i,i+size));
		  }
		  return arr2;
		}
		let commonFontList = K.queryAll('.commonFont',window.parent.document.getElementsByClassName('fontBoxes')[0]),
				diyFontList = K.queryAll('.diyFont',window.parent.document.getElementsByClassName('fontBoxes')[0]),
				fontObj = [{
					title:'通用特殊字符',
					content:[]
				},{
					title:'自有特殊字符',
					content:[]
				}],
				[transCommonList,transDiyList] = [[],[]];
				K.each(commonFontList,(index,val) => {
					transCommonList.push(val.innerHTML)
				});
				K.each(diyFontList,(index,val) => {
					transDiyList.push(val.innerHTML)
				});
				fontObj[0]['content'] = chunk(transCommonList,5);
				fontObj[1]['content'] = chunk(transDiyList,5);
		self.createMenu({
			name : name,
			fontSlug : true,
			data : fontObj,
			click : function(data) {
				let sValue = self.selectedHtml();
				let cValue = `<span style="font-family: njmindFont;">${data}</span>${sValue}`;
				self.insertHtml(cValue)
				self.hideMenu();
			}
		});
	});
});