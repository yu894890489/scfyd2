$(function(){
	CloudUtils.inputCacheClear();
	dataSearch();
	initDate();
	initTable();
	numFormat();
	formValidator();
});

function initDate(){
	$('#valDt').datetimepicker({
		language: 'zh-CN',
		autoclose: true,
		todayHighlight: true,
		format: 'yyyy-mm-dd',
		minView:'month',
		todayBtn: true,
		initialDate : new Date() ,
		pickerPosition: "bottom-left"
	});
	$('#dueDt').datetimepicker({
		language: 'zh-CN',
		autoclose: true,
		todayHighlight: true,
		format: 'yyyy-mm-dd',
		minView:'month',
		todayBtn: true,
		initialDate : new Date() ,
		pickerPosition: "bottom-left"
	}).on("click",function(){  
        $("#dueDt").datetimepicker("setStartDate",$("#valDt").val());
    }); 
}

function initTable() { 
	$('#receiveAccountManagerList').bootstrapTable('destroy');  
	$("#receiveAccountManagerList").bootstrapTable({  
		method: "post", 
		url: "../../receiveAccount/list", 
		striped: false,  //表格显示条纹  
		pagination: true, //启动分页  
		pageSize: 5,  //每页显示的记录数  
		pageNumber:1, //当前第几页  
		pageList: [5, 10, 15, 20, 25],  //记录数可选列表  
		search: false,  //是否启用查询  
		showColumns: false,  //显示下拉框勾选要显示的列  
		showRefresh: false,  //显示刷新按钮  
		sidePagination: "server", //表示服务端请求  
		//设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
		//设置为limit可以获取limit, offset, search, sort, order  
		queryParamsType : "undefined",   
		queryParams: function queryParams(params) {   //设置查询参数  
			var data = CloudUtils.convertStringJson('searchForm');
			var jsonData = eval("(" + data + ")");
			 if(jsonData.txt_corpId ==""){
	        	   jsonData.txt_corpId = null;
	           }
			var param = {    
					pageNumber: params.pageNumber,    
					pageSize: params.pageSize,
					corpId: null,
					invoiceNo:null
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
			field: 'recUid',
			title: 'Item ID',
			align: 'center',
			valign: 'middle',
			visible: false
		}, {
			field: 'invoiceNo',
			title: '发票编号',
			align: 'center',
			valign: 'middle'
		}, {
			field: 'invoiceAmount',
			title: '应收账款金额',
			align: 'center',
			valign: 'middle',
			formatter:function(value,row,index){
 	 	    	return $.number(value,2);
		        }
		}, {
			field: 'invoiceDate',
			title: '单据日期',
			align: 'center',
			valign: 'middle'
		}, {
			field: 'netDay',
			title: '账期',
			align: 'center',
			valign: 'middle'
		}, {
			field: 'overdueDays',
			title: '补充说明',
			align: 'center',
			valign: 'middle'
		}]
	});  
}
/**
 * 查询出所有的符合条件的企业
 */
function dataSearch(){
	var options = {
		url : "../../flowProject/list",
		data :'{"proStatus":2,"state":0,"isPage":0}',
		callBackFun : function(data) {
			if(data.result==0){
				fuzzySearch(data);
			}else{
				bootbox.alert(data.resultNote);
				return false;
			}
		},
		errorCallback:function(data){
			bootbox.alert(data.resultNote);
			return false;
		}
	};		
	CloudUtils.ajax(options);
}

/*
 * 模糊查询
 */
function fuzzySearch(data){
	var jsonStringData = JSON.stringify(data.dataList);
	jsonStringData=jsonStringData.replace(/projectName/g,'label');
	var jsonData=eval('('+ jsonStringData +')');
	$('#proNameS').autocompleter({
        highlightMatches: true,
        source: jsonData,
        // show hint
        hint: false,
        empty: true,
        // max results
        cashe: true,
        callback: function (value, index, selected) {
        	$("#coreCorpName").val(selected.coreCorpName);
        	$("#coreCorpNo").val(selected.coreCorpId);
        	$("#custNo").val(selected.custNo);
        	$("#proName").val(value);
        	$("#proNo").val(selected.proId);
        	$("#custName").val(selected.custName);
        	$("#corpId").val(selected.custNo);
        	$("#orgNo").val(selected.orgNo);
        	$("#cntrctNo").val(selected.cntNo);
        	$("#contractSerialNum").val(selected.contractSerialNum);
        }
	});
}

function saveloanInfo(){
	var data = CloudUtils.convertStringJson('infoForm');
	data = eval("(" + data + ")");
	data['sysType'] = 5;
	data['corpId'] = corpId ? corpId : '';
	data['ProNo'] = $("#proNo").val();
	data = JSON.stringify(data);
	var options = {
		url : '../../workflow/startFKProcess',
		data : data,
		callBackFun : function(data) {
			if(data.result==0){
				corpId = $("#corpId").val();
				bootbox.alert(data.resultNote);
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
}

/*
 * 项目名称查询改变清空数据
 */
function changeName(){
	$("#coreCorpName").val("");
	$("#coreCorpNo").val("");
	$("#custNo").val("");
	$("#proName").val("");
	$("#corpId").val("");
	$("#orgNo").val("");
	$("#custName").val("");
}

function numFormat(){
	$("#creditLimit").number(true, 2);
	$("#arAmt").number(true, 2);
	$("#loanAmt").number(true, 2);
	$("#loanRt").number(true, 2);
}

function formValidator(){
	$('#infoForm').bootstrapValidator({
		  group: '.scf_valid',
	      message: 'This value is not valid',
	      excluded: ':disabled',
	      feedbackIcons: {
	          valid: 'glyphicon glyphicon-ok',
	          invalid: 'glyphicon glyphicon-remove',
	          validating: 'glyphicon glyphicon-refresh'
	      },
	      fields: {
	    	  loanRt:{
	    		  validators: {
	            	  numeric: {message: '只能输入数字'},
		              callback: {  
	                       message: '比例在0~100之间',  
	                       callback: function(value, validator) { 
	                        	return value =="" || (parseFloat(value)>=0&&parseFloat(value)<=100);
	                         }  
	                     } 
	              }
	    	  },
	      	loanAmt:{
	    		  validators: {
	    			  numeric: {
	            		  message: '放款金额只能输入数字'
	            	  },
	            	  callback: {  
	                         message: '放款金额在0~1000000000之间',  
	                         callback: function(value, validator) { 
	                        	 return value =="" || (parseFloat(value)>=0&&parseFloat(value)<=999999999.99);
	                         }  
	                     } 
	              }
	    	  }
	      }
	}).on('success.form.bv', function (e) {
		e.preventDefault();
		$(e.target).bootstrapValidator('resetForm', true);
	});
}