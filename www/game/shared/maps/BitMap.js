import Loc from "../Loc.js"


export default ()=>BitM


class BitM
{
	cellsl	=0

	cells

	getr()	{return this.r }

	r

	_loc	=new Loc(0,0,0)

	getloc()	{return this._loc}
}


///////////////////////////////////////////////////////////////////////////////



BitM.prototype. newbuf	=function( clen, loc, r )
{
	this.cells	=new Uint32Array( Math.ceil( clen / 32 ))

	this.r	=r

	this.cellsl	=clen
}



BitM.prototype. setval	=function( ic, val )
{
	var i	=ic>>5

	var data	=this.cells[i]

	this.cells[i]	=BitM.sval( data, ic-(i<<5), 1, val )
}


BitM.prototype. getval	=function( ic )
{
	var i	=ic>>5

	return BitM.gval( this.cells[i], ic-(i<<5), 1 )
}


///////////////////////////////////////////////////////////////////////////////



/** Get value out of code from start bit and len bits long */

BitM.gval	=function(code, start, len)
{
	var val	=code >> start

	return val	&= ~((~0)<<len)
}


/** Rewrite value in code. Trunctate the value to length. */

BitM.sval	=function( code, start, len, val )
{
	var mask	=~((~0)<<len)

	mask	=~(mask<<start)

	code	&= mask

	return code	|= BitM.gval(val,0,len) << start
}