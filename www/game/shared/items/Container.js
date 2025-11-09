// import Holder from "../Holder.js";
// import Item	from "./Item.js"
import Jable from "../Jsonable.js"

import{ IdPool }	from "../utils.js"


/** @extends Holder */

export default class Cnt	extends Jable
{
	id	=0

	holder

	/** pl|loc|cnt *
	dadtype*/

	static idpool	=new IdPool()


	constructor( init )
	{
		/** the difference is only relevant between server and client machines */
		
		if( init )	this.set( init )

		else	this.id	=Cnt.idpool.new()
	}
}


/**@returns the container the item is going to be added to */

Cnt.prototype. additem	=function( item )
{
	if( ! this.id )	return this.setuniq()

	return this
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


/** @todo What's happening with dadtype ?? *

Cnt.prototype. setuniq	=function()
{
	var cnt	=this.take( 1 )

	cnt.id	=this.constructor.idpool.new()

	if( this.dad /*&& this.dadtype==="cnt"* )
	{
		this.dad.mov2uniq( cnt )
	}
	return cnt
}
*/

