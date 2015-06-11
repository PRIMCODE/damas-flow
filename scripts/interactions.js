var wd= (JSON.parse(loadConfJSON())).workdirs;
console.log(wd);
if(!localStorage['workdirs'])
	localStorage['workdirs']='[]';

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
		e.preventDefault();
		return false;
	}
	if(e.ctrlKey)
	{
		damas_open(this._id);
		e.preventDefault();
		return false;
	}
	if(window['assetOverlay']){
		assetOverlay(this);
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
		
		var tempSelection = graph.selection.slice(); //temporary array

		for(var i=0; i< tempSelection.length;i++)
		{
			var node = tempSelection[i];
			var id = node._id;
			console.log(node);
			if(node.src_id && node.tgt_id)
			{
				damas.delete_rest(id, function(success){
					if(success) graph.removeNode(node);
				});
			}
			else
			{
				graph.removeNode(node);
			}
		}
		tempSelection = [];
		graph.unselectAll();
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
	if(unicode === 100){ // d
		if (document.querySelector('#graphDebug').style.display === 'none')
		{
			document.querySelector('#graphDebug').style.display = 'block';
		}
		else
		{
			document.querySelector('#graphDebug').style.display = 'none';
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
		var panel = document.querySelector('#graphHelpFrame');
		if (panel.style.display === 'none')
		{
			panel.style.display = 'block';
		}
		else
		{
			panel.style.display = 'none';
		}
		return;
	}
	if(unicode === 108){ // l
		if(graph.selection[0] && graph.selection[1])
		{
			graph.unhighlightElements();
			var id1 = graph.selection[0]._id;
			var id2 = graph.selection[1]._id;
			damas.create_rest({
				src_id: id1,
				tgt_id: id2 }, function(node){
					if(!node)
					{
						console.log("create link failed! ");
					}
					else
					{
						graph.newEdge(node);
						console.log('LINK CREATED! src_id: '+ id1+', tgt_id: '+id2 );
					}
				}
			);
			graph.unselectAll();
			return;
		}
		alert('Please select 2 nodes to link');
		return;
	}
	if(unicode === 109){ // m
		return;
	}
	if(unicode === 116){ // t
		graph.svg.querySelector('g.texts').classList.toggle('hidden');
		//TOGGLE TEXTS
		return;
	}
	if(unicode === 111){ // o
		graph.svg.querySelector('g.edges').classList.toggle('shadowE');
		graph.svg.querySelector('g.nodes').classList.toggle('shadowN');
		//TOGGLE SHADOWS
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
		// EDIT WORKDIRS
		var wds=localStorage["workdirs"];
		wds = prompt('Edit workdir', wds);
		if(wds)
			localStorage['workdirs']=wds;
		return;
	}
	if(unicode === 120){ // x
		// EXPORT GRAPH
		alert('The graph has been copied to the console.log');
		console.log(JSON.stringify(graph.nodes.concat(graph.links)));
	}
	/*
		// REMOVE WORKDIR
		var wds=localStorage["workdirs"].replace(',','\r\n');
		wds=wds.replace('[','');
		wds=wds.replace(']','');
		var workdir = prompt('Workdir to delete:\r\n'+wds, 'workdir');
		if(workdir)
			removeWorkdirs(workdir);
		return;
	*/
	if(unicode === 87){ // W
		// LIST WORKDIRS
		var wds="Default Workdirs: \r\n"+(JSON.stringify(wd)).replace(/,/g,'\r\n')+"\r\nUser Workdirs:\r\n";
		wds+=localStorage["workdirs"].replace(/,/g,'\r\n');
		wds=wds.replace(/\[/g,'');
		wds=wds.replace(/\]/g,'');
		alert(wds);
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
 * OS        To        From     ok? Field
 * ---------------------------------------------------
 * Linux     Iceweasel pcmanfm  yes text/x-moz-url
 * Linux     Iceweasel gftp     yes text/x-moz-url
 * Linux     Chrome    pcmanfm  no
 * Linux     Chrome    gftp     yes text/plain
 * Windows   Firefox   Explorer yes text/x-moz-url
 * Windows   Chrome    Explorer no
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
		var workdir=wd.concat(JSON.parse(localStorage["workdirs"]));
		workdir.sort(function(a, b){
			return b.length - a.length;
		});
		console.log(workdir);
		for(var w=0;w<workdir.length;w++)
			path= path.replace(new RegExp("^"+workdir[w]), '');
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

function removeWorkdirs(wd){
	var workdirs=JSON.parse(localStorage["workdirs"]);
	var index=workdirs.indexOf(wd);
	if(workdirs[wd])
		workdirs.splice(wd,1);
	localStorage["workdirs"]=JSON.stringify(workdirs);
	console.log(localStorage["workdirs"]);
}

function addWorkdirs(wd){
	var workdirs=JSON.parse(localStorage["workdirs"]);
	workdirs.push(wd);
	localStorage["workdirs"]=JSON.stringify(workdirs);
	console.log(localStorage["workdirs"]);
}

function loadConfJSON() {
	var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
	xobj.open('GET', 'conf.json', false);
	xobj.send(null);
	return xobj.responseText;
}
