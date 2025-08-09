import items	from "./items.js"


export default class Box extends items.Item
{
	o	={}

	
	static boxvol	=8000	//10cm^3
}


/** Only changes this box. Doesn't modify given item.
 * @returns how many items were transfered */

Box.prototype. additem	=function( itemn, item, num )
{
	var itemb	=this.o[itemn]	??=new item.constructor(item, 0)

	var numb	=itemb.num

	var maxvol	=this.constructor.boxvol

	var maxnum	=Math.floor((maxvol - this.calcitemvol())/item.constructor.vol)

	var addnum	=maxnum > num	? num	: maxnum

	itemb.spoil	=( itemb.spoil*numb + item.spoil*addnum )/( numb + addnum )

	itemb.num	+= addnum

	return addnum
}


Box.prototype. delitem	=function( itemn, num )
{
	(this.o[itemn].num	-= num) > 0	? 0	: delete this.o[itemn]
}



Box.prototype. calcitemvol	=function()
{
	var vol	=0

	for(var itemn in this.o )
	{
		vol	+=this.o[itemn].calcvol()
	}
	return vol
}