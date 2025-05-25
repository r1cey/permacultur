import newTrees from "./newTrees.js"

import V from "../Vec.js"


export default function( Map )
{
	class TM extends newTrees(Map)
	{

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


	
	T.prototype. climbable	=function( loc )
	{
		return this.cmpbinval( loc, ["floor","ty"], "trunk" )
	}
}

