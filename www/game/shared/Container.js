// import Box	from "./Box.js"


export default class Cnt
{
	/** Returns container or item
	 * Defined in derived class
	@method getinv( id )	{} */

	/** Defined in derived class
	@method additem( item, num )	{} */

	/** Defined in derived class
	@method delitem( item, num )	{} */
}


/*
Cnt.prototype. getobj	=function( id )
{

}


Cnt.prototype. frompl	=function( path, game )
{
	var inv	=game

	for(var id of path )
	{
		inv.getinv( id )
	}
	this.inv	=inv
}


Cnt.prototype. loc2map	=function( maps, loc, boxes )
{
	var inv	=maps.loc2map( loc )

	inv	=inv.

	for(var id of path )

	if( path?.length )
	{
		// looks stupid, I know... Bad with names
		inv	=inv.obj.g( loc )

		for(var i =0;i< boxes.length ;i++)
		{
			this.dadbox	=inv instanceof Box ? inv : 0

			var val	=path[i]

			inv	=typeof val==="number" ? inv.boxes[val] : inv.items[val]
		}
	}
	else
	{
		this.loc	=loc
	}
}*/