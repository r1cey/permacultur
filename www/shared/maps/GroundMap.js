import Map from "./Map.js"

import Ground from "./Ground.js"



export default class GM extends Ground(Map)
{

}


///////////////////////////////////////////////////////////////////////////////



GM.prototype. isplmov	=function( dest )
{
	var ic	=this.i(dest)

	return this.nemptycelli(ic) && Map.prototype.isplmov.call(this, dest) &&
	
		! ( this.cmpvegti( ic, "apple" ) && this.getveglvli(ic) > 1 )
}
