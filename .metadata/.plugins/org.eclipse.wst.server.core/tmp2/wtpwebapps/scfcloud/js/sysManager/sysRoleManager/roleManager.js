$(document).ready(function() {
	"use strict";
	CloudUtils.ajax(CloudUtils.options);
	CloudUtils.inputCacheClear();
	searchMoreIsHidden();
	
	//option下拉选
	ajaxOption("r_roleType", "roleType");
	
	$("#r_roleType").selectOrDie('destroy');
	$("#r_roleType").selectOrDie({
		placeholder:"角色类型"
	});
	
	
	//初始化table
	initTable();
	
	//初始化验证
	formValidator();
	
	//modal绑定事件
	$('#addModal').on('hidden.bs.modal', function(){
		$("#addForm").bootstrapValidator('resetForm', true);
	});
} );

//重置按钮事件
function ResetBtn(){
	$("#r_roleName").val('');
	
	$("#r_roleType").selectOrDie('destroy');
	$("#r_roleType").val('1');
	$("#r_roleType").selectOrDie({
		placeholder:"角色类型"
	});
}

//修改和删除操作
window.operateEvents = {
	'click .mod': function (e, value, row, index) {
		modFun(row);
	},
	'click .remove': function (e, value, row, index) {
		bootbox.confirm("确定删除此条记录?", function(result) {  
		    if (result) {  
				var options = {
					url : '../../role/delete',
					data : '{"roleId":"'+row.roleId+'"}',
					callBackFun: function(data) {
						if (data.result == 0) {
							selectRole();
	    				} else {
	    					bootbox.alert(data.resultNote);
	    					return false;
	    				}
					},
					errorCallback: function(data) {
						bootbox.alert("error");
					}
				};
				CloudUtils.ajax(options);
			}
	    });
	}
};

//表格创建
function initTable() {
	$('#roleListTable').bootstrapTable('destroy');
	$('#roleListTable').bootstrapTable({
		method: "post",
		url: "../../role/list",
		striped: false,						//是否显示行间隔色
        cache: false,						//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true,
		sidePagination: "server",			//分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,						//初始化加载第一页，默认第一页
        pageSize: 5,						//每页的记录行数（*）
        pageList: [5,10,15,20,25],			//可供选择的每页的行数（*）
        search: false,						//是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: false,					//是否显示所有的列
        showRefresh: false,					//是否显示刷新按钮
//       minimumCountColumns: 2,			//最少允许的列数
        clickToSelect: false,				//是否启用点击选中行
        showColumns: false,					//是否显示所有的列
        showRefresh: false,					//是否显示刷新按钮
        sortable: false,					//是否启用排序
        sortOrder: "asc",					//排序方式
        showToggle:false,					//是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        queryParamsType : "undefined",   
        queryParams: function queryParams(params) {   //设置查询参数  
           var data = CloudUtils.convertStringJson('roleForm');
           debugger
           var corpId = store.get("corpId");
           var jsonData = eval("(" + data + ")");
           var ispage = {isPage:1};
           var paramTemp = {    
               pageNumber: params.pageNumber,    
               pageSize: params.pageSize,
               roleName: jsonData.r_roleName,
               roleType: jsonData.r_roleType,
               corpId:corpId
           };    
           var param = $.extend({},ispage,paramTemp);
           return JSON.stringify(param);
        },  
        responseHandler: function responseHandler(res) {
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
	        field: 'roleId',
	        title: '角色Id',
	        align: 'center',
	        valign: 'middle',
	        visible:false
	    } , {
	        field: 'roleName',
	        title: '角色名称',
	        align: 'center',
	        valign: 'middle'
	    },{
	        field: 'roleTypeName',
	        title: '角色类型',
	        align: 'center',
	        valign: 'middle'
	    },{
	        field: 'corpName',
	        title: '企业名称',
	        align: 'center',
	        valign: 'middle'
	    },{
	        field: 'roleType',
	        title: '角色类型',
	        align: 'center',
		    valign: 'middle',
		    visible:false
	    }
	    ,{
	        field: 'note',
	        title: '备注',
	        align: 'center',
	        valign: 'middle'
	    }, {
	        field: 'operation',
	        title: '操作',
	        align: 'center',
		    valign: 'middle',
	        formatter:function(value,row,index){
	        	 var s = '<a class = "fa fa-edit mod" style="color:#d864fd;padding:0px 5px;" title="编辑" href="javascript:void(0)"></a>';
	 	         var d = '<a class = "fa fa-trash-o remove" style="color:#fa8564;padding:0px 5px;" title="删除" href="javascript:void(0)"></a>';
	            return s+' '+d;
	        },
	        events: 'operateEvents'
	    }]
	});
}

