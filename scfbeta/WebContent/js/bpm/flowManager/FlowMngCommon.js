/** 
 * 流程管理前端公共js
 * @author jiangl
 * @date:  2016-12-22 
 */
(function ($){
    //全局对象
    window['FlowMngCommon'] = {};
 
    /**
	 * 流程一览初始化（未结、已结）
	 * 
	 * @param tableId
	 *            列表ID
	 * @param method
	 *            后台执行方法
	 * @param flowType
	 *            流程类别：'NOT'-未结流程;'OVER'-已结流程
	 */
    FlowMngCommon.initTable = function(tableId, method, flowType) {
    	$('#' + tableId)
    		.bootstrapTable('destroy')
    		.bootstrapTable({
	             method: "post", 
	             url: "../../workflow/" + method, 
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
	               var procInsName;
	               var startTime;
	               var endTime;
	               var v_procInsName = $("#procInsName").val();
	               var v_createTime = $("#createTime").val();
	               // 流程实例名称
	               if (CloudUtils.isEmpty(v_procInsName)) {
	            	   procInsName = "";
	               } else {
	            	   procInsName = $("#procInsName").find("option:selected").text();
	               }
	               // 创建时间from-to
	               if (CloudUtils.isEmpty(v_createTime)) {
	            	   startTime = "";
	            	   endTime = "";
	               } else {
	            	   var array = v_createTime.split(' - ');
	            	   startTime = array[0];
	            	   endTime = array[1];
	               }
	               var param = {    
	                   pageNumber: params.pageNumber,
	                   pageSize: params.pageSize,
	                   username: store.get('username'),
	                   corpId: store.get('corpId'),
	                   projectName: $("#projectName").val(),
	                   procInsName: procInsName,
	                   startTime: startTime,
	                   roleId:store.get("roleId"),
	                   endTime: endTime
	               }
	               if (flowType == "OVER") {
	            	   param.priState = $("#priState").val();
	               }
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
	     	        field: 'procInsId',
	     	        title: '流程实例ID',
	     	        align: 'center',
	                valign: 'middle',
	                visible: false
	     	     },{
	     	        field: 'proId',
	     	        title: '项目ID',
	     	        align: 'center',
	                valign: 'middle',
	                visible: false
	     	     }, {
	     	        field: 'proName',
	     	        title: '项目名称',
	     	        align: 'center',
	                valign: 'middle',
	                formatter:function(value, row, index) {
	     	            return '<a class="procDetail" style="color:#a9d86e;padding:0px 5px;" title="详情" href="javascript:void(0)">'+value+'</a>';
	     	        },
	     	        events: 'operateEvents'
	     	     }, {
	     	        field: 'procInsName',
	     	        title: '项目流程',
	     	        align: 'center',
	                valign: 'middle'
	     	     }, {
	     	        field: 'createDate',
	     	        title: '创建时间',
	     	        align: 'center',
	                valign: 'middle'
	     	     }, {
	     	        field: 'endDate',
	     	        title: '结束时间',
	     	        align: 'center',
	                valign: 'middle',
	                visible: flowType == 'OVER'
	     	     }, {
	     	        field: 'continueDate',
	     	        title: '持续时间',
	     	        align: 'center',
	                valign: 'middle',
	                visible: flowType == 'OVER',
	                formatter:function(value, row, index) {
	                	return CloudUtils.dateSub(row.createDate, row.endDate);
	                }
	     	     }, {
	     	        field: 'status',
	     	        title: '项目状态',
	     	        align: 'center',
	                valign: 'middle'
	     	     }, {
	     	        field: 'monitorUrl',
	     	        title: '状态图',
	     	        align: 'center',
	                valign: 'middle',
	                formatter:function(value, row, index) {
	     	            return '<a class = "fa fa-eye" style="color:#1c4efa;padding:0px 5px;" title="预览" href="'+ value + row.procInsId +'" target="_blank"></a>';
	     	        },
	     	        events: 'operateEvents',
	                visible: false
	     	     }, {
	     	        field: 'operation',
	     	        title: '操作',
	     	        align: 'center',
	                valign: 'middle',
	                visible: flowType == 'NOT',
	                formatter:function(value, row, index) {
	     	            return '<a class = "fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" title="终止" href="javascript:void(0)"></a>';
	     	        },
	     	        events: 'operateEvents'
	     	     }]
        });
    };
    
    /**
	 * 项目详情一览初始化
	 * 
	 * @param procInsId
	 *            流程实例ID
	 * @param flowType
	 *            流程类别：'NOT'-未结流程;'OVER'-已结流程
	 */
    FlowMngCommon.initDetailTable = function(modalId, procInsId, flowType) {
    	$('#'+modalId+'Table')
    		.bootstrapTable('destroy')
    		.bootstrapTable({
	             method: "post", 
	             url: "../../workflow/detail",
	             striped: false,  //表格显示条纹  
	             pagination: false, //启动分页  
	             search: false,  //是否启用查询  
	             showColumns: false,  //显示下拉框勾选要显示的列  
	             showRefresh: false,  //显示刷新按钮  
	             sidePagination: "server", //表示服务端请求  
	             //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
	             //设置为limit可以获取limit, offset, search, sort, order  
	             queryParamsType : "undefined",   
	             queryParams: function queryParams() {   //设置查询参数  
	               var param = {
	            	   procInsId : procInsId
	               };    
	               return JSON.stringify(param);
	             },  
	             responseHandler:function responseHandler(res) {
	            	 if (res.result==0) {
	            		 if (flowType == 'NOT') {
	            			 if (res.operateFlg == 1) {
	                			 $("#"+modalId+"Modal #operateFooter").show();
	                			 $("#"+modalId+"Modal #procInsId").val(procInsId);
	                			 $("#"+modalId+"Modal #workItemId").val(res.workItemId);
	                			 $("#"+modalId+"Modal #stepId").val(res.stepId);
	                			 $("#"+modalId+"Modal #custNo").val(res.custNo);
	                			 $("#"+modalId+"Modal #proName").val(res.proName);
	                			 $("#"+modalId+"Modal #creditMode").val(res.creditMode);
	                			 $("#"+modalId+"Modal #proId").val(res.proId);
	                		 } else {
	                			 $("#"+modalId+"Modal #operateFooter").hide();
	                		 }
	            		 }
	    	        	 return {
	    	        		 "rows": res.dataList,
	    	        		 "total": res.records
	    	        	 };
	            	 } else {
	            		 if (flowType == 'NOT') {
	            			 $("#operateFooter").hide();
	            		 }
	            		 bootbox.alert(res.resultNote);
	            		 return {
	    			        	 "rows": [],
	    			        	 "total": 0
	    			        	 };
	            	 }
	             },
	             columns: [{
	     	        field: 'workItemId',
	     	        title: '工作项ID',
	     	        align: 'center',
	                valign: 'middle',
	                visible: false
	     	     }, {
	     	        field: 'procInsId',
	     	        title: '流程ID',
	     	        align: 'center',
	                valign: 'middle',
	                visible: false
	     	     }, {
	     	        field: 'advice',
	     	        title: '意见',
	     	        align: 'center',
	                valign: 'middle',
	                visible: false
	     	     }, {
	     	        field: 'stepId',
	     	        title: '步骤ID',
	     	        align: 'center',
	                valign: 'middle',
	                visible: false
	     	     }, {
	     	        field: 'name',
	     	        title: '名称',
	     	        align: 'center',
	                valign: 'middle'
	     	     }, {
	     	        field: 'startDate',
	     	        title: '开始时间',
	     	        align: 'center',
	                valign: 'middle'
	     	     },{
	     	        field: 'endDate',
	     	        title: '结束时间',
	     	        align: 'center',
	                valign: 'middle'
	     	     }, {
	     	        field: 'user',
	     	        title: '负责人',
	     	        align: 'center',
	                valign: 'middle'
	     	     }, {
	     	        field: 'status',
	     	        title: '状态',
	     	        align: 'center',
	                valign: 'middle',
	                formatter:function(value, row, index) {
	                	var content;
	                	if (value == "0") {
	                		content = '同意';
	                	} else if (value == "1") {
	                		content = '不同意';
	                	} else if (value == "2") {
	                		content = '申请';
	                	} else if (value == "3") {
	                		content = '<font color="red">待办</font>';
	                	} else if (value == "4") {
	                		content = '<font color="red">终止</font>';
	                	}
	     	            return content;
	     	        }
	     	     }, {
	     	        field: 'details',
	     	        title: '详情',
	     	        align: 'center',
	                valign: 'middle',
	                formatter:function(value, row, index) {
	                	// 待办以外的场合可以查看详情
	                	if (row.status != "3" && row.status != "4") {
	                		return '<a class="workDetail" style="color:#a9d86e;padding:0px 5px;" title="详情" href="javascript:void(0)">详情</a>';
	                	}
	                	
	                	return '';
	     	        },
	     	        events: 'operateEvents'
	     	     }]
        });
    };
    
    /**
	 * 详情点击事件
	 * 
	 * @param row
	 *            详情所在行
	 */
    FlowMngCommon.clickDetail = function(row) {
    	$(".riskAdvices").attr("style","display:none;");
    	var modalId;
		var formId;
		var stepId = row.stepId;
		var flowType = stepId.slice(0, 1);
		// 立项审批流程
		if (flowType == "L"){
			modalId = "projectSetupModal";
			formId = "projectSetupForm";
		} else if (flowType== "X"){
			modalId = "projectTuningModal";
			formId = "projectTuningForm";
		} else if (flowType== "F"){
			modalId = "loanApprovalModal";
			formId = "loanApprovalForm";
		}
		$("#" + modalId).modal({backdrop: 'static', keyboard: false});
		$("#" + modalId).on('hide.bs.modal',function(){
			$("#detailModal").modal("show");
		});
		// 意见栏
		if (modalId == "financeLblModal") {
			if (row.status == "0" || row.status == "1") {
				$("#tab6LblForm #advice").text(row.advice)
				$("#financeLblModal").find("#myTabLbl li:eq(5)").show();
			} else {
				$("#tab6LblForm #advice").text("")
				$("#financeLblModal").find("#myTabLbl li:eq(5)").hide();
			}
		} else if(modalId == "projectTuningModal"&&stepId=="X3"){
			$(".riskAdvices").attr("style","display:block;");
			$("#" + modalId + " #advice").val("");
			$("#" + modalId + " #fsAdvice").hide();
		} else {
			if (row.status == "0" || row.status == "1") {
				$("#" + modalId + " #advice").val(row.advice);
				$("#" + modalId + " #fsAdvice").show();
			} else {
				$("#" + modalId + " #advice").val("");
				$("#" + modalId + " #fsAdvice").hide();
			}
		}
		
		// 项目详情取得
		var options = {
				url : '../../workflow/info',
				data : JSON.stringify({
					workItemId : row.workItemId,
					procInsId : row.procInsId,
					stepId : row.stepId
				}),
				callBackFun : function(data) {
					if(data.result==0){
						// 立项审批流程
						if (flowType ==="L" || flowType ==="F"){
							FlowMngCommon.detailProjectSetup(formId, data);
						}else if(flowType ==="X"){
							//项目尽调中的项目简介详情
							CloudUtils.setForm(data,"infoForm");
							//项目分析加上详情
							CloudUtils.setForm(data,"addProAnlyForm");
						}
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
    };
    
    /**
     * 详情_特殊事项审批
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailSpMatter = function(formId, data) {
    	var targetLbl;
    	var applyItem;
    	$.each(data, function(name, value) {
    		targetLbl = $("#" + formId + " #" + name + "Lbl");
    		// 是否有追
    		if (name == "chaseFlg") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 保理类型
    		} else if (name == "factorType") {
    			if (value == "1") {
    				targetLbl.text("明保");
    			} else {
    				targetLbl.text("暗保");
    			}
    			// 申请事项
    		} else if (name == "applyItem") {
    			applyItem = value;
    			if (value == "1") {
    				targetLbl.text("展期");
    			} else if (value == "2") {
    				targetLbl.text("费用减免");
    			} else if (value == "3") {
    				targetLbl.text("转法务");
    			} else if (value == "4") {
    				targetLbl.text("其他");
    			}
    			// 还款类型
    		} else if (name == "repayType") {
    			if (value == "1") {
    				targetLbl.text("买方");
    			} else if (value == "2") {
    				targetLbl.text("卖方");
    			} else if (value == "3") {
    				targetLbl.text("间接");
    			}
    			// 是否转法务
    		} else if (name == "chgForensicFlg") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    		} else if (name == "repayAmount" || name == "reduceAmount") {
    			targetLbl.text($.number(value, 2));
    		} else {
    			targetLbl.text(value);
    		}
    	});
    	FlowMngCommon.changeApplyItemLbl(applyItem);
    };

    /**
     * 详情_融资直通车
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailFinance = function(data) {
    	// 详情_立项管理
    	FlowMngCommon.detailProEst("tab1LblForm", data);
    	// 详情_授信申请
    	FlowMngCommon.detailCredit("tab2LblForm", data);
    	// 详情_风控报告
    	FlowMngCommon.detailRiskCtrl("tab3LblForm", data);
    	// 详情_合同申请
    	FlowMngCommon.detailContract("tab4LblForm", data);
    	// 详情_放款申请
    	FlowMngCommon.detailLoan("tab5LblForm", data);
    }
    
    /**
     * 详情_立项管理
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailProEst = function(formId, data) {
    	var targetLbl;
    	var invNoArr = new Array();
    	var invAmtArr = new Array();
    	var invoiceArr = new Array();
    	$.each(data, function(name, value) {
    		targetLbl = $("#" + formId + " #" + name + "Lbl");
    		// 是否有追
    		if (name == "chaseFlg") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 保理类型
    		} else if (name == "factorType") {
    			if (value == "1") {
    				targetLbl.text("明保");
    			} else {
    				targetLbl.text("暗保");
    			}
    			// 是否开立发票
    		} else if (name == "hasInv") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    		} else if (name == "invNo") {
    			if (!CloudUtils.isEmpty(value)) {
    				invNoArr = value.split(",");
    			}
    		} else if (name == "invAmt") {
    			if (!CloudUtils.isEmpty(value)) {
    				invAmtArr = value.split(",");
    			}
    		} else if (name == "invoice") {
    			if (!CloudUtils.isEmpty(value)) {
    				invoiceArr = value.split(",");
    			}
    		} else if (name == "billAmount"
    				|| name == "arBal" || name == "aplFacAmt") {
    			targetLbl.text($.number(value, 2));
    		} else {
    			FlowMngCommon.setFileUrl(targetLbl, value);
    		}
    	});
    	$("#" + formId + " #detailInvcDiv").empty();
    	if (invNoArr.length > 0) {
    		var invNoNum = invNoArr.length;
    		for (var i = 1; i < invNoNum + 1; i++){
    			var invoiceUrl = invoiceArr[i-1];
    			var invNoLb = invNoArr[i-1];
    			var invAmtLb = invAmtArr[i-1];
    			// 发票追加
    			var invHtml='<div class="form-group">';
    			invHtml +=	'	<label class="col-sm-4 control-label">发票'+i+'</label>';
    			if (CloudUtils.isEmpty(invoiceUrl)) {
    				invHtml +=	'	<label class="col-sm-6 control-label left"></label>';
    			} else {
    				var suffix = invoiceUrl.substring(invoiceUrl.lastIndexOf("."), invoiceUrl.length);
    				var target;
    				// 图片格式
    				if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(suffix)) {
    					target = "_blank";
    				} else {
    					target = "_self";
    				}
    				invHtml +=	'	<a class = "fa fa-eye" style="color:#1c4efa;padding:10px 5px;margin-left:10px;" title="附件" href="' + invoiceUrl + '" target="' + target + '"></a>';
    			}
    			invHtml +=	'</div>';
    			invHtml +=	'<div class="form-group">';
    			invHtml +=	'	<label class="col-sm-4 control-label">发票编号'+i+'</label>';
    			invHtml +=	'	<label id="invNoLbl'+i+'" class="col-sm-6 control-label left">'+invNoLb+'</label>';
    			invHtml +=	'</div>';
    			invHtml +=	'<div class="form-group">';
    			invHtml +=	'	<label class="col-sm-4 control-label">发票金额'+i+'</label>';
    			invHtml +=	'	<label id="invAmtLbl'+i+'" class="col-sm-6 control-label left">'+$.number(invAmtLb, 2)+'</label>';
    			invHtml +=	'</div>';
    			$("#" + formId + " #detailInvcDiv").append(invHtml);
    		}
    	}
    };

    /**
     * 详情_授信申请
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailCredit = function(formId, data) {
    	var targetLbl;
    	// 备注_厂房/经营场所
    	var facAddrTypeOther;
    	// 备注_主要车间建造时间(适用制造业及自有)
    	var mainWorkShopBuildTimeOther;
    	// 备注_备注_车间/仓库安全生产配置
    	var workShopSafeConfigOther;
    	// 备注_存货存放
    	var inventoryStorageOther;
    	// 备注_仓库是否有存放较久的原材料或产品
    	var hasLongTimeStoredGoodsOther;
    	// 备注_仓库进出库管理是出入库管理系统
    	var hasOutStorageManagementSystemOther;
    	// 备注_公司货物运输方式及比率
    	var deliverMethodOther;
    	// 备注_是否有任何机器闲置
    	var hasAnyMachineIdleOther;
    	// 备注_企业是否有配套设施（如排污设施、净化设施等）
    	var hasSupportingFacilitiesOther;
    	// 备注_企业主要能耗
    	var mainEnergyConsumptionOther;
    	// 备注_工人忙碌程度
    	var isBusyOther;
    	// 备注_每天开工班次
    	var orderOfClassesOther;
    	// 备注_生产情况（如日产量、开工程度、产品单价等）与报告中营业额的80%
    	var productionStatusOther;
    	// 备注_公司是否有自有研发人员
    	var hasOwnRDOther;
    	// 备注_是否有严格的质量保证体系
    	var hasQASOther;
    	// 备注_业务来源
    	var busiSourceOther;
    	// 备注_股东在过去或未来6个月是否有变动
    	var hasShareHolderChangeInSixMonthOther;
    	// 备注_公司最近12个月是否涉及诉讼或被执行
    	var hasLawsuitRecentYearOther;
    	// 备注_公司业务近期是否遇到了麻烦
    	var hasTroubleOther;
    	// 备注_公司最近12个月内是否有拖欠员工工资或福利
    	var hasArrearsOfWagesOther;
    	
    	$.each(data, function(name, value) {
    		if (name === "facAddrTypeOther") {
    			facAddrTypeOther = value;
    		} else if (name === "mainWorkShopBuildTimeOther") {
    			mainWorkShopBuildTimeOther = value;
    		} else if (name === "workShopSafeConfigOther") {
    			workShopSafeConfigOther = value;
    		} else if (name === "inventoryStorageOther") {
    			inventoryStorageOther = value;
    		} else if (name === "hasLongTimeStoredGoodsOther") {
    			hasLongTimeStoredGoodsOther = value;
    		} else if (name === "hasOutStorageManagementSystemOther") {
    			hasOutStorageManagementSystemOther = value;
    		} else if (name === "deliverMethodOther") {
    			deliverMethodOther = value;
    		} else if (name === "hasAnyMachineIdleOther") {
    			hasAnyMachineIdleOther = value;
    		} else if (name === "hasSupportingFacilitiesOther") {
    			hasSupportingFacilitiesOther = value;
    		} else if (name === "mainEnergyConsumptionOther") {
    			mainEnergyConsumptionOther = value;
    		} else if (name === "isBusyOther") {
    			isBusyOther = value;
    		} else if (name === "orderOfClassesOther") {
    			orderOfClassesOther = value;
    		} else if (name === "productionStatusOther") {
    			productionStatusOther = value;
    		} else if (name === "hasOwnRDOther") {
    			hasOwnRDOther = value;
    		} else if (name === "hasQASOther") {
    			hasQASOther = value;
    		} else if (name === "busiSourceOther") {
    			busiSourceOther = value;
    		} else if (name === "hasShareHolderChangeInSixMonthOther") {
    			hasShareHolderChangeInSixMonthOther = value;
    		} else if (name === "hasLawsuitRecentYearOther") {
    			hasLawsuitRecentYearOther = value;
    		} else if (name === "hasTroubleOther") {
    			hasTroubleOther = value;
    		} else if (name === "hasArrearsOfWagesOther") {
    			hasArrearsOfWagesOther = value;
    		}
    	});
    	
    	$.each(data, function(name, value) {
    		targetLbl = $("#" + formId + " #" + name + "Lbl");
    		// 是否有追
    		if (name == "chaseFlg") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 保理类型
    		} else if (name == "factorType") {
    			if (value == "1") {
    				targetLbl.text("明保");
    			} else {
    				targetLbl.text("暗保");
    			}
    			// 三个地址是否一致
    		} else if (name == "isAddrSame") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 厂区（经营场所）处于
    		} else if (name == "facAddrArea") {
    			if (value == "1") {
    				targetLbl.text("城镇中心");
    			} else if (value == "2") {
    				targetLbl.text("工业区");
    			} else if (value == "3") {
    				targetLbl.text("主干道");
    			} else {
    				targetLbl.text("支路");
    			}
    			// 厂房/经营场所
    		} else if (name == "facAddrType") {
    			if (value == "1") {
    				targetLbl.text("独立厂区/经营场所");
    			} else if (value == "2") {
    				targetLbl.text("共同使用");
    			} else {
    				targetLbl.text(facAddrTypeOther);
    			}
    			// 经营场所为
    		} else if (name == "busiPlaceType") {
    			if (value == "1") {
    				targetLbl.text("自有");
    			} else {
    				targetLbl.text("租赁");
    			}
    			// 经营场所是否为本次授信担保品
    		} else if (name == "isFacGuarantee") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 主要经营场所建造时间
    		} else if (name == "mainFacBuildTime") {
    			if (value == "1") {
    				targetLbl.text("3年内");
    			} else if (value == "2") {
    				targetLbl.text("3-6年");
    			} else {
    				targetLbl.text("6年以上");
    			}
    			// 主要车间建造时间(适用制造业及自有)
    		} else if (name == "mainWorkShopBuildTime") {
    			if (value == "1") {
    				targetLbl.text("3年内");
    			} else if (value == "2") {
    				targetLbl.text("3-6年");
    			} else if (value == "3") {
    				targetLbl.text("6年以上");
    			} else {
    				targetLbl.text(mainWorkShopBuildTimeOther);
    			}
    			// 车间/仓库安全生产配置
    		} else if (name == "workShopSafeConfig") {
    			if (value == "1") {
    				targetLbl.text(workShopSafeConfigOther);
    			} else {
    				targetLbl.text("无");
    			}
    			// 存货存放
    		} else if (name == "inventoryStorage") {
    			if (value == "1") {
    				targetLbl.text("自有仓库");
    			} else if (value == "2") {
    				targetLbl.text("租用仓库");
    			} else {
    				targetLbl.text(inventoryStorageOther);
    			}
    			// 仓库是否有存放较久的原材料或产品
    		} else if (name == "hasLongTimeStoredGoods") {
    			if (value == "1") {
    				targetLbl.text(hasLongTimeStoredGoodsOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 仓库进出库管理是出入库管理系统
    		} else if (name == "hasOutStorageManagementSystem") {
    			if (value == "1") {
    				targetLbl.text(hasOutStorageManagementSystemOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 公司货物运输方式及比率
    		} else if (name == "deliverMethod") {
    			if (value == "1") {
    				targetLbl.text("货运公司");
    			} else if (value == "2") {
    				targetLbl.text("公司送货");
    			} else if (value == "3") {
    				targetLbl.text("客户自提");
    			} else {
    				targetLbl.text(deliverMethodOther);
    			}
    			// 公司产能利用
    		} else if (name == "prdCapUtil") {
    			if (value == "1") {
    				targetLbl.text("100%");
    			} else if (value == "2") {
    				targetLbl.text("80%-100%");
    			} else if (value == "3") {
    				targetLbl.text("80%以内");
    			} else {
    				targetLbl.text("60%以内");
    			}
    			// 是否有任何机器闲置
    		} else if (name == "hasAnyMachineIdle") {
    			if (value == "1") {
    				targetLbl.text(hasAnyMachineIdleOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 企业是否有配套设施（如排污设施、净化设施等）
    		} else if (name == "hasSupportingFacilities") {
    			if (value == "1") {
    				targetLbl.text(hasSupportingFacilitiesOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 企业主要能耗
    		} else if (name == "mainEnergyConsumption") {
    			if (value == "1") {
    				targetLbl.text("电");
    			} else if (value == "2") {
    				targetLbl.text("水");
    			} else if (value == "3") {
    				targetLbl.text("蒸气");
    			} else {
    				targetLbl.text(mainEnergyConsumptionOther);
    			}
    			// 工人忙碌程度
    		} else if (name == "isBusy") {
    			if (value == "1") {
    				targetLbl.text("忙碌");
    			} else if (value == "2") {
    				targetLbl.text("一般");
    			} else {
    				targetLbl.text(isBusyOther);
    			}
    			// 每天开工班次
    		} else if (name == "orderOfClasses") {
    			if (value == "1") {
    				targetLbl.text("1*8小时");
    			} else if (value == "2") {
    				targetLbl.text("2*8小时");
    			} else if (value == "3") {
    				targetLbl.text("3*8小时");
    			} else {
    				targetLbl.text(orderOfClassesOther);
    			}
    			// 生产情况（如日产量、开工程度、产品单价等）与报告中营业额的80%
    		} else if (name == "productionStatus") {
    			if (value == "1" || value == "2") {
    				targetLbl.text(productionStatusOther);
    			} else {
    				targetLbl.text("不确定");
    			}
    			// 企业是否有专门的质检人员（适用制造业）
    		} else if (name == "hasQC") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 公司是否有自有研发人员
    		} else if (name == "hasOwnRD") {
    			if (value == "1") {
    				targetLbl.text(hasOwnRDOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 是否有严格的质量保证体系
    		} else if (name == "hasQAS") {
    			if (value == "1") {
    				targetLbl.text(hasQASOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 机器的平均使用年限
    		} else if (name == "machineAvgUseLife") {
    			if (value == "1") {
    				targetLbl.text("三年以内");
    			} else if (value == "2") {
    				targetLbl.text("三至七年");
    			} else {
    				targetLbl.text("七年以上");
    			}
    			// 业务来源
    		} else if (name == "busiSource") {
    			if (value == "1") {
    				targetLbl.text("法定代表人");
    			} else if (value == "2") {
    				targetLbl.text("股东");
    			} else if (value == "3") {
    				targetLbl.text("业务员");
    			} else if (value == "4") {
    				targetLbl.text("实际控制人");
    			} else {
    				targetLbl.text(busiSourceOther);
    			}
    			// 股东在过去或未来6个月是否有变动
    		} else if (name == "hasShareHolderChangeInSixMonth") {
    			if (value == "1") {
    				targetLbl.text(hasShareHolderChangeInSixMonthOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 公司资金回笼的主要方式(如有多选，请备注比率)
    		} else if (name == "capitalReturnMethod") {
    			if (value == "1") {
    				targetLbl.text("银行帐户");
    			} else if (value == "2") {
    				targetLbl.text("银行承兑");
    			} else if (value == "3") {
    				targetLbl.text("个人账户");
    			} else {
    				targetLbl.text("现金");
    			}
    			// 公司最近12个月是否涉及诉讼或被执行
    		} else if (name == "hasLawsuitRecentYear") {
    			if (value == "1") {
    				targetLbl.hide();
    				targetLbl.prev().show();
    				
    				if (!CloudUtils.isEmpty(hasLawsuitRecentYearOther)) {
    					$("#" + formId + " #hasLawsuitRecentYearA").attr("href", hasLawsuitRecentYearOther);
    					var suffix = hasLawsuitRecentYearOther.substring(
    							hasLawsuitRecentYearOther.lastIndexOf("."), hasLawsuitRecentYearOther.length);
    					// 图片格式
    					if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(suffix)) {
    						$("#" + formId + " #hasLawsuitRecentYearA").attr("target", "_blank");
    					} else {
    						$("#" + formId + " #hasLawsuitRecentYearA").attr("target", "_self");
    					}
    				}
    			} else {
    				targetLbl.show();
    				targetLbl.text("否");
    				targetLbl.prev().hide();
    			}
    			// 公司业务近期是否遇到了麻烦（包括但不限于重要人员/合约的流失、关键人员患重大疾病、应收帐款回收困难、债务纠纷等）
    		} else if (name == "hasTrouble") {
    			if (value == "1") {
    				targetLbl.text(hasTroubleOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 公司最近12个月内是否有拖欠员工工资或福利
    		} else if (name == "hasArrearsOfWages") {
    			if (value == "1") {
    				targetLbl.text(hasArrearsOfWagesOther);
    			} else {
    				targetLbl.text("否");
    			}
    			// 公司是否涉及外销
    		} else if (name == "hasExport") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 企业财报与税报差异
    		} else if (name == "diffEarningsTax") {
    			if (value == "1") {
    				targetLbl.text("<30%");
    			} else if (value == "2") {
    				targetLbl.text("≥30%");
    			} else if (value == "3") {
    				targetLbl.text("≥50%");
    			} else {
    				targetLbl.text("≥70%");
    			}
    			// 公司材料采购频率
    		} else if (name == "materialStockFrequency") {
    			if (value == "1") {
    				targetLbl.text("1次/月");
    			} else if (value == "2") {
    				targetLbl.text("2次/月");
    			} else {
    				targetLbl.text("3次及以上/月");
    			}
    		} else {
    			targetLbl.text(value);
    		}
    	});
    };

    /**
     * 详情_风控报告
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailRiskCtrl = function(formId, data) {
    	var targetLbl;
    	$.each(data, function(name, value) {
    		targetLbl = $("#" + formId + " #" + name + "Lbl");
    		// 是否有追
    		if (name == "chaseFlg") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 保理类型
    		} else if (name == "factorType") {
    			if (value == "1") {
    				targetLbl.text("明保");
    			} else {
    				targetLbl.text("暗保");
    			}
    			// 是否存量客户
    		} else if (name == "isStockCustomer") {
    			if (value == "1") {
    				targetLbl.text("是");
    			} else {
    				targetLbl.text("否");
    			}
    			// 授信额度类型
    		} else if (name == "reditLineType") {
    			if (value == "1") {
    				targetLbl.text("循环额度");
    			} else {
    				targetLbl.text("单次");
    			}
    			// 千分位表示
    		} else if (name == "reditLine" || name == "aplFacAmt") {
    			targetLbl.text($.number(value, 2));
    		} else {
    			FlowMngCommon.setFileUrl(targetLbl, value);
    		}
    	});
    };

    
    
    /**
     * 详情_立项申请_德远
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailProjectSetup = function(formId,data) {
    	FlowMngCommon.setLabelValue(data,formId);
    }
    
  //span和strong,label等不用value的赋值的类型加载json对象数据
    FlowMngCommon.setLabelValue = function(jsonValue, id) {
        var obj = $("#" + id);
        $.each(jsonValue, function(name, ival) {
        	var span = obj.find("[name=" + name + "]").not("input");
            span.text(ival);
        })
    }
    /**
     * 详情_放款申请
     * @param formId 表单ID
     * @param data 详情展示用数据
     */
    FlowMngCommon.detailLoan = function(formId, data) {
    	var targetLbl;
    	var lendBathNoArr;
    	var lendAmtArr;
    	var lendDateArr;
    	var lendPersonArr;
    	var lendCorpArr;
    	var lendStateArr;
    	$.each(data, function(name, value) {
    		targetLbl = $("#" + formId + " #" + name + "Lbl");
    		// 放款批次号
    		if (name == "lendBathNo") {
    			lendBathNoArr = value.split(",");
    			// 放款金额
    		} else if (name == "lendAmt") {
    			lendAmtArr = value.split(",");
    			// 放款时间
    		} else if (name == "lendDate") {
    			lendDateArr = value.split(",");
    			// 放款人
    		} else if (name == "lendPerson") {
    			lendPersonArr = value.split(",");
    			// 放款企业
    		} else if (name == "lendCorp") {
    			lendCorpArr = value.split(",");
    			// 放款状态
    		} else if (name == "lendState") {
    			lendStateArr = value.split(",");
    		} else {
    			targetLbl.text(value);
    		}
    	});
    	$("#" + formId + " #detailLend").empty();
    	var lendHtml = '';
    	var lendState = '';
    	var lendNum = lendBathNoArr.length;
    	for (var i = 1; i <= lendNum; i++) {
    		if (lendStateArr[i-1] == '1') {
    			lendState = '已放款';
    		} else if (lendStateArr[i-1] == '2') {
    			lendState = '未放款';
    		} else {
    			lendState = '';
    		}
    		
    		lendHtml += '<div class="form-group">';
    		lendHtml += '	<label class="col-sm-4 control-label">放款批次号'+i+'</label>';
    		lendHtml += '	<label class="col-sm-6 control-label left">'+lendBathNoArr[i-1]+'</label>';
    		lendHtml += '</div>';
    		lendHtml += '<div class="form-group">';
    		lendHtml += '	<label class="col-sm-4 control-label">放款金额'+i+'</label>';
    		lendHtml += '	<label class="col-sm-6 control-label left">'+$.number(lendAmtArr[i-1], 2)+'</label>';
    		lendHtml += '</div>';
    		lendHtml += '<div class="form-group">';
    		lendHtml += '	<label class="col-sm-4 control-label">放款时间'+i+'</label>';
    		lendHtml += '	<label class="col-sm-6 control-label left">'+lendDateArr[i-1]+'</label>';
    		lendHtml += '</div>';
    		lendHtml += '<div class="form-group">';
    		lendHtml += '	<label class="col-sm-4 control-label">放款人'+i+'</label>';
    		lendHtml += '	<label class="col-sm-6 control-label left">'+lendPersonArr[i-1]+'</label>';
    		lendHtml += '</div>';
    		lendHtml += '<div class="form-group">';
    		lendHtml += '	<label class="col-sm-4 control-label">放款企业'+i+'</label>';
    		lendHtml += '	<label class="col-sm-6 control-label left">'+FlowMngCommon.getLendCorpNameDetail(lendCorpArr[i-1])+'</label>';
            lendHtml += '</div>';
            lendHtml += '<div class="form-group">';
            lendHtml += '	<label class="col-sm-4 control-label">放款状态'+i+'</label>';
            lendHtml += '	<label class="col-sm-6 control-label left">'+lendState+'</label>';
            lendHtml += '</div>';
    	}
    	$("#" + formId + " #detailLend").append(lendHtml);
    };
    
    /**
     * 申请事项change事件_详情展示用
     * @param applyItem
     *  	"1"->只表示展期
     *  	"2"->只表示费用减免
     *  	"3"->只表示转法务
     *  	"4"->只表示其他
     */
    FlowMngCommon.changeApplyItemLbl = function(applyItem) {
    	$("#spMatterLblForm")
    		.find("#applyItem1, #applyItem2, #applyItem3, #applyItem4")
			.each(function(index) {
				if (index + 1 === parseInt(applyItem)) {
					$(this).show();
				} else {
					$(this).hide();
					$(this).find("label").each(function() {
						if ($(this).attr("id")) {
							$(this).text("");
						}
					});
				}
			});
    };
    
    /**
     * 申请事项change事件_申请用
     * @param applyItem
     *  	"1"->只表示展期
     *  	"2"->只表示费用减免
     *  	"3"->只表示转法务
     *  	"4"->只表示其他
     */
    FlowMngCommon.changeApplyItem = function(applyItem) {
    	$("#spMatterForm")
    		.find("#applyItem1, #applyItem2, #applyItem3, #applyItem4")
    		.each(function(index) {
    			if (index + 1 === parseInt(applyItem)) {
    				$(this).show();
    			} else {
    				$(this).hide();
    				$(this).find("input").each(function() {
    					if ($(this).attr("type") == "radio") {
    						var name = $(this).attr("name");
    						$("#spMatterForm").find("[name="+name+"]").get(0).checked = true;
    					} else {
    						$(this).val("");
    					}
    				});
    				$(this).find("select").each(function() {
    					$(this).find("option:first").attr("selected", true);
    				});
    			}
    		});
    };
    
    /**
     * 附件url设定
     * @param targetLbl 附件表示label
     * @param value 附件地址
     */
    FlowMngCommon.setFileUrl = function(targetLbl, value) {
    	if (targetLbl.prop("tagName") == "INPUT") {
    		var a_file = targetLbl.next();
    		if (CloudUtils.isEmpty(value)) {
    			a_file.hide();
    		} else {
    			a_file.show();
    			a_file.attr("href", value);
    			var suffix = value.substring(value.lastIndexOf("."), value.length);
    			// 图片格式
    			if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(suffix)) {
    				a_file.attr("target", "_blank");
    			} else {
    				a_file.attr("target", "_self");
    			}
    		}
    	} else {
    		targetLbl.text(value);
    	}
    };
    
    /**
     * 附件上传
     * @param obj <i>元素对象
     */
    FlowMngCommon.fileSelect = function(obj) {
    	$(obj).next().click();
    };

    /**
     * 附件上传
     * @param obj <file>元素对象
     */
    FlowMngCommon.ajaxFileUpload = function(obj) {
    	var target = $(obj).parent().prev();
    	if ($(obj).val().length > 0) {
    		$.ajaxFileUpload({
    	        url : '../../file/binUpload?pathId=2',
    	        secureuri : false,
    	        fileElementId : $(obj).attr("id"),
    	        dataType : 'json',
    	        success : function(data, status) {
    	            if (data.result == 0) {
    	            	target.val(data.fileUrl);
    	            	target.focus();
    	            }else{
    	            	bootbox.alert("上传失败！");
    	            } 
    	        },
    	        error : function(data, status, e) {
    	        	bootbox.alert(e);
    	        }
    	    });
        } else {
        	bootbox.alert("请选择附件");
        }
    };
    
    /**
     * 检索条件日期控件初始化
     * @param createTime 检索条件日期项目
     */
    FlowMngCommon.dateload_createTime = function(createTime) {
    	// 检索
    	$('#' + createTime).daterangepicker(
            {
                //startDate: moment().startOf('day'),
                //endDate: moment(),
                //minDate: '01/01/2012',    //最小时间
                maxDate : moment(), //最大时间
                dateLimit : { days : 90 }, //起止时间的最大间隔
                showDropdowns : true,
                showWeekNumbers : false, //是否显示第几周
                timePicker : false, //是否显示小时和分钟
                //timePickerIncrement : 60, //时间的增量，单位为分钟
                //timePicker12Hour : false, //是否使用12小时制来显示时间
//    	            ranges : {
//    	                //'最近1小时': [moment().subtract('hours',1), moment()],
//    	                '今日': [moment().startOf('day'), moment()],
//    	                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
//    	                '最近7日': [moment().subtract('days', 6), moment()],
//    	                '最近30日': [moment().subtract('days', 29), moment()]
//    	            },
                opens : 'right', //日期选择框的弹出位置
                buttonClasses : [ 'btn btn-default' ],
//                applyClass : 'btn-small btn-primary blue',
//    	            cancelClass : 'btn-small',
                format : 'yyyy-MM-dd', //控件中from和to显示的日期格式
                separator : ' - ',
                locale : {
                    applyLabel : '确定',
    	            cancelLabel : '取消',
                    fromLabel : '起始时间',
                    toLabel : '结束时间',
                    //customRangeLabel : '自定义',
                    daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                    monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                                   '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                    firstDay : 1
                }
            },
            function(start, end, label) {//格式化日期显示框
            	$('#' + createTime).val(start.toString('yyyy-MM-dd') + ' - ' + end.toString('yyyy-MM-dd'));
            }
    	);
    };
    
    /**
     * 授信申请_事件绑定
     * @param formId
     */
    FlowMngCommon.bindCreditEvent = function(formId) {
    	// 厂房/经营场所
    	$("#" + formId + " #facAddrType").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 主要车间建造时间(适用制造业及自有)
    	$("#" + formId + " #mainWorkShopBuildTime").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 车间/仓库安全生产配置
    	$("#" + formId + " [name='workShopSafeConfig']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 存货存放
    	$("#" + formId + " #inventoryStorage").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 仓库是否有存放较久的原材料或产品
    	$("#" + formId + " [name='hasLongTimeStoredGoods']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 仓库进出库管理是出入库管理系统
    	$("#" + formId + " [name='hasOutStorageManagementSystem']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 公司货物运输方式及比率
    	$("#" + formId + " #deliverMethod").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 是否有任何机器闲置
    	$("#" + formId + " [name='hasAnyMachineIdle']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 企业是否有配套设施（如排污设施、净化设施等）
    	$("#" + formId + " [name='hasSupportingFacilities']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 企业主要能耗
    	$("#" + formId + " #mainEnergyConsumption").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 工人忙碌程度
    	$("#" + formId + " #isBusy").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 每天开工班次
    	$("#" + formId + " #orderOfClasses").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 生产情况（如日产量、开工程度、产品单价等）与报告中营业额的80%
    	$("#" + formId + " #productionStatus").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 公司是否有自有研发人员
    	$("#" + formId + " [name='hasOwnRD']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 是否有严格的质量保证体系
    	$("#" + formId + " [name='hasQAS']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 业务来源
    	$("#" + formId + " #busiSource").change(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 股东在过去或未来6个月是否有变动
    	$("#" + formId + " [name='hasShareHolderChangeInSixMonth']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 公司最近12个月是否涉及诉讼或被执行
    	$("#" + formId + " [name='hasLawsuitRecentYear']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 公司业务近期是否遇到了麻烦
    	$("#" + formId + " [name='hasTrouble']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 公司最近12个月内是否有拖欠员工工资或福利
    	$("#" + formId + " [name='hasArrearsOfWages']").click(function() {FlowMngCommon.disRemark(formId, $(this))});
    	// 公司是否涉及外销
    	$("#" + formId + " [name='hasExport']").click(function() {FlowMngCommon.hasExportChg(formId)});
    }

    /**
     * 授信申请_初始化事件触发
     * @param formId
     */
    FlowMngCommon.initCreditEvent = function(formId) {
    	// 厂房/经营场所
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #facAddrType"), "init");
    	// 主要车间建造时间(适用制造业及自有)
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #mainWorkShopBuildTime"), "init");
    	// 车间/仓库安全生产配置
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='workShopSafeConfig']:checked"), "init");
    	// 存货存放
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #inventoryStorage"), "init");
    	// 仓库是否有存放较久的原材料或产品
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasLongTimeStoredGoods']:checked"), "init");
    	// 仓库进出库管理是出入库管理系统
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasOutStorageManagementSystem']:checked"), "init");
    	// 公司货物运输方式及比率
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #deliverMethod"), "init");
    	// 是否有任何机器闲置
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasAnyMachineIdle']:checked"), "init");
    	// 企业是否有配套设施（如排污设施、净化设施等）
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasSupportingFacilities']:checked"), "init");
    	// 企业主要能耗
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #mainEnergyConsumption"), "init");
    	// 工人忙碌程度
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #isBusy"), "init");
    	// 每天开工班次
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #orderOfClasses"), "init");
    	// 生产情况（如日产量、开工程度、产品单价等）与报告中营业额的80%
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #productionStatus"), "init");
    	// 公司是否有自有研发人员
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasOwnRD']:checked"), "init");
    	// 是否有严格的质量保证体系
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasQAS']:checked"), "init");
    	// 业务来源
    	FlowMngCommon.disRemark(formId, $("#" + formId + " #busiSource"), "init");
    	// 股东在过去或未来6个月是否有变动
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasShareHolderChangeInSixMonth']:checked"), "init");
    	// 公司最近12个月是否涉及诉讼或被执行
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasLawsuitRecentYear']:checked"), "init");
    	// 公司业务近期是否遇到了麻烦
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasTrouble']:checked"), "init");
    	// 公司最近12个月内是否有拖欠员工工资或福利
    	FlowMngCommon.disRemark(formId, $("#" + formId + " [name='hasArrearsOfWages']:checked"), "init");
    }

    /**
     * 备注显示与否
     * @param formId
     * @param obj
     * @param type
     */
    FlowMngCommon.disRemark = function(formId, obj, type) {
    	var name = obj.attr("name");
    	var value;

    	// select
    	if (obj[0].tagName == "SELECT") {
    		value = obj.find("option:selected").text();
    		// radio
    	} else {
    		value = obj.val();
    	}

    	if (value == "其他" || value == "不适用" || value == "相匹配"
    		|| value == "不匹配" || value == "1") {
    		$("#" + formId).find("#" + name + "Div").show();
    		
    		// 初期表示不触发验证
    		if (type != 'init') {
    			// 重置备注验证
        		$("#" + formId)
        			.data("bootstrapValidator")
        			.updateStatus(name + "Other", "NOT_VALIDATED", null)
        			.validateField(name + "Other");
    		}
    	} else {
    		$("#" + formId).find("#" + name + "Div").hide();
    		$("#" + formId).find("#" + name + "Other").val("");
    		
    		// 初期表示的时候不触发验证
    		if (type != 'init') {
    			// 重置备注验证
        		$("#" + formId)
        			.data("bootstrapValidator")
        			.updateStatus(name + "Other", "NOT_VALIDATED", null);
    		}
    	}
    }
    
    /**
     * 公司是否涉及外销change事件
     * @param formId
     */
    FlowMngCommon.hasExportChg = function(formId) {
    	// 重置比率验证
    	$("#" + formId)
    		.data("bootstrapValidator")
    		.updateStatus('ratioOfExport', 'NOT_VALIDATED', null)
    		.validateField('ratioOfExport');
    }
    
    /**
     * 还款类型改变自动带出还款企业
     * @param obj
     * @param formId
     */
    FlowMngCommon.setRepaymentCorp = function(obj, formId) {
    	var repayCorp;
    	// 买方
    	if ($(obj).val() == "1") {
    		repayCorp = $("#" + formId).find("#relBuyName").val();
    		// 卖方
    	} else {
    		repayCorp = $("#" + formId).find("#relSaleName").val();
    	}
    	
    	// 特殊事项
    	if (formId == "spMatterForm") {
    		$("#spMatterForm #repayCorp").val(repayCorp);
    		
    		// 标准流程_合同申请
    	} else if (formId == "contractForm") {
    		$("#contractForm #repaymentCorp").val(repayCorp);
    		
    		// 融资直通车_合同申请
    	} else if (formId == "financeForm") {
    		$("#financeForm #repaymentCorp").val(repayCorp);
    	}
    }
    
    /**
     * 放款企业下拉框取得
     * @param formId
     * @param lendCorpId
     */
    FlowMngCommon.getLendCorpNameList = function(formId, lendCorpId) {
    	// 参数
    	var param = {
    			relaCorpId : store.get('corpId'),
    			isPage : 0  //是否分页，0：否，1：是，默认为0.
    	};
    	var options = {
    			url : '../../corp/list',
    			data : JSON.stringify(param),
    			callBackFun : function(data) {
    				if(data.result==0){
    					$.each(data.dataList, function(index, rec) {
    						$("#" + formId)
    						.find("#" + lendCorpId)
    						.append("<option value="+rec.corpId+">"+rec.corpName+"</option>");
    					});
    				}else{
    					bootbox.alert(data.resultNote);
    				}
    			},
    			errorCallback:function(data){
    				bootbox.alert("error");  
    			}
    	};
    	CloudUtils.ajax(options);
    }
    
    /**
     * 放款企业名称取得（详情用）
     * @param p_corpId
     */
    FlowMngCommon.getLendCorpNameDetail = function(p_corpId) {
    	var ret = "";
    	// 参数
    	var param = {
    			corpId : p_corpId,
    			relaCorpId : store.get('corpId'),
    			isPage : 0  //是否分页，0：否，1：是，默认为0.
    	};
    	var options = {
    			url : '../../corp/list',
    			data : JSON.stringify(param),
    			callBackFun : function(data) {
    				if(data.result==0){
    					if (data.dataList.length > 0) {
    						ret = data.dataList[0].corpName;
    					}
    				}else{
    					bootbox.alert(data.resultNote);
    				}
    			},
    			errorCallback:function(data){
    				bootbox.alert("error");  
    			}
    	};
    	CloudUtils.ajax(options);
    	
    	return ret;
    }
    
    /**
     * 计算手续费/管理费/利息 
     * 
     * 利息interest  F=P（1+r*n)   p是本金（融资金额） r是利率 n是年数/月数/天数
     * 管理费manageFee  F=P1（1+r1*n1)   p1是发票金额(应收账款) r1是管理费率 n1是年数/月数/天数
     * 
     * @param formId
     */
    FlowMngCommon.countFees = function(formId) {
    	var days = 0;
    	var repaymentPlan = $("#" + formId + " #repaymentPlan").val();
    	var times = $("#" + formId + " #repaymentTimes").val();
    	if(repaymentPlan=="1"){//年
    		var paramStr = times + ",360" ;
    		days =  CloudUtils.MathArray(paramStr,"mul");
    	}else if(repaymentPlan=="2"){//季
    		var paramStr = times + ",90";
    		days =  CloudUtils.MathArray(paramStr,"mul");
    	}else if(repaymentPlan=="3"){//月
    		var paramStr = times + ",30";
    		days =  CloudUtils.MathArray(paramStr,"mul");
    	}else if(repaymentPlan=="4"){//天
    		days = times;
    	}
    	//计算利率
    	var standardRateTmp = $("#" + formId + " #standardRate").val() ==""?0:$("#" + formId + " #standardRate").val();
    	var standardRateStr = standardRateTmp +",100";
    	var standardRate = CloudUtils.MathArray(standardRateStr,"div");//基准利率
    	var rateFloatPctTmp = $("#" + formId + " #rateFloatPct").val() ==""?0:$("#" + formId + " #rateFloatPct").val();
    	var rateFloatPctStr = rateFloatPctTmp +",100";
    	var rateFloatPct = CloudUtils.MathArray(rateFloatPctStr,"div");//上浮比例
    	
    	var step1str = "1,"+rateFloatPct;
    	var step2str = CloudUtils.MathArray(step1str,"add") +","+standardRate;
    	var rate = CloudUtils.MathArray(step2str,"mul");
    	$("#" + formId + " #interestRate").val(rate);
    	
    	//计算利息
    	var interestStrStep1 = rate + "," + days;
    	var interestResultStep1 = CloudUtils.MathArray(interestStrStep1,"mul");
    	var interestStrStep2 = interestResultStep1 + ",1";
    	var interestResultStep2 = CloudUtils.MathArray(interestStrStep2,"add");
    	var loanAmt = $("#" + formId + " #loanAmt").val();//融资金额
    	var interestStrStep3 = interestResultStep2 + "," +loanAmt;
    	
    	var interest = CloudUtils.MathArray(interestStrStep3,"mul");
    	$("#" + formId + " #interest").val(interest);
    	
    	//计算管理费
    	var manageFeeRateTmp = $("#" + formId + " #managementFeeRate").val() ==""?0:$("#" + formId + " #managementFeeRate").val();
    	var manageFeeRateStr = manageFeeRateTmp +",100";
    	var manageFeeRate = CloudUtils.MathArray(manageFeeRateStr,"div");//管理费率
    	
    	var manageFeeStrStep1 = manageFeeRate + "," + days;
    	var manageFeeResultStep1 = CloudUtils.MathArray(manageFeeStrStep1,"mul");
    	var manageFeeStrStep2 = manageFeeResultStep1 + ",1";
    	var manageFeeResultStep2 = CloudUtils.MathArray(manageFeeStrStep2,"add");
    	var arAmt = $("#" + formId + " #arAmt").val();//应收账款
    	var manageFeeResultStep3 = manageFeeResultStep2 + "," +arAmt;
    	
    	var manageFee = CloudUtils.MathArray(manageFeeResultStep3,"mul");
    	$("#" + formId + " #managementFee").val(manageFee);
    }
    
    
    /**
     * 合同申请_还款计划change事件
     * @param formId
     */
    FlowMngCommon.changeRepaymentPlan = function(formId) {
    	$("#" + formId)
    		.data("bootstrapValidator")
    		.updateStatus("repaymentTimes", "NOT_VALIDATED", null)
    		.validateField("repaymentTimes");
    }

    /**
     * 在线申请_公司名称
     */
    FlowMngCommon.ajaxSelCorps = function(){
    	var param = {
    			sysType : 5,  //类型有2保理商/3资方/4买方/5卖方
    			relaCorpId : store.get('corpId'),
    			isPage : 0  //是否分页，0：否，1：是，默认为0.
    	};
    	var options = {
    			url : '../../corp/list',
    			data :JSON.stringify(param),
    			callBackFun : function(data) {
    				if(data.result==0){
    					$("#selCorpId").html('');
    					$.each(data.dataList, function (index, units) {  
    						$("#selCorpId").append("<option value="+units.corpId+">" + units.corpName + "</option>");  
    					});
    					$("#onlineForm #corpNm").val($('#selCorpId  option:selected').text());
    				}else{
    					bootbox.alert(data.resultNote);
    				}
    			},
    			errorCallback:function(data){
    				bootbox.alert("error");  
    			}
    	};
    	CloudUtils.ajax(options);
    }
    
    
    FlowMngCommon.initDetTable = function (corpId){
    	initSupplierBaseTable(corpId);
    	initSplFinInfoTable(corpId);
    	initCreditLtgInfoTable(corpId);
    	initBusiInfoTable(corpId);
    	initAttachmentDetails(corpId);
    };
    
  //初始化供应商信息的表------------------------------------------------------------------------
    function initSupplierBaseTable(corpId){
    	initTableEnterprise(corpId);//初始化关联企业信息表  
    	initTableShareHolder(corpId);//初始化股东信息表
    	initTableCorpAccount(corpId);//初始化账户信息表 
    	
    	initLoanApprovalTable(corpId)//放款审批中的表格
    }

    function initTableEnterprise(corpId) { 
    	$('#tableEnterprise').bootstrapTable('destroy');  
    	$("#tableEnterprise").bootstrapTable({  
             method: "post", 
             url: "../../affiliatedEnterprise/list", 
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
                   isPage : 1,
                   corpId: corpId ? corpId : 0
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
    	 	        title: '关联企业Id',
    	 	        align: 'center',
    	            valign: 'middle',
    	            visible: false
    	 	}, {
     	        field: 'enterpriseName',
     	        title: '关联企业名称',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'corpName',
     	        title: '所属企业',
     	        align: 'center',
                valign: 'middle'
     	    },{
    	 		field: 'industry',
    	 		title: '所属行业',
    	 		align: 'center',
                valign: 'middle'
    	 	},{
     	        field: 'relationType',
     	        title: '关系类型',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
     	        	if(value==1){
     	        		return "子公司";
     	        	}else if(value==2){
     	        		return "母公司";
     	        	}else if(value==3){
     	        		return "兄弟公司";
     	        	}else{
     	        		return "其他";
     	        	}
     	        }
     	    }, {
     	        field: 'enterpriseCorporation',
     	        title: '企业法人',
     	        align: 'center',
                valign: 'middle'
     	    }]
           });  
    }

    function initTableShareHolder(corpId) {
    	$('#tableShareHolder').bootstrapTable('destroy');  
    	$("#tableShareHolder").bootstrapTable({  
             method: "post", 
             url: "../../shareHolder/list", 
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
                   corpId: corpId ? corpId : 0
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
     	        field: 'shareHolderId',
     	        title: 'Item ID',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    }, {
     	        field: 'corpId',
     	        title: '所属企业',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    },{
     	        field: 'shareName',
     	        title: '股东名称',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'shareType',
     	        title: '股东性质',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                  	if(value==1){
                  		return "个人";
                  	}else if(value==2){
                  		return "法人";
                  	}else{
                  		return "其他";
                  	}
                  } 
     	    }, {
     	        field: 'subscribedCapital',
     	        title: '认缴资本',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'paidInCapital',
     	        title: '实缴资本',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'shareProportion',
     	        title: '持股比例',
     	        align: 'center',
                valign: 'middle'
     	    },{
     	        field: 'note',
     	        title: '变动情况',
     	        align: 'center',
                valign: 'middle'
     	    },{
     	        field: 'corpName',
     	        title: '企业名称',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    }]
           });  
    }

    function initTableCorpAccount(corpId) { 
    	$('#tableCorpAccount').bootstrapTable('destroy');  
    	$("#tableCorpAccount").bootstrapTable({  
             method: "post", 
             url: "../../corpAccount/list", 
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
                   pageNumber: params.pageNumber,    
                   pageSize: params.pageSize,
                   corpId: corpId ? corpId : 0
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
     	        field: 'corpId',
     	        title: '付款企业',
     	        align: 'center',
                valign: 'middle',
                 visible: false
     	    },{
     	        field: 'accountType',
     	        title: '账号类型',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                  	if(value==1){
                  		return "买方";
                  	}else if(value==2){
                  		return "卖方";
                  	}else{
                  		return "其他";
                  	}
                  } 
     	    },{
     	        field: 'accountName',
     	        title: '户名',
     	        align: 'center',
                 valign: 'middle'
     	    },{
     	        field: 'currency',
     	        title: '币种',
     	        align: 'center',
                 valign: 'middle',
                     formatter:function(value,row,index){
                     	if(value=="人民币"){
                     		return "人民币";
                     	}else if(value=="美元"){
                     		return "美元";
                     	}
                     } 
     	    },{
     	        field: 'accountBank',
     	        title: '开户银行',
     	        align: 'center',
                 valign: 'middle'
     	    }, {
     	        field: 'bankLocation',
     	        title: '开户网点',
     	        align: 'center',
                valign: 'middle'
     	    }]
           });  
    }

    //初始化供应商财务信息表
    function initSplFinInfoTable(corpId) {
    	negativeInitTable(corpId);//资产负债表
    	profitInitTable(corpId);//利润表
    	cashflowInitTable(corpId);//现金流量表
    	bankRecInitTable(corpId);//银行对账单
    	taxReturnsInitTable(corpId);//纳税申请表
    }

    function negativeInitTable(corpId) {
    	$('#negativeList').bootstrapTable('destroy');
    	$('#negativeList').bootstrapTable({
    		method: "post",
            url: "../../negative/list",
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
    				corpId: corpId ? corpId : 0
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
    	        field: 'negId',
    	        title: 'Item ID',
    	        align: 'center',
    	        valign: 'middle',
    	        visible: false
    	    }, {
    	        field: 'corpName',
    	        title: '企业名称',
    	        align: 'center',
    	        valign: 'middle',
    	        visible: false
    	    }, {
    	        field: 'operYear',
    	        title: '年份',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalCurrentAssets',
    	        title: '流动资产合计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalNonCurrentAssets',
    	        title: '非流动资产合计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalAssets',
    	        title: '资产总计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalCurrentLiabilities',
    	        title: '流动负债合计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalNonCurrentLiabilities',
    	        title: '非流动负债合计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalLiabilities',
    	        title: '负债合计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalOwnersEquity',
    	        title: '所有者权益（或股东权益）合计',
    	        align: 'center',
    	        valign: 'middle'
    	    }, {
    	        field: 'totalLiabilitiesAndOwnersEquity',
    	        title: '负债和所有者权益（或股东权益）总计',
    	        align: 'center',
    	        valign: 'middle'
    	    }]
    	});
    }

    function profitInitTable(corpId) {
    	$('#profitList').bootstrapTable('destroy');
    	$("#profitList").bootstrapTable({
    		method: "post",
            url: "../../profit/list",
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
    				corpId: corpId ? corpId : 0
    			};
    			return JSON.stringify(param);
    		},
            responseHandler:function responseHandler(res) {
    	    	if (res.result == 0) {
//    	    		var size = res.records;
//    	    		canExp = size <= 50000;//限制5w条不允许导出
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
     	        field: 'corpName',
     	        title: '企业名称',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    }, {
     	        field: 'operYear',
     	        title: '时间(年)',
     	        align: 'center',
                valign: 'middle',
     	    }, {
     	        field: 'grossProfitRate',
     	        title: '毛利率(%)',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'expenseRate',
     	        title: '费用率(%)',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'totalProfit',
     	        title: '利润总额',
     	        align: 'center',
     	        valign: 'middle'
     	    }, {
     	        field: 'netProfit',
     	        title: '净利润',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'netProfitGrowthRate',
     	        title: '净利润增长率(%)',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'mainCostRate',
     	        title: '主营业务成本率(%)',
     	        align: 'center',
                valign: 'middle'
     	    }]
    	});
    }
    function cashflowInitTable(corpId) {
    	$('#cashflowList').bootstrapTable('destroy');
    	$("#cashflowList").bootstrapTable({
    		method : "post",
    		url : "../../cashflow/list",
    		striped : false, // 表格显示条纹
    		pagination : true, // 启动分页
    		pageSize : 5, // 每页显示的记录数
    		pageNumber : 1, // 当前第几页
    		pageList : [ 5, 10, 15, 20, 25 ], // 记录数可选列表
    		search : false, // 是否启用查询
    		showColumns : false, // 显示下拉框勾选要显示的列
    		showRefresh : false, // 显示刷新按钮
    		sidePagination : "server", // 表示服务端请求
    		// 设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
    		// 设置为limit可以获取limit, offset, search, sort, order
    		queryParamsType : "undefined",
    		queryParams : function queryParams(params) { // 设置查询参数
    			var param = {
    				pageNumber : params.pageNumber,
    				pageSize : params.pageSize,
    				corpId : corpId ? corpId : 0
    			};
    			return JSON.stringify(param);
    		},
    		responseHandler : function responseHandler(res) {
    			if (res.result == 0) {
//    				 var size = res.records;
//    				 canExp = size <= 50000;//限制5w条不允许导出
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
    		columns : [{
    			field : 'recUid',
    			title : 'Item ID',
    			align : 'center',
    			valign : 'middle',
    			visible : false
    		}, {
    			field : 'corpName',
    			title : '企业名称',
    			align : 'center',
    			valign : 'middle',
    			visible : false
    		}, {
    			field : 'operYear',
    			title : '时间(年)',
    			align : 'center',
    			valign : 'middle'
    		}, {
    			field : 'netAmountOfCashFlow',
    			title : '经营活动产生的现金流量净额',
    			align : 'center',
    			valign : 'middle'
    		}, {
    			field : 'investmentAmountOfCashFlow',
    			title : '投资活动产生的现金流量净额',
    			align : 'center',
    			valign : 'middle'
    		}, {
    			field : 'financingAmountOfCashFlow',
    			title : '筹资活动产生的现金流量净额',
    			align : 'center',
    			valign : 'middle'
    		}, {
    			field : 'increaseCashEquivalent',
    			title : '现金及现金等价物净增加额',
    			align : 'center',
    			valign : 'middle'
    		}, {
    			field : 'cashAndCashEquivalents',
    			title : '现金及现金等价物净增加额(补充)',
    			align : 'center',
    			valign : 'middle',
    			visible : false
    		}, {
    			field: 'otherAmountOfCashFlow', 
    			title: '其他经营活动产生的现金流量净额', 
    			align : 'center',
    			valign : 'middle'
    		}]
    	});
    }

    function bankRecInitTable(corpId) { 
    	$('#bankRecList').bootstrapTable('destroy');  
    	$('#bankRecList').bootstrapTable({  
             method: "post", 
             url: "../../bankRec/list", 
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
                   corpId: corpId ? corpId : 0
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
     	        field: 'recId',
     	        title: 'Item ID',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    },{
     	    	field: 'corpId',
    	        title: 'Item ID',
    	        align: 'center',
    	        valign: 'middle',
    	        visible: false
    	       },{
     	        field: 'accountBank',
     	        title: '开户行',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'accountName',
     	        title: '户名',
     	        align: 'center',
                valign: 'middle',
     	    }, {
     	        field: 'account',
     	        title: '账号',
     	        align: 'center',
                valign: 'middle'
     	    },{
     	    	field:'currency',
     	    	title:'币种',
     	    	align:'center',
     	    	valign:'middle',
     	    	formatter:function(value,row,index) {
    				if (value == "人民币") {
    					return "人民币";
    				} else if (value == "美元") {
    					return "美元";
    				}
     	    	}
     	    }, {
     	        field: 'startDate',
     	        title: '起始日',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
            		if(row.startDate!=null&&row.startDate!=''){
            			return CloudUtils.dateFormat(row.startDate, 'yyyy-MM-dd')
            		}
     	        }
     	    }, {
     	        field: 'endDate',
     	        title: '到期日',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
            		if(row.endDate!=null&&row.endDate!=''){
            			return CloudUtils.dateFormat(row.endDate, 'yyyy-MM-dd')
            		}
     	        }
     	    }, {
     	        field: 'debitAmount',
     	        title: '借方发生金额(汇总)',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'creditAmount',
     	        title: '贷方发生金额(汇总)',
     	        align: 'center',
                valign: 'middle'
     	    },{
     	    	field: 'accountAmount',
     	        title: '金额(汇总)',
     	        align: 'center',
                valign: 'middle'
     	    }]
           }); 
    }

    function taxReturnsInitTable(corpId) { 
    	$('#taxReturnsList').bootstrapTable('destroy');
    	$("#taxReturnsList").bootstrapTable({  
             method: "post", 
             url: "../../taxReturns/list", 
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
                   corpId: corpId ? corpId : 0
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
     	        field: 'vatId',
     	        title: '主键',
     	        align: 'center',
     	        valign: 'middle',
     	        visible:false
     	    },{
     	        field: 'corpId',
     	        title: '企业所属id',
     	        align: 'center',
     	        valign: 'middle',
     	        visible:false
     	    },{
     	        field: 'operYear',
     	        title: '年度',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'purchasesTax',
     	        title: '进项税额',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'salesTax',
     	        title: '销项税额',
     	        align: 'center',
     	        valign: 'middle'
     	    }]
           });  
    	
    }

    //初始化信用及诉讼信息表------------------------------------------------------------
    function initCreditLtgInfoTable(corpId){
    	corpInitTable(corpId);//企业征信
    	shareInitTable(corpId);//个人征信
    	orgnInitTable(corpId);//机构借款统计表
    	guaranteeInitTable(corpId);//对外担保明细
    	litigantInitTable(corpId);//诉讼情况表
    }

    function corpInitTable(corpId) { 
    	$('#corpListTable').bootstrapTable('destroy');
    	$("#corpListTable").bootstrapTable({
    		method : "post",
    		url : "../../creditReport/list",
    		striped : true, // 表格显示条纹
    		pagination : true, // 启动分页
    		pageSize : 5, // 每页显示的记录数
    		pageNumber : 1, // 当前第几页
    		pageList : [ 5, 10, 15, 20, 25 ], // 记录数可选列表
    		search : false, // 是否启用查询
    		showColumns : false, // 显示下拉框勾选要显示的列
    		showRefresh : false, // 显示刷新按钮
    		sidePagination : "server", // 表示服务端请求
    		// 设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
    		// 设置为limit可以获取limit, offset, search, sort, order
    		queryParamsType : "undefined",
    		queryParams : function queryParams(params) { // 设置查询参数
    			var param = {
    				pageNumber : params.pageNumber,
    				pageSize : params.pageSize,
    				creditType : 0,
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
    					field : 'creditId',
    					title : 'Item ID',
    					align : 'center',
    					valign : 'middle',
    					visible : false
    				},
    				{
    					field : 'corpName',
    					title : '企业名称',
    					align : 'center',
    					valign : 'middle',
    					formatter : function(value, row, index) {
    						if (row.enterpriseName != null
    								&& row.enterpriseName != '') {
    							return row.enterpriseName
    						} else {
    							return row.corpName
    						}
    					}
    				},
    				{
    					field : 'inquiryTime',
    					title : '查询时间',
    					align : 'center',
    					valign : 'middle',
    					formatter : function(value, row, index) {
    						if (row.inquiryTime != null
    								&& row.inquiryTime != '') {
    							return CloudUtils.dateFormat(row.inquiryTime, 'yyyy-MM-dd')
    						}
    					}
    				}
    			]
    	});  
    }

    function shareInitTable(corpId) { 
    	$('#shareListTable').bootstrapTable('destroy');  
    	$("#shareListTable").bootstrapTable({  
    		method : "post",
    		url : "../../creditReport/list",
    		striped : true, // 表格显示条纹
    		pagination : true, // 启动分页
    		pageSize : 5, // 每页显示的记录数
    		pageNumber : 1, // 当前第几页
    		pageList : [ 5, 10, 15, 20, 25 ], // 记录数可选列表
    		search : false, // 是否启用查询
    		showColumns : false, // 显示下拉框勾选要显示的列
    		showRefresh : false, // 显示刷新按钮
    		sidePagination : "server", // 表示服务端请求
    		// 设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
    		// 设置为limit可以获取limit, offset, search, sort, order
    		queryParamsType : "undefined",
    		queryParams : function queryParams(params) { // 设置查询参数
    			var param = {
    				pageNumber : params.pageNumber,
    				pageSize : params.pageSize,
    				creditType : 1,
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
    					field : 'creditId',
    					title : 'Item ID',
    					align : 'center',
    					valign : 'middle',
    					visible : false
    				},
    				{
    					field : 'shareName',
    					title : '查询人名称',
    					align : 'center',
    					valign : 'middle'
    				},
    				{
    					field : 'inquiryTime',
    					title : '查询时间',
    					align : 'center',
    					valign : 'middle',
    					formatter : function(value, row, index) {
    						if (row.inquiryTime != null
    								&& row.inquiryTime != '') {
    							return CloudUtils.dateFormat(row.inquiryTime,
    									'yyyy-MM-dd')
    						}
    					}
    				},
    				{
    					field : 'operation',
    					title : '操作',
    					align : 'center',
    					valign : 'middle',
    					formatter : function(value, row, index) {
    						var s = '<a class = "fa fa-edit modify" style="color:#d864fd;padding:0px 5px;" data-type="share" title="编辑" href="javascript:void(0)"></a>';
    						var r = '<a class = "fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" data-type="share" title="删除" href="javascript:void(0)"></a>';
    						return s + ' ' + r;
    					},
    					events : 'operateCreditEvents'
    				}
    			]
    	});  
    }

    function orgnInitTable(corpId) { 
    	$('#orgnListTable').bootstrapTable('destroy');
    	$("#orgnListTable").bootstrapTable({  
             method: "post", 
             url: "../../orgnLoanCount/list", 
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
                   corpId: corpId ? corpId : 0
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
     	        title: '主键',
     	        align: 'center',
     	        valign: 'middle',
     	        visible:false
     	    },{
     	        field: 'corpId',
     	        title: '企业所属id',
     	        align: 'center',
     	        valign: 'middle',
     	        visible:false
     	    },{
     	        field: 'loanDate',
     	        title: '贷款时间',
     	        align: 'center',
     	        valign: 'middle',
     	       formatter:function(value,row,index){
           		if(row.loanDate!=null&&row.loanDate!=''){
           			return CloudUtils.dateFormat(row.loanDate, 'yyyy-MM-dd')
           		}
    	        }
     	    },{
     	        field: 'dueDate',
     	        title: '到期日',
     	        align: 'center',
     	        valign: 'middle',
     	        formatter:function(value,row,index){
           		if(row.dueDate!=null&&row.dueDate!=''){
           			return CloudUtils.dateFormat(row.dueDate, 'yyyy-MM-dd')
           		}
    	        }
     	    },{
     	        field: 'loanBank',
     	        title: '借款银行',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'assureCompany',
     	        title: '担保公司',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'cautionMoney',
     	        title: '保证金(担保公司)',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'loanMoney',
     	        title: '金额(元)',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'profitRate',
     	        title: '利率(%)',
     	        align: 'center',
     	        valign: 'middle'
     	    },{
     	        field: 'pawn',
     	        title: '抵押物',
     	        align: 'center',
     	        valign: 'middle'
     	    }]
           });  
    }

    function guaranteeInitTable(corpId) { 
    	$('#guaranteeListTable').bootstrapTable('destroy');  
    	$("#guaranteeListTable").bootstrapTable({  
             method: "post", 
             url: "../../externalGuarantee/list", 
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
                   pageNumber: params.pageNumber,    
                   pageSize: params.pageSize,
                   corpId: corpId ? corpId : 0
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
     	    } , {
     	        field: 'corpId',
     	        title: '企业ID',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    }, {
     	        field: 'guarantorName',
     	        title: '被担保方名称',
     	        align: 'center',
                valign: 'middle'
     	    },  {
     	        field: 'guaranteeMoney',
     	        title: '担保金额',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
     	 	    	return $.number(value,2);
     		        }
     	    }, {
     	        field: 'guaranteeType',
     	        title: '担保类型',
     	        align: 'center',
                valign: 'middle',
                formatter:function(value,row,index){
                   	if(value==0){
                   		return "保证";
                   	}else if(value==1){
                   		return "抵押";
                   	}else if(value==2){
                   		return "质押";
                   	}else if(value==3){
                   		return "留置";
                   	}else{
                   		return "定金";
                   	}
                }
     	    }]
           });  
    }

    function litigantInitTable(corpId) { 
    	$('#litigantListTable').bootstrapTable('destroy');
    	$("#litigantListTable").bootstrapTable({  
             method: "post", 
             url: "../../litigantSituation/list", 
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
                   corpId: corpId ? corpId : 0
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
     	    },{
     	        field: 'corpId',
     	        title: '企业ID',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    },{
     	    	field: 'litigantName',
     	        title: '诉讼方名称',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	    	field: 'litigantMoney',
     	        title: '诉讼金额',
     	        align: 'center',
     	       formatter:function(value,row,index){
    	 	    	return $.number(value,2);
    		        },
                valign: 'middle'
     	    },{
     	        field: 'querySource',
     	        title: '查询来源',
     	        align: 'center',
                valign: 'middle'
     	    }]
           });  
    }

    //初始化业务信息中的表--------------------------------------------------------
    function initBusiInfoTable(corpId){
    	initTableBid(corpId);//初始化招/投标合同表
    	initTableSale(corpId);//初始化贸易/销售合同表
    }

    function initTableBid(corpId) { 
    	$('#userListBidTablel').bootstrapTable('destroy');
    	$("#userListBidTablel").bootstrapTable({  
             method: "post", 
             url: "../../corpContract/list", 
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
                   contractType: 1,
                   corpId: corpId ? corpId : 0
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
     	        field: 'corpId',
     	        title: 'corpId',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    }, {
     	        field: 'projectName',
     	        title: '项目名称',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'amount',
     	        title: '项目金额',
     	        align: 'center',
                valign: 'middle'
     	    }]
           });  
    }

    function initTableSale(corpId) { 
    	$('#userListSaleTablel').bootstrapTable('destroy');
    	$("#userListSaleTablel").bootstrapTable({  
             method: "post", 
             url: "../../corpContract/list", 
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
                   contractType: 2,
                   corpId: corpId ? corpId : 0
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
     	        field: 'corpId',
     	        title: 'corpId',
     	        align: 'center',
                valign: 'middle',
                visible: false
     	    }, {
     	        field: 'projectUser',
     	        title: '交易对手名称',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'startDate',
     	        title: '合同起始日',
     	        align: 'center',
                valign: 'middle'
     	    }, {
     	        field: 'endDate',
     	        title: '合同到期日',
     	        align: 'center',
                valign: 'middle'
     	    }]
           });  
    }

    //放款审批中的表格------------------------------------------------------------------------
    function initLoanApprovalTable(corpId){
    	initReceiveAccountTable(corpId);
    }
    function initReceiveAccountTable(corpId){
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
    			valign: 'middle'
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
    //附件信息的----------------------------------------------------------------------
    function initAttachmentDetails(corpId){
    	initAttachment('base',corpId);
    	initAttachment('finance',corpId);
    	initAttachment('credit',corpId);
    	initAttachment('contract',corpId);
    }

    var moduleType;
    let initAttachment = function(type,corpId) {
    	$('#' + type + 'Attachment').bootstrapTable('destroy');
    	$('#' + type + 'Attachment').bootstrapTable({
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
    			switch(type) {
    				case 'base': moduleType = 1;break;
    				case 'finance': moduleType = 2;break;
    				case 'credit': moduleType = 3;break;
    				case 'contract': moduleType = 4;break;
    			}
    			var param = {
    				pageNumber : params.pageNumber,
    				pageSize : params.pageSize,
    				moduleType : moduleType,
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
    			}
    		]
    	});
    }
    
    /**
     * 供应商基本信息的加载
     */
    FlowMngCommon.setSupplierBaseInfo = function(corpId){
    	var data = {};
    	data.sysType = 5;
    	data.corpId = corpId;
    	data = JSON.stringify(data);
    	var options = {
    			url : '../../corp/list',
    			data : data,
    			callBackFun : function(data) {
    				if(data.result==0){
    					 CloudUtils.setForm(data.dataList[0],"splinfoForm");
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
})(jQuery);