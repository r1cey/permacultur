import ShMaps	from '../shared/maps/Maps.js'
import Map	from '../shared/maps/Map.js'
import Trees	from './Trees.js'
import Ground	from './Ground.js'




export default class M extends ShMaps
{
	cl


	constructor( cl )
	{
		super()

		this.ground	=new Ground()

		this.trees	=new Trees()
		
		this.cl	=cl
	}
}


///////////////////////////////////////////////////////////////////////////////

/*
M.prototype. onbuf	=function( buf )
{
	var id	=Map.codefrombuf( buf )

	var idmove	=id>>8		// when player moves, buffer id is received with offset

	if( idmove )
	{
		this.forbufid( idmove ,( map, ibuf )=>
		{
			map.shift( Loc.dirv2dirh(Loc.V.seta(o.delta)))
		})
	}
	else
	{
		this.forbufid( id, (map, ibuf)=>
		{
			map.setbuf( buf, ibuf )
		})
	}
}
*/




///////////////////////////////////////////////////////////////////////////////


/*
M.prototype. setbuf	=function( buf, code )
{
	code	??=Ground.codefrombuf( buf )

	var{ map, ibuf }	=this.frombid(code)

	map.setbuf( buf, ibuf )
}*/


///////////////////////////////////////////////////////////////////////////////



M.prototype. shift	=function( grbin, grobj, trbin, trobj, dir )
{
	this.gr.shift( dir, new Ground.MapShiftBo( grbin, grobj ) )

	this.tr.shift( dir, new Trees.MapShiftBo( trbin, trobj ) )
}