import Ground	from './Ground.js'
import Trees	from './Trees.js'




export default class M
{
	cl

	ground	=new Ground(this)

	gr	=this.ground

	trees	=new Trees(this)

	tr	=this.trees



	constructor( cl )
	{
		this.cl	=cl
	}
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. ready	=function()
{
	return this.gr.ready() && this.tr.ready()
}




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




M.prototype. fore	=function( fun )
{
	fun( this.gr )
	fun( this.tr )
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