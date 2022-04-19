var confWorkdir= (JSON.parse(loadConfJSON())).workdirs;

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

function damas_open( id ) {
	console.log(damas.read(id));
}

function node_pressed(e){
	if(e.shiftKey)
	{
		graph.selectToggle(this);
		e.preventDefault();
		return false;
	}
	if(e.ctrlKey)
	{
		damas_open(this._id);
		e.preventDefault();
		return false;
	}

	// ####
	graph.unselectAll();
	graph.selectToggle(this);
	var div = document.querySelector('#sidepanel');
	if (!div)
	{
		div = document.createElement('div')
		div.setAttribute('id', 'sidepanel' )
	}
	div.innerHTML = '';
	var keys = Object.keys(this)
	keys.sort();
	for (key of keys)
	{
		var attr_html = document.createElement('div')
		if(this[key].length < 25)
			attr_html.innerHTML = '<b>'+key+'</b> '+this[key]
		else
			attr_html.innerHTML = '<b>'+key+'</b><br/>'+this[key]
		//var attr_text = document.createTextNode(key + ' = ' + this[key])
		//attr_html.appendChild(attr_text)
		div.appendChild(attr_html)
	}
	// ####

	if(window['assetOverlay']){
		var newObject = JSON.parse(JSON.stringify(this));
		newObject.file = "/file"+newObject.file;
		assetOverlay(newObject);
		var newHash = getHash();
		newHash.view = this._id;
		doHash(newHash);
	}
}

