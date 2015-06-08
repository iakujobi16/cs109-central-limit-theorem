var factorials = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 
				3628800, 39916800, 479001600, 6227020800, 87178291200, 
				1307674368000, 20922789888000, 355687428096000, 6402373705728000, 
				121645100408832000, 2432902008176640000];

$(document).ready(function() {
	$("#info").submit(function(e){
		e.preventDefault();

		var dist = $("select[name=distribution]").val();
		var size = parseInt($("input:text[name=size]").val());
		var numSamples = parseInt($("input:text[name=numSamples]").val());

		var min = parseInt($("input:text[name=min]").val());
		var max = parseInt($("input:text[name=max]").val());
		var lambda = parseFloat($("input:text[name=lambda]").val());
		var n = parseInt($("input:text[name=n]").val());
		var p = parseFloat($("input:text[name=p]").val());

		var means = "";

		var sum;
		var buckets = [];
		buckets.length = 20;
		for (i = 0; i < buckets.length; i ++) {
			buckets[i] = 0;
		}

		var options = {
			title: {
				text: "Population of Sample Means"
			},
			axisX: {
				title: "Sample Means"
			},
			axisY: {
				title: "Number of Occurences"
			},
			data: [
				{
					type: "column",
					dataPoints: []
				}
			]
		};

		$("#clt-chart").CanvasJSChart(options);
		var chart = $("#clt-chart").CanvasJSChart();

		if(dist === "Uniform"){
			var distOptions = {
				title: {
					text: "Uniform Distribution PDF"
				},
				axisX: {
					minimum: min-1,
					maximum: max +1
				},
				axisY: {
					minimum: 0,
					maximum: 2*(1/(max-min))
				},
				data: [
					{
						type: "stepLine",
						dataPoints: [
							{x: min, y: 0},
							{x: min, y: 1/(max-min)},
							{x: max, y: 1/(max-min)},
							{x: max, y: 0},
						]
					}
				]
			}

			$("#dist-chart").CanvasJSChart(distOptions);

			var uniChart = $("#dist-chart").CanvasJSChart();

			uniChart.render();

			means += "<br>Mean: " + ((max + min)/2).toString() + "<br>";
			means += "Variance: " + (((max - min) * (max - min))/(12)).toString()
			means += "<br><br>"

			var diff = max - min + 1
			sum = 0;
			for (i = 0; i < numSamples*size; i++) {
				sum += Math.floor(Math.random()*diff) + min;
				if (i % size == size - 1) {
					var avg = sum/size;
					buckets[Math.floor((avg - min)/((max-min)/buckets.length))] += 1;
					sum = 0;
				}
			}
			for (i = 0; i < buckets.length; i++) {
				chart.options.data[0].dataPoints.push({
					x: i*((max-min)/buckets.length)+ min, y: buckets[i]
				});
			}
			chart.render();

		} else if(dist === "Poisson"){
			var distOptions = {
				title: {
					text: "Poisson Distribution PMF"
				},
				data: [
					{
						type: "column",
						dataPoints: []
					}
				]
			}

			$("#dist-chart").CanvasJSChart(distOptions);

			var poiChart = $("#dist-chart").CanvasJSChart();
			for (i = 0; i <= 20; i++) {
				poiChart.options.data[0].dataPoints.push({
					x: i, y: Math.exp(-lambda)*Math.pow(lambda, i)/factorials[i]
				});
			}
			poiChart.render();

			means += "<br>Mean: " + (lambda).toString() + "<br>";
			means += "Variance: " + (lambda).toString();
			means += "<br><br>"
			sum = 0;
			for (i = 0; i < numSamples*size; i++) {
				var l = Math.exp(-lambda);
				var x = 1;
				var k = 0;
				do {
					k++;
					x *= Math.random();
				} while (x >l);

				sum += k-1;

				if (i % size == size - 1) {
					var avg = sum/size;
					buckets[Math.floor(avg)] += 1;
					sum = 0;
				}
			}
			for (i = 0; i < buckets.length; i++) {
				chart.options.data[0].dataPoints.push({
					x: i, y: buckets[i]
				});
			}
			chart.render();
		} else if(dist === "Binomial"){
			var distOptions = {
				title: {
					text: "Binomial Distribution PMF"
				},
				data: [
					{
						type: "column",
						dataPoints: []
					}
				]
			}

			$("#dist-chart").CanvasJSChart(distOptions);

			var binChart = $("#dist-chart").CanvasJSChart();
			for (i = 0; i <= n; i++) {
				binChart.options.data[0].dataPoints.push({
					x: i, y: (Math.pow(1-p, n-i) * Math.pow(p, i) * factorials[n] )/(factorials[i] * factorials[n-i])
				});
			}
			binChart.render();

			means += "<br>Mean: " + (n*p).toString() + "<br>";
			means += "Variance: " + (n*p*(1-p)).toString();
			means += "<br><br>"
			sum = 0;
			for (i = 0; i < numSamples*size; i++) {
				console.log("we are in the for loop");
				var x = 0;
				for(j = 0; j< n; j++){
					if(Math.random() < p) x++;
				}
				sum += x;
				if (i % size == size - 1) {
					var avg = sum/size;
					buckets[Math.floor(avg/(n/20))] += 1;
					sum = 0;
				}
			}
			for (i = 0; i < buckets.length; i++) {
				chart.options.data[0].dataPoints.push({
					x: i*(n/20), y: buckets[i]
				});
			}
			chart.render();			
		} else if(dist === "Exponential"){
			var distOptions = {
				title: {
					text: "Exponential Distribution PDF"
				},
				data: [
					{
						type: "spline",
						dataPoints: [
							
						]
					}
				]
			}

			$("#dist-chart").CanvasJSChart(distOptions);

			var expChart = $("#dist-chart").CanvasJSChart();

			for (i = 0; i < 5; i += 0.1) {
				expChart.options.data[0].dataPoints.push({
					x: i, y: lambda*Math.exp(-lambda*i)
				});
			}

			expChart.render();

			means += "<br>Mean: " + (1/lambda).toString() + "<br>";
			means += "Variance: " + (1/(lambda*lambda)).toString()
			means += "<br><br>"
			sum = 0;
			for (i = 0; i < numSamples*size; i++) {
				sum += Math.floor(Math.log(1-Math.random())/(-lambda));
				if (i % size == size - 1) {
					var avg = sum/size;
					buckets[Math.floor(avg/((10)/buckets.length))] += 1;
					sum = 0;
				}
			}
			for (i = 0; i < buckets.length; i++) {
				chart.options.data[0].dataPoints.push({
					x: i*((10)/buckets.length), y: buckets[i]
				});
			}
			chart.render();

		}
		$("#change").html(means);
	});
});