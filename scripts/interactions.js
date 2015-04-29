	function fetchJSONFile(path, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				//if (httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (callback) callback(data);
				//}
			}
		};
		httpRequest.open('GET', path);
		httpRequest.send(); 
	}

function enable_keyboard( svg ) {
	//svg.setAttribute('onkeypress', 'keypress(e)');

	window.addEventListener('keypress', keypress );
}

function keypress(e){
	var unicode=e.keyCode? e.keyCode : e.charCode;
	console.log(unicode);
	if(unicode === 48){
		//document.documentElement.setCurrentTime(0);
		return;
	}
	if(unicode === 101){ // e
		if( confirm('Erase graph?') )
		{
			damasGraph.erase();
		}
		return;
	}
	if(unicode === 104){ // h
		return;
	}
	if(unicode === 109){ // m
		return;
	}
	if(unicode === 116){ // t
		return;
	}

}

function enable_drop( svg, graph ) {
	function cancel(e){
		e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
		return false; // required by IE
	}
	svg.ondragover = cancel;
	svg.ondragenter = cancel;
/*
	svg.ondragover = function(e){
		e.stopPropagation();
		e.preventDefault();
	}
*/
	svg.ondragleave = function(e){
		e.stopPropagation();
		e.preventDefault();
	}
	svg.ondrop = damasflow_ondrop;
}


damasflow_ondrop = function ( e )
{
	//alert('COMING SOON :) Drop your assets and connect them, in this web page');
	e.stopPropagation();
	if(e.preventDefault) e.preventDefault();

	// DEBUG START
	console.log(e.dataTransfer);
	console.log(e.dataTransfer.files);
	if(e.dataTransfer.types)
	{
		var keys = {};
		for(i=0;i<e.dataTransfer.types.length;i++)
		{
			//console.log(e.dataTransfer.types[i]);
			keys[e.dataTransfer.types[i]] = e.dataTransfer.getData(e.dataTransfer.types[i]);
		}
		console.log(keys);
	}
	// END DEBUG

	/*
	var files = e.dataTransfer.files;
	// DROP FILES
	for(i=0;i<files.length;i++)
	{
		var file = files[i];
		// DAMAS
		//var elem = damas.create(file);
		//elem.update({label: file.name });
		//nodes[elem.id] = graph.newNode({'label': file.name});
		//nodes[elem.id].damelem = elem;
		//console.log(ev.dataTransfer);
		graph.newNode({ keys: file, 'label': file.name});
		//graph.newNode( file );
	}
	*/

	var path = e.dataTransfer.getData('text/x-moz-url');

	if (path.indexOf('file://') === 0)
	{
		// temporary absolute path for tests - path to local projects
		var path = path.replace('file:///home/damas/files', '');
		var path = path.replace('file://', '');

		damas.search({file: "='"+path +"'"}, null, null, null, function(res){
			if(res.length>0)
			{
				damas.utils.command_a( {cmd: 'graph', id: res[0] }, function(res){
					damasGraph.load( JSON.parse( res.text ));
				});
			}
			else
			{
				if( confirm('Add ' + path + '?'))
				{
					console.log(e.dataTransfer);
					console.log(path);
					//damas.create_rest({ file: path }, function(node){
					damas.create({ file: path }, function(node){
						damasGraph.newNode(node);
					});
				}
			}
		});
		return;
	}
	if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0)
	{
		var text = e.dataTransfer.getData('Text');
		console.log(text);
		if( text.indexOf(window.location.origin) === 0)
		{
			// DROPPED AN EXISTING NODE FROM SAME SERVER
			var r = new RegExp(window.location.origin+'.*#view=');
			var id = parseInt(text.replace(r, ''));
			console.log('Dropped node #' +id);
			//var elem = damas.read_rest(parseInt(id));
			damas.utils.command_a( {cmd: 'graph', id: id }, function(res){
				damasGraph.load( JSON.parse( res.text ));
			});
		}
		//else
		//{
			// DROP ARBITRARY LINK
			//var elem = damas.create( {
				//url: e.dataTransfer.getData('Text')
			//});
			//nodes[elem.id] = graph.newNode({'label': e.dataTransfer.getData('Text')});
			//graph.newNode({keys:{}, 'label': e.dataTransfer.getData('Text')});
			//nodes[elem.id].damelem = elem;
		//}
	}
}
