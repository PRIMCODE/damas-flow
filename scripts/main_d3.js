document.addEventListener('DOMContentLoaded', function() {
});

//require(["https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"]);
require.config({
	paths: {
		'prototype': "https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype",
		'damas': "damas",
		'd3': 'graphViewer/d3.min',
		'graph': 'graphViewer/graph_d3',
		'interactions': "graphViewer/interactions"
	}
});


require(["prototype", "damas", "d3", "graph", "interactions" ], function(p, damas, d3, graph, interac){
	window.damas = damas;
	damas.server = '/damas/server';


/*
                        var svgD = document.getElementById('graph');
                        svgD.style.height = window.innerHeight + 'px';
                        svgD.style.width = window.innerWidth + 'px';
                        
                        var backD = document.getElementById('backG');
                        backD.setAttribute('height', window.innerHeight + 'px');
                        backD.setAttribute('width', window.innerWidth + 'px');  
*/


	//window.Springy = Springy;
	//damas.getUser();
	//var roots = JSON.parse( damas.read( damas.utils.command( { cmd: 'roots' } ).text ));

	
	//alert(roots.length);
	var svg = damassvggraph.getSVG();
	//document.body.appendChild(svg);


/*
	springy_graph = new Springy.Graph();
	var springy_layout = new Springy.Layout.ForceDirected(springy_graph, 300.0, 300.0, 0.5);
	//window.svgpanzoomoinstance = svgPanZoom('#svggraph' );

	springy_damas.currentBB = springy_layout.getBoundingBox();
	var springy_renderer = springy_damas.get_renderer( springy_layout );
	springy_renderer.start();
*/

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
