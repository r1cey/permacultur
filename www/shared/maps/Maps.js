/*export default ( newGround, newTrees )=> class extends Maps
{
	ground	=newGround()
	
	trees	=newTrees()

	static Trees	=Trees

	static Ground	=Ground
}*/


///////////////////////////////////////////////////////////////////////////////



export default class Maps
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
	}
}


///////////////////////////////////////////////////////////////////////////



Maps.prototype. fromloc	=function( loc )
{
	return this.fromh( loc.h )
}

Maps.prototype. fromh	=function( h )
{
	return h	? this.tr	: this.gr
}

Maps.prototype. fromid	=function( id )
{
	if( id === this.gr.constructor.id )	return this.gr

	if( id === this.tr.constructor.id )	return this.tr
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



Maps.prototype. isplmov	=function( dest )
{
	return this.fromloc( dest ).isplmov( dest )
}