import Loc from "../Loc.js"

import PObj from "../PathObj.js"


/*export default ( newGround, newTrees )=> class extends Maps
{
	ground	=newGround()
	
	trees	=newTrees()

	static Trees	=Trees

	static Ground	=Ground
}*/


///////////////////////////////////////////////////////////////////////////////



export default class Maps	extends PObj
{
	/** Define in derived
	@var ground */
	
	get gr()	{return this.ground }

	/** Define in derived
	@var trees */

	get tr()	{return this.trees }


	/** Define in derived
	@static
	@var Ground */

	/** Define in derived
	@static
	@var Trees */


	constructor()
	{
		super()
	}
}


///////////////////////////////////////////////////////////////////////////



Maps.prototype. loc2map	=function( loc )
{
	return this.h2map( loc.h )
}


Maps.prototype. h2map	=function( h )
{
	return h	? this.tr	: this.gr
}

Maps.prototype. fromid	=function( id )
{
	if( id === this.gr.bin.constructor.id )	return this.gr

	if( id === this.tr.bin.constructor.id )	return this.tr

	console.error( "Maps.fromid", id )
}



Maps.prototype. isready	=function()
{
	return this.gr.ready() && this.tr.ready()
}



Maps.prototype. fore	=function( fun )
{
	fun( this.gr )
	fun( this.tr )
}


///////////////////////////////////////////////////////////////////////////////



Maps.prototype. canplmov	=function( dest )
{
	return this.loc2map( dest ).canplmov( dest )
}


///////////////////////////////////////////////////////////////////////////////



Maps.prototype. getobj	=function( loca )
{
	var loc	=new Loc().seta(loca)

	return this.loc2map(loc).newcell( loc )
}