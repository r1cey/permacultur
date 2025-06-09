import Loc	from "../Loc.js"


///////////////////////////////////////////////////////////////////////////////

/** bmapa	-Bitmap array for values.
 * Each value will have these properties.
	 * name	-used for looking up
	 * bits -bit length of this value.
	 * valsa	-array of named values
	 * subd	-subdivision
	 * condsubd	-conditional subdivision based on value of previous section.
	 * 		Each subdivision must be an array.
	 * bin_i	-index of the array where the value is stored
	 * valso	-automatically created reverse lookup of named values
	 * offset	-automatically calculated bit offset from the beginning
	 * path	-used for intermediary building */

export default function( id, bmapa, structadd )
{
	class C extends Bin
	{
		static id	=id

		static bmapbins	=build_bmapbins( bmapa)

		static bmap	=build_bmap( this.bmapbins )
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
	
	/** Defined in derived class.
	@static
	@var bmap */

	/**Number of cells.*/
	cellsl	=0

	////----

	/** DataViews */
	dvs	={}

	/** Structure of the header element of binary data.
	 * Code value has to come first. Id value has to come second.
	 * {vals} = [ name , valid bits number for DataVew get and set functions ]
	 * @type {vals[]} */
	static _structarr	=
		[ ["code",16],["id",16],["r",16],["loc",16] ]

	/** Reverse lookup for data structure values */
	static _structo	={ }

	arrs	=[[]]

	/** Defined in derived class
	@static
	@var {BitmapBin[]} bmapbins */
	////----
}


///////////////////////////////////////////////////////////////////////////////


Bin. getcode	=function( buf )
{
	return new DataView( buf )["getUint"+this._structarr[0][1]](0, true)
}

Bin. getid	=function( buf )
{
	return new DataView( buf, this._structarr[0][1]>>3 )["getUint"+this._structarr[1][1]](0, true)
}


/** @ret {ArrayBuffer} */

Bin.prototype. newbuf	=function( clen, r, loc =new Loc(0,0,0) )
{
	var C	=this.constructor

	var buf	=new ArrayBuffer( C.headlen() + clen * C.bpc() )

	Bin.prototype.setbuf. call(this, buf, clen )

	this.set("code", C.code)
	this.set("id", C.id )
	this.set("r", r )
	this.setloc( loc )

	return buf
}


/** @arg {ArrayBuffer} buf
 * @arg [clen]
 * @ret {Bin} */

Bin.prototype. setbuf	=function( buf, clen )
{
	var Bin	=this.constructor

	this.setdataviews( buf )

	clen	??=Bin.getlen( buf )

	var offset	=Bin.headlen()

	for(var i =0, len =Bin.bmapbins.length ;i<len;i++)
	{
		var bmbin	=Bin.bmapbins[i]

		this.arrs[i]	=new globalThis["Uint"+bmbin.size+"Array"]( buf, offset, clen )

		offset	+= clen * ( bmbin.size >> 3 )
	}

	this.cellsl	=clen

	return this
}



Bin.prototype. getbuf	=function()
{
	return this.dvs.code?.buffer
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


/** @arg loc -provided loc instance to save into */

Bin.prototype. getloc	=function( loc )
{
	var C	=this.constructor

	var loclen	=C._structo.loc

	var get	=this.dvs.loc["getInt"+loclen]. bind(this.dvs.loc)

	return loc.setxy( get( loclen>>3 ,true), get( loclen>>2 ,true), get(0 ,true) )
}




Bin.prototype. setval_str	=function( ic, bmapv, valstr )
{
	this.setval( ic, bmapv, bmapv.valso[valstr] )
}


/** Similar to getval  */

Bin.prototype. setval	=function( ic, bmapv, val )
{
	var data	=this.arrs[bmapv.bin_i][ic]

	this.arrs[bmapv.bin_i][ic]	=Bin.sval( data, bmapv.offset, bmapv.bits, val )
}


/** Get binary value.
 * Doesn't check if cond subdivision choice matches the written value in the buffer.
 * Use separate method for that. */

Bin.prototype. getval	=function( ic, bmapv )
{
	return Bin.gval( this.arrs[bmapv.bin_i][ic], bmapv.offset, bmapv.bits )
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


/** AFTER RELEASE, GET RID OF TO MAKE FASTER 
 * this.arrs and valarr must have same length */

Bin.prototype. setcell	=function( ic, valarr )
{
	for(var i=0,len= this.arrs.length ;i<len;i++)
	{
		this.arrs[i][ic]	=valarr[i]
	}
}


/** Get binary value of a cell.
 * AFTER RELEASE, GET RID OF TO MAKE FASTER
 * @return {array} - */

Bin.prototype. getcell	=function( ic )
{
	var C	=this.constructor

	var vals	=[]

	for(var cells of this.arrs )
	{
		vals.push( cells[ic] )
	}

	return vals
}


///////////////////////////////////////////////////////////////////////////////



Bin. getlen	=function( buf )
{
	return ( buf.byteLength - this.headlen() ) / this.bpc()
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



Bin. headlen	=function()
{
	var len	=0

	for(var val of this._structarr )
	{
		len	+= val[1] + (val[0]==="loc")*(val[1]<<1)
	}
	return len >> 3
}


/** @return -bytes per cell */

Bin. bpc	=function()
{
	var bpc	=0

	for(var bmbin of this.bmapbins )
	{
		bpc	+= bmbin.size
	}

	return bpc>>3
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


///////////////////////////////////////////////////////////////////////////////


/** Call it to make sure that all bmap data is filled properly and calculate bpc.
 * Recursive function; is called on certain inner arrays too.
 * @arg [offset=0]	-Don't use when calling manually. Needed for recursion.
 * @return changed bmap array split into typedarray arrays */

function build_bmapbins( bmapao )
{
	var bmapflat	=[]

	bmap_flat( bmapao, bmapflat )

	var bmapbins	=fit_in_bins( bmapflat, 32 )

	return bmapbins
}


/** Sets offsets too */

function build_bmap( bmapbins )
{
	var bmap	={}

	for(var i =0, len =bmapbins.length;i<len;i++)
	{
		var bin	=bmapbins[i]

		var offset	=0

		for(var val of bin.vals )
		{
			if( val.condsubd )
			{
				for(var cond in val.condsubd )
				{
					let inval, inoffset	=0

					for(inval of val.condsubd[cond] )
					{
						inval.offset	=offset + inoffset

						build_keys( bmap, inval.path, inval )

						inval.bin_i	=i

						inoffset	+= inval.bits
					}
				}
			}
			else
			{
				val.offset	=offset

				build_keys( bmap, val.path, val )

				val.bin_i	=i
			}

			offset	+= val.bits
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

	this.dvs.cells	=new DataView( buf, start >> 3)
}


///////////////////////////////////////////////////////////////////////////////


/** Recursive function.
 * Also calculates valso !
 * @arg {array} bmapflat	-To add to
 * @return -number of bits */

function bmap_flat( bmapao, bmapflat, pref ="" )
{
	var bits	=0

	for(var val of bmapao )
	{
		if( val.subd )
		{
			bits	+= bmap_flat( val.subd, bmapflat, val.name+"_" )
		}
		else if( val.condsubd )
		{
			val.path	=pref

			let maxsize	=0

			for(let cond in val.condsubd )
			{
				let flat	=[]

				let size	=bmap_flat( val.condsubd[cond], flat, pref+cond+"_" )

				val.condsubd[cond]	=flat

				if( size > maxsize )	maxsize	=size
			}

			val.bits	=maxsize

			bmapflat.push( val )
		}
		else
		{
			val.path	=pref+val.name

			val.valso	=build_valslookup( val.valsa )

			bmapflat.push( val )

			bits	+= val.bits
		}
	}

	return bits
}


/**@return -{ size , vals :[] }[] */

function fit_in_bins( vals, binsize )
{
	vals.sort(( a, b )=> b.bits-a.bits )

	var	bins	=[]

	for(var val of vals )
	{
		var bestbin	=null

		var mingap	=binsize

		for(var bin of bins )
		{
			var bitsused	=bin.vals.reduce(( offset, val )=> offset+val.bits , 0 )

			if( bitsused + val.bits <= bin.size )
			{
				var gap	=bin.size - ( bitsused + val.bits )

				if( gap < mingap )
				{
					mingap	=gap

					bestbin	=bin
				}
			}
		}

		if( bestbin )	bestbin.vals.push( val )

		else
		{
			if( val.bits <= binsize )
			{
				bins.push({ size :binsize, vals :[ val ] })
			}
			else
			{
				return bins	// should be empty
			}
		}
	}

	bins.splice( bins.length-1, 1, split_bin( bins.at(-1), ))

	return bins.flat()
}


/** Put o at path in root object */

function build_keys( root, path, o )
{
	path	=path.split('_')

	var prop	=root

	for(var i =0, len =path.length-1 ;i<len;i++)
	{
		var key	=path[i]

		if( ! prop[key] )
		{
			prop[key]	={}
		}

		prop	=prop[key]
	}

	prop[path[i]]	=o

	return root
}


///////////////////////////////////////////////////////////////////////////////



function build_valslookup( valsa )
{
	if( ! valsa )	return

	var valso	={}

	for(var iv =0,lenv= valsa.length ;iv<lenv;iv++)
	{
		if(typeof valsa[iv] == "string" )
		{
			valso[valsa[iv]]	=iv
		}
	}

	return valso
}



function split_bin( bin )
{
	var max	=bin.size

	var bitsum	=bin.vals.reduce(( offset, val )=> offset+val.bits , 0 )

	var bytes	=1

	for(var top =8 ; top <= max ; top += 8 )
	{
		if( bytes<<3 === top )
		{
			if( bitsum <= top )
			{
				return { size :top, vals :bin.vals }
			}

			bytes	<<= 1
		}
		else if( bitsum <= top )
		{
			var bins	=fit_in_bins( bin.vals, bytes<<2 )//8*bytes/2

			if( ! bins.length )	return bin

			return bins
		}
	}

	return bin
}


/*/*
	function slice( bmapa, starta, offset, arr, MAX, curdepth =0 )
	{
		var bitlen	=offset

		starta[curdepth]	??=0

		for(var i = starta[curdepth] ; i < bmapa.length ; i++ )
		{
			var val	=bmapa[i]

			starta[curdepth]	=i

			if( bmapa[i].subd )
			{
				var arr2	=[]

				bitlen	+= slice( bmapa[i].subd, starta, bitlen, arr2, MAX, curdepth+1 )

				if( arr2.length )
				{
					arr.push({
							name	:bmapa[i].name ,
							subd	:arr2
						})
					
					if( starta[curdepth + 1] )
					{
						return bitlen
					}
				}
				else
				{
					return bitlen
				}
			}
			else if( bmapa[i].condsubd )
			{

			}
			else
			{
				bmapa[i].offset	=bitlen

				bitlen	+= bmapa[i].bits

				if( bitlen <= MAX )
				{
					arr.push( bmapa[i] )
				}
				else
				{
					// starta[curdepth]	=i

					return bitlen
				}
			}
		}

		starta[curdepth]	=0

		return bitlen
	}
*/


/*for(var prop of arr )
	{
		prop.offset	=offset

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
		else	//edge value
		{
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
		}
		bits	+= prop.bits

		offset	+= prop.bits
	}

	return bits
*/