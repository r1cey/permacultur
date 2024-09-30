import Map from './Map.js'




export default class T extends Map
{
	static Bufs	=
	[
		Map.newBuf
		(
			3, 1,
			[
				{ branch	:[ 2 ]},	// none-stump-branch-platform
			]
		)
	]

	/******/

	constructor( r, c, loc )
	{
		super()

		if( r || c )	this.newbufs( r, c, loc )
	}
}