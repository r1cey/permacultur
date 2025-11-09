/** The associative array part of the maps and boards.
 * Used properties:
, pl */

export default class Obj
{
	map

	o	={}


	constructor( map )
	{
		this.map	=map
	}
}


///////////////////////////////////////////////////////////////////////////////


/** @return Cell object to save into. Be sure to use it if it's created fresh. */

Obj.prototype. set	=function( loc )
{
	return	this.o[loc.tovstr()]	??={}
}

Obj.prototype. s	=Obj.prototype. set
// Bo.prototype. setcello	=Bo.prototype. scello


/** Will NOT create a new entry if doesn't exist */

Obj.prototype. get	=function(loc)
{
	return this.o[loc.tovstr()]
}

Obj.prototype. g	=Obj.prototype. get



Obj.prototype. del	=function( loc, n )
{
	var str	=loc.tovstr()

	delete this.o[str][n]

	for( n in this.o[str] )
	{
		return
	}
	delete this.o[str]
}


///////////////////////////////////////////////////////////////////////////////



Obj. setstack	=function( c ,stack )
{
	var arr	=c[key]

	if( ! arr )	arr =c[key] =[]

	arr[0]	=stack
}

Obj. getstack	=function( c ,key )
{
	return c[key][0]
}


Obj.getcnts	=function( c ,key )
{
	return c[key][1]
}

Obj.getcnt	=function( c ,key ,id )
{
	return c[key][1][id]
}