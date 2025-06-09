import newTrees from "./newTrees.js"

import V from "../Vec.js"

import BoMS	from "./BoardMShift.js"


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



export default function( Map )
{
	class TM extends newTrees(Map)
	{
		static Br	=Br

		static MapShiftBo	=newTrees( BoMS )
	}


	
	TM.prototype. isplmov	=function( dest )
	{
		var C	=this.constructor

		var ic	=this.ic(dest)

		var valname	=["floor","ty"]

		var bmapval	=C.Bin.getbmapval( valname )

		var floorty	=this.bin.getval( ic, null, bmapval )

		if( Map.prototype.isplmov. call(this, dest) && floorty !== bmapval.enum.trunk )
		{
			if( floorty === bmapval.e.branch )	return true

			var v	=new V()

			for(var dir=0;dir<6;dir++)
			{
				if( this.cmpbinval( v.set(dest).neighh(dir), valname, "trunk" ) )
				{
					return true
				}
			}
		}
		return false
	}


	/*
	T.prototype. climbable	=function( loc )
	{
		return this.cmpbinval( loc, ["floor","ty"], "trunk" )
	}*/


	///////////////////////////////////////////////////////////////////////////

	

	TM.prototype. setfloorty	=function( loc, type )
	{
		this.setfloorty_i(this.ic(loc), type )
	}


	TM.prototype. getfloorty	=function( loc )
	{
		return this.getfloorty_i(this.ic(loc) )
	}


	
	TM.prototype. setbranch	=function( loc, dir )
	{
		if( dir>5 || dir < 0 )	console.error("TreeMap.setbranch", loc, dir )

		this.setbranch_i(this.ic(loc), dir )
	}



	TM.prototype.isnextbr	=function( loc, dir )
	{
		if( this.inside( loc ))
		{
			return this.isnextbr_i( this.ic(loc), dir )
		}
	}



	TM.prototype. getbrdir	=function( loc )
	{
		return getbrdir_i( this.ic(loc))
	}


	///////////////////////////////////////////////////////////////////////////


	return TM
}


///////////////////////////////////////////////////////////////////////////////


/** loc is not changed through calculation */

Br.prototype. scan	=function( map, v )
{
	var { dir, brs }	=this

	var dirs	=[V.roth(dir, -1), dir, V.roth(dir, 1)]

	for(var i=0; i<dirs.length; i++)
	{
		if( map.isnextbr( v.neighh(dirs[i]), dirs[i] ))
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