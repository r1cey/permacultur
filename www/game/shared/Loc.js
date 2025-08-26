import V	from './Vec.js'

export default class Loc extends V
{
	h


	static Vec	=V

	static V	=V

	static key	="loc"


	constructor( x =0, y =0, h =0 )
	{
		super( x, y )

		this.h	=h
		/*
		if( Array.isArray( args[0] ) )	this.fromJSON( args[0] )

		else if( args[0] instanceof Loc )	this.set( args[0] )

		else if( args.length > 1 )	this.setxy( ...args )*/
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Return better json representation of object for messaging. *

Loc.prototype. newmsg	=function()
{
	return [this.x, this.y, this.h]
}*/



Loc.prototype. clone	=function()
{
	return new Loc(this.x, this.y, this.h)
}
Loc.prototype. c	=Loc.prototype. clone



Loc.prototype. set	=function({ x, y, h })
{
	return this.setxy( x, y, h )

}
Loc.prototype. setv	=function({ x, y })
{
	return this.setxy( x, y, this.h )
}

Loc.prototype. setxy	=function( x, y, l )
{
	this.x	=x
	this.y	=y
	this.h	=l

	return this
}
Loc.prototype. seta	=function( a )
{
	return this.setxy( ...a )
}
Loc.prototype.fromJSON	=Loc.prototype.seta



Loc.fromJSON	=function( a )
{
	return new this( ...a )
}



Loc.prototype. setvstr	=function( str, h )
{
	var a	=str.split(V.delim)

	this.setxy( Number(a[0]), Number(a[1]), h)

	return this
}



Loc.prototype. toString	=function()
{
	return this.x.toString()+V.delim+this.y+V.delim+this.h
}



Loc.prototype. tovstr	=V.prototype. toString


/** Questionable use */

Loc.prototype. isloc	=function( str )
{
	return ! isNaN(parseInt( str ))
}



Loc.prototype. addloc	=function( loc )
{
	return this.add( loc.x, loc.y, loc.h)
}
Loc.prototype. add	=function( x, y, h =0 )
{
	this.x	+= x
	this.y	+= y
	this.h	+= h
	return this
}
Loc.prototype. addv	=function( v )
{
	return this.add( v.x, v.y, 0 )
}

Loc.prototype. sub	=function( x, y, h =0 )
{
	this.x	-= x
	this.y	-= y
	this.h	-= h
	return this
}
Loc.prototype. subv	=function( v )
{
	return this.sub(v.x, v.y, v.h )
}


///////////////////////////////////////////////////////////////////////////////



Loc. isarr	=( a )=>	isNaN(parseInt(a[0])) * isNaN(parseInt(a[1])) * isNaN(parseInt(a[2]))



Loc.prototype. toJSON	=function()
{
	return [this.x, this.y, this.h]
}