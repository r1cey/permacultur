import newGround from "./newGround.js"



export default function( Map )
{
	class GM extends newGround(Map)
	{

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



	GM.prototype. issoil	=function( loc )
	{
		return this.issoil_i( this.ic( loc ))
	}

	
	GM.prototype. getsoilhum	=function( loc )
	{
		return this.getsoilhum_i(this.ic( loc ))
	}

	Gr.prototype. isvegty	=function( loc, vegns )
	{
		var ic	=this.ic( loc )

		if( this.isveg_i( ic ))
		{
			for(var vegn of vegns )
			{
				if( this.getvegty_str_i( ic ) === Gr.Bin.bmap.plfl.plant.ty.valso[vegn] )
				{
					return true
				}
			}
		}
		return false
	}


	///////////////////////////////////////////////////////////////////////////


	return GM
}
