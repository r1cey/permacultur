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

	var mapcell	=map.obj.s( loc )

	var itemk	=item.constructor.name

	var mapitem	=mapcell[itemk]

	if( mapitem )
	{
		if( mapitem.id || item.id )		return 0

		mapitem.num	+= len
	}
	else
	{
		mapcell[itemk]	=item.take( len )
	}
	return len
}


Cell.prototype. delitem	=function( item, len )
{
	var all	=item.del( len )

	if( all )	this.map.obj.del( this.loc, item.constructor.name )
}