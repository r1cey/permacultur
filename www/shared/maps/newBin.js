import Loc	from "../Loc.js"


///////////////////////////////////////////////////////////////////////////////

/** bmapa	-Bitmap array for values. No value must take more than 24 bits!
	 * name	-used for looking up
	 * bits -bit length of this value.
	 * valsa	-array of named values
	 * subd	-subdivision
	 * condsubd	-conditional subdivision based on value of previous section.
	 * 		Make sure total bits counts match.
	 * 		Each subdivision must be an array.
	 * valso	-automatically created reverse lookup of named values
	 * offset	-automatically calculated bit offset from the beginning */

export default function( id, bmapa, structadd )
{
	class C extends Bin
	{
		static id	=id

		static bpc	=prep_bmapa( bmapa )

		static bmap	=build_bmap( bmapa )
	}

	if( structadd )	C._structarr	=Bin._structarr.concat( structadd )

	C.build_structo()

	return C
}


///////////////////////////////////////////////////////////////////////////////


/** Collection of cells stored in a binary buffer.
 * Basic class divides the data like this:
 * [ code, id, r, loc, cells ]
 * code	-Defines the type of data inside the binary data.
	 * 1 - BinMap
	 * 2 - BinMapShift 
 * id	-Map type identifier.
 * r	-Radius
 * loc	-3 values for location
 * cells	-The actual cell data. */

class Bin
{
	/**Defined in derived class.
	@static
	@var code */

	/**Code for how the cell data is structured.
	 * Defined in derived class.
	@static
	@var id */

	/** Bytes per cell.
	 * Defined in derived class.
	@static
	@var bpc */

	////----

	/** DataViews */
	dvs	={ cells :null }

	/**Second value must be valid bits number for DataVew get and set functions. */
	static _structarr	=
		[ ["code",16],["id",16],["r",16],["loc",16] ]

	/** Reverse lookup for data structure values */
	static _structo	={ }

	/**Number of cells. If cell is less than 8 bits long,
	 * automatic calculation from buffer will not work properly*/
	// cellsl	=0

	
	/** Defined in derived class.
	@static
	@var bmap */

	////----

	/** tricky buffer, ONLY access it through
	 * getloc() because it can be changed to anything */	
	_loc	=new Loc()
}


///////////////////////////////////////////////////////////////////////////////


/** @ret {ArrayBuffer} */

Bin.prototype. newbuf	=function( clen, r, loc =new Loc(0,0,0) )
{
	var Bin	=this.constructor

	var buf	=new ArrayBuffer( clen * Bin.bpc + Bin.headlen() )

	this.setdataviews( buf )

	this.set("code", Bin.code)
	this.set("id", Bin.id )
	this.set("r", r )
	this.setloc( loc )

	return buf
}


/** @arg {ArrayBuffer} buf
 * @ret {Bin} */

Bin.prototype. setbuf	=function( buf )
{
	var C	=this.constructor

	this.setdataviews( buf )

	return this
}


///////////////////////////////////////////////////////////////////////////////



Bin.prototype. get	=function( dataname )
{
	var C	=this.constructor

	return this.dvs[dataname]["getUint"+C._structo[dataname]]( 0,true)
}


Bin.prototype. set	=function( dataname, val )
{
	var C	=this.constructor

	this.dvs[dataname]["setUint"+C._structo[dataname]]( 0, val ,true)
}



Bin.prototype. setloc	=function( loc )
{
	var C	=this.constructor

	var loclen	=C._structo.loc

	var set	=this.dvs.loc["setInt"+loclen]. bind(this.dvs.loc)

	set( 0, loc.h ,true)
	set( loclen >> 3 , loc.x ,true)
	set( loclen >> 2 , loc.y ,true)
}


/** Location object returned can change later. Don't reuse it outside of class.
 * Designed like this just to save on garbage collection */

Bin.prototype. getloc	=function()
{
	var C	=this.constructor

	var loclen	=C._structo.loc

	var get	=this.dvs.loc["getInt"+loclen]. bind(this.dvs.loc)

	return this._loc.setxy( get( loclen>>3 ,true), get( loclen>>2 ,true), get(0 ,true) )
}




Bin.prototype. setval_str	=function( ic, bmapv, valstr )
{
	this.setval( ic, bmapv, bmapv.valso[valstr] )
}


/** Similar to getval  */

Bin.prototype. setval	=function( ic, bmapv, val )
{
	var bitoffs	=this.getcellsoffs( ic, bmapv.offset )

	// reminder that bitlen can't be more than 24 bits

	var byteoffs	=bitoffs >> 3

	var data	=this.dvs.cells.getUint32( byteoffs ,true)

	if( typeof val === "string" )
	{
		throw new Error("find where the mistake is. Not supposed to be string")
	}

	this.dvs.cells.setUint32( byteoffs, Bin.sval( data, bitoffs - (byteoffs<<3), bmapv.bits, val ), true)
}


