import V	from './Vec.js'

export default class Loc extends V
{
	h


	static Vec	=V

	static V	=V


	constructor( ...args )
	{
		super( ...args )

		if( Array.isArray( args[0] ) )
		{
			this.h	=args[0][2]
		}
		else
		{
			this.h	=args[2] ?? 0
		}
	}

	tovstr()
	{
		return super.toString()
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



Loc.prototype. set	=function( loc )
{
	return this.setxy( loc.x, loc.y, loc.h )

}
Loc.prototype. setv	=function( vec )
{
	return this.setxy( vec.x, vec.y, this.h )
}

Loc.prototype. setxy	=function( x, y, l )
{
	this.x	=x
	this.y	=y
	this.h	=l

	return this
}
Loc.prototype. fromJSON	=function( a )
{
	return this.setxy( a[0], a[1], a[2] )
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



Loc.prototype. add	=function( x, y, h )
{
	this.x	+= x
	this.y	+= y
	this.h	+= h
	return this
}
Loc.prototype. addv	=function( v )
{
	return this.add( v.x, v.y, v.h)
}

Loc.prototype. sub	=function( x, y, h )
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