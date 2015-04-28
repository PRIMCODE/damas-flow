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
	svg.ondrop = function(e){
		//alert('COMING SOON :) Drop your assets and connect them, in this web page');
		//alert( e.dataTransfer.getData('Text'));
		e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		//return;
		//alert('ondrop');
		console.log(e.dataTransfer);
		console.log(e.dataTransfer.files);
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
		console.log(e.dataTransfer.types);
		var types = e.dataTransfer.types;
		if(e.dataTransfer.types)
		{
			var keys = {};
			for(i=0;i<e.dataTransfer.types.length;i++)
			{
				console.log(e.dataTransfer.types[i]);
				keys[e.dataTransfer.types[i]] = e.dataTransfer.getData(e.dataTransfer.types[i]);
			}
			
			graph.newNode({ keys: keys});
			//graph.newNode(keys);
			// DROP EXISTING NODE
/*
			var text = e.dataTransfer.getData('Text');
			if( text.indexOf(window.location.origin) === 0)
			{
				id = text.replace(window.location.origin+window.location.pathname+'#view=', '');
				var elem = damas.read(parseInt(id));
				Object.extend( elem, damas.element_canvas );
				var img = elem.imageURL();
				nodes[elem.id] = graph.newNode( { 'elem':elem, 'label': elem.label(), 'damid': elem.id, 'damimg': img } );
				nodes[elem.id].damelem = elem;
			}
			// DROP LINK
			else
			{
				var elem = damas.create( {
					url: e.dataTransfer.getData('Text')
				});
				nodes[elem.id] = graph.newNode({'label': e.dataTransfer.getData('Text')});
*/
				//graph.newNode({keys:{}, 'label': e.dataTransfer.getData('Text')});
/*
				nodes[elem.id].damelem = elem;
			}
*/
		}
		var data = e.dataTransfer.getData("text");
		console.log(data);
		var data = e.dataTransfer.getData("text/uri-list");
		console.log(data);
		var data = e.dataTransfer.getData("text/html");
		console.log(data);


		
	}
}

