export default ( Ground, Trees )=> class extends Maps
{
	ground	=new Ground()
	
	trees	=new Trees()

	static Trees	=Trees

	static Ground	=Ground
}


///////////////////////////////////////////////////////////////////////////////



class Maps
{
	ground
	
	get gr()	{return this.ground }

	trees

	get tr()	{return this.trees }

	static Trees

	static Ground
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