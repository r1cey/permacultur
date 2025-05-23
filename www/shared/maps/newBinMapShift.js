import Bin	from "./newBin.js"


export default function( id, bmap )
{
	/**Everytime player moves, new revealed cells are sent to him.
	 * This class represents the binary data sent.
	 * Some added data from base class:
	 * [ code, id, r, loc, timecode, dir, cells ]
	 * timecode	-Code for syncing between srvr and client.
	 * dir	-Direction of movement code */

	class BMS extends Bin( id, bmap, [["timecode",16],["dir",8]] )
	{
		static code	=2
	}


	///////////////////////////////////////////////////////////////////////////



	BMS.prototype. newbuf	=function( clen, r, loc, tc, dir )
	{
		Base.prototype.newbuf.call(this, clen, r, loc )

		this.set("timecode", tc )

		this.set("dir", dir )

		return this
	}


	///////////////////////////////////////////////////////////////////////////



	return BMS
}