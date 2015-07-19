document.addEventListener('DOMContentLoaded', function() {
});

window.addEventListener("resize", function() {
	graph.svg.style.height = window.innerHeight - 4 + 'px';
	graph.svg.style.width = window.innerWidth + 'px';
});

window.addEventListener("hashchange", function() {
	//process_hash();
});


window.addEventListener('mousedown', function(){
	var help = document.querySelector('#graphHelpFrame');
	if (help.style.display != 'none')
	{
		help.style.display = 'none';
	}
	return;
});


process_hash = function() {
	//if(/#graph=/.test(location.hash))
	var keys = getHash();
	if(keys.graph)
	{
		//var id = location.hash.replace('#graph=','');
		damas.get_rest( 'graph/'+keys.graph, function(res){
			graph.load(res);
		});
	}
	if(keys.view)
	{
		//damas_open(keys.view);
		damas.read(keys.view, function(res){
			console.log(res);
			var newObject = JSON.parse(JSON.stringify(res[0]));
			newObject.file = '/file' + newObject.file;
			assetOverlay(newObject);
		} );
	}
	else
	{
		document.querySelector('#graphHelpFrame').style.display = 'block';
	}
}

function getHash() {
	var hash = window.location.hash.slice(1);
	var array = hash.split("&");
	var result = {};
	for (var i = 0; i < array.length; i += 1) {
		var key = array[i].split("=");
		result[key[0]] = key[1];
	}
	return(result);
}

function doHash( obj ) {
	var arr = [];
	for (key in obj) {
		arr.push(key + '=' + obj[key]);
	}
	window.location.hash = arr.join('&');
}

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

window.loadCss = loadCss;
