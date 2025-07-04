import newGround	from "./newGround.js"

import BoMS	from "./BoardMShift.js"



export default function( Map )
{
	class GM extends newGround(Map)
	{
		static MapShiftBo	=newGround( BoMS )
	}

	///////////////////////////////////////////////////////////////////////////


	GM.prototype. isplmov	=function( dest, pl )
	{
		var ic	=this.ic(dest)

		var plfl	=GM.Bin.bmap.plfl

		var plty	=this.bin.getval_str( ic, plfl.plant.ty )

		return this.nemptycell_i(ic) && Map.prototype.isplmov.call(this, dest, pl ) &&
		
			! ( this.bin.getval_str( ic, plfl.ty ) === "plant" &&
				
				( plty === "apple" || plty === "umbrtr" ) &&
			
				this.bin.getval( ic, plfl.plant.lvl ) > 3 )
	}


	///////////////////////////////////////////////////////////////////////////


	
	GM.prototype. nemptycell	=function( loc )
	{
		return this.nemptycell_i( this.ic(loc) )
	}



	GM.prototype. plantable	=function( loc )
	{
		this.plantable_i( this.ic( loc ))
	}



	///////////////////////////////////////////////////////////////////////////



	GM.prototype. getwsr	=function( loc )
	{
		return this.getwsr_i(this.ic(loc))
	}
	GM.prototype. setwsr	=function( loc, str )
	{
		return this.setwsr_i(this.ic(loc), str )
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
	GM.prototype. setsoilhum	=function( loc, lvl )
	{
		return this.setsoilhum_i(this.ic( loc ), lvl )
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


	GM.prototype. getwaterlvl	=function( loc )
	{
		var ic	=this.ic(loc)

		return (this.getwsr_i(ic) === "water") * this.getwaterlvl_i(ic)
	}



	GM.prototype. setveg	=function( loc, type, lvl )
	{
		this.setveg_i(this.ic(loc), type, lvl )
	}


	GM.prototype. getvegty	=function( loc )
	{
		return this.getvegty_i( this.ic(loc))
	}


	GM.prototype. getveglvl	=function( loc )
	{
		return this.getveglvl_i( this.ic(loc))
	}

	GM.prototype. setveglvl	=function( loc, lvl )
	{
		this.setveglvl_i( this.ic(loc), lvl )
	}


	///////////////////////////////////////////////////////////////////////////


	return GM
}
