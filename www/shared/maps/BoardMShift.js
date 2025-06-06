import newBo	from "./newBoard.js"

import newBinMS	from "./newBinMapShift.js"


export default class BMS	extends newBo(newBinMS)
{


	constructor( cellsl, loc, r, dir, timecode )
	{
		if( cellsl )
		{
			this.bin =BMS.newBin( cellsl, loc, r, dir, timecode )
		}
	}
}