//下拉框
function ajaxOption(Id1,Id2){
	var options = {
		url : "../../role/roleTypeList",
		data : JSON.stringify({}),
		callBackFun : function(data) {
			var control1 = $('#' + Id1);
			var control2 = $('#' + Id2);
			if(data.result==0){
				$.each(data.dataList, function(i, n) {
					control1.append('<option value="' + n.roleType + '">' + n.roleTypeName + '</option>');
					control2.append('<option value="' + n.roleType + '">' + n.roleTypeName + '</option>');
				});
			}else{
				bootbox.alert(data.resultNote);
				return false;
			}
			control1.selectOrDie();
		   //control2.selectOrDie();
		},
		errorCallback:function(data){
			bootbox.alert("error");
		}
	};
	CloudUtils.ajax(options);
}

//点击查询按钮生成表格
function selectRole(){
	initTable();
}

function addRole(){
	//生成动态菜单树
	$("#addForm [name='roleType']").attr("disabled", false);
	//var data = '{"roleId":"","isRelation":"1"}';
	ajaxMenu();
	$("#addModalLabel").text("添加");
	$('#addModal').modal({backdrop: 'static', keyboard: false});//防止点击空白/ESC 关闭
	$('#isEdit').val(1); //新增1；修改2
}

// 保存新增角色
function saveRole(){
	var tt =  $('#treeview12').treeview('getChecked', 0);
	for(var i=0;i<tt.length;i++){
		jsonlistadd.push(tt[i].menuId);
	}
	var data = CloudUtils.convertStringJson('addForm');
	//getMenuName();
	ajaxMenu();
	data = eval("(" + data + ")");
	data.corpId = store.get("corpId");
	data.menuIdList = jsonlistadd;

	if(jsonlistadd.length == 0){
		bootbox.alert("菜单不能为空！");
		return false;
	}
	//$("#addForm").data("bootstrapValidator").isValid();
	var isEdit =  $('#isEdit').val();
	$('#addModal').modal("hide");
	if(isEdit == 1){//新增1；修改2
	var options = {
		url : "../../role/add",
		data : JSON.stringify(data),
		callBackFun : function(data) {
			bootbox.alert(data.resultNote);
			if(data.result==0){
				selectRole();
				jsonlistadd = [];
			}else{
				return false;
			}
		},
		errorCallback:function(data){
			bootbox.alert("error");
			}
		};
		CloudUtils.ajax(options);
	}else{
		var options = {
			url : "../../role/mod",
			data : JSON.stringify(data),
			callBackFun : function(data) {
				bootbox.alert(data.resultNote);
				if(data.result==0){
					selectRole();
					jsonlistadd = [];
				}else{
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

// 修改角色
function modFun(row){
	
	var data = '{"roleId":"'+row.roleId+'","isRelation":"1"}';
	var menuList = null;
	var options = {
		url : "../../menu/tree",
		data : '{"roleId":"","isRelation":"0"}',
		callBackFun : function(data) {
			if(data.result==0){
				menuList = JSON.stringify(data.dataList);
			}else{
				bootbox.alert(data.resultNote);
				return false;
			}
		},
		errorCallback : function(data) {
			bootbox.alert("error");
		}
	};
	CloudUtils.ajax(options);
	ajaxMenu();
	var options = {
		url : "../../menu/tree",
		data : data,
		callBackFun : function(data) {
			if(data.result==0){
				CloudUtils.checkByJson("treeview12",menuList,data);
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
	$('#isEdit').val(2); //新增1；修改2
	$("#roleType").attr("disabled", true);
	CloudUtils.setForm(row,'addForm');
	$("#addModalLabel").text("修改");
	$('#addModal').modal();
}

//生成动态菜单树
var jsonlistadd=new Array();
function ajaxMenu(){
	var options = {
		url : "../../menu/tree",
		data : '{"roleId":"","isRelation":"0"}',
		callBackFun : function(data) {
			var jsonStringData = JSON.stringify(data.dataList);
			jsonStringData=jsonStringData.replace(/menuName/g,'text');
			jsonStringData=jsonStringData.replace(new RegExp("subMenuList","gm"),"nodes");
			var jsonData=eval('('+ jsonStringData +')');
			$('#treeview12').treeview({
				data:jsonData,
				showCheckbox:true,
				highlightSelected: false,
				multiSelect:true,
				levels:0,
				onNodeSelected: function(event, data) {
					$('#treeview12').treeview('checkNode', [ data.nodeId, { silent: true } ]);
					if(data.menuLevel ==1){
						$.each(data.nodes, function(i, o) {
					 		$('#treeview12').treeview('checkNode', [ o.nodeId, { silent: true } ]);
					 		$.each(o.nodes, function(h, u) {
						 		$('#treeview12').treeview('checkNode', [ u.nodeId, { silent: true } ]);
					 		 });
				 		 });
					}else if(data.menuLevel ==2){
						var obj= $('#treeview12').treeview('getParent', data.nodeId);
						$('#treeview12').treeview('checkNode', [ obj.nodeId, { silent: true } ]);
						$.each(data.nodes, function(i, o) {
					 		$('#treeview12').treeview('checkNode', [ o.nodeId, { silent: true } ]);
				 		 });
					}else{
						var obj= $('#treeview12').treeview('getParent', data.nodeId);
						$('#treeview12').treeview('checkNode', [ obj.nodeId, { silent: true } ]);
						var objparent = $('#treeview12').treeview('getParent', obj.nodeId);
						$('#treeview12').treeview('checkNode', [ objparent.nodeId, { silent: true } ]);
					}
				},
				onNodeChecked: function(event, data){
					if(data.menuLevel ==1){
						$.each(data.nodes, function(i, o) {
					 		$('#treeview12').treeview('checkNode', [ o.nodeId, { silent: true } ]);
					 		$.each(o.nodes, function(h, u) {
					 			$('#treeview12').treeview('checkNode', [ u.nodeId, { silent: true } ]);
					 		});
					 	});
					}else if(data.menuLevel ==2){
						var obj= $('#treeview12').treeview('getParent', data.nodeId);
						$('#treeview12').treeview('checkNode', [ obj.nodeId, { silent: true } ]);
						$.each(data.nodes, function(i, o) {
					 		$('#treeview12').treeview('checkNode', [ o.nodeId, { silent: true } ]);
						});
					}else{
						var obj= $('#treeview12').treeview('getParent', data.nodeId);
						$('#treeview12').treeview('checkNode', [ obj.nodeId, { silent: true } ]);
						var objparent = $('#treeview12').treeview('getParent', obj.nodeId);
						$('#treeview12').treeview('checkNode', [ objparent.nodeId, { silent: true } ]);
					}
				//$('#treeview12').treeview('checkNode', [ data.nodeId, { silent: true } ]);	
				},
				onNodeUnselected: function(event, data) {
					$('#treeview12').treeview('uncheckNode', [ data.nodeId, { silent: true } ]);
					if(data.menuLevel == 1){
						$.each(data.nodes, function(i, o) {
				 			$('#treeview12').treeview('uncheckNode', [ o.nodeId, { silent: true } ]);
				 			$.each(o.nodes, function(h, u) {
				 				$('#treeview12').treeview('uncheckNode', [ u.nodeId, { silent: true } ]);
				 			});
						});
					}else if(data.menuLevel == 2){
						$.each(data.nodes, function(i, o) {
				 			$('#treeview12').treeview('uncheckNode', [ o.nodeId, { silent: true } ]);
						});
						var parent = $('#treeview12').treeview('getParent', data.nodeId);
						var obj= $('#treeview12').treeview('getSiblings', data.nodeId);
						allChildUncheck(obj,parent.nodeId);
					}else if(data.menuLevel == 3){
						var parent = $('#treeview12').treeview('getParent', data.nodeId);//父
						var obj= $('#treeview12').treeview('getSiblings', data.nodeId);//兄弟
						allChildUncheck(obj,parent.nodeId);
						//先判断点击的父级有没有被取消，在判断父父级
						if(parent.state.checked == false){
							var Pobj= $('#treeview12').treeview('getSiblings', parent.nodeId);//父的兄弟
				 			var Pparent = $('#treeview12').treeview('getParent', parent.nodeId);//父父
				 			allChildUncheck(Pobj,Pparent.nodeId);
						}
					}
				},
				onNodeUnchecked: function(event ,data) {
					if (data.menuLevel == 1) {
						$.each(data.nodes, function(i, o) {
							$('#treeview12').treeview('uncheckNode', [ o.nodeId, { silent: true } ]);
							$.each(o.nodes, function(h, u) {
								$('#treeview12').treeview('uncheckNode', [ u.nodeId, { silent: true } ]);
							});
						});
					}else if(data.menuLevel == 2){
						$.each(data.nodes, function(i, o) {
							$('#treeview12').treeview('uncheckNode', [ o.nodeId, { silent: true } ]);
						});
						var parent = $('#treeview12').treeview('getParent', data.nodeId);
						var obj= $('#treeview12').treeview('getSiblings', data.nodeId);
						allChildUncheck(obj,parent.nodeId);
					}else if(data.menuLevel == 3){
						var parent = $('#treeview12').treeview('getParent', data.nodeId);//父
						var obj= $('#treeview12').treeview('getSiblings', data.nodeId);//兄弟
						allChildUncheck(obj,parent.nodeId);
						//先判断点击的父级有没有被取消，在判断父父级
						if(parent.state.checked == false){
							var Pobj= $('#treeview12').treeview('getSiblings', parent.nodeId);//父的兄弟
							var Pparent = $('#treeview12').treeview('getParent', parent.nodeId);//父父
					 			allChildUncheck(Pobj,Pparent.nodeId);
						}
					}
				 }
			});
		},
		errorCallback : function(data) {
			bootbox.alert("error");
		}
	};
	CloudUtils.ajax(options);
}

// 查看子节点是否全部没选择
function allChildUncheck(obj, parentId){
	if (obj.length == 0) {
		$('#treeview12').treeview('uncheckNode', [ parentId, { silent: true } ]);
	} else {
		var filtered = obj.filter(isChecked);
		if(filtered.length == 0){
			$('#treeview12').treeview('uncheckNode', [ parentId, { silent: true } ]);
		}
	}
}

/**
 * 过滤器
 * jihang
 */
function isChecked(element,index,array){
	if(element.state.checked == true){
		return element;
	}
}


//form验证规则
function formValidator(){
	$('#addForm').bootstrapValidator({
		message: 'This value is not valid',
		excluded: ':disabled',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			roleName: {
				validators: {
					notEmpty: {
						message: '角色名不能为空'
					},
					regexp: {
	                      regexp: /^[A-Za-z\u4e00-\u9fa5]+$/,
	                      message: '角色名只能输英文和中文'
	                },
					stringLength: {
						min: 3,
						max: 30,
						message: '角色名长度为3-30'
					}
				}
			},
			note:{
				validators: {
					stringLength: {
						max: 128,
						message: '备注不能大于128个字'
					}
				}
			}
		}
	})
	.on('success.form.bv', function (e) {
		e.preventDefault();
		var $form = $(e.target);
		$form.bootstrapValidator('resetForm', true);             // Reset the form
	});
}


/**
 * 查询页面更多筛选条件的隐藏和显示
 */
function searchMoreIsHidden(){
	$("#searchMore").click(function(){
		var i = $('#searchMore').children('i');
		if(i.hasClass('glyphicon glyphicon-chevron-down')) {
			i.removeClass('glyphicon glyphicon-chevron-down');
			i.addClass('glyphicon glyphicon-chevron-up');
			$('#searchMore').children('span').html('精选筛选条件 ');
			$('#isHidden').show();
		} else {
			i.removeClass('glyphicon glyphicon-chevron-up');
			i.addClass('glyphicon glyphicon-chevron-down');
			$('#searchMore').children('span').html('更多筛选条件 ');
			$('#isHidden').hide();
		}
	})
}