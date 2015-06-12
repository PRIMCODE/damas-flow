document.addEventListener('DOMContentLoaded', function() {
});

require.config({
	paths: {
		'prototype': "vendor/prototype",
		'damas': "damas",
		'd3': 'graphViewer/vendor/d3',
		'graph-common': "graphViewer/graph-common",
		'graph': 'graphViewer/graph-d3',
		'interactions': "interactions",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	},
	urlArgs: "v=" +  (new Date()).getTime()
});

require(["prototype", "damas", "d3", "graph", "interactions", "ao", "av" ], function(p, damas, d3, damasGraph, interactions){
	loadCss("style.css");
	loadCss("scripts/graphViewer/graph-common.css");
	loadCss("scripts/assetViewer/assetOverlay.css");
	window.damas = damas;
	//damas.server = '/damas/server';
	damas.server = '/';
	var graph = new damasGraph( document.getElementById('graph'));
	window.graph = graph;
	enable_drop(graph.svg, graph);
	enable_keyboard(graph.svg);
	var help = document.querySelector('#graphHelpFrame');
	help.addEventListener('click', function(e){
		e.target.style.display = 'none';
	});
	graph.svg.style.height = window.innerHeight - 3 + 'px';
	graph.svg.style.width = window.innerWidth + 'px';

	process_hash();
});

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

window.addEventListener("resize", function() {
	graph.svg.style.height = window.innerHeight - 3 + 'px';
	graph.svg.style.width = window.innerWidth + 'px';
});

window.addEventListener("hashchange", function() {
	//process_hash();
});

process_hash = function() {
	if(/#graph=/.test(location.hash))
	{
		var id = location.hash.replace('#graph=','');
		damas.get_rest( 'graph/'+id, function(res){
			graph.load(res);
		});
	}
}
