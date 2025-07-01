import V from "../Vec.js"


export default class Br
{
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

	for(var i=0; i<dirs.length; i++)
	{
		if( map.isnextbr( v.neighh(dirs[i]), dirs[i] ))
		{
			brs.push( new Br( dirs[i] ).scan( map, v ))

			this.size	+=brs[brs.length-1].size
		}

		v.neighh( V.rotopph( dirs[i]) )
	}

	brs.sort(( b1, b2 )=> b1.size-b2.size )

	return this
}


///////////////////////////////////////////////////////////////////////////////



Br.prototype. sort	=function()
{
	this.brs.sort(( b1, b2 )=> b1.size-b2.size )
}