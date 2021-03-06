var priId = null;
$(function(){
	CloudUtils.inputCacheClear();
	initTable();
	getProject();
	Buttonhidden1();
	numFormat();
	$('.modal').on('hidden.bs.modal', function(){
		window.parent.scrollTo(0,0);
		$("form.form-horizontal").not($("#proSetupForm")).each(function() {
			$(this).bootstrapValidator('resetForm', true);
			this.reset();
		});
	});
});

var initTable = function() {
	flowGuaranteeInfoInitTable();
	flowRiskCtrlInitTable();
}

var flowGuaranteeInfoInitTable = function() {
	var custNo = $('#custNo').val();
	$('#guaranteeList').bootstrapTable('destroy');
	$('#guaranteeList').bootstrapTable({
		method: "post",
        url: "../../flowGuaranteeInfo/list",
        striped: true,  //表格显示条纹 
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
			var param = {
				pageNumber: params.pageNumber,
				pageSize: params.pageSize,
				priId : priId,
				corpId: custNo ? custNo : 0
			};
			return JSON.stringify(param);
		},
        responseHandler:function responseHandler(res) {
        	if (res.result == 0) {
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
	        field: 'grtId',
	        title: '主键',
	        align: 'center',
	        valign: 'middle',
	        visible: false
	    }, {
	        field: 'grtName',
	        title: '担保方名称',
	        align: 'center',
	        valign: 'middle'
	    }, {
	        field: 'grtMsr',
	        title: '担保措施',
	        align: 'center',
	        valign: 'middle'
	    }, {
	        field: 'grtAmt',
	        title: '担保金额',
	        align: 'center',
	        valign: 'middle',
	        formatter: function(value, row, index) {
	        	return $.number(value, 2);
	        }
	    }, {
	        field: 'priId',
	        title: '立项流程ID',
	        align: 'center',
	        valign: 'middle',
	        visible: false
	    }, {
	        field: 'corpId',
	        title: '供应商ID',
	        align: 'center',
	        valign: 'middle',
	        visible: false
	    }, {
	        field: 'operation',
	        title: '操作',
	        align: 'center',
	        valign: 'middle',
	        formatter: function(value, row, index) {
	            var s = '<a class="fa fa-edit modify" style="color:#d864fd;padding:0px 5px;" title="编辑" data-type="flowGuaranteeInfo" href="javascript:void(0)"></a>';
	            var r = '<a class="fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" title="删除" data-type="flowGuaranteeInfo" href="javascript:void(0)"></a>';
	            return s + ' ' + r;
	        },
	        display: 'inline-flex',
	        events: 'operateEvents'
	    }]
	});
}

var flowRiskCtrlInitTable = function() {
	var custNo = $('#custNo').val();
	$('#riskList').bootstrapTable('destroy');
	$('#riskList').bootstrapTable({
		method: "post",
        url: "../../flowRiskCtrl/list",
        striped: true,  //表格显示条纹 
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
			var param = {
				pageNumber: params.pageNumber,
				pageSize: params.pageSize,
				corpId: custNo ? custNo : 0
			};
			return JSON.stringify(param);
		},
        responseHandler:function responseHandler(res) {
        	if (res.result == 0) {
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
	        field: 'rskctId',
	        title: 'Item ID',
	        align: 'center',
	        valign: 'middle',
	        visible: false
	    }, {
	        field: 'rskctMsr',
	        title: '立项报告',
	        align: 'center',
	        valign: 'middle'
	    }, {
	        field: 'priId',
	        title: '立项流程id',
	        align: 'center',
	        valign: 'middle',
	        visible: false
	    }, {
	        field: 'corpId',
	        title: '供应商id',
	        align: 'center',
	        valign: 'middle',
	        visible: false
	    }, {
	        field: 'operation',
	        title: '操作',
	        align: 'center',
	        valign: 'middle',
	        formatter: function(value, row, index) {
	            var s = '<a class="fa fa-edit modify" style="color:#d864fd;padding:0px 5px;" title="编辑" data-type="flowRiskCtrl" href="javascript:void(0)"></a>';
	            var r = '<a class="fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" title="删除" data-type="flowRiskCtrl" href="javascript:void(0)"></a>';
	            return s + ' ' + r;
	        },
	        display: 'inline-flex',
	        events: 'operateEvents'
	    }]
	});
}

