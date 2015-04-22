
require(['damas'], function(damas){


window.damas_open = function ( id ){
	damas.utils.command_a( {cmd: 'links', id: id}, function(res){
		//damas.utils.command_a({cmd: 'read', id: res.text}, function(res2){

		//alert(res);
		var newnodes = JSON.parse(res.text);
		console.log(newnodes);
		
		for( node of newnodes)
		{
			//console.log(node);
			springy_graph.nodes[node.id] = springy_graph.newNode(node);
		}

		damas.utils.command_a({cmd:'links2', id: springy_damas.graph_all_nodes.join(',')}, function(r){
			var json = JSON.parse(r.text);
			$A(json).each(function(n){
				springy_graph.newEdge( nodes[n[1]], nodes[n[2]]);
			});
		});



		//});
	});
}

});
