document.addEventListener('DOMContentLoaded', function() {
});

require.config({
	paths: {
		'prototype': "vendor/prototype",
		'damas': "damas",
		'springy': 	"graphViewer/vendor/springy",
		'svg-pan-zoom':	"graphViewer/vendor/svg-pan-zoom",
		'graph-common': "graphViewer/graph-common",
		'damasGraph':	"graphViewer/graph-springy",
		'interactions': "interactions",
		'graph-client': "graph-client",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	},
	urlArgs: "v=" +  (new Date()).getTime()
});

require(["prototype", "damas", "damasGraph", "graph-client", "ao", "av", "interactions" ], function(p, damas, damasGraph){
	// PHP
	//damas.server = '/damas/server';
	damas.server = '/';
	window.damas = damas;
	loadCss('style.css');
	loadCss('scripts/graphViewer/graph-common.css');
	loadCss("scripts/assetViewer/assetOverlay.css");
		
	var graph = new damasGraph( document.getElementById('graph'));
	window.graph = graph;

	enable_drop( graph.svg, graph);
	enable_keyboard( graph.svg);
	//damas.getUser();
	graph.svg.style.height = window.innerHeight -3 + 'px';

/*
	// graph PHP
	damas.utils.command_a( { cmd: 'graph', id: 306 }, function(res){
		graph.load(JSON.parse( res.text ));
	});

	// graph NODEJS
	var req = new XMLHttpRequest();
	req.open('GET', damas.server + '/graph/306', true);
	req.onreadystatechange = function(e){
		if(req.readyState == 4)
		{
			if(req.status == 200)
			{
				damasGraph.load( JSON.parse(req.responseText));
			}
		}
	}
	req.send();
*/
	var help = document.querySelector('#graphHelpFrame');
	help.addEventListener('click', function(e){
		e.target.style.display = 'none';
	});
});

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

window.addEventListener("resize", function() {
	graph.svg.style.height = window.innerHeight -3 + 'px';
});

