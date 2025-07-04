import V from "../Vec.js"


export default class Br
{
	/** Direction to take to arrive here */
	dir

	size	=1

	brs	=[]


	constructor( dir )
	{
		this.dir	=dir
	}
}


///////////////////////////////////////////////////////////////////////////////


/** v is not changed through calculation */

Br.prototype. scan	=function( map, v )
{
	var Br	=this.constructor

	var{ dir, brs }	=this

	var dirs	=[V.roth(dir, -1), dir, V.roth(dir, 1)]

	for(var dir2 of dirs )
	{
		if( map.isnextbr( v.neighh(dir2), dir2 ))
		{
			var len	=brs.push( new Br( dir2 ).scan( map, v ) )

			this.size	+=brs[len-1].size
		}
		v.neighh( V.rotopph( dir2 ) )
	}
	brs.sort(( b1, b2 )=> b1.size-b2.size )

	return this
}


///////////////////////////////////////////////////////////////////////////////



Br.prototype. sort	=function()
{
	this.brs.sort(( b1, b2 )=> b1.size-b2.size )
}