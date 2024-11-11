import Map from './Map.js'

import V from "../Vec.js"


var def	=
{
	branch	:["none","stump","b","platform"]
}

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
			1,
			[
				{ branch	:
					[
						[ 2, def.branch ],
						  3
					]
				}	// none-stump-branch-platform, dir
			]
		)
	]

	static ibfromp	={}

	static enum	={}

	static e	=T.enum

	static Br	=Br

	/******/
}


T.setbufp()


///////////////////////////////////////////////////////////////////////////////


for(var n in def)
{
	T.enum[n]	={}

	for(var i =0;i< def[n].length ;i++)
	{
		T.enum[n][def[n][i]]	=i
	}
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. isplmov	=function( dest )
{
	var ic	=this.i(dest)

	var brancht	=this.getbranchti(ic)

	var v	=new V()

	if( Map.prototype.isplmov.call(this, dest) && brancht !== T.e.branch.stump )
	{
		if( brancht === T.e.branch.b )	return true

		for(var dir=0;dir<6;dir++)
		{
			if( this.getbrancht( v.set(dest).neighh(dir) ) === T.e.branch.stump )
			{
				return true
			}
		}
	}
	return false
}


T.prototype. climbable	=function( loc )
{
	return this.getbrancht(loc) === T.e.branch.stump
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




/** Might not be necessary. When using ic for checking this? */

T.prototype. nextbranchi	=function( ic, dir )
{
	return this.getbranchti(ic)===T.e.branch.b && this.getbranchdi(ic)===dir
}




T.prototype. getbranchti	=function( ic )
{
	return this.getbprop( ic, "branch", 0 )
}




T.prototype. getbranchdi	=function( ic )
{
	return this.getbprop( ic, "branch", 1 )
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