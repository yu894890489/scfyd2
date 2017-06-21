$(document).ready(function() {
	$("form").attr("autocomplete","off");
	CloudUtils.getMenuNames("nav");
	dateload();
	initInterestTable();
	$('#agencyInfoModal').on('hidden.bs.modal', function() {
		$("#agencySearchForm")[0].reset();
		$("#agencySearchForm").bootstrapValidator('resetForm', true);
	});
	// 申请日期
	$("#applyDate").val(CloudUtils.getcurrentdate());
	// 保证金比例,融资比例,费率,利息列表
	ajaxProGuarantee();
	formValidator();
	numFormat();
});

function dateload(){
	 $('#financeStartDate').datetimepicker({
      language: 'zh-CN',
      autoclose: 1,
      todayBtn: true,// 显示今天时间
      pickerPosition: "bottom-left",
      minuteStep: 5,
      format: 'yyyy-mm-dd',
      minView: 'month',　　// 日期时间选择器所能够提供的最精确的时间选择视图。
      initialDate : new Date()
     }).on("click",function(){
	      $("#financeStartDate").datetimepicker("setEndDate",$("#financeEndDate").val());
	 }).on('hide',function(e) {  
         $('#addForm').data('bootstrapValidator')  
         .updateStatus('financeStartDate', 'NOT_VALIDATED',null)  
         .validateField('financeStartDate');  
     });
	 
	 $('#financeEndDate').datetimepicker({
	      language: 'zh-CN',
	      autoclose: 1,
	      todayBtn: true,// 显示今天时间
	      pickerPosition: "bottom-left",
	      minuteStep: 5,
	      format: 'yyyy-mm-dd',
	      minView: 'month',　　// 日期时间选择器所能够提供的最精确的时间选择视图。
	      initialDate : new Date()
	     }).on("click",function(){
		     $("#financeEndDate").datetimepicker("setStartDate",$("#financeStartDate").val());
		 }).on('hide',function(e) {  
		     $('#addForm').data('bootstrapValidator')  
		     .updateStatus('financeEndDate', 'NOT_VALIDATED',null)  
		     .validateField('financeEndDate');  
	     });
	 
	 
	 
	 
}

function serchAgency(){
	$("#agencyInfoModal").modal();
	initAgencyListTable();
}

function searchAgencyFun(){
	initAgencyListTable();
}


