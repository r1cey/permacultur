export default class Color
{
	h
	s
	l

	constructor( ...args )
	{
		if( Array.isArray( args[0] ) )	this.fromJSON( args[0] )

		else
		{
			this.h	=args[0] ?? 0
			this.s	=args[1] ?? 0
			this.l	=args[2] ?? 0
		}
	}
}

Color.prototype. c	=function()
{
	return new Color().set(this)
}



Color.prototype. set	=function( o )
{
	this.h	=o.h
	this.s	=o.s
	this.l	=o.l

	return this
}


/** Colour  */

Color.prototype. fromJSON	=function( arr )
{
	this.h	=arr[0]
	this.s	=arr[1]
	this.l	=arr[2]

	return this
}

Color.prototype. toJSON	=function()
{
	return [this.h, this.s, this.l]
}



Color.prototype. sethsl	=function( h, s, l )
{
	this.h	=h
	this.s	=s
	this.l	=l
}



Color.prototype. add	=function( h, s, l )
{
	this.h	+=Math.round(h)
	this.s	+=Math.round(s)
	this.l	+=Math.round(l)
}


/** Return better json representation of object for messaging. *

Color.prototype. newmsg	=function()
{
	return [this.h, this.s, this.l]
}*/

Color.prototype. str	=function()
{
	return `hsl(${this.h} ${this.s}% ${this.l}%)`
}

Color.prototype. inv	=function()
{
	this.h	=this.h + 180

	if(this.h > 360)	this.h -=360

	this.s	+= ( (100-this.s)>>1 )

	this.l	=100 - this.l

	return this
}


///////////////////////////////////////////////////////////////////////////////

