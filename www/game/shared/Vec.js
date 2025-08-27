export const sqr3	=Math.sqrt(3)

export const dsqr3	=1/sqr3

export const sin60	=sqr3*0.5

export const sec60	=2*dsqr3

export default class V
{
	static sin60	=sin60

	static sec60	=sec60

	static rad60	=Math.PI/3

	static delim	='_'

	static zero	=new V()	//bug, xy are set at the bottom
	
	x
	y
	
	constructor( x =0, y =0 )
	{
		this.setxy( x, y )
		/*
		if( Array.isArray( args[0] ) )	this.fromJSON( args[0] )

		else if( args[0] instanceof V )	this.set( args[0] )

		else if( args.length > 1 )	this.setxy( ...args )*/
	}


	setxy( x , y )
	{
		this.x	=x
		this.y	=y

		return this
	}
}






V.prototype. half	=function()
{
	this.x	=this.x>>1
	this.y	=this.y>>1
	
	return this
}




V.prototype. tohexc	=function( can )
{
	return this.tohex(can.units.dh2)
}

V.prototype. tosqc	=function( can )
{
	return this.tosq(can.units.h2)
}



///////////////////////////////////////////////////////////////////////////////



// V.dirv is set at the bottom - bug

V.dirv2dirh	=function(v)
{
	for(var dir=0, len=V.dirvh.length; dir<len; dir++)
	{
		if( V.dirvh[dir].eq(v))
		{
			return dir
		}
	}
	// console.log()
	throw new Error(`DIRECTIONAL VECTOR WAS NOT FOUND!`)
}

V.roth	=function( dir, a=1 )
{
	var len	=V.dirvh.length
	
	dir	+=a
	
	while(dir>=len)	dir -=len
	while(dir<0)	dir +=len
	
	return dir
}
V.rotopph	=function( dir )
{
	return V.roth( dir, V.dirvh.length >> 1)
}

V.dirvhrot	=function( dir, a=1 )
{
	return V.dirvh[V.roth( dir, a )]
}


V.newcube	=function(x, y, z)
{
	return {x,y,z}
}


V.set	=function( v )
{
	return new this().set(v)
}



V.fromJSON	=function( arr )
{
	return new this(...arr)
}



V.prototype. z	=function()
{
	return -this.x-this.y
}


V.prototype. toString	=function()
{
	return this.x+V.delim+this.y
}



V.prototype. set	=function({ x, y })
{
	return this.setxy( x, y )
}
V.prototype. fromJSON	=function(arr)
{
	return this.setxy( ...arr )
}
/*V.prototype. setxy	=function( x , y )
{
	this.x	=x
	this.y	=y

	return this
}*/
/** @arg {x,y,z}	o	- One property is optional */
V.prototype. setxyzh	=function( o )
{
	if('x' in o)	this.x	=o.x
	else	this.x	=-o.y-o.z

	if('y' in o)	this.y	=o.y
	else	this.y	=-o.x-o.z

	return this
}


V.prototype. newarr	=function()
{
	return [this.x, this.y]
}

V.prototype. clone	=function()
{
	return new V(this.x, this.y)
}
V.prototype. c	=V.prototype. clone

V.prototype. neg	=function()
{
	this.x	=-this.x
	this.y	=-this.y
	return this
}


/** Convert to location on super grid */

V.prototype. tosuper	=function( r, sin, cos, dh2 )
{
	this.tosq( 1 )

	sin	??=V.super.sin( r )

	cos	??=Math.sqrt(1 - sin*sin)

	var x	=this.x*cos - this.y*sin

	this.y	=this.y*cos + this.x*sin

	this.x	=x

	dh2	??=V.super.dh2( r )

	this.tohex( dh2 )

	return this.roundh()
}


V.prototype. tosub	=function( r, sin, cos, h2 )
{
	h2	??=V.super.h2( r )

	this.tosq( h2 )

	sin	??=V.super.sin( r )

	cos	??=Math.sqrt(1 - sin*sin)

	var x	=this.x*cos + this.y*sin

	this.y	=this.y*cos - this.x*sin

	this.x	=x

	this.tohex( 1 )

	return this.roundh()
}



V.prototype. newcube	=function()
{
	return V.newcube( this.x, this.y, this.z() )
}

V.prototype. absh	=function()
{
	return V.newcube( Math.abs(this.x), Math.abs(this.y), Math.abs(this.z()))
}

V.prototype. add	=function( x, y )
{
	this.x	+= x
	this.y	+= y
	return this
}
V.prototype. addv	=function( v )
{
	this.add( v.x, v.y)
	return this
}

V.prototype. sub	=function( x, y )
{
	this.x	-= x
	this.y	-= y
	return this
}
V.prototype. subv	=function( v )
{
	this.sub(v.x, v.y)
	return this
}

