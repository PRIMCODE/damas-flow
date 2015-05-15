document.addEventListener('DOMContentLoaded', function() {
});

//require(["https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"]);
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
	loadCss("scripts/graphViewer/graph-d3.css");
	loadCss("scripts/graphViewer/graph-common.css");
	loadCss("scripts/assetViewer/assetOverlay.css");
//	assetsURL = '/projects';
	assetsURL = '';
	window.damas = damas;

//	damas.server = '/damas/server';
//	damas.server = '../server';
	damas.server = '/';
	
//	var graph = document.createElement('div');
//	graph.setAttribute('id', 'graph');
//	document.body.appendChild(graph);
//	damasGraph.init( graph );
//	window.damasGraph = damasGraph;
//	enable_drop(damasGraph.svg, damasGraph);



	var graphDiv = document.createElement('div');
	graphDiv.setAttribute('id', 'graph');
	document.body.appendChild(graphDiv);
	
	var graph = new damasGraph( graphDiv );
	window.graph = graph;
	enable_drop(graph.svg, graph);


	//damasGraph.load( "scripts/graphViewer/bigbuckbunny_characters.json" );
	//var roots = JSON.parse( damas.read( damas.utils.command( { cmd: 'roots' } ).text ));

//	damas.utils.command_a( { cmd: 'graph', id: 65337 }, function(res){

//	damas.utils.command_a( { cmd: 'graph', id: 306 }, function(res){

//		var data = JSON.parse( res.text );
//		for(i=0;i<data['nodes'].length;i++)
//		{
//			var n = data['nodes'][i];
//			damasGraph.newNode(n);
//		}
//		for(i=0;i<data['links'].length;i++)
//		{
//			var l = data['links'][i];
//			damasGraph.newEdge( l );
//		}
//	});
//
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

