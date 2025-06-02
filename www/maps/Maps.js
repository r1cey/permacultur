import ShMaps	from '../shared/maps/Maps.js'
import Map	from '../shared/maps/Map.js'
import Trees	from './Trees.js'
import Ground	from './Ground.js'




export default class M extends ShMaps
{
	cl




	constructor( cl )
	{
		super(new Ground() ,new Trees())
		
		this.cl	=cl
	}
}


///////////////////////////////////////////////////////////////////////////////


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



///////////////////////////////////////////////////////////////////////////////



M.prototype. setbuf	=function( buf, code )
{
	code	??=Ground.codefrombuf( buf )

	var{ map, ibuf }	=this.frombid(code)

	map.setbuf( buf, ibuf )
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. shift	=function( arrs, cellso, dir )
{
	// code	??=Ground.codefrombuf(bufs)>>8

	this.fore(( map )=>
	{
		var h	=map.getloc().h

		map.shift( dir, arrs[h], cellso[h], ( o )=>
		{
			for( p in o )
			{
				switch( p )
				{
					case 'pl' :
	
						o[p]	=new Pl.Vis( o[p], this.cl )
				}
			}
	
			return o
		})
	})
}