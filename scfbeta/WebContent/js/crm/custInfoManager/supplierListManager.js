$(document).ready(function() {
	initTable();
	CloudUtils.inputCacheClear();
	$('#btn_search').click(function() {
		initTable();
	});
	$('#btn_add').click(function () {
		window.location.href = "/scfbeta/crm/custInfoManager/supplierInfoManager.html";
//		$(window.parent.document).find('iframe').attr('src', 'crm/custInfoManager/supplierInfoManager.html');
	});
});

//重置按钮事件
function ResetBtn(){
	$("#listCorpName").val(""); 
}

let initTable = function() {
	$('#userListTable').bootstrapTable('destroy');
	$("#userListTable").bootstrapTable({
		method : "post",
		url : "../../corp/list",
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
				isPage: 1,
				sysType: 5,
				corpName: jsonData.corpName == null ? '' : jsonData.corpName
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
				field : 'corpId',
				title : 'Item ID',
				align : 'center',
				valign : 'middle',
				visible : false
			},
			{
				field : 'corpName',
				title : '供应商名称',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'orgnNum',
				title : '组织机构代码',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'coreCorpName',
				title : '关联核心企业',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'prdStatus',
				title : '立项状态',
				align : 'center',
				valign : 'middle',
				formatter : function (value, row, index) {
					switch(value) {
						case 0: return '未立项';break;
						case 1: return '已立项';break;
					}
				}
			},
			{
				field : 'operation',
				title : '操作',
				align : 'center',
				valign : 'middle',
				formatter : function(value, row, index) {
					var s = '<a class = "fa fa-edit modify" style="color:#d864fd;padding:0px 5px;" title="编辑" href="javascript:void(0)"></a>';
					var r = '<a class = "fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" title="删除" href="javascript:void(0)"></a>';
					return s + ' ' + r;
				},
				events : 'operateEvents'
			}
		]
	});
}

window.operateEvents = {
	'click .modify' : function(e, value, row, index) {
		window.location.href = "/scfbeta/crm/custInfoManager/supplierInfoManager.html?corpId=" + row.corpId;
//		$(window.parent.document).find('iframe').attr('src', 'crm/custInfoManager/supplierInfoManager.html?corpId=' + row.corpId);
	},
	'click .remove' : function(e, value, row, index) {
		bootbox.confirm("确定删除此条记录?", function(result) {
			if (result) {
				var options = {
					url : '../../corp/delete',
					data : '{"corpId":"' + row.corpId + '"}',
					callBackFun : function(data) {
						if (data.result == 0) {
							initTable();
							window.location.reload();
						} else {
							bootbox.alert(data.resultNote);
							return false;
						}
					},
					errorCallback : function(data) {
						bootbox.alert("error");
					}
				};
				CloudUtils.ajax(options);
			}
		});
	}
};