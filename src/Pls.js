import Pl	from './Player.js'

import Loc	from '../www/game/shared/Loc.js'

import * as fs from './fs.js'

import * as json from "../www/game/shared/json.js"



export default class Pls
{
	game

	conf	=
	{
		max	:1000
		,
		dir	:'./pls/'
	}

	o	={}

	// arr	=[]

	g( n )	{ return this.o[n] }

	s( n, pl)	{ this.o[n]	=pl }

	
	rev

	constructor( game )
	{
		this.game	=game

		this.rev	=json.newrevivr( json.newrules(
			{
				""	:
				{
					rev	:( val )=> new Pl( val, game )
				}
			} ) )
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Reads and saves */

Pls.prototype. read	=async function( name, map )
{
	var game	=this.game

	var pa	=this.conf.dir+name+'.json'

	var pl	=await fs.readjson( pa, this.rev )
				
	if(pl)
	{
		this.o[pl.name]	=pl

		return pl
	}
}



Pls.prototype. left	=function()
{
	return this.conf.max
}



Pls.prototype. new	=function( plmsg )
{
	console.log( `Creating new player: ${plmsg.name}` )

	var g=this.game

	var map	=g.maps.ground

	var pl	=new Pl( plmsg, g )

	var loc	=new Loc(0,0,0)

	while( map.obj.get(loc)?.pl )
	{
		loc.randh(8)
	}

	pl.loc.set( loc )

	this.o[pl.name]	=pl

	pl.save( this.conf.dir )

	map.obj.set(loc).pl	=pl

	g.srv?.send_newpl( pl )

	return pl
}



Pls.prototype. save	=async function()
{
	for(var name in this.o)
	{
		await this.o[name].save( this.conf.dir )
	}
}


///////////////////////////////////////////////////////////////////////////////


/** fun( pl, game ) */

Pls.prototype. fore	=function( fun )
{
	for(var n in this.o)
	{
		if( fun( this.o[n], this.game ))	return
	}
}


/*
Pls.prototype. newid	=function()
{
	for(var i=0; i<this.conf.max; i++)
	{
		if( ! this.arr[i]) return i + 1
	}
	return 0
}
*/


Pls.prototype. ismaxips	=function( ip )
{
	return this.game.srv.ismaxips.call(this, ip )
}
Pls.prototype. addip	=function( ip )
{
	return this.game.srv.addip.call(this, ip )
}

/** @return - { err, pl } *

Pls.prototype. add	=function( pln, pl )
{
	console.log( `Adding new player: ${pln}.`)

	var game	=this.game

	var errs	=game.errs

	var pls	=this.o

	if( pls[pln] )
	{
		let err	=11

		console.log( errs[err], pln )

		return { err }
	}
	else if( this.ismaxips( pla.ip ) )
	{
		let err	=9

		console.log( errs[err], pla.ip )

		return {err}
	}
	else if( this.left() <= 0 )
	{
		let err	=8

		console.log( errs[err] )

		return {err}
	}

	let pl	=new Pl( pla, true )

	pls[pln]	=pl

	this.arr[this.newid]

	this.addip( pl.ip )

	return { pl }
}


Pls.prototype. forvispls	=function( pln, fun )
{
	var pl	=this.o[pln]

	this.fore(( n2, pl2 )=>
	{
		if( pl.seespl(pl2) )	fun( n2, pl2, pln, pl )
	})
}

Pls.prototype. setwater	=function( pln, num )
{
	this.game.srv.s.water( pln, this.o[pln].setwater( num ))
}
Pls.prototype. subwater	=function( pln, num )
{
	var water	=this.o[pln].subwater( num )

	this.game.srv.s.water( pln, water )
}

/** !!!newloc will be modified!!! */

Pls.prototype. mov	=function( pln, newloc, pl )
{
	var g	=this.game

	pl	??=g.pls.g(pln)

	var loc	=pl.loc

	if( pl.loc.eq( newloc )) return

	pl.loc.forlineh( newloc, (v)=>
	{
		newloc.set(v)

		return true
	})
	
	g.srv.plmoving( pln, newloc, pl )

	var dv	=newloc.c().subv(pl.loc)

	pl.loc.set(newloc)

	if( pl.cl )	g.srv.s.clplmov( pl.cl-1, V.dirv2dirh( dv ) )

	g.map.fore( ( v ) =>
	{
		if( game.map.water(v) )
		{
			pl.setwater( 1 )

			return true
		}
	}
	, 1, pl.loc )
}