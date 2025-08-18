import PV	from "./PlVis.js"



/** Also extends Container class, but cbf doing mixins */

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


Pl.prototype. getinv	=function( id )
{
	return id === "hands" ?	this.hands	: this.inv[id]
}


Pl.prototype. additem	=function( item, num )
{
	
}


/** Different movement possibilities:
 * 1. Directly from/to ground (map cell object)
 * 2. From/to player box
 * 3. From/to outside box
 * Map cell objects are special. They are barebones and their
 * management is done through the parent map object.
 * @arg {Box|Loc} frombox
 * @arg {Box|Map} fromdadbox */


Pl.prototype. movitem	=function( fromcnt, itemid, len, tocnt )
{
	var item	=cntfrom.gitem( itemid )
}


Pl.prototype. movitem	=function( frombox, fromdadbox, itemn, len, boxi, tobox, todadbox )
{
	var item	=cntfrom.gitem( itemn, ibox )

	var movedl	=cntto.additem( item, len )

	movedl	? cntfrom.delitem( itemn, movedl, ibox )	: 0

	return movedl



	// delete below

	var itemfrom	=boxfrom.o[itemn]

	var movednum	=tobox.additem( itemn, itemfrom, num )

	boxfrom.delitem( itemn, movednum )
}


///////////////////////////////////////////////////////////////////////////////