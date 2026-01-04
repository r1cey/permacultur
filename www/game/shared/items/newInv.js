import newJable from "../newJsonable.js";

import newPathable from "../newPathable.js";



export default function( Base )
{
	class Inv extends newPathable( newJable( Base ))
	{
		inv	={}

		

		isempty(){ for(var k in this.inv) return true; return false }
	}


	return Inv
}