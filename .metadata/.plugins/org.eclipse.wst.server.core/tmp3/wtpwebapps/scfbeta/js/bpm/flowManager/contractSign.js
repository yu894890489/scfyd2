$(function(){
	CloudUtils.inputCacheClear();
	/*loadDate();*/
	initAttachment();
	getProject();
	formValidator();
	numFormat();
	hiddenButton();
	$('#valDt').datetimepicker({
		language: 'zh-CN',
		autoclose: true,
		todayHighlight: true,
		format: 'yyyy-mm-dd',
		startView: 2,
		minView: 2,
		todayBtn: true,
		initialDate : new Date(),
		pickerPosition: "bottom-left"
	});
	
	
	
});

function duechange(){
	   var valDt = $("#valDt").val();
		var vd =  new Date(valDt);
		var term=$("#term").val();
		if(valDt&&term){
			vd.setDate(vd.getDate()+parseInt(term)-1);
			vd=CloudUtils.dateFormat(vd,"yyyy-MM-dd");
			$("#dueDt").val(vd);
		}
		

}

/*function dueDate(){
	var valDt=$('#valDt').val();
	var term=$('#term').val();
	var dueDt=valDt+term;
	$('#dueDt').datetimepicker({
		language: 'zh-CN',
		autoclose: true,
		todayHighlight: true,
		format: 'yyyy-mm-dd',
		startView: 2,
		minView: 2,
		todayBtn: true,
		initialDate :dueDt,
		pickerPosition: "bottom-left"
	});
}*/

var corpId = null;
/**
 * 获取已通过审核的项目
 */
