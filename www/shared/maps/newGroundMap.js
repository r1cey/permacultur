import newGround	from "./newGround.js"

import BoMS	from "./BoardMShift.js"



export default function( Map )
{
	class GM extends newGround(Map)
	{
		static MapShiftBo	=newGround( BoMS )
	}

	///////////////////////////////////////////////////////////////////////////


	GM.prototype. isplmov	=function( dest )
	{
		var ic	=this.ic(dest)

		return this.nemptycell_i(ic) && Map.prototype.isplmov.call(this, dest) &&
		
			! ( this.bin.cmpval( ic, ["plfl","plant","ty"], "apple" ) &&
			
				this.bin.gval( ic, ["plfl","plant","lvl"] ) > 1 )
	}


	///////////////////////////////////////////////////////////////////////////


	
	GM.prototype. nemptycell	=function( loc )
	{
		return this.nemptycell_i( this.ic(loc) )
	}



	GM.prototype. setsoil	=function( loc, lvl )
	{
		if( lvl < 0 )	lvl	=0

		if( lvl > GM.maxhum() )	lvl	=GM.maxhum()

		this.setsoil_i(this.ic( loc ), lvl )
	}


	GM.prototype. issoil	=function( loc )
	{
		return this.issoil_i( this.ic( loc ))
	}

	
	GM.prototype. getsoilhum	=function( loc )
	{
		return this.getsoilhum_i(this.ic( loc ))
	}

	

	GM.prototype. setwater	=function( loc, lvl )
	{
		if( lvl < 1 )	lvl	=1

		if( lvl > GM.maxwater() )	lvl	=GM.maxwater()

		this.setwater_i(this.ic( loc ), lvl )
	}


	GM.prototype. iswater	=function(loc)
	{
		return this.iswater_i(this.ic(loc))
	}



	GM.prototype. setveg	=function( loc, type, lvl )
	{
		this.setveg_i(this.ic(loc), type, lvl )
	}


	GM.prototype. getvegty	=function( loc )
	{
		return this.getvegty_i( this.ic(loc))
	}


	///////////////////////////////////////////////////////////////////////////


	return GM
}
