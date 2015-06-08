$(document).ready(function() {
	$("#info").submit(function(e){
		e.preventDefault();

		var min = parseInt($("input:text[name=min]").val());
		var max = parseInt($("input:text[name=max]").val());
		var size = parseInt($("input:text[name=size]").val());
		var diff = max - min + 1
		var means = "";

		var buckets = [];
		buckets.length = (diff - 1) * 2;
		for (i = 0; i < buckets.length; i ++) {
			buckets[i] = 0;
		}

		means += "Mean: " + ((max + min)/2).toString() + "<br>";
		means += "Variance: " + (((max - min) * (max - min))/(12*size)).toString()
		means += "<br><br>"
		means += "Sample Means:<br>"
		var sum = 0;
		for (i = 0; i < 100*size; i++) {
			sum += Math.floor(Math.random()*diff) + min;
			if (i % size == size - 1) {
				var avg = sum/size;
				means += avg + "<br>";
				buckets[Math.floor(avg - min)/0.5] += 1;
				sum = 0;
			}
		}

		var options = {
			data: [
				{
					type: "column",
					dataPoints: []
				}
			]
		};

		$("#clt-chart").CanvasJSChart(options);
		var chart = $("#clt-chart").CanvasJSChart();
		for (i = 0; i < buckets.length; i++) {
			chart.options.data[0].dataPoints.push({
				x: i*.5 + min, y: buckets[i]
			});
		}
		chart.render();

		$("#change").html(means);
	});
});