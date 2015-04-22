document.addEventListener('DOMContentLoaded', function() {
});

//require(["https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"]);
require.config({
	paths: {
		'prototype': "https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype",
//		'damas': "damas",
		'd3': 'graphViewer/d3.min',
		'graph': 'graphViewer/graph_d3',
		'interactions': "graphViewer/interactions",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	}
});


require(["prototype","d3", "graph", "interactions", "ao", "av" ], function(p, damas, d3, graph, interac){
//	window.damas = damas;
//	damas.server = '/damas/server';

//	d3.json("test_mat.json", function(error, json) {
		var graph = document.createElement('div');
		graph.setAttribute('id', 'graph');
		document.body.appendChild(graph);
		svg = damassvggraph.getSVG();

		var svgD = document.getElementById('svggraph');
		svgD.style.height = window.innerHeight - 4 + 'px';
		svgD.style.width = window.innerWidth - 4 + 'px';

		var backD = document.getElementById('backG');
		backD.setAttribute('height', window.innerHeight + 'px');
		backD.setAttribute('width', window.innerWidth + 'px');
//		enable_drop(svgD , json);
//	});

	//window.Springy = Springy;
	//damas.getUser();
	//var roots = JSON.parse( damas.read( damas.utils.command( { cmd: 'roots' } ).text ));
	
	//alert(roots.length);
	//document.body.appendChild(svg);
	loadCss("scripts/graphViewer/graph_d3.css");
	loadCss("scripts/assetViewer/assetOverlay.css");

	//
	// we ask server the root nodes to show
	//
	damas.utils.command_a( { cmd: 'roots' }, function(res){
		damas.read(res.text, function(nodes){

			for(i=0;i<nodes.length;i++)
			{
				var n = nodes[i];
				//console.log(n);
				//springy_graph.newNode(n);
			}
		});
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

