import newBo	from "./newBoard.js"

import newBinMS	from "./newBinMapShift.js"


export default class BMS	extends newBo(newBinMS)
{


	constructor( ...args )
	{
		super()

		if( args[0] > 0 )
		{
			this.bin =new this.constructor.Bin( ...args )
		}
		else if( args[0] instanceof this.constructor.Bin )
		{
			this.bin	=args[0]

			this.obj	=args[1]
		}
	}
}