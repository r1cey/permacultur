import Cnt from "./Container.js"



export default class Box extends Cnt
{
	/** Including empty containers */
	items	={}

	cnts	={}

	static boxvol	=8000	//10cm^3
}



Box.prototype. getobj	=function( id )
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

	{
		{
			let itemo	=this.o[item.constructor.name]	??={}

			itemb	=itemo["0"]	??=new item.constructor(item, 0)
		}
		// else
		{
			this.addbox( item )

			return 1
		}
	}
	// else
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

	this.calcempty()	? dadbox.set.delete(this) && Box.prototype.additem. call(dadbox, this ) : 0
}



///////////////////////////////////////////////////////////////////////////////



Box.prototype. mov2uniq	=function( cnt )
{
	var key	=cnt.constructor.key

	if( this.items[key].num <= 0 )	delete this.items[key]

	this.cnts[cnt.id]	=cnt
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