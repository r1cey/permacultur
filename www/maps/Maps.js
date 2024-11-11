import ShMaps	from '../shared/maps/Maps.js'
import Ground	from './Ground.js'
import Trees	from './Trees.js'




export default class M extends ShMaps( Ground, Trees )
{
	cl




	constructor( cl )
	{
		super()
		
		this.cl	=cl
	}
}


///////////////////////////////////////////////////////////////////////////////




M.prototype. setbuf	=function( buf, code )
{
	code	??=Ground.idfrombuf( buf )

	var{ map, ibuf }	=this.frombid(code)

	map.setbuf( buf, ibuf )
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. shift	=function( arrs, cellso, dir )
{
	// code	??=Ground.idfrombuf(bufs)>>8

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