V.prototype. mul	=function( n )
{
	this.x	*= n
	this.y	*= n
	return this
}

V.prototype. div	=function( n )
{
	this.x	/= n
	this.y	/= n
	return this
}

V.prototype. tohex	=function( dh2 = 1/32 )
{
	this.x	*= sec60 * dh2

	this.y	= this.y*dh2 - 0.5*this.x

	return this
}

V.prototype. tosq	=function( h2 = 32 )
{
	this.y	=(this.y + 0.5*this.x) * h2

	this.x	=sin60*this.x * h2

	return this
}


/** Hex to double offset */

V.prototype. todoffs	=function()
{
	this.y	=(this.y*2) + this.x

	return this
}

/** Double offset to hex 
 * DOESN'T DEAL WITH FRACTIONS */

V.prototype. toaxial	=function()
{
	this.y	=(this.y - this.x)>>1

	return this
}


V.prototype. setev	=function(ev)
{
	this.x	=ev.pageX
	this.y	=ev.pageY

	return this
}

V.prototype. round	=function()
{
	this.x	=Math.round(this.x)
	this.y	=Math.round(this.y)

	return this
}

V.prototype. roundh	=function()
{
	var round	={x:Math.round(this.x),y:Math.round(this.y),z:Math.round(this.z())}

	var d	={x:Math.abs(this.x-round.x),y:Math.abs(this.y-round.y),z:Math.abs(this.z()-round.z)}

	if( d.x > d.y && d.x > d.z )
	{
		round.x	=-round.y-round.z
	}
	else if( d.y > d.z )
	{
		round.y	=-round.x-round.z
	}
	this.x	=round.x
	this.y	=round.y

	return this
}




V.prototype. eq	=function(v)
{
	return this.eqxy( v.x, v.y )
}

V.prototype. eqxy	=function( x, y )
{
	return this.x === x && this.y === y
} 




V.prototype. zero	=function()
{
	return !( this.x || this.y )
}

V.prototype. neighh	=function(dir)
{
	return this.addv(this.constructor.dirvh[dir])
}

V.prototype. steph	=function( dir, n )
{
	return this.addv(V.dirvh[dir].c().mul(n))
}

V.prototype. disth	=function( v )
{
	return Math.max( Math.abs(this.x - (v?.x ?? 0)),
		Math.abs(this.y - (v?.y ?? 0)),
		Math.abs(this.z() - (v?.z() ?? 0)) )
}

/** !!!Don't modify the vector sent to fun!!! */

V.prototype. forlineh	=function( v2, fun )
{
	var v	=this

	if( v.eq(v2) )	return v2

	var d	=v2.c().subv( v )

	var dcube	=d.newcube()

	var dabs	=d.absh()

	var max="x", min="x"

	for(var prop in dabs)
	{
		if( dabs[prop] > dabs[max] )
		{
			max	=prop
		}
		else if( dabs[prop] < dabs[min] )
		{
			min	=prop
		}
	}

	var unitv	={}

	unitv[max]	=dcube[max] > 0	? 1 : -1
	unitv[min]	=0

	var vmain	=new V().setxyzh(unitv)

	unitv[min]	=dcube[min] > 0	? 1 : -1

	var vside	=new V().setxyzh(unitv)

	var e	=0

	var vp	=v.c()

	while( ! vp.eq(v2) && vp.disth(v) <= dabs[max] )
	{
		e	+= dabs[min]

		if( e*2 >= dabs[max] )
		{
			vp.addv( vside )

			e	-= dabs[max]
		}
		else
		{
			vp.addv( vmain )
		}

		if( fun( vp ) ) return vp
	}
}

V.prototype. randh	=function( r )
{
	this.x	=Math.floor(Math.random()*((r<<1)+1)) - r

	let min	=Math.max(-r, -r - this.x)
	let max	=Math.min(r, r - this.x)

	this.y	=Math.floor(Math.random()*(max-min+1)) + min

	return this
}



V.prototype. floor	=function()
{
	this.x	=Math.floor(this.x)
	this.y	=Math.floor(this.y)
	return this
}


///////////////////////////////////////////////////////////////////////////////



V. isarr	=( a )=>	isNaN(parseInt(a[0])) * isNaN(parseInt(a[1]))



V.dirvh	=[new V(1,0),new V(1,-1),new V(0,-1),new V(-1,0),new V(-1,1),new V(0,1)]



V.super	=
{
	h2	:( r )=> Math.sqrt(3*r*r+3*r+1)
	,
	sin	:( r, h2 )=> sqr3*r/(2*(h2||V.super.h2(r)))
	,
	dh2	:( r )=> 1/V.super.h2(r)
}



V. diredgesize	=function( r )
{
	return (r<<1) + 1
}


///////////////////////////////////////////////////////////////////////////////



V.zero.setxy(0,0)
