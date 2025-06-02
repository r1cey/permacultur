import Loc	from "../Loc.js"


///////////////////////////////////////////////////////////////////////////////

/** bmapa	-Bitmap array for values.
 * MUST have the total number of bits divisible by 8.
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

		static bmap	=build_bmap( prep_bmapa( bmapa) )
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

	arrs	=[]

	/**Number of cells.*/
	get cellsl()	{return this.arrs[0].length }

	
	/** Defined in derived class.
	@static
	@var bmap */

	////----
}


///////////////////////////////////////////////////////////////////////////////


Bin. getcode	=function( buf )
{
	return new DataView( buf )["getUint"+this._structarr[0][1]](0, true)
}

Bin. getid	=function( buf )
{
	return new DataView( buf )["getUint"+this._structarr[1][1]](0, true)
}


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

	this.cellsl	=clen

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
	var bitoffs	=this.getcellsoffs( ic, bmapv.offset )

	// reminder that bitlen can't be more than 24 bits

	var byteoffs	=bitoffs >> 3

	try
	{
		var data	=this.dvs.cells.getUint32( byteoffs ,true)
	}
	catch(err)
	{
		console.error("bin.setval ERROR!! Must check it out")
	}

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

	try
	{
		var data	=this.dvs.cells.getUint32( byteoffs, true)
	}
	catch(err)
	{
		console.error("bin.getval ERROR!! Must check it out.")
	}

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
	var byteoffs	=this.getcellsoffs( ic ) >> 3

	for(var val of valarr )
	{
		this.dvs.cells.setUint8( byteoffs, val )

		byteoffs	++
	}
}


/** Get binary value of a cell.
 * @return {array} - The binary value broken down in byte intervals */

Bin.prototype. getcell	=function( ic )
{
	var C	=this.constructor

	var vals	=[]
	
	var byteoffs	=this.getcellsoffs( ic ) >> 3

	for(var max= byteoffs+C.bpc ; byteoffs < max ; byteoffs ++ )
	{
		var byte	=this.dvs.cells.getUint8( byteoffs )

		vals.push( byte )
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
 * @return changed bmap array split into typedarray arrays */

function prep_bmapa( bmapao, offset=0 )
{
	var bmapflat	=[]

	flat( bmapao, bmapflat )

	var bmapabins	=fit_in_bins( bmapflat, [8,16,32])

	"2"
	

	function flat( bmapao, bmapflat, pref ="" )
	{
		var bits	=0

		for(var val of bmapao )
		{
			if( val.subd )
			{
				bits	+= flat( val.subd, bmapflat, val.name+"_" )
			}
			else if( val.condsubd )
			{
				var o	={
					name	:bmapflat[bmapflat.length-1].name ,
					condsubd	:{},
					bits	:0
				}

				var size, maxsize	=0

				for(var cond in val.condsubd )
				{
					o.condsubd[cond]	=[]

					size	=flat( val.condsubd[cond], o.condsubd[cond], o.name+"_"+cond+"_" )

					if( size > maxsize )	maxsize	=size
				}

				o.bits	=maxsize

				bmapflat.push( o )
			}
			else
			{
				bmapflat.push( {
					name	:pref+val.name ,
					bits	:val.bits ,
					valsa	:val.valsa ,
					valso	:valslookup( val.valsa )
				} )

				bits	+= val.bits
			}
		}

		return bits
	}


	/**@return -{ size , vals :[] }[] */
	function fit_in_bins( vals, binlens )
	{
		vals.sort(( a, b )=> b.bits-a.bits )

		binlens.sort(( a, b )=> a - b )

		var	bins	=[]	// bin=

		for(var val of vals )
		{
			var bestbin	=null

			var mingap	=binlens.at(-1)

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
				for(var binlen of binlens )
				{
					if( val.bits <= binlen )
					{
						bins.push({ size :binlen, vals :[ val ] })

						break
					}
				}
			}
		}

		return bins
	}


	function valslookup( valsa )
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



/*
	var arrs	=[]

	var starta	=[]

	const MAX	=22

	var enda	=[]

	var starti	=0

	debugger

	do
	{
		var arr	=[]

		slice( bmapa, starta, 0, arr, MAX )

		arrs.push(arr)
	}
	while( starta[0] !== 0 )

	console.log(1)



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
	


	for(var prop of arr )
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


	function split( arrout, arrin )
	{

	}*/
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

	this.dvs.cells	=new DataView( buf, start >> 3)
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