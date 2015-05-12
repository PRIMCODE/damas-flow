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
	window.addEventListener('keydown', keydown );
	window.addEventListener('keyup', keyup );
}

function node_pressed(e){
	if(e.shiftKey)
	{
		graph.selectToggle( this );
		//graph.selection.push( this );
		//e.target.classList.toggle('selected');
		e.preventDefault();
		return false;
	}
	if(e.ctrlKey)
	{
		damas_open(this.data.id);
		e.preventDefault();
		return false;
	}
	if(window['assetOverlay']){
		assetOverlay(this.data);
	}
}

function keydown(e){
	if (e.shiftKey)
	//if (window.event.shiftKey)
	{
		graph.svg.style.cursor = 'crosshair';
	}
}

function keyup(e){
	graph.svg.style.cursor = '';
}

function keypress(e){
	var unicode=e.keyCode? e.keyCode : e.charCode;
	console.log(unicode);
	if(unicode === 46){ // Delete
		// REMOVE SELECTION (from local graph only, this is not a deletion in remote database)
		//for(node in graph.selection)
		for(var i=0; i< graph.selection.length;i++)
		{
			var node = graph.selection[i];
			console.log(node);
			graph.removeNode(node);
		}
		return;
	}
	if(unicode === 48){ // 0
		return;
	}
	if(unicode === 97){ // a
		// SELECT ALL
		for(node in graph.springy_graph.nodes)
		{
			graph.selection.push(node);
			node.shape.classList.toggle('selected');
		}
		return;
	}
	if(unicode === 101){ // e
		if( confirm('Erase graph?') )
		{
			graph.erase();
		}
		return;
	}
	if(unicode === 102){ // f
		// FOCUS SELECTION
		return;
	}
	if(unicode === 104){ // h
		// SHOW HELP PANEL
		return;
	}
	if(unicode === 108){ // l
		if(graph.selection[0] && graph.selection[1])
		{
			damas.create_rest({
				src_id: graph.selection[0].data._id,
				tgt_id: graph.selection[1].data._id }, function(node){
					graph.newEdge(node);
			});
			return;
		}
		alert('Please select 2 nodes to link');
		return;
	}
	if(unicode === 109){ // m
		return;
	}
	if(unicode === 116){ // t
		return;
	}
	if(unicode === 99){ // c
		// CREATE NODE
		var keys = prompt('keys', '{"label":"test"}');
		damas.create_rest(JSON.parse(keys), function(node){
			console.log(node);
			graph.newNode(node);
		});
		return;
	}
	if(unicode === 119){ // w
		// ADD WORKDIR
		var workdir = prompt('New workdir', 'workdir');
		if(workdir)
			damas.utils.addWorkdirs(workdir);
		return;
	}
	if(unicode === 120){ // x
		// REMOVE WORKDIR
		var wds=JSON.stringify(damas.utils.getWorkdirs()).replace(',','\r\n');
		wds=wds.replace('[','');
		wds=wds.replace(']','');
		var workdir = prompt('Workdir to delete:\r\n'+wds, 'workdir');
		if(workdir)
			damas.utils.removeWorkdirs(workdir);
		return;
	}
	if(unicode === 87){ // W
		// LIST WORKDIRS
		var wds=JSON.stringify(damas.utils.getWorkdirs()).replace(',','\r\n');
		wds=wds.replace('[','');
		wds=wds.replace(']','');
		alert('Workdirs:\r\n'+wds);
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


/**
 *
 * Table for dropped files - is the absolute file path found and in which field
 *
 * OS    To        From    ok? Field
 * ------------------------------------------
 * Linux Iceweasel pcmanfm yes text/x-moz-url
 * Linux Iceweasel gftp    yes text/x-moz-url
 * Linux Chrome    pcmanfm no
 * Linux Chrome    gftp    yes text/plain
 *
 *
 */

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

	var path;
	if (keys['text/x-moz-url'])
		path = keys['text/x-moz-url'];
	if (keys['text/plain'])
		path = keys['text/plain'];

	console.log(path);
	if(!path)
	{
		alert('Could not determine the path for the file ' + e.dataTransfer.files[0].name +': Drop aborted' );
		return;
	}

	if (path.indexOf('file://') === 0)
	{
		path = path.replace('file://', '');
		var wd= JSON.parse(damas.get_rest( 'workdirs/'));
		wd=wd.concat(damas.utils.getWorkdirs());
		wd.sort(function(a, b){
			return b.length - a.length;
		});
		for(w in wd)
			path= path.replace(wd[w], '');
		//damas.search({file: "='"+path +"'"}, null, null, null, function(res){
		damas.search_rest('file:'+path, function(res){
			if(res.length>0)
			{
/*
				damas.utils.command_a( {cmd: 'graph', id: res[0] }, function(res){
					graph.load( JSON.parse( res.text ));
				});
*/
				damas.get_rest( 'graph/'+res[0], function(res){
					graph.load( res);
					//graph.load( JSON.parse( res ));
				});
			}
			else
			{
				if( confirm('Add ' + path + '?'))
				{
					console.log(e.dataTransfer);
					console.log(path);
					//damas.create_rest({ file: path }, function(node){
					damas.create_rest({ file: path }, function(node){
						graph.newNode(node);
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
				graph.load( JSON.parse( res.text ));
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
		return;
	}
	if (path)
	{
		damas.search_rest('file:'+path, function(res){
			if(res.length>0)
			{
				damas.get_rest( 'graph/'+res[0], function(res){
					graph.load( res);
				});
			}
			else
			{
				if( confirm('Add ' + path + '?'))
				{
					console.log(e.dataTransfer);
					console.log(path);
					//damas.create({ file: path }, function(node){
					damas.create_rest({ file: path }, function(node){
						graph.newNode(node);
					});
				}
			}
		});
		return;
	}

}
