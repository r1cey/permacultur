import Holder	from "../Holder.js"



export default class Cell	extends Holder
{
	map

	loc


	constructor( map, loc )
	{
		this.map	=map

		this.loc	=loc
	}
}



Cell.prototype. getobj	=function( name )
{
	return this.map.obj.g( this.loc )[name]
}



Cell.prototype. additem	=function( item, len )
{
	return this.map.additem( this.loc ,item ,len )
}


Cell.prototype. delitem	=function( item, len )
{
	var all	=item.del( len )

	if( all )	this.map.obj.del( this.loc, item.constructor.name )
}