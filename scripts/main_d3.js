require.config({
	paths: {
		'damas': "damas",
		'd3': 'graphViewer/vendor/d3',
		'graph-common': "graphViewer/graph-common",
		'graph': 'graphViewer/graph-d3',
		'main_common': "main_common",
		'interactions': "interactions",
		'sha1': "vendor/sha1",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	},
	urlArgs: "v=" +  (new Date()).getTime()
});

require(["damas", "d3", "graph", "main_common", "interactions", "sha1", "ao", "av" ], function(damas, d3, damasGraph, interactions){
	window.damas = damas;
	damas_connect('/api/', function(res){
		if (!res)
		{
			window.location='signin.html'
		}
		loadCss("style.css");
		loadCss("scripts/graphViewer/graph-common.css");
		loadCss("scripts/assetViewer/assetOverlay.css");
		var graph = new damasGraph( document.getElementById('graph'));
		window.graph = graph;
		enable_drop(graph.svg, graph);
		enable_keyboard(graph.svg);
		var help = document.querySelector('#graphHelpFrame');
		help.style.display = 'none';
		help.addEventListener('click', function(e){
			e.target.style.display = 'none';
		});
		graph.svg.style.height = window.innerHeight - 4 + 'px';
		graph.svg.style.width = window.innerWidth + 'px';

		process_hash();

		graph.svg.addEventListener('mouseleave', function(e){
			window.mouseongraph = false;
		});
		graph.svg.addEventListener('mouseenter', function(e){
			window.mouseongraph = true;
		});
	});
});
