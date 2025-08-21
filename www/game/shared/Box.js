import items	from "./items.js"

import{ IdPool }	from "./utils.js"


/** Also extends Container class, but cbf doing mixins */

export default class Box extends items.Item
{
	id	=0

	/** Including empty bags */
	items	={}

	bags	={}

	dad

	/** pl|loc|bag */
	dadtype

	static boxvol	=8000	//10cm^3

	static idpool	=new IdPool()
}



Box.prototype. getinv	=function( id )
{
	return typeof id==="number"	? this.bags[id]	: this.items[id]
}


/** Only changes this bag. Doesn't modify given item.
 * @returns how many items were transfered */

Box.prototype. additem	=function( item, len =1 )
{
	if( this.num > 1 || this.calcempty() )
	{
		this.setuniq()

	}
	var itemb

	if( item instanceof Box && ! item.calcempty() )
	
		this.addbox( item)

	else

	}
		{
			let itemo	=this.o[item.constructor.name]	??={}

			itemb	=itemo["0"]	??=new item.constructor(item, 0)
		}
		else
		{
			this.addbox( item )

			return 1
		}
	}
	else
	{
		itemb	=this.o[item.constructor.name]	??=new item.constructor(item, 0)
	}
	var numb	=itemb.num

	var maxvol	=this.constructor.boxvol

	var maxnum	=Math.floor((maxvol - this.calcitemvol())/item.constructor.vol)

	var addnum	=maxnum > num	? num	: maxnum

	itemb.spoil	=( itemb.spoil*numb + item.spoil*addnum )/( numb + addnum )

	itemb.num	+= addnum

	return addnum
}


Box.prototype. delitem	=function( item, num =1, dadbox )
{
	var itemn	=item.constructor.name

	item.notempty	? this.set.delete(item)	:
	
		(this.o[itemn].num	-= num) > 0	? 0	: delete this.o[itemn]

	this.calcempty()	? dadbox.set.delete(this) && Box.prototype.additem. call(dadbox, this )
}



///////////////////////////////////////////////////////////////////////////////


Box.prototype. calcitemvol	=function()
{
	var vol	=0

	for(var itemn in this.o )
	{
		vol	+= this.o[itemn].calcvol()
	}
	for(var item of this.set )
	{
		vol	+= item.calcvol()
	}
	return vol
}



Box.prototype. calcempty	=function()
{
	for(var itemn in this.o )
	{
		return false
	}
	return true
}


///////////////////////////////////////////////////////////////////////////////



Box.prototype. setuniq	=function()
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


