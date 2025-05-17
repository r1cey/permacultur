import Loc	from "../Loc.js"


///////////////////////////////////////////////////////////////////////////////



export default ( id, bmap )=>	class extends Bin
{
	static id	=id

	static bmap	=bmap

	static bpc	=prepbmap( bmap )
}


///////////////////////////////////////////////////////////////////////////////


/** Collection of cells stored in a binary buffer. */

class Bin
{
	/** Code for how the cell data is structured. */
	static id

	getcode()	{return this.codedv["getUint"+Bin.codelen]( 0,true)}

	static codelen	=32

	/** Location object returned can change later. Don't reuse it outside of class.
	 * Designed like this just to save on garbage collection */
	getloc()	{return this._loc.setxy( this.locdv.getInt16(2, true),
			this.locdv.getInt16(4, true), this.locdv.getInt16(0, true) ) }

	static loclen	=16

	/** Cells length */
	cellsl	=0

	////----

	/** Bitmap for values. No value must take more than 24 bits!
	 * name	-used for looking up
	 * bits -bit length of this value.
	 * 		If omitted is calculated automatically from inner subd values.
	 * vals	-array of named values
	 * subd	-subdivision
	 * condsubd	-conditional subdivision based on value of previous section.
	 * 		Make sure total bits counts match.
	 * 		Each subdivision must be an array.
	 * enum	-automatically created reverse lookup of named values
	 * offset	-automatically created bit offset from the beginning */
	static bmap

	/** Bytes per cell. */
	static bpc

	/** @type {DataView} */
	codedv

	/** @type {DataView} */
	locdv

	/** @type {DataView} */
	cellsdv

	////----

	/** tricky buffer, ONLY access it through
	 * getloc() because it can be changed to anything */	
	_loc	=new Loc()
}


///////////////////////////////////////////////////////////////////////////////



Bin.prototype. newbuf	=function( c )
{
	var Class	=this.constructor

	var buf	=new ArrayBuffer( c * Class.bpc + Class.headlen() )

	this.setbuf( buf, c )

	return this
}



Bin.prototype. setbuf	=function( buf, c )
{
	var C	=this.constructor

	this.codedv	=new DataView( buf, 0, C.codelen )

	this.locdv	=new DataView( buf, C.codelen, C.loclen * 3 )

	this.cellsdv	=new DataView( buf, C.headlen() )

	this.cellsl	=c

	return this
}


///////////////////////////////////////////////////////////////////////////////


/** Similar to gbval
 * @arg {(number|string)}	val	-When string, it's an enumed valued in bmap
 */

Bin.prototype. setval	=function( ic, names, val )
{
	var C	=this.constructor

	var bmapv	=C.getbmapval( names )

	var bitoffs	=this.getcellsoffs( ic, bmapv.offset )

	// reminder that bitlen can't be more than 24 bits

	var byteoffs	=bitoffs >> 3

	var data	=this.cellsdv.getUint32( byteoffs ,true)

	if( typeof val === "string" )
	{
		val	=bmapv.enum[val]
	}

	this.cellsdv.setUint32( byteoffs, C.setval( data, bitoffs - (byteoffs<<3), bmapv.bits, val ), true)
}


/** Get binary value.
 * Doesn't check if subdivision choice matches the written value in the buffer.
 * Use separate method for that.
 @arg ic	-index of cell
@arg {string[]} names	-includes the name of conditional subdivision for look up  */

Bin.prototype. getval	=function( ic, names )
{
	var C	=this.constructor

	var bmapv	=C.getbmapval( names )

	var bitoffs	=this.getcellsoffs( ic, bmapv.offset )

	// reminder that bitlen can't be more than 24 bits

	var byteoffs	=bitoffs >> 3

	var data	=this.cellsdv.getUint32( byteoffs, true)

	return C.gval( data, bitoffs - (byteoffs<<3), bmapv.bits )
}


/** Get maximum value that can be stored in bin map */

Bin. getmaxval	=function( names )
{
	return ( 1 << this.getbmapval(names).bits ) - 1
}



Bin.prototype. getbuf	=function()
{
	return this.cellsdv.buffer
}


/** Get binary value of a cell.
 * @arg [bitoffs]	-Precise bit offset from the beginning of data can come precalculated.
 * @return {array} - The binary value broken down in 16 bit intervals using little endian */

Bin.prototype. getcell	=function( ic )
{
	var C	=this.constructor

	var bpc	=C.bpc

	var bitoffs	=this.getcellsoffs( ic )

	var vals	=[]
	
	var byteoffs	=bitoffs >> 3

	var relbitoffs	=bitoffs - (byteoffs<<3)

	for(var max= bitoffs+C.bpc ; byteoffs<<3 < max ; byteoffs += 2 )
	{
		var dword	=this.cellsdv.getUint32( byteoffs ,true)

		var readend	=(byteoffs<<3) + relbitoffs + 16

		vals.push( C.getval( dword, relbitoffs, readend < max ? 16 : 16 - readend + max ) )
	}

	return vals
}


///////////////////////////////////////////////////////////////////////////////



Bin. headlen	=function()
{
	return this.codelen + this.loclen * 3
}


/** Get bmap entry.
 * @arg {string[]} names 
 * @return {object} */

