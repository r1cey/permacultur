import Map from './Map.js'

import V from "../Vec.js"



class Br
{
	dir

	size	=1

	brs	=[]



	constructor( dir )
	{
		this.dir	=dir
	}
}




export default class T extends Map
{
	static Bufs	=
	[
		Map.newBuf
		(
			3, 1,
			[
				{ branch	:[ 2, 3 ]}	// none-stump-branch-platform, dir
			]
		)
	]

	static Br	=Br

	/******/

	constructor( r, c, loc )
	{
		super()

		if( r || c )	this.newbufs( r, c, loc )
	}
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. nextbranch	=function( loc, dir )
{
	if( this.inside( loc ))
	{
		return this.nextbranchi( this.i(loc), dir )
	}
}




T.prototype. getbranch	=function( loc )
{
	
}



T.prototype. getbrancht	=function( loc )
{
	return this.getbranchti( this.i(loc) )
}




T.prototype. getbranchd	=function( loc )
{
	return this.getbranchdi( this.i(loc) )
}


///////////////////////////////////////////////////////////////////////////////


T.prototype. isstemi	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 0 ) === 1
}



/** Might not be necessary. When using ic for checking this? */

T.prototype. nextbranchi	=function( ic, dir )
{
	return this.getbranchti(ic)===2 && this.getbranchdi(ic)===dir
}




T.prototype. getbranchti	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 0 )
}




T.prototype. getbranchdi	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 1 )
}


///////////////////////////////////////////////////////////////////////////////



/** loc is not changed through calculation */

Br.prototype. scan	=function( map, v )
{
	var { dir, brs }	=this

	var dirs	=[V.roth(dir, -1), dir, V.roth(dir, 1)]

	for(var i=0; i<dirs.length; i++)
	{
		if( map.nextbranch( v.neighh(dirs[i]), dirs[i] ))
		{
			brs.push( new this.constructor( dirs[i] ).scan( map, v ))

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