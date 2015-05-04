document.addEventListener('DOMContentLoaded', function() {
});

require.config({
	paths: {
		'prototype': "https://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype",
		'damas': "damas",
		'svg-pan-zoom': 'graphViewer/svg-pan-zoom',
		'graph-common': "graphViewer/graph_common",
		'damasGraph': "graphViewer/graph",
		'springy': "graphViewer/springy",
		'interactions': "interactions",
		'graph-client': "graph-client",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	}
});

require(["prototype", "damas", "damasGraph", "graph-client", "ao", "av", "interactions" ], function(p, damas, damasGraph){
	damas.server = '/damas/server';
	window.damas = damas;
	loadCss('scripts/graphViewer/graph.css');
	damasGraph.init(document.body);
	window.damasGraph = damasGraph;
	enable_drop( damasGraph.svg, damasGraph);
	enable_keyboard( damasGraph.svg);
	//damas.getUser();
	damasGraph.svg.style.height = window.innerHeight + 'px';
/*
	damas.utils.command_a( { cmd: 'roots' }, function(res){
		damas.utils.command_a( { cmd: 'read', id: JSON.parse(res.text).join(','), depth: '1', flags: '4' }, function(res){
			var nodes = JSON.parse( res.text );
			for(i=0;i<nodes.length;i++)
			{
				var n = nodes[i];
				damasGraph.newNode(n);
			}
		});
	});
*/
	damas.utils.command_a( { cmd: 'graph', id: 306 }, function(res){
		damasGraph.load(JSON.parse( res.text ));
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
	damasGraph.svg.style.height = window.innerHeight + 'px';
});

