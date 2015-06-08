$(document).ready(function() {
	$("#info").submit(function(e){
		e.preventDefault();

		var min = parseInt($("input:text[name=min]").val());
		var max = parseInt($("input:text[name=max]").val());
		var size = parseInt($("input:text[name=size]").val());
		var diff = max - min + 1
		var means = "";
		means += "Mean: " + ((max + min)/2).toString() + "<br>";
		means += "Variance: " + (((max - min) * (max - min))/(12*size)).toString()
		means += "<br><br>"
		means += "Sample Means:<br>"
		var sum = 0;
		for (i = 0; i < 25*size; i++) {
			sum += Math.floor(Math.random()*diff) + min;
			if (i % size == size - 1) {
				var avg = sum/size;
				means += avg + "<br>";
				sum = 0;
			}
		}
		$("#change").html(means);
	});
});