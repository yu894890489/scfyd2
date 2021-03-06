$(function(){
	if(store.get('roleType')==2){
		$(".btnHide").removeClass("hidden");
	}
	initTable();
	$('#btn_search').click(function() {
		initTable();
	});
	$('#btn_add').click(function () {
		window.location.href = '../../asset/packageManager/packageManager.html';
	});
	$("#div_detail").load("../../bpm/flowManager/FlowMngCommon.html");
});

//重置按钮事件
function ResetBtn(){
	$("#corpName").val("");
}

function initTable(){
	$("#packageListTable").bootstrapTable('destroy');
	$("#packageListTable").bootstrapTable({
		method : "post",
		url : '../../package/list',
		striped : true, //表格显示条纹  
		pagination : true, //启动分页  
		pageSize : 10, //每页显示的记录数  
		pageNumber : 1, //当前第几页  
		pageList : [ 5, 10, 15, 20, 25 ], //记录数可选列表  
		search : false, //是否启用查询  
		showColumns : false, //显示下拉框勾选要显示的列  
		showRefresh : false, //显示刷新按钮  
		sidePagination : "server", //表示服务端请求  
		//设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
		//设置为limit可以获取limit, offset, search, sort, order  
		queryParamsType : "undefined",
		queryParams : function queryParams(params) { //设置查询参数  
			var data = CloudUtils.convertStringJson('searchForm');
			var jsonData = eval("(" + data + ")");
			var param = {
				pageNumber : params.pageNumber,
				pageSize : params.pageSize,
				corpName: jsonData.corpName
			};
			return JSON.stringify(param);
		},
		responseHandler : function responseHandler(res) {
			if (res.result == 0) {
				return {
					"rows" : res.dataList,
					"total" : res.records
				};

			} else {
				bootbox.alert(res.resultNote);
				return {
					"rows" : [],
					"total" : 0
				};
			}
		},
		columns : [
		    {
		    	field : 'recUid',
		    	title : '主键',
		    	align : 'center',
		    	valign : 'middle',
		    	visible : false
		    }, 
		    {
				field : 'corpId',
				title : '券商ID',
				align : 'center',
				valign : 'middle',
				visible : false
			},
			{
				field : 'corpName',
				title : '券商名称',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'apNo',
				title : '资产包编号',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'apAmount',
				title : '资产包金额',
				align : 'center',
				formatter:function(value,row,index){
		 	    	return $.number(value,2);
			        },
				valign : 'middle'
			},
			{
				field : 'packetTime',
				title : '封包日期',
				align : 'center',
				valign : 'middle',
				formatter:function(value,row,index){
	        		if(row.packetTime!=null&&row.packetTime!=''){
	        			return CloudUtils.dateFormat(row.packetTime, 'yyyy-MM-dd')
	        		}
	 	        }
			},
			{
				field : 'assetRating',
				title : '资产包评级',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'operation',
				title : '操作',
				align : 'center',
				valign : 'middle',
				formatter : function(value, row, index) {
					//var s = '<a class = "fa fa-edit modify" style="color:#d864fd;padding:0px 5px;" title="编辑" href="javascript:void(0)"></a>';
					//var r = '<a class = "fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" title="删除" href="javascript:void(0)"></a>';
					var t = '<a class="fa fa-list-ul detail" style="color:#fa8564;padding:0px 5px;" title="详情" href="javascript:void(0)"></a>'
					return t;
				},
				events : 'operateEvents'
			}
		]
	});
}

window.operateEvents = {
//	'click .modify' : function(e, value, row, index) {
//		window.location.href = '../../asset/packageManager/packageManager.html?corpId='+row.corpId;
//	},
//	'click .remove' : function(e, value, row, index) {
//		bootbox.confirm("确定删除此条记录?", function(result) {
//			if (result) {
//				var data = {"recUid":row.recUid};
//				var options = {
//					url : '../../package/delete',
//					data : JSON.stringify(data),
//					callBackFun : function(data) {
//						if (data.result == 0) {
//							initTable();
//							window.location.reload();
//						} else {
//							bootbox.alert(data.resultNote);
//							return false;
//						}
//					},
//					errorCallback : function(data) {
//						bootbox.alert("error");
//					}
//				};
//				CloudUtils.ajax(options);
//			}
//		});
//	},
	'click .detail' : function(e, value, row, index) {
		initProjectTable(row.recUid);
		$('#detailModal').modal({backdrop: 'static', keyboard: false});
	},
	'click .info' : function(e, value, row, index) {
		detail(row);
	}
};

