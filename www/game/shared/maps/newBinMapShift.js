import newBin	from "./newBin.js"


export default function( id, bmap )
{
	var Bin	=newBin( id, bmap, [["dir",8]] )

	/**Everytime player moves, new revealed cells are sent to him.
	 * This class represents the binary data sent.
	 * Some added data from base class:
	 * [ code, id, r, loc, dir, cells ]
	 * dir	-Direction of movement code */

	class BMS extends Bin
	{
		static code	=2


		constructor( ...args )
		{
			super()

			if( args[0] instanceof ArrayBuffer )	this.setbuf( ...args )

			else if( args[0] > 0 || args[1] > 0 )	this.newbuf( ...args )
		}
	}


	///////////////////////////////////////////////////////////////////////////



	BMS.prototype. newbuf	=function( clen, loc, r, dir )
	{
		var buf	=Bin.prototype.newbuf.call(this, clen, loc, r )

		this.set("dir", dir )

		return buf
	}


	///////////////////////////////////////////////////////////////////////////



	return BMS
}