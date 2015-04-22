document.addEventListener('DOMContentLoaded', function() {
});

require.config({
	paths: {
		'prototype': "https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype",
		'damas': "damas",
		'svg-pan-zoom': 'graphViewer/svg-pan-zoom',
		'graph': "graphViewer/graph",
		'springy': "graphViewer/springy",
		'graph-client': "graph-client",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	}
});
		//'': "scripts/assetViewer/assetOverlay.css"

require(["prototype", "damas", "graph", "springy", "svg-pan-zoom","graph-client", "ao", "av" ], function(p, damas, graph, Springy, svgPanZoom){
	//window.damas = damas;
	damas.server = '/damas/server';
	window.Springy = Springy;
	//damas.getUser();
	//var roots = JSON.parse( damas.read( damas.utils.command( { cmd: 'roots' } ).text ));
	window.svg = damassvggraph.getSVG();
	document.body.appendChild(svg);
	svg.style.height = window.innerHeight + 'px';
	springy_graph = new Springy.Graph();
	var springy_layout = new Springy.Layout.ForceDirected(springy_graph, 300.0, 300.0, 0.5);
	window.svgpanzoomoinstance = svgPanZoom('#svggraph' );

	springy_damas.currentBB = springy_layout.getBoundingBox();
	var springy_renderer = springy_damas.get_renderer( springy_layout );
	springy_renderer.start();

	//
	// we ask server the root nodes to show
	//
	damas.utils.command_a( { cmd: 'roots' }, function(res){
		damas.utils.command_a( { cmd: 'read', id: JSON.parse(res.text).join(','), depth: '1', flags: '4' }, function(res){
			var nodes = JSON.parse( res.text );
			for(i=0;i<nodes.length;i++)
			{
				var n = nodes[i];
				springy_graph.newNode(n);
			}
		});
	});
	loadCss("scripts/assetViewer/assetOverlay.css");
});

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

window.addEventListener("resize", function() {
	svg.style.height = window.innerHeight + 'px';
});

