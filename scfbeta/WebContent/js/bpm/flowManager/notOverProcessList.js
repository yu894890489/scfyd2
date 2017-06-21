$(document).ready(function() {
	initNotOverProcessListTable();
});

/**
 * 未结流程列表
 */
let initNotOverProcessListTable = function() {
	$('#notOverProcessListTable').bootstrapTable('destroy');
	$('#notOverProcessListTable').bootstrapTable({
		method : "post",
		url : "../../actflow/notOverProcessList",
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
			var param = {
				pageNumber : params.pageNumber,
				pageSize : params.pageSize,
				isPage: 1
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
				field : 'taskId',
				title : '任务ID',
				align : 'center',
				valign : 'middle',
				visible: false
			},
			{
				field : 'processInstanceId',
				title : '流程实例ID',
				align : 'center',
				valign : 'middle',
				visible : false
			},
			{
				field : 'projectName',
				title : '项目名称',
				align : 'center',
				valign : 'middle',
				formatter:function(value, row, index) {
     	            return '<a class="procDetail" style="color:#a9d86e;padding:0px 5px;" title="详情" href="javascript:void(0)">'+value+'</a>';
     	        },
     	        events: 'operateEvents'
			},
			{
				field : 'taskName',
				title : '节点名称',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'assignee',
				title : '办理人',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'startTime',
				title : '创建时间',
				align : 'center',
				valign : 'middle'
			},
			{
				field : 'endTime',
				title : '结束时间',
				align : 'center',
				valign : 'middle'
			}
		]
	});
}

window.operateEvents = {
		// 项目名称点击事件
		'click .procDetail': function (e, value, row, index) {
	    	var options = {
	    			url : '../../actflow/showProjectDetail?processInstanceId='+row.processInstanceId+'&taskId='+row.taskId,
	    			callBackFun : function(data) {
	    				if(data.result==0){
	    					console.log(data.dataList[0]);
	    					 CloudUtils.setForm(data.dataList[0],"_proSetupForm");
	    					 $('#projDetailModal').modal({backdrop: 'static', keyboard: false});
	    					return true;
	    				}else{
	    					bootbox.alert(data.resultNote);
	    					return false;
	    				}
	    			},
	    			errorCallback:function(data){
	    				bootbox.alert("error");
	    			}
	    		};
	    	CloudUtils.ajax(options);
		},
	};
