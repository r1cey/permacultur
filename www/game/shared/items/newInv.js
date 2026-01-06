import newJable from "../newJsonable.js";

import newPathable from "../newPathable.js";



export default function( Base )
{
	class Inv extends newPathable( newJable( Base ))
	{
		inv	={}

		

		isempty(){ for(var k in this.inv) return true; return false }


		msg2navo( afrom ,i ,ato )
		{
			var navo	=this.inv[afrom[i]]

			if( navo.iscnts() )
			{
				ato.push( navo.o[afrom[i+1]] )

				return 1
			}
			ato.push( navo )
		}
	}


	return Inv
}