document.addEventListener('DOMContentLoaded', function() {
});

//require(["https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"]);
require.config({
	paths: {
		'prototype': "https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype",
//		'damas': "damas",
		'damas': "../../js/damas",
		'd3': 'graphViewer/d3',
		'graph-common': "graphViewer/graph_common",
		'graph': 'graphViewer/graph_d3',
		'interactions': "interactions",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
//		'af': "assetViewer/assetFunctions"
	},
	urlArgs: "v=" +  (new Date()).getTime()
});


require(["prototype", "damas", "d3", "graph", "interactions", "ao", "av"], function(p, damas, d3, damasGraph, interactions){
	loadCss("scripts/graphViewer/graph_d3.css");
	loadCss("scripts/assetViewer/assetOverlay.css");
	window.damas = damas;
//	damas.server = '/damas/server';
	damas.server = '../server';
	var graph = document.createElement('div');
	graph.setAttribute('id', 'graph');
	document.body.appendChild(graph);
	damasGraph.init( graph );
	window.damasGraph = damasGraph;
	enable_drop(damasGraph.svg, damasGraph);
	//damasGraph.load( "scripts/graphViewer/bigbuckbunny_characters.json" );
	//var roots = JSON.parse( damas.read( damas.utils.command( { cmd: 'roots' } ).text ));
	damas.utils.command_a( { cmd: 'graph', id: 65337 }, function(res){
		var data = JSON.parse( res.text );
		for(i=0;i<data['nodes'].length;i++)
		{
			var n = data['nodes'][i];
			damasGraph.newNode(n);
		}
		for(i=0;i<data['links'].length;i++)
		{
			var l = data['links'][i];
			damasGraph.newEdge( l );
		}
	});
});

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

//window.addEventListener("resize", function() {
//	svg.style.height = window.innerHeight + 'px';
//});

window.addEventListener("resize", function() {
	var svgD = document.getElementById('svggraph');
	var height = window.innerHeight;
	var width = window.innerWidth;
	svgD.style.height = window.innerHeight - 4 + 'px';
	svgD.style.width = window.innerWidth - 4 + 'px';
});

