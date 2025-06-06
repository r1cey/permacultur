import newBin	from "./newBin.js"


export default function( id, bmap )
{
	var Bin	=newBin( id, bmap )


	/** Binary representation of a typical round hex map. */

	class BM extends Bin
	{
		static code	=1


		constructor( ...args )
		{
			super()

			if( args[0] instanceof ArrayBuffer )	this.setbuf( ...args )

			else if( args[0] > 0 || args[1] > 0 )	this.newbuf( ...args )
		}
	}


	///////////////////////////////////////////////////////////////////////////



	BM.prototype. newbuf	=function( r=0, maxc=0, loc )
	{
		var C	=this.constructor

		if( maxc>0 )
		{
			let maxr	=C.cells2r(maxc)

			if( !r || maxr<r )
			{
				r	=maxr
			}
		}
		if( ! r )
		{
			console.error('Wrong newbuf')
			
			return
		}

		var c	=C.r2cells( r )

		return Bin.prototype.newbuf. call(this, c , r , loc )
	}


	/** @ret cellsl */

	BM.prototype. setbuf	=function( buf )
	{
		var C	=this.constructor

		Bin.prototype.setbuf. call(this, buf )

		if( this.cellsl !== C.r2cells( this.get("r") ) )	throw new Error()

		return cellsl
	}


	///////////////////////////////////////////////////////////////////////////



	BM.r2cells	=function(r)
	{
		let cells=1

		for(let i=0; i<r; i++)
		{
			cells	+= 6*(i+1)
		}
		return cells
	}

	BM.cells2r	=function(cells)
	{
		let r	=0

		for(let i=6 ; i<=cells ; i+=6*(r+1) )
		{
			r	++
		}
		return r
	}

	
	///////////////////////////////////////////////////////////////////////////


	return BM
}