Bin. getbmapval	=function( names )
{
	var C	=this

	var bmapv

	var bmapa	=C.bmap

	// for(var inm =0,lenn= names.length ;inm<lenn;inm++)
	for(var name of names )
	{
		for(var bmap of bmapa )
		{
			var condsubd	=bmap.condsubd

			if( name === bmap.name )
			{
				bmapa	=bmap.subd

				bmapv	=bmap

				break
			}
			else if( condsubd )
			{
				var foundin_condsubd	=false

				for(var cond in condsubd )
				{
					if( name === cond )
					{
						bmapa	=condsubd[cond]

						bmapv	=bmap

						foundin_condsubd	=true

						break
					}
				}

				if( foundin_condsubd )
				{
					break
				}
			}
		}
	}

	// if( bmap.name !== name )	throw new Error()	//used for testing

	return bmapv
}


/** Get bit offset from the beginning of cells array
 * @arg [off=0]	-Offset from the beginning of cell */

Bin.prototype. getcellsoffs	=function( ic, off =0 )
{
	return this.constructor.bpc * ic + off
}


///////////////////////////////////////////////////////////////////////////////


/** Get value out of code from start bit and len bits long */

Bin.gval	=function(code, start, len)
{
	var val	=code >> start

	return val	&= ~((~0)<<len)
}


/** Rewrite value in code. Trunctate the value to length. */

Bin.sval	=function( code, start, len, val )
{
	var mask	=~((~0)<<len)

	mask	=~(mask<<start)

	code	&= mask

	return code	|= Bin.gval(val,0,len) << start
}


///////////////////////////////////////////////////////////////////////////////


/** Call it to make sure that all bmap data is filled properly.
 * Recursive function; is called on certain inner arrays too.
 * @arg [offset=0]	-Don't use when calling manually. Needed for recursion.
 * @return the total number of bits in arr */

function prepbmap( arr, offset=0 )
{
	var bits	=0

	for(var prop of arr )
	{
		prop.offset	=offset

		//calculate prop.bits
		{
			if( prop.subd )
			{
				prop.bits	=Bin.prepbmap( prop.subd, offset )
			}
			else if( prop.condsubd )
			{
				for(var cond in prop.condsubd )
				{
					prop.bits	=Bin.prepbmap( prop.condsubd[cond], offset )
				}
			}
		}

		if( prop.vals )	//create enum
		{
			prop.enum	={}

			for(var iv =0,lenv= prop.vals.length ;iv<lenv;iv++)
			{
				if(typeof prop.vals[iv] == "string" )
				{
					prop.enum[prop.vals[iv]]	=iv
				}
			}
		}

		bits	+= prop.bits

		offset	+= prop.bits
	}

	return bits
}

///////////////////////////////////////////////////////////////////////////////

/*
throw Error(666)

Bin.prototype. set	=function( buf, cellsl )
{
	var Class	=this.constructor

	cellsl	??=parseInt( (buf.byteLength - Class.headlen) / Class.bpc )

	this.head	=Class.newheadarr( buf )

	this.head[0]	=Class.id

	this.cells	=new Class.Arr( buf, Class.headlen, cellsl )

	return this
}


///////////////////////////////////////////////////////////////////////////////


/** @arg ibmp	- Can be number or string
 * @arg val	- can be number of string
*

Bin.prototype. setprop		=function( ic, ibmp, jbmp, val )
{
	var Class	=this.constructor

	if( typeof ibmp === "string" )	ibmp	=Class.bmapo[ibmp]

	if( typeof val === "string" )	val	=Class.bmap[ibmp][jbmp][1][val]

	var start	=this.getstartbit( ibmp, jbmp )

	this.cells[ic] =Bin.smask( this.cells[ic], start, Class.bmap[ibmp][jbmp][0], val )

	/*
	// var mask	=~((~0)<< Con.bmaps[ia][ibmp][jbmp] )

	var mask	=(1 << Con.bmap[ibmp][jbmp]) - 1	//00000111

	mask	=~(mask<< start )	//00011100 -> 11100011

	c	&= mask

	c	|= val << start

	//Map.mask(val,0,len) << start

	this.cells[ic]	=c
	
}


/** @arg ibmp	- Can be number or string *

Bin.prototype. getprop	=function( ic, ibmp, jbmp )
{
	var Class	=this.constructor

	if( typeof ibmp === "string" )	ibmp	=Class.bmapo[ibmp]
	
	return Bin.gmask( this.cells[ic], this.getstartbit( ibmp, jbmp ), Class.bmap[ibmp][jbmp][0] )
}

Bin.prototype. gprop	=Bin.prototype. getprop



Bin.prototype. testprop	=function( ic, ibmp, jbmp, valname )
{
	var Class	=this.constructor

	if( typeof ibmp === "string" )	ibmp	=Class.bmapo[ibmp]

	return this.getprop( ic, ibmp, jbmp ) === Class.bmap[ibmp][jbmp][1][valname]
}


///////////////////////////////////////////////////////////////////////////////


Bin.prototype. getstartbit	=function( ibmap, jbmap )
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







Bin.newheadarr	=function( buf )
{
	return new Int16Array( buf, 0, this.headlen>>1 )
}




Bin. diredgesize	=function( r )
{
	var Bin	=this

	return Bin.headlen + Bin.Arr.BYTES_PER_ELEMENT * Loc.diredgesize(r)
}*/