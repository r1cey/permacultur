import Map from './Map.js'




export default class T extends Map
{
	static Bufs	=
	[
		Map.newBuf
		(
			3, 1,
			[
				{ branch	:[ 2, 3 ]},	// none-stump-branch-platform, dir
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
	
}



T.prototype. getbrancht	=function( loc )
{
	return this.getbranchti( this.i(loc) )
}




T.prototype. getbranchd	=function( loc )
{
	return this.getbranchdi( this.i(loc) )
}


///////////////////////////////////////////////////////////////////////////////


T.prototype. isstemi	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 0 ) === 1
}




T.prototype. getbranchti	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 0 )
}




T.prototype. getbranchdi	=function( ic )
{
	return this.bufs[0].getprop( ic, 0, 1 )
}