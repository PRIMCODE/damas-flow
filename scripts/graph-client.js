
require(['damas'], function(damas){


window.damas_open = function ( id ){
	damas.utils.command_a( {cmd: 'links', id: id}, function(res){
		//damas.utils.command_a({cmd: 'read', id: res.text}, function(res2){
		//alert(res.text);

		//alert(res);
		var newnodes = JSON.parse(res.text);
		//console.log(newnodes);
		
		//for( node of newnodes)
		for(var i=0;i< newnodes.length; i++)
		{
			var node = newnodes[i];
			//console.log(node);
			//springy_graph.nodes[node.id] = springy_graph.newNode(node);
			damasGraph.newNode(node);
		}

		damas.utils.command_a({cmd:'links2', id: damasGraph.node_indexes.join(',')}, function(r){
			var json = JSON.parse(r.text);
			$A(json).each(function(l){
				//damasGraph.newEdge( damasGraph.node_lut[l[1]], damasGraph.node_lut[l[2]]);
				damasGraph.newEdge( l[1], l[2]);
			});
		});



		//});
	});
}

});
