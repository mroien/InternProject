javascript:(function(){if(document.getElementById('tif-button') != null) { return; } var script = document.createElement("script");script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";document.head.appendChild(script);var chart = document.createElement("script");chart.src = "http://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js";document.head.appendChild(chart);var tif_button = document.createElement("script");tif_button.src = "http://localhost/Intern-Project/lib/tif-button.js";document.head.appendChild(tif_button);var tif_css = document.createElement("link");tif_css.href = "http://localhost/Intern-Project/lib/tif-button.css";tif_css.rel  = "stylesheet";tif_css.type = "text/css";document.head.appendChild(tif_css);})();