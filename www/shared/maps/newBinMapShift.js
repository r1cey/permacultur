import newBin	from "./newBin.js"


export default function( id, bmap )
{
	var Bin	=newBin( id, bmap, [["timecode",16],["dir",8]] )

	/**Everytime player moves, new revealed cells are sent to him.
	 * This class represents the binary data sent.
	 * Some added data from base class:
	 * [ code, id, r, loc, timecode, dir, cells ]
	 * timecode	-Code for syncing between srvr and client.
	 * dir	-Direction of movement code */

	class BMS extends Bin
	{
		static code	=2


		constructor( clen, r, loc, dir, tc )
		{
			if( clen )	this.newbuf( clen, r, loc, dir, tc )
		}
	}


	///////////////////////////////////////////////////////////////////////////



	BMS.prototype. newbuf	=function( clen, r, loc, dir, tc )
	{
		var buf	=Bin.prototype.newbuf.call(this, clen, r, loc )

		this.set("timecode", tc )

		this.set("dir", dir )

		return buf
	}


	///////////////////////////////////////////////////////////////////////////



	return BMS
}