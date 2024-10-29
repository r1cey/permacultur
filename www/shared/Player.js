import Loc from "./Loc.js"
import Col from './Color.js'




class	PlVis
{
	name

	r	= 0.62

	col

	loc		// when this is derived, it can become a getter function

	cl	=0

	sleep	=0
}




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

	static Msg	=PlVisA

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

			delete this.cl
		}
	}
}




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
	static Msg	=PlA

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




PlO.prototype. sees	=function( v )
{
	var pl	=this

	var dist	=pl.loc.disth( v )

	return dist <= pl.vision
}



/** Can't see self */

PlO.prototype. seespl	=function( pl2 )
{
	if( this === pl2 )	return false

	return this.sees( pl2.loc )
}




PlO.prototype. setwater	=function( lvl )
{
	if(lvl < 0)	lvl	=0
	if(lvl > 1)	lvl	=1
	
	this.water	=lvl

	return lvl
}




PlO.prototype. subwater	=function( n )
{
	return this.setwater( this.water - n )
}
