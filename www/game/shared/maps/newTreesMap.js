import newTrees from "./newTrees.js"

import V from "../Vec.js"

import BoMS	from "./BoardMShift.js"



export default function( Map )
{
	class TM extends newTrees(Map)
	{
		ground

		get gr()	{return this.ground }

		static MapShiftBo	=newTrees( BoMS )
	}


	
	TM.prototype. canplmov	=function( dest )
	{
		var C	=this.constructor

		var ic	=this.ic(dest)

		var valname	=["floor","ty"]

		var bmapval	=C.Bin.getbmapval( valname )

		var floorty	=this.bin.getval( ic, null, bmapval )

		if( Map.prototype.canplmov. call(this, dest) && floorty !== bmapval.enum.trunk )
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
		return this.getbrdir_i( this.ic(loc))
	}



	TM.prototype. setnewleaves	=function( loc, isflat =false )
	{
		this.fore(( loc )=>
		{
			this.setleafl( loc, 1 )
		}
		, 1, loc )

		isflat ? null : this.setleafh( loc, 1 )
	}


	TM.prototype. setleafl	=function( loc, val )
	{
		this.setleafl_i( this.ic(loc), val )
	}
	TM.prototype. setleafh	=function( loc, val )
	{
		this.setleafh_i( this.ic(loc), val )
	}
	TM.prototype. getleafl	=function( loc )
	{
		return this.getleafl_i( this.ic(loc) )
	}
	TM.prototype. getleafh	=function( loc )
	{
		return this.getleafh_i( this.ic(loc) )
	}


	///////////////////////////////////////////////////////////////////////////


	return TM
}