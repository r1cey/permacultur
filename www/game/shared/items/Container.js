// import Holder from "../Holder.js";
import Item	from "./Item.js"

import{ IdPool }	from "../utils.js"


/** @extends Holder */

export default class Cnt	extends Item
{
	id	=0

	dad

	/** pl|loc|bag */
	dadtype

	static idpool	=new IdPool()
}


/** Only changes this bag. Doesn't modify given item.
 * @returns how many items were transfered */

Cnt.prototype. additem	=function( item, len =1 )
{
	/** If empty, make unique */
}


Cnt.prototype. delitem	=function( item, num =1, dadbox )
{
	/** If becomes empty, make generic and merge at dad. */

	var itemn	=item.constructor.name

	item.notempty	? this.set.delete(item)	:
	
		(this.o[itemn].num	-= num) > 0	? 0	: delete this.o[itemn]

	this.calcempty()	? dadbox.set.delete(this) && Box.prototype.additem. call(dadbox, this ) : 0
}


///////////////////////////////////////////////////////////////////////////////



Cnt.prototype. setuniq	=function()
{
	if( this.num > 1 )
	{
		
	}

	var bag	=this.num===1	? this	: this.take( 1 )

	this.id	=this.constructor.idpool.new()

	if( this.dad && this.dadtype==="bag" )
	{
		Box.prototype.delitem. call(dad, this )	//maybe problem with GUI

		this.conv
	}
}


