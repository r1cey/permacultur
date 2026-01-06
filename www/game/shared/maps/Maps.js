import Loc from "../Loc.js"

// import PObj from "../newPathable.js"


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
	
	// get gr()	{return this.ground }

	/** Define in derived
	@var trees */

	// get tr()	{return this.trees }


	/** Define in derived
	@static
	@var Ground */

	/** Define in derived
	@static
	@var Trees */


	constructor( Gr ,Tr )
	{
		this.ground	=this.gr	=new Gr( this )

		this.trees	=this.tr	=new Tr( this )
		
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


/** @todo If item not found in location, find closest similar item. *

Maps.prototype. getitem	=function( loc ,key )
{
	return this.loc2map(loc).obj.g(loc)?.[key]
}*/


///////////////////////////////////////////////////////////////////////////////



Maps.prototype. canplmov	=function( dest )
{
	return this.loc2map( dest ).canplmov( dest )
}


///////////////////////////////////////////////////////////////////////////////



Maps.prototype. canpushitem	=function( loc )
{
	return this.loc2map( loc ).canpushitem( loc )
}


Maps.prototype. delpls	=function( pls )
{
	for(var[ pln ,plloc ] of pls )
	{
		delete this.loc2map(plloc).g(plloc).pl
	}
}


///////////////////////////////////////////////////////////////////////////////



Maps.prototype. msg2navo	=function( afrom ,i ,ato )
{
	var loc	=new Loc().fromJSON( afrom[i] )

	ato.push( this.loc2map(loc).newcell( loc ))
}