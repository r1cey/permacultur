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

		return Bin.prototype.newbuf. call(this, c , loc, r )
	}


	/** @ret cellsl */

	BM.prototype. setbuf	=function( buf )
	{
		var C	=this.constructor

		Bin.prototype.setbuf. call(this, buf )

		if( this.cellsl !== C.r2cells( this.getr()) ) throw new Error()

		return this.cellsl
	}


	///////////////////////////////////////////////////////////////////////////



	BM.prototype. ic	=function( loc )
	{
		let r	=this.getr()

		let rsize	=r*(r+1)

		var v	=this.getloc().neg().addv(loc)

		return (v.x>=0 && v.y<0) * (v.x*r - v.y) +
			(v.y>=0 && v.z()<0) * (rsize + v.y*r - v.z()) +
			(v.z()>=0 && v.x<0) * (rsize*2 + v.z()*r - v.x);
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