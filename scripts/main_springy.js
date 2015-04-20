document.addEventListener('DOMContentLoaded', function() {
});

//require(["https://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js"]);
require.config({
	paths: {
		'prototype': "https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype",
		'damas': "damas",
		'svg-pan-zoom': 'graphViewer/svg-pan-zoom',
		'graph': "graphViewer/graph",
		'springy': "graphViewer/springy"
	}
});


require(["prototype", "damas", "graph", "springy", "svg-pan-zoom" ], function(p, damas, graph, Springy, svgPanZoom){
	//window.damas = damas;
	damas.server = '/damas/server';
	window.Springy = Springy;
	//damas.getUser();
	//var roots = JSON.parse( damas.read( damas.utils.command( { cmd: 'roots' } ).text ));

	
	//alert(roots.length);
	svg = damassvggraph.getSVG();
	document.body.appendChild(svg);
	springy_graph = new Springy.Graph();
	var springy_layout = new Springy.Layout.ForceDirected(springy_graph, 300.0, 300.0, 0.5);
	//window.svgpanzoomoinstance = svgPanZoom('#svggraph' );

	springy_damas.currentBB = springy_layout.getBoundingBox();
	var springy_renderer = springy_damas.get_renderer( springy_layout );
	springy_renderer.start();

	//
	// we ask server the root nodes to show
	//
	damas.utils.command_a( { cmd: 'roots' }, function(res){
		damas.read(res.text, function(nodes){

			for(i=0;i<nodes.length;i++)
			{
				var n = nodes[i];
				console.log(n);
				springy_graph.newNode(n);
			}
		});
	});
});
