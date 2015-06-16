document.addEventListener('DOMContentLoaded', function() {
});

window.addEventListener("resize", function() {
	graph.svg.style.height = window.innerHeight - 4 + 'px';
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

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

window.loadCss = loadCss;