function initProjectTable(id) {
	$('#flowProjectList').bootstrapTable('destroy');  
	$("#flowProjectList").bootstrapTable({  
		method: "post", 
		url: "../../flowProject/list",
		striped: false,  // 表格显示条纹
		pagination: false, // 启动分页
		pageSize: 5,  // 每页显示的记录数
		pageNumber:1, // 当前第几页
		pageList: [5, 10, 15, 20, 25],  // 记录数可选列表
		search: false,  // 是否启用查询
		showColumns: false,  // 显示下拉框勾选要显示的列
		showRefresh: false,  // 显示刷新按钮
		clickToSelect: true,  // 是否启用点击选中行
		sidePagination: "server", // 表示服务端请求
		queryParamsType : "undefined",
		queryParams: function queryParams(params) {   // 设置查询参数
			var param = {
				pageNumber: params.pageNumber,
				pageSize: params.pageSize,
				apId: id,
				proStatus: 4,
				isPage: 0
			};
			return JSON.stringify(param);
		},
		responseHandler:function responseHandler(res) {
			if (res.result==0) {
				return {
					"rows": res.dataList,
					"total": res.records
				};
				} else {
					bootbox.alert(res.resultNote);
					return {
						"rows": [],
						"total": 0
					};
				}
			},
         columns: [{
 	        field: 'proId',
 	        title: 'Item ID',
 	        align: 'center',
            valign: 'middle',
            visible: false
 	    }, {
 	        field: 'corpId',
 	        title: '企业Id',
 	        align: 'center',
            valign: 'middle',
            visible: false
 	    },{
			field: 'apId',
			title: '资产包名称',
			align: 'center',
			valign: 'middle',
			visible: false
		},{
 	        field: 'projectName',
 	        title: '项目名称',
 	        align: 'center',
            valign: 'middle'
 	    },{
 	    	field: 'custName',
 	        title: '供应商名称',
 	        align: 'center',
            valign: 'middle'
 	    },{
 	    	field: 'coreCorpName',
 	        title: '核心企业名称',
 	        align: 'center',
            valign: 'middle'
 	    },{
 	    	field : 'loanAmt',
			title : '放款金额',
			align : 'center',
			formatter : function (value, row, index){
				return $.number(value, 2);
			},
			valign : 'middle'
 	    },{
 	    	field : 'operation',
			title : '操作',
			align : 'center',
			valign : 'middle',
			formatter : function(value, row, index) {
				console.log(row);
				return '<a class="fa fa-list-ul info" style="color:#fa8564;padding:0px 5px;" title="详情" href="javascript:;"></a>'
			},
			events : 'operateEvents'
 	    }]
	});
}

function detail(row) {
	$('#projectTuningModal').modal({backdrop: 'static', keyboard: false});
	$("#detailModal").modal("hide");
	setProjectInfo(row.proId);//加载项目详情
	FlowMngCommon.setSupplierBaseInfo(row.custNo);//加载供应商基本信息的数据
	FlowMngCommon.initDetTable(data.custNo,"projectTuningModal");//加载表格的数据
	$('#projectTuningModal').on('hide.bs.modal',function(){
		$("#detailModal").modal("show");
	});
}

function setProjectInfo(proId) {
	var options = {
		url : '../../package/listByProId',
		data : JSON.stringify({
			proId : proId
		}),
		callBackFun : function(data) {
			if (data.result == 0) {
				// 项目尽调中的项目简介详情
				CloudUtils.setForm(data, "infoForm");
				// 项目分析加上详情
				CloudUtils.setForm(data, "addProAnlyForm");
				return true;
			} else {
				bootbox.alert(data.resultNote);
				return false;
			}
		},
		errorCallback:function(data){
			bootbox.alert("error");
		}
	};
	CloudUtils.ajax(options);
}