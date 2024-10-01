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


///////////////////////////////////////////////////////////////////////////////



T.prototype. getbranch	=function( loc )
{
	return this.getbranchi( this.i(loc) )
}


///////////////////////////////////////////////////////////////////////////////


T.prototype. isstemi	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 0 ) === 1
}




T.prototype. getbranchi	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 0 )
}