function getProject(){
	var options = {
			url : "../../flowProject/list",
			data :'{"proStatus":1,"state":0,"isPage":0}',
			callBackFun : function(data) {
				var jsonStringData = JSON.stringify(data.dataList);
				jsonStringData=jsonStringData.replace(/projectName/g,'label');
				var jsonData=eval('('+ jsonStringData +')');
				if(data.result==0){
					//查找成功
					$('#projectNameS').autocompleter({
				        highlightMatches: true,
				        source: jsonData,
				        // show hint
				        hint: false,
				        empty: true,
				        callback: function (value, index, selected) {
				        	$("#projectName").val(value);
				        	$("#custName").val(selected.custName);
				        	$("#coreCorpName").val(selected.coreCorpName);
				        	$("#coreCorpNo").val(selected.coreCorpId);
				        	$("#custNo").val(selected.custNo);
				        	$("#proId").val(selected.proId);
				        	$("#orgNo").val(selected.orgNo);
				        	corpId = selected.custNo;
				        	initAttachment();
				        	hiddenButton();
				        }
				    });
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


//form验证规则
function formValidator(){
	$('#contractForm').bootstrapValidator({
		  group: '.scf_valid',
	      message: 'This value is not valid',
	      feedbackIcons: {
	          valid: 'glyphicon glyphicon-ok',
	          invalid: 'glyphicon glyphicon-remove',
	          validating: 'glyphicon glyphicon-refresh'
	      },
	      fields: {
	    	  projectName: {
	    		  validators: {
	                  notEmpty: {
	                      message: '项目名称不能为空'
	                  },
	                  stringLength: {
	                      min: 1,
	                      max: 32,
	                      message: '长度为1-32'
	                  }
	              }
	              
	          },
	          creditLimit: {
	    		  validators: {
	                  notEmpty: {
	                      message: '合同金额不能为空'
	                  },
	                  regexp: {
	                		 regexp: /^\d+(\.\d+)?$/,
		                     message: '只能使用数字'
	                     },
	                  stringLength: {
	                      min: 1,
	                      max: 32,
	                      message: '长度为1-32'
	                  }
	              }
	              
	          },
	          factorRate:{
	    		  validators: {
	                  notEmpty: {
	                      message: '保理综合费率不能为空'
	                  },
	                  regexp: {
	                		 regexp: /^\d+(\.\d+)?$/,
		                     message: '只能使用数字'
	                     },
	                  stringLength:{
	                      min: 1,
	                      max: 32,
	                      message: '长度为1-32'
	                  }
	              }
	              
	          },
	          term:{
	        	  validators: {
	                  notEmpty: {
	                      message: '期限不能为空'
	                  },
	                  regexp: {
	                		 regexp: /^([0-9]*)$/,
		                     message: '只能使用整数'
	                     },
	                  stringLength:{
	                      min: 1,
	                      max: 32,
	                      message: '长度为1-32'
	                  }
	              }
	          },
	          loanRt:{
	    		  validators: {
	                  notEmpty: {
	                      message: '融资比例不能为空'
	                  },
	                  regexp: {
	                		 regexp: /^\d+(\.\d+)?$/,
		                     message: '只能使用数字'
	                     },
	                     callback: {  
		                       message: '保证金在0~100之间',  
		                       callback: function(value, validator) { 
		                        	return value =="" || (parseFloat(value)>=0&&parseFloat(value)<=100);
		                         }  
		                     } 
	              }
	              
	          }
	      }
		})
		.on('success.form.bv', function (e) {
			e.preventDefault();
		});	
}

/**
 * 发起流程
 * @param workflowNm
 */
function start(formId) {
	// 前端校验
	var bootstrapValidator = $("#" + formId).data('bootstrapValidator');
	bootstrapValidator.validate();
	if (!bootstrapValidator.isValid()) {
		return;
	}
	
	var url = '../../workflow/startCntSign';
	var data = CloudUtils.convertStringJson(formId);
	var options = {
			url : url,
			data : data,
			callBackFun : function(data) {
				if(data.result==0){
					bootbox.alert(data.resultNote);
					//$("#"+formId)[0].reset();
					corpId = $('#custNo').val();
					$("form input").attr("disabled",true);
					$("select").attr("disabled",true);
					$(".btn-info").attr("disabled",true);
					
					hiddenButton();
					//initAttachment();
					window.parent.scrollTo(0,0);
					return true;
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

/**
 *合同附件上传 
 */
function initAttachment() {
	$('#contractAttachment').bootstrapTable('destroy');
	$('#contractAttachment').bootstrapTable({
		method : "post",
		url : "../../uploadFile/list",
		striped : false, //表格显示条纹  
		pagination : true, //启动分页  
		pageSize : 5, //每页显示的记录数  
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
				moduleType : 5,
				corpId : corpId ? corpId : 0
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
				field : 'fileName',
				title : '上传文件名',
				align : 'center',
				valign : 'middle',
				formatter : function(value, row, index) {
					var m = '<a href="' + "../../" + row.fileUrl + '" download="'
							+ row.fileName + '">' + row.fileName + '</a>';
					return m;
				}
			},
			{
				field : 'operation',
				title : '操作',
				align : 'center',
				valign : 'middle',
				width : '120',
				formatter : function(value, row, index) {
					return '<a class = "fa fa-trash-o removeAttachment" style="color:#fa8564;padding:0px 5px;" title="删除" href="javascript:void(0)"></a>';
				},
				events : 'operateAttachmentEvents'
			}
		]
	});
}

function uploadAttachment(id) {
	$("#file").data('type', id == 6 ? 1 : 0);
	document.getElementById("file").value = null;
	document.getElementById("file").click();
}

function ajaxFileUpload() {
	var flag = $('#file').data('type');
	if ($("#file").val().length > 0) {
		$.ajaxFileUpload({  
	        url : '../../file/attachmentUpload?corpId=' + corpId + '&moduleType=' + 5 + '&isAgreement=' + flag,  
	        secureuri : false,
	        fileElementId : 'file',
	        dataType : 'json',  
	        success : function(data, status) {  
	            if (data.result == 0) { 
	            	var path=data.fileUrl;
	            	//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
	            	initAttachment();
	            }else{
	            	bootbox.alert("上传失败！"); 
	            } 
	        },  
	        error : function(data, status, e) {  
	        	bootbox.alert(e);  
	        }  
	    });  
    }
    else {
    	bootbox.alert("请选择附件");
    }
}

window.operateAttachmentEvents = {
		'click .removeAttachment' : function(e, value, row, index) {
			let type = $(e.target).data('type');
			bootbox.confirm("确定删除此条记录?", function(result) {
				if (result) {
					var options = {
						url : '../../uploadFile/delete',
						data : '{"fileId":"' + row.fileId + '"}',
						callBackFun : function(data) {
							if (data.result == 0) {
								initAttachment(type);
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

/*
 * 上传按钮的隐藏和显示
 */
function hiddenButton(){
	if (corpId) {
		$(".btn-link").removeClass('hidden');
	} else {
		$(".btn-link").addClass('hidden');
	}
}

/*
 * 当input框中数据发生改变清空
 */
function changeName(){
	$("#projectName").val("");
	$("#custName").val("");
	$("#coreCorpName").val("");
	$("#coreCorpNo").val("");
	$("#custNo").val("");
	$("#proId").val("");
	corpId = null;
	initAttachment();
	hiddenButton();
}

function numFormat(){
	$("#creditLimit").number(true, 2);
	$("#factorRate").number(true, 2);
	$("#loanRt").number(true, 2);
}