/** Get binary value.
 * Doesn't check if subdivision choice matches the written value in the buffer.
 * Use separate method for that. */

Bin.prototype. getval	=function( ic, bmapv )
{
	var bitoffs	=this.getcellsoffs( ic, bmapv.offset )

	// reminder that bitlen can't be more than 24 bits

	var byteoffs	=bitoffs >> 3

	var data	=this.dvs.cells.getUint32( byteoffs, true)

	return Bin.gval( data, bitoffs - (byteoffs<<3), bmapv.bits )
}

Bin.prototype. gval	=Bin.prototype. getval



Bin.prototype. getval_str	=function( ic, bmapv )
{
	var val	=this.getval( ic, bmapv )

	return bmapv.valsa[val]
}

Bin.prototype. gvaln	=Bin.prototype. getval_str


/** Get maximum value that can be stored in bin map */

Bin. getmaxval	=function( bmapv )
{
	return ( 1 << bmapv.bits ) - 1
}



Bin.prototype. getbuf	=function()
{
	return this.dvs.cells?.buffer
}



Bin.prototype. setcell	=function( ic, valarr )
{
	var C	=this.constructor

	var bpc	=C.bpc

	var bitoffs	=this.getcellsoffs( ic )

	var end	=bitoffs + bpc

	var byteoffs	=bitoffs >> 3

	var relbitoffs	=bitoffs - (byteoffs<<3)

	for(var val of valarr )
	{
		var dword	=this.dvs.cells.getUint32( byteoffs, true)

		var readend	=(byteoffs<<3) + relbitoffs + 16

		var len	=end < readend	? 16 - readend + end	: 16

		val	=C.sval( dword, relbitoffs, len, val )

		this.dvs.cells.setUint32( byteoffs, val ,true)

		byteoffs	+= 2
	}
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
		var dword	=this.dvs.cells.getUint32( byteoffs ,true)

		var readend	=(byteoffs<<3) + relbitoffs + 16

		vals.push( C.gval( dword, relbitoffs, readend < max ? 16 : 16 - readend + max ) )
	}

	return vals
}


///////////////////////////////////////////////////////////////////////////////


/** Get bmap entry.
 * @arg {string[]} names 
 * @return {object} *

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
}*/


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


/** Call it to make sure that all bmap data is filled properly and calculate bpc.
 * Recursive function; is called on certain inner arrays too.
 * @arg [offset=0]	-Don't use when calling manually. Needed for recursion.
 * @return the total number of bits in arr */

function prep_bmapa( arr, offset=0 )
{
	var bits	=0

	for(var prop of arr )
	{
		prop.offset	=offset

		//calculate prop.bits
		{
			if( prop.subd )
			{
				prop.bits	=prep_bmapa( prop.subd, offset )
			}
			else if( prop.condsubd )
			{
				for(var cond in prop.condsubd )
				{
					prop.bits	=prep_bmapa( prop.condsubd[cond], offset )
				}
			}
		}

		if( prop.valsa )	//create valso
		{
			prop.valso	={}

			for(var iv =0,lenv= prop.valsa.length ;iv<lenv;iv++)
			{
				if(typeof prop.valsa[iv] == "string" )
				{
					prop.valso[prop.valsa[iv]]	=iv
				}
			}
		}

		bits	+= prop.bits

		offset	+= prop.bits
	}

	return bits
}



function build_bmap( bmapa )
{
	var bmap	={}

	for(var prop of bmapa )
	{
		if( prop.subd )	bmap[prop.name]	=build_bmap( prop.subd )
		
		else if( prop.condsubd )
		{
			for(var cond in prop.condsubd )
			{
				bmap[cond]	=build_bmap( prop.condsubd[cond] )
			}
		}
		else
		{
			bmap[prop.name]	=
			{
				offset	:prop.offset
				,
				bits	:prop.bits
				,
				valsa	:prop.valsa
				,
				valso	:prop.valso
			}
		}
	}

	return bmap
}



Bin. build_structo	=function()
{
	var C	=this

	for(var val of C._structarr )
	{
		C._structo[val[0]]	=val[1]
	}
}



Bin.prototype. setdataviews	=function( buf )
{
	var C	=this.constructor

	var start	=0

	for(var dvvals of C._structarr )
	{
		var name	=dvvals[0]

		var len	=dvvals[1] + (name==="loc")*(dvvals[1]<<1)

		this.dvs[name]	=new DataView( buf, start>>3, len>>3 )

		start	+= len
	}

	this.dvs.cells	=new DataView( buf, start )
}



Bin. headlen	=function()
{
	var len	=0

	for(var val of this._structarr )
	{
		len	+= val[1] + (val[0]==="loc")*(val[1]<<1)
	}
	return len >> 3
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