document.addEventListener("assetOverlay:close", function(){
	var newHash = getHash();
	delete newHash['view'];
	doHash(newHash);
}, false);


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
	if (!window.mouseongraph) return;
	var unicode=e.keyCode? e.keyCode : e.charCode;
	console.log(unicode);
	if(unicode === 46){ // Delete
		// REMOVE SELECTION (from local graph only, this is not a deletion in remote database)
		//for(node in graph.selection)
		//graph.unhighlightElements();
		var selection = graph.selection; //selection array
		for(var i = selection.length -1; i >= 0; i--) //For in reverse because each loop the length change
		{
			var node = selection[i];
			//console.log(node);
			if(node.src_id && node.tgt_id)
			{
				continue;
/*
				(function(node){
					var id = node._id;
					damas.delete_rest(id, function(success){
					if(success){
						graph.removeNode(node);
					}
				});
				})(node);
*/
			}
			else
			{
				graph.removeNode(node);
			}
		}
		doHash({graph:Object.keys(graph.node_lut).join(',')});
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
			window.location = window.location.pathname;
			//graph.erase();
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
			var keys = prompt('keys', '{"_id":"{#}"}');
			var obj = JSON.parse(keys);
			obj.src_id = id1;
			obj.tgt_id = id2;
			damas.create_rest( obj, function(node){
					if(!node) {
						console.log("create link failed! ");
					}
					else {
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
	if(unicode === 114){ // r
		// RESUME ANIMATION
		if(graph.force)
			graph.force.resume();
		return;
	}
	if(unicode === 115){ // s
		// STOP ANIMATION
		if(graph.force)
			graph.force.stop();
		return;
	}
	if(unicode === 116){ // t
		//TOGGLE TEXTS
		graph.svg.querySelector('g.texts').classList.toggle('hidden');
		return;
	}
	if(unicode === 117){ // u
		// UNLINK - DELETE SELECTED LINKS FROM THE DB
		var selection = graph.selection; //selection array
		for(var i = selection.length -1; i >= 0; i--) //For in reverse because each loop the length change
		{
			var node = selection[i];
			console.log(node);
			if(node.src_id && node.tgt_id)
			{
				(function(node){
					var id = node._id;
					damas.delete_rest(id, function(success){
					if(success){
						graph.removeNode(node);
					}
				});
				})(node);
			}
		}
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
		var wds="Default Workdirs: \r\n"+(JSON.stringify(confWorkdir)).replace(/,/g,'\r\n')+"\r\nUser Workdirs:\r\n";
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
			keys[e.dataTransfer.types[i]] = e.dataTransfer.getData(e.dataTransfer.types[i]);
		}
		console.log(keys);
	}
	// END DEBUG

	var path;
	if (keys['text/x-moz-url'])
		path = keys['text/x-moz-url'];
	if (keys['text/plain'])
		path = keys['text/plain'].trim();

	console.log(path);
	if(!path)
	{
		alert('Could not determine the path for the file ' + e.dataTransfer.files[0].name +': Drop aborted' );
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
			return;
		}
	}

	var newPath= processPath(path);
	console.log(newPath);

	if(!newPath){
		newPath=path;
		var newWd=prompt("This file doesn't appear to be held in a defined local work directory, thus we cannot extract a relative path from its absolute path:\n"+path+"\nYou can set a workdir now:",path.replace(/\/[^\/]*$/,""));
		if(newWd){
			addWorkdirs(newWd);
			newPath= path.replace(new RegExp("^"+newWd+"/?"), '');
		}
		else
		{
			return;
		}
	}
	if(newPath.indexOf("/")!=0)
		newPath= "/"+newPath;

	//sha1sum(e.dataTransfer.files[0]);

	damas.search_rest('file:'+newPath, function(res){
		if(res.length>0)
		{
			//window.document.location.hash = 'graph='+res[0];
			//damas.get_rest( 'graph/'+res[0], function(res){
			var newHash = getHash();
			if(!newHash.graph) newHash.graph = res[0];
			else newHash.graph += ',' + res[0];
			doHash(newHash);
			damas.graph( res[0], function(res){
				graph.load(res);
				//graph.load( JSON.parse( res ));
			});
/* UPLOAD
			if( confirm('Update ' + decodeURIComponent(newPath) + '?'))
			{
				upload_rest(e.dataTransfer.files[0],newPath, res[0], function(node){
				});
			}
*/
		}
		else
		{
			if( confirm('Register ' + decodeURIComponent(newPath) + '?'))
			{
				damas.create({file: decodeURIComponent(newPath)}, function(res){ console.log(res); });
			}
/* UPLOAD
			if( newPath = prompt('Publish as', newPath))
			{
				upload_rest(e.dataTransfer.files[0],newPath, null, function(node){
					graph.newNode(node);
				});
			}
*/
		}
	});
	return;
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

function processPath(path){
	var workdir=confWorkdir.concat(JSON.parse(localStorage["workdirs"]));
	var tempWd=null;
	workdir.sort(function(a, b){
		return b.length - a.length;
	});
	for(var w=0;w<workdir.length;w++){
		if(workdir[w][workdir[w].length-1]==="/")
			tempWd = workdir[w].substring(0, workdir[w].length -1);
		else
			tempWd= workdir[w];
		//else
			//tempWd= workdir[w]+"/";
		if(path.indexOf(tempWd)===0)
			return path.replace(tempWd,"");
	}
	return null;
}

function loadConfJSON() {
	var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
	xobj.open('GET', 'config.json', false);
	xobj.send(null);
	return xobj.responseText;
}

upload_rest = function ( file, path, id, callback )
{
  var req = new XMLHttpRequest();
  var fd= new FormData();
  fd.append('path',path);
  fd.append('id',id);
  fd.append('file', file);
  if(!document.getElementById('upload_div')){
    var upload_div = document.createElement( 'div' );
    var progress= document.createElement('progress');
    var speed = document.createElement('span');
    var stats= document.createElement('span');
    var cancel= document.createElement('button');
    var exit= document.createElement('button');
    upload_div.appendChild(speed);
    upload_div.appendChild(stats);
    upload_div.appendChild(progress);
    upload_div.appendChild(cancel);
    upload_div.appendChild(exit);
    upload_div.setAttribute("id","upload_div");
    speed.setAttribute("id","speed");
    progress.setAttribute("id",'progressBar');
    stats.setAttribute("id",'stats');
    exit.setAttribute("id",'exit');
    cancel.setAttribute("id",'cancel');
    cancel.innerHTML="Cancel";
    exit.innerHTML="X";

    exit.addEventListener("click",function(e){
      upload_div.remove();
    });
    document.getElementById('graph').appendChild(upload_div);
  }
  else {
    var cancel= document.getElementById('cancel');
    var progress=document.getElementById('progressBar');
    var speed= document.getElementById('speed');
    var stats= document.getElementById('stats');
  }
  var d = new Date();
  var starttime = oldtime = d.getTime();
  progress.value=0;
  /*req.upload.addEventListener("progress",progressHandler, false);
  req.addEventListener("load", completeHandler, false);*/
  if(id)
    req.open("PUT", "/upload", callback !== undefined);
  else
    req.open("POST", "/upload", callback !== undefined);
  cancel.addEventListener("click",function(e){
    if(req.readyState<4){
      req.abort();
      req=null;
      speed.innerHTML="---";
      stats.innerHTML="Aborted";
    }
  });
  req.upload.onprogress = function(e) {
    progress.max=e.total;
    var delta_size = e.loaded - progress.value;
    var d = new Date();
    var delta_time = d.getTime() - oldtime;
    oldtime = d.getTime();
    var tempSpeed=(( delta_size * 1000 / delta_time )) * 100;
    speed.innerHTML=human_size((tempSpeed) / 100) +'/s';
    progress.value = e.loaded;
    stats.innerHTML = e.loaded + ' / ' + e.total + ' (' + Math.ceil( e.loaded * 100 / e.total ) + '%)';
  };
  req.onreadystatechange = function(e){
    if(req.readyState == 4)
    {
      if(req.status == 201)
      {
        var d = new Date();
        var delta_time = d.getTime() - starttime;
        speed.innerHTML= human_size( progress.max * 1000 / delta_time ) + '/s' ;
        //setTimeout("500",function({upload_div.remove();}));
        callback(JSON.parse(req.responseText));
      }
    }
  }
  req.send(fd);
}

human_size = function ( filesize )
{
        var t = typeof filesize;
        if( !( t === 'number' || t === 'string') )
                return "?";
        if (filesize>1024*1024*1024*1024)
                return (filesize/1024/1024/1024/1024).toFixed(2) + " TiB";
        if (filesize>1024*1024*1024)
                return (filesize/1024/1024/1024).toFixed(2) + " GiB";
        if (filesize>1024*1024)
                return (filesize/1024/1024).toFixed(2) + " MiB";
        if (filesize>1024)
                return (filesize/1024).toFixed(2) + " KiB";
        return filesize + " Bytes";
}
