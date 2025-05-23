import Ground from "./newGround.js"



export default function( Map )
{
	class GM extends Ground(Map)
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


	return GM
}
