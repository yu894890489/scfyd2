$(function() {
    $('#easypiechart-teal').easyPieChart({
        scaleColor: false,
        barColor: '#1ebfae'
    });
});

$(function() {
    $('#easypiechart-orange').easyPieChart({
        scaleColor: false,
        barColor: '#ffb53e'
    });
});

$(function() {
    $('#easypiechart-red').easyPieChart({
        scaleColor: false,
        barColor: '#f9243f'
    });
});

$(function() {
   $('#easypiechart-blue').easyPieChart({
       scaleColor: false,
       barColor: '#30a5ff'
   });
});

try{
	
	$('#calendar').datepicker({
	});
}catch (e) {
	throw new Error(10,"asdasdasd") 
}