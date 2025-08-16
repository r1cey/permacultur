import Box	from "./Box.js"


export default class Cnt
{
	/** is any obj with additem and delitem methods */
	obj

	loc

	dadbox
}


Cnt.prototype. frompl	=function( pl, path )
{
	var obj	=pl

	if( path && path.length )
	{
		var i	=0
			
		if( path[i] === "hands" )
		{
			obj	=pl.hands

			i++
		}
		else		obj	=pl.inv

		for(; i < path.length ; i++ )
		{
			this.dadbox	=obj instanceof Box ? obj : 0

			var val	=path[i]

			obj	=typeof val==="number" ? obj.boxes[val] : obj.items[val]
		}
	}
	this.obj	=obj
}


Cnt.prototype. fromloc	=function( maps, loc, boxes )
{
	var obj	=maps.fromloc( loc )

	if( path?.length )
	{
		// looks stupid, I know... Bad with names
		obj	=obj.obj.g( loc )

		for(var i =0;i< boxes.length ;i++)
		{
			this.dadbox	=obj instanceof Box ? obj : 0

			var val	=path[i]

			obj	=typeof val==="number" ? obj.boxes[val] : obj.items[val]
		}
	}
	else
	{
		this.loc	=loc
	}
}