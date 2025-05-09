import Loc	from "../Loc.js"



export default class Buf
{
	head

	cells

	get c()	{return this.cells }

	get buf()	{return this.head.buffer }

	static id	//used to recongise buffer when receiving binary data

	static skipid	=false	//when true, skip this buffer when assigning ids
							// used in client maps which add visual buffers

	static headlen	=4*2

	static bpc		//bytes per cell

	static Arr		//Buffer Array class

	static bmap	//[]

	/** Each bmap member is [[number of bits],[numbits,{name:val,name:val}],...] */

	static bmapo	//{ name :index , ... }
}


///////////////////////////////////////////////////////////////////////////////



Buf.prototype. new	=function( cellsl )
{
	var Class	=this.constructor

	var buf	=new ArrayBuffer( cellsl * Class.bpc + Class.headlen )

	this.set( buf, cellsl )

	return this
}



Buf.prototype. set	=function( buf, cellsl )
{
	var Class	=this.constructor

	this.head	=Class.newheadarr( buf )

	this.head[0]	=Class.id

	this.cells	=new Class.Arr( buf, Class.headlen, cellsl )

	return this
}


///////////////////////////////////////////////////////////////////////////////


/** @arg ibmp	- Can be number or string
 * @arg val	- can be number of string
*/

Buf.prototype. setprop		=function( ic, ibmp, jbmp, val )
{
	var Class	=this.constructor

	if( typeof ibmp === "string" )	ibmp	=Class.bmapo[ibmp]

	if( typeof val === "string" )	val	=Class.bmap[ibmp][jbmp][1][val]

	var start	=this.getstartbit( ibmp, jbmp )

	this.cells[ic] =Buf.smask( this.cells[ic], start, Class.bmap[ibmp][jbmp][0], val )

	/*
	// var mask	=~((~0)<< Con.bmaps[ia][ibmp][jbmp] )

	var mask	=(1 << Con.bmap[ibmp][jbmp]) - 1	//00000111

	mask	=~(mask<< start )	//00011100 -> 11100011

	c	&= mask

	c	|= val << start

	//Map.mask(val,0,len) << start

	this.cells[ic]	=c
	*/
}


/** @arg ibmp	- Can be number or string */

Buf.prototype. getprop	=function( ic, ibmp, jbmp )
{
	var Class	=this.constructor

	if( typeof ibmp === "string" )	ibmp	=Class.bmapo[ibmp]
	
	return Buf.gmask( this.cells[ic], this.getstartbit( ibmp, jbmp ), Class.bmap[ibmp][jbmp][0] )
}

Buf.prototype. gprop	=Buf.prototype. getprop



Buf.prototype. testprop	=function( ic, ibmp, jbmp, valname )
{
	var Class	=this.constructor

	if( typeof ibmp === "string" )	ibmp	=Class.bmapo[ibmp]

	return this.getprop( ic, ibmp, jbmp ) === Class.bmap[ibmp][jbmp][1][valname]
}


///////////////////////////////////////////////////////////////////////////////


Buf.prototype. getstartbit	=function( ibmap, jbmap )
{
	var bmap	=this.constructor.bmap

	var start	=0

	for(var i=0; i<=ibmap; i++)
	{
		for(var j=0, jlen=bmap[i].length; j<jlen; j++)
		{
			if( i===ibmap && j===jbmap )
			{
				return start
			}

			start	+=bmap[i][j][0]
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



Buf.gmask	=function(code, start, len)
{
	var val	=code >> start

	return val	&= ~((~0)<<len)
}




Buf.smask	=function( code, start, len, val )
{
	var mask	=~((~0)<<len)

	mask	=~(mask<<start)

	code	&= mask

	return code	|= Buf.gmask(val,0,len) << start
}




Buf.newheadarr	=function( buf )
{
	return new Int16Array( buf, 0, this.headlen>>1 )
}




Buf. diredgesize	=function( r )
{
	var Buf	=this

	return Buf.headlen + Buf.Arr.BYTES_PER_ELEMENT * Loc.diredgesize(r)
}