import Buf from "./Buf,js"


/** @returns Board class */

export default function( bmap )
{
	/**Collection of cells.
	Cell object used properties:
	, pl */

	class Bo
	{
		/** Cells length */
		cellsl	=0

		o	={}

		/** Location array
		 * @type {Int16Array} */
		locarr

		/** Bitmap for values defined in derived classes:
		 * omitted bits-count gets automatically calculated from inner values,
		 * subd	-subdivision
		 * condsubd	-conditional subdivision based on value of previous section.
		 * 		Make sure total bits counts match.
		 * 		Each subdivision must be an array.
		 * enum	-automatically created reverse lookup of values*/
		static bmap	=bmap

		/** Bytes per cell calculated automatically from bmap */
		static bpc	=0

		buf	=new Buf()

		/** tricky buffer, ONLY access it through
		 * calcloc() because it can be changed to anything */	
		_loc	=new Loc()
	}

	Bo.bpc	=Math.ceil( calcbits(bmap) / 8 )


	///////////////////////////////////////////////////////////////////////////


	/** Get buffer value.
	 * Doesn't check if subdivision choice matches the written value in the buffer.
	 * Use separate method for that.
	@arg ic	-index of cell
	@arg {string[]} names	-includes the name of conditional subdivision for look up  */

	Bo.prototype. val	=function( ic, ...names)
	{
		var C	=this.constructor

		var byteoffs	=ic * C.bpc

		var bitoffset	=this.getbitoffs( names )

		var val	=this.buf.
	}


	/** @return Cell object to save into. Be sure to use it if it's created fresh. */

	Bo.prototype. scello	=function( loc )
	{
		var str	=loc.tovstr()

		var cell	=this.o[str]

		if( ! cell )	this.o[str]	=cell	={}

		return	cell
	}

	Bo.prototype. setcello	=Bo.prototype. scello



	Bo.prototype. gcello	=function(loc)
	{
		return this.o[loc.tovstr()]
	}

	Bo.prototype. getcello	=Bo.prototype. gcello



	Bo.prototype. deloprop	=function( loc, n )
	{
		var str	=loc.tovstr()

		delete this.o[str][n]

		for( n in this.o[str] )
		{
			return
		}
		
		delete this.o[str]
	}



	Bo.prototype. calcloc	=function()
	{
		return this._loc.setxy( this.locarr[1], this.locarr[2], this.locarr[0] )
	}


	///////////////////////////////////////////////////////////////////////////


	/** @arg {string[]} names */

	Bo.prototype. getbitoffs	=function( names )
	{
		var C	=this.constructor

		var bitoffset	=0

		var bmapa	=C.bmap

		// for(var inm =0,lenn= names.length ;inm<lenn;inm++)
		for(var name of names )
		{
			for(var bmap of bmapa )
			{
				var condsubd	=bmap.condsubd

				if( name === bmap.name )
				{
					bmapa	??=bmap.subd

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

							foundin_condsubd	=true

							break
						}
					}

					if( foundin_condsubd )
					{
						break
					}
				}
				bitoffset	+= bmap.bits
			}
		}

		return bitoffset
	}

	///////////////////////////////////////////////////////////////////////////

	return Bo
}


///////////////////////////////////////////////////////////////////////////////


/** Call it to make sure that all bit lengths are filled-in in bmap arr.
 * On the way, also create enums */

function calcbits( arr )
{
	var bits	=0

	for(var prop of arr )
	{
		if( ! prop.bits )
		{
			if( prop.subd )
			{
				prop.bits	=calcbits( prop.subd )
			}
			else if( prop.condsubd )
			{
				for(var cond in prop.condsubd )
				{
					prop.bits	=calcbits( prop.condsubd[cond] )

					break
				}
			}
		}

		bits	+= prop.bits

		// create enum ////////////////
		if( prop.vals )
		{
			prop.enum	={}

			for(var iv =0,lenv= prop.vals.length ;iv<lenv;iv++)
			{
				if(typeof prop.vals[iv] === "string" )
				{
					prop.enum[prop.vals[iv]]	=iv
				}
			}
		}
	}

	return bits
}



throw Error(666)

Bo.prototype. getbprop	=function( ic, name, jbmp )
{
	var Class	=this.constructor

	return this.bufs[Class.ibfromp[name]].getprop( ic, name, jbmp )
}


/** @returns - index of buffer where property was set */

Bo.prototype. setbprop		=function( ic, name, jbmp, val )
{
	var ibuf	=this.constructor.ibfromp[name]

	this.bufs[ibuf].setprop( ic, name, jbmp, val )

	return ibuf
}


/** @arg val	- must be string */

Bo.prototype. testbprop	=function( ic, name, jbmp, val )
{
	return this.bufs[ this.constructor.ibfromp[name] ].testprop( ic, name, jbmp, val )
}