window.operateEvents = {
		'click .modify': function (e, value, row, index) {
			modFun(row, $(e.target).data('type'), 2);
		},
	    'click .remove': function (e, value, row, index) {
	    	var type = $(e.target).data('type'), mData;
	    	if (type == 'flowGuaranteeInfo') {
	    		mData = '{"grtId":"'+row.grtId+'"}'
	    	} 
	    	else if (type == 'flowRiskCtrl') {
	    		mData = '{"rskctId":"'+row.rskctId+'"}'
	    	}
	    	bootbox.confirm("确定删除此条记录?", function(result) {  
				if (result) {
					var options = {
						url : '../../' + type + '/delete',
						data : mData,
						callBackFun : function(data) {
							if (data.result==0) {
								eval(''+ type + 'InitTable()');
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
	    	});
		},
		'click .removeAttachment':function(e, value, row, index) {
	    	bootbox.confirm("确定删除此条记录?", function(result) {  
	            if (result) {  
	            	var options = {
	    					url : '../../uploadFile/delete',
	    					data : '{"fileId":"'+row.fileId+'"}',
	    					callBackFun : function(data) {
	    						if(data.result==0){
	    							initAttachment();
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
	    	 });
	    }   
};

var addFun = function(type, num) {
	$('#isEdit').val(num);
	$("#" + type + "ModalLabel").text("添加");
	$("#" + type + "Modal").modal({backdrop: 'static', keyboard: false});//防止点击空白/ESC 关闭
}

var modFun = function(row, type, num) {
	$('#isEdit').val(num);
	$("#" + type + "ModalLabel").text("修改");
    $("#" + type + "Modal").modal({backdrop: 'static', keyboard: false});//防止点击空白/ESC 关闭
    CloudUtils.setForm(row, "" + type + "Form");
}

var saveFun1 = function(type) {
	var isEdit =  $('#isEdit').val();
	var data = CloudUtils.convertAllJson('' + type + 'Form');
	data = eval("(" + data + ")");
	data['corpId'] = corpId;
	data['priId'] = priId; //立项流程Id
	data = JSON.stringify(data);
	var url = isEdit == 1 ? '../../'+type+'/add' : '../../'+type+'/mod';
	$('#' + type + 'Modal').modal("hide");
	var options = {
		url : url,
		data : data,
		callBackFun : function(data) {
			if (data.result == 0) {
				eval(''+ type + 'InitTable()');
				bootbox.alert(data.resultNote);
			} else {
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

//初始化附件表格
function initAttachment(){
	$('#showAttachment').bootstrapTable('destroy');  
	$("#showAttachment").bootstrapTable({  
         method: "post", 
         url: "../../uploadFile/list",
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
           var param = {
        	   sysType:2,
               corpId:"corp00002"
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
 	        field: 'fileName',
 	        title: '上传文件名',
 	        align: 'center',
            valign: 'middle',
            formatter:function(value,row,index){
 	 	    	var m = '<a href="'+"../../"+row.fileUrl+'" download="'+row.fileName+'">'+row.fileName+'</a>';
 	            return m;
 	        }
 	    }, {
 	        field: 'operation',
 	        title: '操作',
 	       align: 'center',
           valign: 'middle',
           width:'120',
 	        formatter:function(value,row,index){
 		 	    var d = '<a class = "fa fa-trash-o removeAttachment" style="color:#fa8564;padding:0px 5px;" title="删除" href="javascript:void(0)"></a>';
 	            return d;
 	        },
 	        events: 'operateEvents'
 	    }]
       });  
}

/**
 * 获取已立项的供应商名称
 */
function getProject(){
	var options = {
			url : "../../corp/list",
			data :'{"sysType":5}',
			callBackFun : function(data) {
				var jsonStringData = JSON.stringify(data.dataList);
				jsonStringData=jsonStringData.replace(/corpName/g,'label');
				var jsonData=eval('('+ jsonStringData +')');
				if(data.result==0){
					//查找成功
					$('#custNameS').autocompleter({
				        highlightMatches: true,
				        source: jsonData,
				        // show hint
				        hint: false, 
				        empty: true,
				        callback: function (value, index, selected) {
				        	$("#coreCorpName").val(selected.coreCorpName);
				        	$("#coreCorpNo").val(selected.coreCorpId);
				        	$("#custNo").val(selected.corpId);
				        	corpId = selected.corpId;
				        	$('#custName').val(value);
				        	$("#creditMode").val("");
				        	//判断是否为首笔，用prdStatus判断
				        	var shoubi = $("#creditMode").find("option[value='首笔']");
				        	if(selected.prdStatus =="1"){
				        		//已经立过项了,首选项disabled
				        		$("#creditMode").find("option[value='首笔']").attr("disabled",true);
				        	/*	$("#creditMode option[value='首笔']").remove();*/ //删除Select中Value='首笔'的Option 
				        	}else{
				        		//已经立过项了,首选项disabled
				        		$("#creditMode").find("option[value='首笔']").attr("disabled",false);
				        		/* $("#creditMode").append('<option value="首笔">首笔</option>');*/
				        	}
				        	Buttonhidden();
				        	//根据custNo查询出corpId表的数据，插入到供应商信息中
				        	var options = {
				        			url : "../../corp/list",
				        			data :'{"corpId":"'+selected.corpId+'"}',
				        			callBackFun : function(data) {
				        				debugger
				        				if(data.result==0){
				        					CloudUtils.setForm(data.dataList[0],'splinfoForm');
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
				        	//初始化其他表格
			        		initSupplierBaseTable();
			        		//初始化附件表格
			    			initAttachment('base');
			    			initAttachment('finance');
			    			initAttachment('credit');
			    			initAttachment('contract');
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

/**
 * 发起流程
 * @param workflowNm
 */
function start(formId,workflowNm) {
	//corpId是否选择
	if(!corpId){
		bootbox.alert("请先选择供应商！");
		return false;
	}
	var url = '../../workflow/startLXProcess';
	var data = CloudUtils.convertStringJson(formId);
	var options = {
			url : url,
			data : data,
			callBackFun : function(data) {
				if(data.result==0){
					priId = data.priId;
					window.parent.scrollTo(0,0);
					//$("#"+formId)[0].reset();
					//$("#field").attr("disabled",true);
					Buttonhidden();
					Buttonhidden1();
					bootbox.alert("操作成功",function(){
						//window.location.href = '../../tabs-accordions.html';
					});
					$("#bttn").attr("disabled","disabled");
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
 * 项目名称查询名称改变的时候清空数据
 */
function changeName(){
	$("#custName").val("");
	$("#coreCorpName").val("");
	$("#coreCorpNo").val("");
	$("#custNo").val("");
	corpId=null;
	priId=null;
	Buttonhidden();
	Buttonhidden1();
}

/*
 * 担保方信息和立项报告的添加按钮的隐藏和显示
 */
function Buttonhidden1(){
	if (corpId && priId) {
		$(".new_setup_hide .btn-link").removeClass('hidden');
	} else {
		$(".new_setup_hide .btn-link").addClass('hidden');
	}
}

//form验证规则
function formValidator(){
	$('#proSetupForm').bootstrapValidator({
		  group: '.scf_valid',
	      message: 'This value is not valid',
	      feedbackIcons: {
	          valid: 'glyphicon glyphicon-ok',
	          invalid: 'glyphicon glyphicon-remove',
	          validating: 'glyphicon glyphicon-refresh'
	      },
	      fields: {
	    	  proName: {
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
	          custName: {
	    		  validators: {
	      				notEmpty : {
							message : '供应商名称不能为空'
						}
	                }
	          },
	          aplFactorLimit:{
	              validators: {
	            	  numeric: {
	            		  message: '申请额度只能输入数字'
	            	  },
	            	  notEmpty : {
							message : '申请额度不能为空'
					  },
	                  callback: {  
	                         message: '申请额度在0~1000000000之间',  
	                         callback: function(value, validator) { 
	                        	 return value =="" || (parseFloat(value)>=0&&parseFloat(value)<=1000000000);
	                         }  
	                     } 
	              }
	          },
	         factCmprCost:{
	              validators: {
	            	  numeric: {
	            		  message: '保理综合成本只能输入数字'
	            	  },
	                  callback: {  
	                         message: '保理综合成本在0~1000000000之间',  
	                         callback: function(value, validator) { 
	                        	 return value =="" || (parseFloat(value)>=0&&parseFloat(value)<=1000000000);
	                         }  
	                     } 
	              }
	          },
	      }
		})
		.on('success.form.bv', function (e) {
			e.preventDefault();
			start('proSetupForm','立项审批');
		});
	$('#flowGuaranteeInfoForm').bootstrapValidator({
	      message: 'This value is not valid',
	      feedbackIcons: {
	          valid: 'glyphicon glyphicon-ok',
	          invalid: 'glyphicon glyphicon-remove',
	          validating: 'glyphicon glyphicon-refresh'
	      },
	      fields: {
	    	  grtName: {
	    		  validators: {
	      				notEmpty : {
							message : '担保方名称不能为空'
						}/*,
						regexp: {
		                      regexp: /^[A-Za-z\u4e00-\u9fa5]+$/,
		                      message: '只能输入中文和英文'
		                }*/
	                }
	          },
	          grtMsr: {
	    		  validators: {
	      				notEmpty : {
							message : '担保措施不能为空'
						}
	                }
	          },
	          grtAmt: {
	    		  validators: {
	      				notEmpty : {
							message : '担保金额不能为空'
						},
						numeric: {
							message: '只能输入数字'
						},
	      				callback: {  
	      					message: '担保金额在-1000000000.00~1000000000.00之间',  
	      						callback: function(value, validator) { 
	      						return parseFloat(value)> -1000000000&&parseFloat(value)<1000000000;
	      						}  
	      				}
	                }
	          }
	      },
	      excluded: ':disabled'
		})
		.on('success.form.bv', function (e) {
			e.preventDefault();
			saveFun1('flowGuaranteeInfo');
			$(e.target).bootstrapValidator('resetForm', true);
		});	
	$('#flowRiskCtrlForm').bootstrapValidator({
	      message: 'This value is not valid',
	      feedbackIcons: {
	          valid: 'glyphicon glyphicon-ok',
	          invalid: 'glyphicon glyphicon-remove',
	          validating: 'glyphicon glyphicon-refresh'
	      },
	      fields: {
	    	  rskctMsr: {
	    		  validators: {
	    			  	notEmpty : {
							message : '立项报告不能为空'
						}
	                }
	          }
	      },
	      excluded: ':disabled'
		})
		.on('success.form.bv', function (e) {
			e.preventDefault();
			saveFun1('flowRiskCtrl');
			$(e.target).bootstrapValidator('resetForm', true);
		});
}

var numFormat = function(){
	$("#grtAmt").number(true, 2);
	$("#factCmprCost").number(true, 2);
	$("#aplFactorLimit").number(true, 2);
	$("#adviceLimit").number(true, 2);
}