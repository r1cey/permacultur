import Bin	from "./newBin.js"


export default function( id, bmap )
{
	/** Binary representation of a typical round hex map. */

	class BM extends Bin( id, bmap )
	{
		static code	=1
	}


	BM.cells2r	=function(cells)
	{
		let r	=0

		for(let i=6 ; i<=cells ; i+=6*(r+1) )
		{
			r	++
		}

		return r
	}


	return BM
}