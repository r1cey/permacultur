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
	var{ map, loc }	=this

	var newit	=item.take( len )

	var additem	=map.obj.s( loc )[ item.constructor.name ]	??=newit

	return additem===newit	? len	: 0
}


Cell.prototype. delitem	=function( item, len )
{
	var all	=item.del( len )

	if( all )	this.map.obj.del( this.loc, item.constructor.name )
}