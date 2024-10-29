import ShMaps	from '../shared/Maps/Maps.js'
import Ground	from './Ground.js'
import Trees	from './Trees.js'




export default class M extends ShMaps({ Ground, Trees })
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
	code	??=Ground.getcode( buf )

	switch( code )
	{
		case 1 :
		case 2 :

			this.gr.setbuf( buf, code )
		break
		case 3 :

			this.tr.setbuf( buf, code )
	}

}


///////////////////////////////////////////////////////////////////////////////



M.prototype. shift	=function( arrs, cellso, dir )
{
	// code	??=Ground.getcode(bufs)>>8

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