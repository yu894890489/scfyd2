$(function(){
	CloudUtils.getMenuNames("nav");
	loadDate0();
	getOverdueList();
});
function initTable(data){
	$('#overdueCountTable').bootstrapTable('destroy');  
	$("#overdueCountTable").bootstrapTable({  
         method: "post", 
         striped: true,  //表格显示条纹  
         search: false,  //是否启用查询  
         data:data,
         showColumns: false,  //显示下拉框勾选要显示的列  
         showRefresh: false,  //显示刷新按钮  
         sidePagination: "server", //表示服务端请求  
         queryParamsType : "undefined",
         columns: [{
	 	        field: 'agencyName',
	 	        title: '客户名称',
	 	        align: 'center',
			            valign: 'middle'
			 	},{
	 	        field: 'orgnNum',
	 	        title: '组织机构代码证号',
	 	        align: 'center',
			    valign: 'middle'
			 	},{
	 	        field: 'payAmtSum',
	 	        title: '总计融资金额',
	 	        align: 'center',
			    valign: 'middle'
			 	}, {
		 	        field: 'payAmtSum',
		 	        title: '总计放款金额',
		 	        align: 'center',
		            valign: 'middle'
		 	    },{
		 	        field: 'overdueAmountSum',
		 	        title: '总计逾期金额',
		 	        align: 'center',
		            valign: 'middle'
		 	    },{
		 	        field: 'overdueCountSum',
		 	        title: '逾期频率',
		 	        align: 'center',
		            valign: 'middle'
		 	    },{
		 	        field: 'overdueRate',
		 	        title: '逾期率',
		 	        align: 'center',
		            valign: 'middle'
		 	    }]
       });  
}

function showChart(data){
	//销毁
	var yearsArray = [];//年份数组
	var overDueNum = [];
	var payNum = [];
	$.each(data, function(index, value) {
		yearsArray.push(value.financeEndDate+"年");
		overDueNum.push(value.overdueAmountSum);
		payNum.push(value.payAmtSum);
	});
	 echarts.dispose(document.getElementById('echart'));
	 var myChart = echarts.init(document.getElementById('echart'));
	 option = {
			   /* title: {
			        text: '世界人口总量',
			        subtext: '数据来自网络'
			    },*/
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'shadow'
			        }
			    },
			    legend: {
			        data: ['逾期融资金额', '总计融资金额']
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type: 'value',
			        boundaryGap: [0, 0.01]
			    },
			    yAxis: {
			        type: 'category',
			        data: yearsArray
			    },
			    series: [
			        {
			            name: '逾期融资金额',
			            type: 'bar',
			            data: overDueNum
			        },
			        {
			            name: '总计融资金额',
			            type: 'bar',
			            data: payNum
			        }
			    ]
			};
     myChart.setOption(option);
}

function searchFun(){
	getOverdueList();
}

function loadDate0(){
	$('#financeStartDate,#financeEndDate').datetimepicker('remove');
	$('#financeStartDate,#financeEndDate').datetimepicker({
		language: 'zh-CN',
		autoclose: 1,
		todayHighlight: true,
		format: 'yyyy',
		startView: 4,
        minView: 4,
		todayBtn: true,
		initialDate : new Date() ,
		pickerPosition: "bottom-left"
	});
}

//获取逾期数据
function getOverdueList(){
	  var param = {    
		   agencyName :$("#txt_agencyName").val(),
   		   financeStartDate:$("#financeStartDate").val()==""?"":$("#financeStartDate").val()+"-01-01",
   		   financeEndDate:$("#financeEndDate").val()==""?"":$("#financeEndDate").val()+"-12-31"
      }
	var options = {
			url : "../../CountAnalyse/getOverdueInfo",
			data : JSON.stringify(param),
			callBackFun : function(data) {
				if(data.result==0){
					initTable(data.tableList);
//					table数据
					showChart(data.echartList);
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

