// import Holder from "../Holder.js";
import Item	from "./Item.js"

import newInv from "./newInv.js"

// import{ IdPool }	from "../utils.js"



export default function( Item =Item ,newInv =newInv )
{
	class Cnt	extends newInv( Item )
	{
		id	=0

		/**@static
		@var Stack */

/*
		constructor( init )
		{
			/** the difference is only relevant between server and client machines *
			
			if( init )	this.set( init )

			else	this.id	=Cnt.idpool.new()
		}*/


		iscnt()	{return this }


		calcvol()	{return this.constructor.vol + this.itemvol() }
	}


	///////////////////////////////////////////////////////////////////////////


	/** Check if dads can also contain the item */

	Cnt. canadditem	=function( nav ,_i ,item ,len )
	{
		if( nav.dad(_i).isbox() )
		{
			return nav.exdad(_i, "canadditem" ,item ,len )
		}
		return len
	}


	/*
	Cnt.prototype. delitem	=function( item, num =1, dadbox )
	{
		/** If becomes empty, make generic and merge at dad. *

		var itemn	=item.constructor.name

		item.notempty	? this.set.delete(item)	:
		
			(this.o[itemn].num	-= num) > 0	? 0	: delete this.o[itemn]

		this.calcempty()	? dadbox.set.delete(this) && Box.prototype.additem. call(dadbox, this ) : 0
	}*/


	///////////////////////////////////////////////////////////////////////////


	
	Cnt. newStck	=function( StckC )
	{
		var Cnt	=this

		var cname	=this.name+StckC.suffix

		var o	={}
		
		o[cname]	=class extends StckC
		{
			static key	=Cnt.key+StckC.suffix

			static vol	=Cnt.vol

			static Cnt	=Cnt
		}
		return	this.Stack	=o[cname]
	}


	///////////////////////////////////////////////////////////////////////////



	Cnt.prototype. itemvol	=function()
	{
		var vol	=0

		var{ inv }	=this

		for(var k in inv )	vol += inv[k].calcvol()

		return vol
	}


	///////////////////////////////////////////////////////////////////////////


	return Cnt
}