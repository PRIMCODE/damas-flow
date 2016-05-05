require.config({
	paths: {
		//'prototype': "vendor/prototype",
		'damas': "damas",
		'springy': 	"graphViewer/vendor/springy",
		'svg-pan-zoom':	"graphViewer/vendor/svg-pan-zoom",
		'graph-common': "graphViewer/graph-common",
		'damasGraph':	"graphViewer/graph-springy",
		'interactions': "interactions",
		'graph-client': "graph-client",
		'main_common': "main_common",
		'ao': "assetViewer/assetOverlay",
		'av': "assetViewer/assetViewerSelector"
	},
	urlArgs: "v=" +  (new Date()).getTime()
});

require(["damas", "damasGraph", "graph-client", "main_common", "ao", "av", "interactions" ], function(damas, damasGraph){
	// PHP
	//damas.server = '/damas/server';
	//damas.server = '/';
	window.damas = damas;

	damas_connect('/api/', function(res){
		if (!res)
		{
			window.location='signin.html'
		}

		loadCss('style.css');
		loadCss('scripts/graphViewer/graph-common.css');
		loadCss("scripts/assetViewer/assetOverlay.css");
		
		var graph = new damasGraph( document.getElementById('graph'));
		window.graph = graph;

		enable_drop( graph.svg, graph);
		enable_keyboard( graph.svg);
		//damas.getUser();
		graph.svg.style.height = window.innerHeight -3 + 'px';

		var help = document.querySelector('#graphHelpFrame');
		help.addEventListener('click', function(e){
			e.target.style.display = 'none';
		});

		process_hash();
	});
});
