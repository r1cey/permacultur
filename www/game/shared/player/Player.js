import PV	from "./PlVis.js"



export default class Pl extends PV
{
	speed	=1

	vision	=50

	water	=1

	heat	=0


	constructor( pl )
	{
		super()
		
		if( pl )	this.set( pl )
	}
}

/*
class	PlVis
{
	name

	r	= 0.62

	col

	loc		// when this is derived, it can become a getter function

	cl	=0

	sleep	=0
}



/*
class PlVisA extends PlVis
{
	// static _	=new PlVisA()

	constructor( viso )
	{
		super()

		if( viso )	this.seto( viso )
	}
}




class PlVisO extends PlVis
{
	col	=new Col(0, 100, 50)

	loc	=new Loc(0,0,0)

	// static Msg	=PlVisA

	constructor( visa )
	{
		super()

		if(visa)	this.seta( visa )
	}
}




function classpl( rootclass )
{
	return class extends rootclass
	{
		speed	=1

		vision	=50

		water	=1

		constructor( ...arg )
		{
			super(...arg)

			// delete this.cl
		}
	}
}


/*

class PlA extends classpl( PlVisA )
{
	static Vis	=PlVisA

	constructor( plo )
	{
		super()

		if( plo )	this.seto( plo )
	}
}




class PlO extends classpl( PlVisO )
{
	// static Msg	=PlA

	constructor( pla )
	{
		super()

		if( pla ) this.seta( pla )
	}
}




export default 
{
	A	:PlA
	,
	O	:PlO
	,
	VisA	:PlVisA
	,
	VisO	:PlVisO
}


///////////////////////////////////////////////////////////////////////////////



PlVisA.prototype. seto	=function( plo )
{	
	for(var prop in this )
	{
		if( this[prop]?.call )	continue

		this[prop]	=plo[prop].newmsg?.() ??	plo[prop]
	}

	this.cl	=plo.cl	? 1	: 0
}




PlVisO.prototype. seta	=function( pla )
{
	for(var prop in pla )
	{
		if(this[prop]?.set )
		{
			this[prop].seta( pla[prop] )
		}
		else
		{
			this[prop]	=pla[prop]
		}
	}

	return this
}




PlVisO.prototype. newmsg	=function()
{
	return new this.constructor.Msg( this )
}




PlVisO.prototype. newmsgvis	=function( oldloc )
{
	return new this.constructor.Msg.Vis( this )
}

*/


Pl.prototype. sees	=function( loc )
{
	var pl	=this

	var dist	=pl.loc.disth( loc )

	return dist <= pl.vision
}


/** Can't see self */

Pl.prototype. seespl	=function( pl2 )
{
	if( this === pl2 )	return false

	return this.sees( pl2.loc )
}



Pl.prototype. subwater	=function( n )
{
	return this.setwater( this.water - n )
}


Pl.prototype. setwater	=function( lvl )
{
	lvl	=lvl<0 ? 0 : lvl>1 ? 1 : lvl
	
	return this.water	=lvl
}



Pl.prototype. addheat	=function( n )
{
	return this.setheat( this.heat + n )
}


Pl.prototype. setheat	=function( lvl )
{
	lvl	=lvl<0 ? 0 : lvl>1 ? 1 : lvl

	return this.heat	=lvl
}


///////////////////////////////////////////////////////////////////////////////



Pl.prototype. additemcnt	=function( path ,item ,len )
{
	var cnt	=this

	var nextit	=[,]

	for(var i =0, len =path.length;i<len; i += nextit[1] )
	{
		cnt.getobj( path ,i ,nextit )

		cnt	=nextit[0]
	}
	return cnt.additem( item ,len )
}



Pl.prototype. delitem	=function( item, num )
{
	item.del(num)	? delete this.inv[item.constructor.name]	: 0
}


/**@arg {Holder}	from
 * @arg {String|Number}	itemid
 * @arg {Holder}	to */


Pl.prototype. movitem	=function( from, itemid, len, to )
{
	var movedl	=to.additem( from.getinv( itemid ), len )

	movedl	? from.delitem( itemid, movedl )	: 0

	return movedl
}


///////////////////////////////////////////////////////////////////////////////