function save() {
/*	$('#addForm').data('bootstrapValidator')
    	.updateStatus('#agencyName', 'NOT_VALIDATED', null)
    	.validateField('#agencyName'); 
*/	
	if(!$('#agencyName').val()){
		bootbox.alert("请选择经销商信息");
		return false;
	}
	$('#addForm').data('bootstrapValidator').validate();
	if(!$('#addForm').data('bootstrapValidator').isValid()){  
	    //没有通过校验 
	 return false;
	} else {
		var data = CloudUtils.convertStringJson('addForm');
		var jsonData = eval("(" + data + ")");
		var interestListData = $("#interestInfoList").bootstrapTable('getData');
		jsonData.interestListInfo = JSON.stringify(interestListData);
		
		var options = {
				url : "../../finance/apply",
				data : JSON.stringify(jsonData),
				callBackFun : function(data) {
					if(data.result==0){
						bootbox.alert(data.resultNote, function() {
							window.location.href = '../../project/dykManager/financeInfoManager.html';
						});
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
}

function initAgencyListTable() { 
	$('#agencyListTable').bootstrapTable('destroy');  
	$("#agencyListTable").bootstrapTable({  
         method: "post", 
         url: "../../corp/agencyList", 
         striped: true,  // 表格显示条纹
         pagination: true, // 启动分页
         pageSize: 5,  // 每页显示的记录数
         pageNumber:1, // 当前第几页
         pageList: [5, 10, 15, 20, 25],  // 记录数可选列表
         search: false,  // 是否启用查询
         showColumns: false,  // 显示下拉框勾选要显示的列
         showRefresh: false,  // 显示刷新按钮
         clickToSelect: true,  //是否启用点击选中行
         sidePagination: "server", // 表示服务端请求
         queryParamsType : "undefined",
         singleSelect:true,
         onCheck: function (row) {
        	$('#corpId').val(row.corpId);
 			$('#agencyName').val(row.agencyName);
 			$('#agencyNum').val(row.agencyNum);
 			$('#maxCredit').val(row.maxCreditAmout);
 			$('#availableCredit').val(row.useAbleCrediAmt);
         },
         queryParams: function queryParams(params) {   // 设置查询参数
           var param = {    
               pageNumber: params.pageNumber,
               pageSize: params.pageSize,
               agencyName:$("#agency_name").val()
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
        	 checkbox: true,
        	 singleSelect: true
         },{
 	        field: 'agencyName',
 	        title: '经销商名称',
 	        align: 'center',
            valign: 'middle'
 	    }, {
 	        field: 'agencyNum',
 	        title: '经销商代码',
 	        align: 'center',
            valign: 'middle'
 	    }, {
 	        field: 'maxCreditAmout',
 	        title: '最高授信额度',
 	        align: 'center',
            valign: 'middle',
            formatter:function(value,row,index) {
				return $.number(value, 2);
	    	}
 	    }, {
 	        field: 'useAbleCrediAmt',
 	        title: '可用授信额度',
 	        align: 'center',
            valign: 'middle',
            formatter:function(value,row,index) {
				return $.number(value, 2);
	    	}
 	    }, {
 	        field: 'corpId',
 	        title: '企业ID',
 	        align: 'center',
            valign: 'middle',
            visible: false
 	    }
 	    ]
	});  
}

function initInterestTable() {
	$('#interestInfoList').bootstrapTable('destroy'); 
	$("#interestInfoList").bootstrapTable({  
		 method: "post", 
         url: "", 
         striped: true,  //表格显示条纹  
         pagination: false, //启动分页  
         search: false,  //是否启用查询  
         showColumns: false,  //显示下拉框勾选要显示的列  
         showRefresh: false,  //显示刷新按钮  
         sidePagination: "server", //表示服务端请求  
         //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
         //设置为limit可以获取limit, offset, search, sort, order  
         queryParamsType : "undefined",   
         queryParams: function queryParams(params) {   //设置查询参数  
           return '{"productId" : "product01"}';
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
 	        field: 'rateStandard',
 	        title: '利率标准',
 	        align: 'center',
            valign: 'middle'
 	    }, {
 	        field: 'dykRate',
 	        title: '利率(%)',
 	        align: 'center',
            valign: 'middle',
            formatter:function(value,row,index) {
				return $.number(value, 2);
	    	}
 	    }, {
 	        field: 'interest',
 	        title: '利息',
 	        align: 'center',
 	        valign: 'middle',
 	        formatter:function(value,row,index) {
 	        	return $.number(value, 2);
	    	}
 	    }]
       });
}

//form验证规则
function formValidator(){
	$('#addForm').bootstrapValidator({
		 message: 'This value is not valid',
	      excluded:':disabled',
	      group:".valid_group",
	      feedbackIcons: {
	          valid: 'glyphicon glyphicon-ok',
	          invalid: 'glyphicon glyphicon-remove',
	          validating: 'glyphicon glyphicon-refresh'
	      },
	      fields: {
	    	  /*agencyName: {
	              validators: {
	                  notEmpty: {
	                      message: '经销商名称不能为空'
	                  }
	              }
	          },*/
	          financeStartDate: {
	              validators: {
	                  notEmpty: {
	                      message: '融资起始日不能为空'
	                  }
	              }
	          },
	          financeEndDate: {
	              validators: {
	                  notEmpty: {
	                      message: '融资到期日不能为空'
	                  }
	              }
	          },
	          financeAmount:{
	        	  validators: {
	        		  notEmpty: {message: '融资金额不能为空'},
	        		  numeric: {message: '只能输入数字'},
	        		  callback: {  
      					message: '融资金额借款余额在0~1000000000.00之间',  
      						callback: function(value, validator) { 
      						return parseFloat(value)> 0 && parseFloat(value)<1000000000;
      						}  
	      			  } 
	        	  } 
	          },
	          remark:{
	        	  validators: {
	        		  notEmpty: {message: '备注不能为空'},
	        		  stringLength: {
			              max: 128,
			              message: '备注长度不能超过128'
			          }
	        	  } ,
	        	  
	          }
	      }
		})
		.on('success.form.bv', function (e) {
        // Prevent form submission
        e.preventDefault();
        // Get the form instance
        //var $form = $(e.target);
        // Get the BootstrapValidator instance
       // var bv = $form.data('bootstrapValidator')
		});
}

function numFormat(){
	$("#maxCredit").number(true, 2);	//最高信用额度
	$("#availableCredit").number(true, 2);	//可用信用额度
	$("#financeRate").number(true, 2);	//融资比例
	$("#cashRate").number(true, 4);	//费率
	$("#financeAmount").number(true, 2);	//融资金额
	$("#expense").number(true, 2);	//费用
}

function ajaxProGuarantee() {
	var options = {
		url : '../../finance/getProGuarantee',
		data : '{"productId":"product01"}',
		callBackFun : function(data) {
			if (data.result == 0) {
				// 保证金比例
				$("#guaranteeRate").val(data.guaranteeRate);
				// 融资比例
				$("#financeRate").val(CloudUtils.Math(100, data.guaranteeRate, 'sub'));
				// 费率
				$("#cashRate").val(data.costRate);
				if (data.dataList != null) {
					$.each(data.dataList, function(i, row) {
						$("#interestInfoList").bootstrapTable('append', row);
					});
				}
			} else {
				bootbox.alert(data.resultNote);
				return false;
			}
		},
		errorCallback : function(data) {
			bootbox.alert(data.resultNote);
			return false;
		}
	};
	CloudUtils.ajax(options);
}

function changeFinanceAmount() {
 	// 计算费用
	var financeAmount = $("#financeAmount").val();
 	var cashRate = $("#cashRate").val();
	var expense = CloudUtils.Math(financeAmount, cashRate, 'mul');
	$("#expense").val(CloudUtils.ccyFormatNoPre(CloudUtils.Math(expense, 100, 'div'), 2));
	
	// 计算利息列表
	calInterestList();
}

function calInterestList() {
	// 利息:融资金额*（融资到期日-融资起始日）*利率/360
	var financeAmount = $("#financeAmount").val();
 	var financeStartDate = $("#financeStartDate").val();
 	var financeEndDate = $("#financeEndDate").val();
 	var tableData = $("#interestInfoList").bootstrapTable("getData");
 	
 	if (CloudUtils.isEmpty(financeAmount)
 			|| CloudUtils.isEmpty(financeStartDate)
 			|| CloudUtils.isEmpty(financeEndDate)) {
 		for (var i = 0; i < tableData.length; i++) {
 			tableData[i].interest = 0;
 			$("#interestInfoList").bootstrapTable('updateRow', {
 				index: i,
 				row: tableData[i]
 			});
 		}
 	} else {
 		var diff = CloudUtils.DateDiffSec(financeEndDate, financeStartDate);
 	 	var a = CloudUtils.Math(financeAmount, diff, "mul");
 	 	var c = CloudUtils.Math(a, 360, "div");
 	 	var d = CloudUtils.Math(c, 100, "div");
 		
 		for (var i = 0; i < tableData.length; i++) {
 			var b = CloudUtils.Math(d, tableData[i].dykRate, "mul");
 			tableData[i].interest = CloudUtils.ccyFormatNoPre(b, 2);
 			$("#interestInfoList").bootstrapTable('updateRow', {
 				index: i,
 				row: tableData[i]
 			});
 		}
 	}
}