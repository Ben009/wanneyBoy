//20180604 修改userAgent，增加判断标志，在非容器中使用时不产生错误
//import {Message} from 'element-ui';


var CsharpObject = function () {
	var browserType = 0;//浏览器类型 0 ie；1 chrome
	var CsharpReturnValue = "";//返回值
	var CsharpObject1 = function () {

		//取得浏览器的userAgent字符串
		if (navigator.userAgent.indexOf("CefSharp") > -1) {
			browserType = 1;//alert("Chrome");
		}
		else if (navigator.userAgent.indexOf("IECsharp") > -1) {
			browserType = 0;//ie
		} else {
			AlertMessage();
			browserType = -1;
		}
		//重置结果值
		CsharpReturnValue = "";


		//测试方法
		this.TestAlert = function () {
			if (browserType == 1) {
				jsObj.TestMethod();
			}
			else if (browserType == 0) {
				window.external.TestMethod();
			}
			alert(browserType)
		};

		//excel容器：打开excel
		//参数：
		//name/string：Excel标志名
		//PnlWidth/int：excel初始化宽度
		//PnlHeight/int：excel初始化高度
		//json/string：初始化参数
		/*json参数如下：
				{"excelname":"E:\\TestDocuments\\test.xlsx",    //excel文件名
		"RangeVersion":"new",                           //红蓝框数据格式(new|old)
		"redwidth":"520",                               //红框宽度
		"redheight":"640",                              //红框高度
		"redrange":"{}",                                //红框数据
		"bluewidth":"520",                              //蓝框宽度
		"blueheight":"320",                             //蓝框高度
		"bluerange":"{}",                               //蓝框数据
		"range_cb":"range_cb",                          //画红蓝框回调js方法名
		"btnType":"1"}                                  //按钮显示参数:0 不显示，1 显示
		*/
		this.ConExcelListOpen = function () {
			if (browserType == 1) {
				jsObj.ConExcelListOpen(arguments[0], Number(arguments[1]), arguments[2], arguments[3])
			}
			else if (browserType == 0) {
				window.external.ConExcelListOpen(window, arguments[0], Number(arguments[1]), arguments[2], arguments[3])
			}
		};
		//excel容器：显示excel
		//参数：
		//name/srting：Excel标志名
		this.ConExcelListShow = function () {
			if (browserType == 1) {
				jsObj.ConExcelListShow(arguments[0])
			}
			else if (browserType == 0) {
				window.external.ConExcelListShow(arguments[0])
			}
		}

		//excel容器：关闭excel
		//参数：
		//name/srting：Excel标志名
		this.ConExcelListClose = function () {
			if (browserType == 1) {
				jsObj.ConExcelListClose(arguments[0]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListClose(arguments[0]);
			}
		};
		//excel容器：隐藏excel（所有excel都将隐藏）
		//参数：无
		this.ConExcelListHide = function () {
			if (browserType == 1) {
				jsObj.ConExcelListHide();
			}
			else if (browserType == 0) {
				window.external.ConExcelListHide();
			}
		};
		//excel容器：关闭所有excel容器
		//参数：无
		this.ConExcelListCloseAll = function () {
			if (browserType == 1) {
				jsObj.ConExcelListCloseAll();
			}
			else if (browserType == 0) {
				window.external.ConExcelListCloseAll();
			}
		};

		//excel容器：保存excel
		//参数：
		//name/srting：Excel标志名
		this.ConExcelListSave = function () {
			if (browserType == 1) {
				jsObj.ConExcelListSave(arguments[0]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListSave(arguments[0]);
			}
		};
		//excel容器：保存emf
		//参数：
		//name/srting：Excel标志名
		//jsonStrRed/string：红框数据
		//jsonStrBlue/string：蓝框数据
		//zipfile/string：emf压缩后的文件名
		this.ConExcelListSaveEmf = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.ConExcelListSaveEmf(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.ConExcelListSaveEmf(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
		};
		//excel容器：画框按钮是否可用控制
		//参数：
		//name/srting：Excel标志名
		//btnType/string：0 不显示（画、删红蓝框），1 显示
		this.ConExcelListBtnTypeSetting = function () {
			if (browserType == 1) {
				jsObj.ConExcelListBtnTypeSetting(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListBtnTypeSetting(arguments[0], arguments[1]);
			}
		};
		//excel容器：excel容器大小设置
		//参数：
		//name/srting：Excel标志名
		//_width/int：宽度
		//_height/int：高度
		this.ConExcelListReSetSize = function () {
			if (browserType == 1) {
				jsObj.ConExcelListReSetSize(Number(arguments[0]), Number(arguments[1]));
			}
			else if (browserType == 0) {
				window.external.ConExcelListReSetSize(Number(arguments[0]), Number(arguments[1]));
			}
		};
		//excel容器：状态设置
		//参数：
		//name/srting：Excel标志名
		//i/int：-1 最小化，0 正常状态，1 最大化
		this.ConExcelListWindowState = function () {
			if (browserType == 1) {
				jsObj.ConExcelListWindowState(arguments[0], Number(arguments[1]));
			}
			else if (browserType == 0) {
				window.external.ConExcelListWindowState(arguments[0], Number(arguments[1]));
			}
		};
		//配置按钮状态(C#中定义的按钮)
		//参数：
		//name/srting：Excel标志名
		//controlNames/srting：控件名称（以 ^ 分隔）
		//operation/srting（不区分大小写） ：DisVisible, Visible, Enabled , DisEnabled
		this.ConExcelListSetControlsStatus = function () {
			if (browserType == 1) {
				jsObj.ConExcelListSetControlsStatus(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListSetControlsStatus(arguments[0], arguments[1], arguments[2]);
			}
		};

		//添加图片按钮
		//参数：
		//name/srting：Excel标志名
		//btnName/string：按钮名称(如果为空，则自动生成一个名称，但不会返回这个名称)
		//jsName/jsName：ie端js方法名称（C#调用时传入一个参数：Excel标志名）
		//picPath/string：pic路径
		//toolTip/string：提示
		this.ConExcelListAddpicButton = function () {
			if (browserType == 1) {
				jsObj.ConExcelListAddpicButton(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListAddpicButton(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
			}
		};
		//添加按钮
		//参数：
		//name/srting：Excel标志名
		//btnName/string：按钮名称(如果为空，则自动生成一个名称，但不会返回这个名称)
		//jsName/jsName：ie端js方法名称（C#调用时传入一个参数：Excel标志名）
		//text/string：按钮显示的内容
		this.ConExcelListAddButton = function () {
			if (browserType == 1) {
				jsObj.ConExcelListAddButton(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListAddButton(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
		};

		//获取excel对象（chrome端没有此方法）
		//参数：
		//name/srting：Excel标志名
		this.ConExcelListGetExcelApp = function () {
			if (browserType == 1) {
				alert("no method")
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.ConExcelListGetExcelApp(arguments[0]);
			}
		}
		//控制单元格变化记录是否打开
		//参数：
		//name/srting：Excel标志名
		//onOff/string：是否启用
		this.ConExcelListSwitchChanged = function () {
			if (browserType == 1) {
				jsObj.ConExcelListSwitchChanged(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.ConExcelListSwitchChanged(arguments[0], arguments[1]);
			}
		};

		//获取变化的记录
		//参数：
		//name/srting：Excel标志名
		this.ConExcelListGetChangeJson = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.ConExcelListGetChangeJson(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.ConExcelListGetChangeJson(arguments[0]);
			}
		};

		//下载文件
		//参数：
		//url/string：网路文件路径
		//filePath/string：本地文件保存地址
		//callback/string：回调 下载失败 -1，下载成功 100
		this.DownloadFile = function () {
			if (browserType == 1) {
				jsObj.DownloadFile(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				window.external.DownloadFile(arguments[0], arguments[1], arguments[2]);
			}
		};
		//上传文件
		//参数：
		//address/string：上传url
		//filePath/string：本地文件名
		//jsonStr/string：上传参数
		//
		//返回值/string：服务端返回内容或空字符串
		this.FileUpload = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.FileUpload(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.FileUpload(arguments[0], arguments[1], arguments[2]);
			}
		}
		//从剪贴板保存emf
		//参数：无
		//返回值/string：保存后的文件名或空
		this.SaveClipboardDataToEMF = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.SaveClipboardDataToEMF();
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.SaveClipboardDataToEMF();
			}
		}
		//从剪贴板保存png
		//参数：无
		//返回值/string：保存后的文件名或空
		this.SaveClipboardDataToImage = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.SaveClipboardDataToImage("png");
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.SaveClipboardDataToImage("png");
			}
		}
		//创建文件夹
		//参数：
		//dirPath/string：文件夹路径
		//返回值/bool：是否成功
		this.CreateDir = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.CreateDir(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.CreateDir(arguments[0]);
			}
		}
		//创建文件
		//参数：
		//filePath/string：文件路径
		//fileData/string：数据内容
		//返回值/bool：是否成功，若文件夹不存在则创建文件夹，若无数据则创建空文件
		this.CreateFile = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.CreateFile(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.CreateFile(arguments[0], arguments[1]);
			}
		}
		//删除文件
		//参数：
		//deleteFilePath/string：文件路径
		//返回值/bool：是否成功
		this.DeleteFile = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.DeleteFile(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.DeleteFile(arguments[0]);
			}
		}
		//压缩单个文件
		//参数：
		//zipfilePath/string：文件名
		//返回值/string：压缩后的文件名
		this.ZipFile = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.ZipFile(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.ZipFile(arguments[0]);
			}
		}
		//删除文件夹中非当天的文件
		//参数：
		// dirPath/string：文件夹路径
		this.DeleteFileNotToday = function () {
			if (browserType == 1) {
				jsObj.DeleteFileNotToday(arguments[0]);
			}
			else if (browserType == 0) {
				window.external.DeleteFileNotToday(arguments[0]);
			}
		}
		//删除文件夹中指定时间范围内的文件
		//参数：
		//dirPath/string：文件夹
		//startTime/string：开始时间(yyyy-MM-dd HH:mm:ss)
		//endTimeString/string：结束时间(yyyy-MM-dd HH:mm:ss)
		this.DeleteFilesByTime = function () {
			if (browserType == 1) {
				jsObj.DeleteFilesByTime(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				window.external.DeleteFilesByTime(arguments[0], arguments[1], arguments[2]);
			}
		}
		//读取txt文件，每行数据以分隔符分开
		//参数：
		//fileName/string：文件名
		//interval/string：行分隔字符串
		//encoding/string：编码格式（默认"GB2312"）
		//返回值/string：读取的内容
		this.ReadTxtFile = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.ReadTxtFile(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.ReadTxtFile(arguments[0], arguments[1], arguments[2]);
			}
		}
		//拷贝文件
		//参数：
		//sourceFile/string：源文件
		//outPath/string：输出路径
		//callback/string：回调 （1，成功；0，失败）
		this.CopyFile = function () {
			if (browserType == 1) {
				jsObj.CopyFile(arguments[0], arguments[1], arguments[2])
			}
			else if (browserType == 0) {
				window.external.CopyFile(arguments[0], arguments[1], arguments[2])
			}
		}
		//压缩文件夹
		//参数：
		//fPath/string：文件夹路径
		//fileName/string：压缩后文件
		//返回值/string：是否成功
		this.CompressDirectory = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.CompressDirectory(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.CompressDirectory(arguments[0], arguments[1]);
			}
		}
		//打开文件
		//参数：
		//fileName/string：文件名
		//callback/string：回调 成功 1，出错 -1, 文件不存在 0
		this.OpenFile = function () {
			if (browserType == 1) {
				jsObj.OpenFile(arguments[0], arguments[1])
			}
			else if (browserType == 0) {
				window.external.OpenFile(arguments[0], arguments[1])
			}
		}
		//打开文件并在文件关闭时上传文件
		//参数：
		//fileName/string：文件名
		//address/string：上传路径
		//jsonStr/string：上传时参数
		//callback/string：回调 打开成功 1，打开出错 -1, 文件不存在 0,上传成功 2，上传失败 -2
		this.OpenFileWithUpload = function () {
			if (browserType == 1) {
				jsObj.OpenFileWithUpload(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			else if (browserType == 0) {
				window.external.OpenFileWithUpload(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
		}
		//以windows进程形式打印文件
		//参数：
		//fileName：文件名
		//printerName：打印机名
		//callback：回调  成功 1，出错 -1, 文件不存在 0
		this.PrintFile = function () {
			if (browserType == 1) {
				jsObj.PrintFile(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				window.external.PrintFile(arguments[0], arguments[1], arguments[2]);
			}
		}
		//打开excel
		//参数：
		//filePath/string：文件名
		//mode/string：打开模式 只读 "r",读写 "rw" 不区分大小写
		//callback/string：回调 文件不存在 0， 打开成功 1，读写方式保存 2，关闭 4 ，发生错误 -1
		this.openExcel = function () {
			if (browserType == 1) {
				jsObj.openExcel(arguments[0], arguments[1], arguments[2]);
			}
			else if (browserType == 0) {
				window.external.openExcel(arguments[0], arguments[1], arguments[2]);
			}
		}
		//关闭excel（与openExcel配合使用）
		//参数：无
		this.closeExcel = function () {
			if (browserType == 1) {
				jsObj.closeExcel();
			}
			else if (browserType == 0) {
				window.external.closeExcel();
			}
		}
		//保存excel（与openExcel配合使用）
		//参数：
		//fileName/string:保存文件名
		//返回值/bool：是否成功
		this.saveAsExcel = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.saveAsExcel(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.saveAsExcel(arguments[0]);
			}
		}
		//打开word
		//参数：
		//filePath/string：文件名
		//mode/string：打开模式 只读 "r",读写 "rw" 不区分大小写
		//callback/string：回调 文件不存在 0， 打开成功 1，读写方式保存 2，关闭 4 ，发生错误 -1
		this.openWord = function () {
			if (browserType == 1) {
				jsObj.openWord(arguments[0], arguments[1], arguments[2])
			}
			else if (browserType == 0) {
				window.external.openWord(arguments[0], arguments[1], arguments[2])
			}
		}
		//关闭word（与openWord配合使用）
		//参数：
		this.closeWord = function () {
			if (browserType == 1) {
				jsObj.closeWord();
			}
			else if (browserType == 0) {
				window.external.closeWord();
			}
		}
		//保存word（与openWord配合使用）
		//参数：
		//fileName/string:保存文件名
		//返回值/bool：是否成功
		this.saveAsWord = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.saveAsWord(arguments[0])
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.saveAsWord(arguments[0])
			}
		}
		//excel转为pdf
		//参数：
		//filePath/string：excel文件名
		//outfileName/string：输出文件名
		//sheetIndex/int：转换页，此参数小于1或大于excel的sheet页数则转换全部
		//callback/string：回调 0 文件不存在，1 成功，-1 失败
		this.ExcelSaveAsPdf = function () {
			if (browserType == 1) {
				jsObj.ExcelSaveAsPdf(arguments[0], arguments[1], arguments[2], arguments[3])
			}
			else if (browserType == 0) {
				window.external.ExcelSaveAsPdf(arguments[0], arguments[1], arguments[2], arguments[3])
			}
		}
		//word转为pdf
		//参数：
		//filePath/string：word文件名
		//outfileName/string：输出文件名
		//callback/string：回调 0 文件不存在，1 成功，-1 失败
		this.WordSavwAsPdf = function () {
			if (browserType == 1) {
				jsObj.WordSavwAsPdf(arguments[0], arguments[1], arguments[2])
			}
			else if (browserType == 0) {
				window.external.WordSavwAsPdf(arguments[0], arguments[1], arguments[2])
			}
		}
		//获取指定word文件的页数
		//参数：
		//filePath/string：word文件名
		this.GetPagecountOfWORD = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.GetPagecountOfWORD(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.GetPagecountOfWORD(arguments[0]);
			}
		}

		//获取EXCEL第一个sheet页数
		//参数：
		//filePath/string：excel文件名
		this.GetPageCountOfExcel = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.GetPageCountOfExcel(arguments[0]);
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.GetPageCountOfExcel(arguments[0]);
			}
		}
		//打印word/excel(sheetIndex)
		//参数：
		//parames/string：json字符串
		/*json格式如下：
	*          flieType 1表示excel,2表示word；
	*          flieName 文件名；
	*          printerName 打印机名；
	*          sheetIndex 如果是excel,打印第几个sheet；
	*          copies 份数
	*/
		//callback/string：回调 文件不存在 0，打印成功 1，文件类型不正确 2，sheetIndex 超出范围：3，打印出错 -1
		this.PrintOfficeFile = function () {
			if (browserType == 1) {
				jsObj.PrintOfficeFile(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.PrintOfficeFile(arguments[0], arguments[1]);
			}
		}
		//打印excel所有sheet页
		//参数：
		//parames/string：json字符串
		/*json格式如下：
	*              fileName 文件名；
	*              copies 份数；
	*              printerName 打印机名
	*/
		//callback/string：回调 文件不存在 0，打印成功 1，打印出错 -1
		this.PrintExcelAll = function () {
			if (browserType == 1) {
				jsObj.PrintExcelAll(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.PrintExcelAll(arguments[0], arguments[1]);
			}
		}
		//获取excel文件真实格式所对应的扩展名
		//参数：
		//fileName/string：文件名
		//返回值/string："","xls","xlsx"
		this.GetExtNameOfExcelFile = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.GetExtNameOfExcelFile(arguments[0])
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.GetExtNameOfExcelFile(arguments[0])
			}
		}
		//合并（拼接）pdf文件
		//参数：
		//_sourceFile/string：待合并文件(以逗号分隔)
		//_outFile/string：合并后输出文件
		//callback/string：回调(可为空),0 有文件不存在，不转换；1 结束 
		this.UnionPdf = function () {
			if (browserType == 1) {
				jsObj.UnionPdf(arguments[0], arguments[1], arguments[2])
			}
			else if (browserType == 0) {
				window.external.UnionPdf(arguments[0], arguments[1], arguments[2])
			}
		}
		//Spire.Pdf:小册子形式打印pdf
		//参数：
		//settingParams/string：json字符串
		/*json格式如下：
	*              fPath 文件路径
	*              fFlieName 文件名
	*              printerName 打印机名
	*							fromPage 开始页码
	*							toPage 终止页码
	*/
		//callback/string：回调(1,结束)
		this.SpirePrintPdfBook = function () {
			if (browserType == 1) {
				jsObj.SpirePrintPdfBook(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.SpirePrintPdfBook(arguments[0], arguments[1]);
			}
		}
		//Spire.Pdf:顺序打印pdf
		//参数：
		//settingParams/string：json字符串
		/*json格式如下：
	*              fPath 文件路径
	*              fFlieName 文件名
	*              printerName 打印机名
	*							fromPage 开始页码
	*							toPage 终止页码
	*/
		//callback/string：回调(1,结束)
		this.SpirePrintPdfOrder = function () {
			if (browserType == 1) {
				jsObj.SpirePrintPdfOrder(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.SpirePrintPdfOrder(arguments[0], arguments[1]);
			}
		}
		//pdf任务
		//参数：
		//urlParams/string：json格式参数
		/*	urlParams	
				{
			"uploadUrl": "",  //pdf上传路径
			"pdfList": "",   ///获取打印任务url
			"handleFailureUrl": "",  //错误处理结果url
			"showZsDetailUrl": "",   //证书详情查询url
						"customerId": "1002",
		}
	 */
		//callback/string：回调
		this.generatePdfTask = function () {
			if (browserType == 1) {
				jsObj.generatePdfTask(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				window.external.generatePdfTask(arguments[0], arguments[1]);
			}
		}
		//照相机窗体
		//参数：
		//callback/string：回调
		this.Camera = function () {
			if (browserType == 1) {
				jsObj.Camera(arguments[0]);
			}
			else if (browserType == 0) {
				window.external.Camera(arguments[0]);
			}
		}
		//设置默认打印机
		//参数：
		//printerName/string：打印机名
		this.SetDefaultPrinter = function () {
			if (browserType == 1) {
				jsObj.SetDefaultPrinter(arguments[0]);
			}
			else if (browserType == 0) {
				window.external.SetDefaultPrinter(arguments[0]);
			}
		}
		//打印主页面
		this.PrintMainHtml = function () {
			if (browserType == 1) {
				jsObj.PrintMainHtml(arguments[0], arguments[1]);
			}
			else if (browserType == 0) {
				if (arguments[0] == 0) {
					window.external.DirectPrintHtml();
				}
				else if (arguments[0] == 1) {
					window.external.PrintPreviewHtml();
				}
				else if (arguments[0] == 2) {
					window.external.NormalPrintHtml();
				}
			}
		}
		//获取打印机列表
		//参数：
		//返回值/string：打印机列表（以 ` 分隔）
		this.GetPrinterList = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.GetPrinterList()
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.GetPrinterList()
			}
		}


		//chrome:打印源码（ie不存在此方法）
		//参数：
		//source/string：源码
		//isPrintView/string：1 打印预览，2 打印
		//orientation/int：打印方向 0 纵向，1 横向
		//callback/string: 回调（未使用）
		this.PrintHtmlBySource = function () {
			if (browserType == 1) {
				jsObj.PrintHtmlBySource(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			else if (browserType == 0) {
				alert("no method")
			}
		}
		//IE:打开iframe空窗体
		this.IframeOpenIE = function () {
			if (browserType == 1) {
				alert("no method")
			}
			else if (browserType == 0) {
				window.external.IframeOpen_w(window, arguments[0]);
			}
		};
		//IE:获取iframe空窗体的window对象
		this.IframeGetWindowIE = function () {
			if (browserType == 1) {
				alert("no method")
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.IframeGetWindow(arguments[0]);
			}
		};
		//IE:打印iframe
		this.IframePrintIE = function () {
			if (browserType == 1) {
				alert("no method")
			}
			else if (browserType == 0) {
				window.external.IframePrint_w(window, arguments[0], arguments[1]);
			}
		};
		//IE:打印预览iframe
		this.IframePreviewIE = function () {
			if (browserType == 1) {
				alert("no method")
			}
			else if (browserType == 0) {
				window.external.IframePreview(arguments[0]);
			}
		};
		//IE:显示打印弹框
		this.IframeShowPrintDialogIE = function () {
			if (browserType == 1) {
				alert("no method")
			}
			else if (browserType == 0) {
				window.external.IframeShowPrintDialog();
			}
		};
		//设置打印机参数
		//参数：
		//jsonString/string：设置参数
		/*
	
				{
			"printerName": "HP Officejet 100 Mobile L411",
			"marginRight": "0.198819",//约5.08mm,右边距
			"marginTop": "0.198819",//约5.08mm,上边距
			"marginLeft": "0.198819",//约5.08mm，左边距
			"marginRight": "0.198819",//约5.08mm，右边距
			"footer": "",//页脚，
			"header": ""//页眉，
		};
	 */
		this.setPrinterSettings = function () {
			if (browserType == 1) {
				jsObj.setPrinterSettings(arguments[0]);
			}
			else if (browserType == 0) {
				window.external.setPrinterSettings(arguments[0]);
			}
		};

		//chrome:操作ie副窗体
		//参数：
		//methodName/string：方法名
		//objParame/Array：参数数组
		//返回值：0 ie未打开，-1 执行出错，js返回值
		this.ieFormOperation = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.ieFormOperation(arguments[0], arguments[1])
			}
			else if (browserType == 0) {
				alert("no method")
			}
		};
		//数据交互窗体显示
		this.DataCollectShow = function () {
			if (browserType == 1) {
				jsObj.DataCollectShow();
			}
			else if (browserType == 0) {
				window.external.DataCollectShow();
			}
		};
		//数据采集更新本地配置文件
		this.DataCollectUpdate = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.DataCollectUpdate(arguments[0], arguments[1])
			}
			else if (browserType == 0) {
				CsharpReturnValue = window.external.DataCollectUpdate(arguments[0], arguments[1])
			}
		}

		//显示pdf
		//参数：
		//address/string：pdfurl
		this.ShowPdfWithotSave = function () {
			if (browserType == 1) {
				CsharpReturnValue = jsObj.ShowPdf(arguments[0])
			}
			else if (browserType == 0) {
				alert("no method")
			}
		}
	}
	return new CsharpObject1();
}
//非容器内的提示信息
var flag=false;
var AlertMessage = function () {
	if (!flag) {
		this.$message.warning("此功能依赖于容器，请在容器中进行操作。");
		flag=true;
	}
	
}
export {AlertMessage,CsharpObject};
