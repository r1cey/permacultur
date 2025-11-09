import PathObj	from "../../www/game/shared/PathObj.js"
import Pl	from './Player.js'

import Loc	from '../../www/game/shared/Loc.js'

import * as fs from '../fs.js'

// import items from "../items.js"
import Hands from '../../www/game/shared/player/Hands.js'
import Stack from "../../www/game/shared/items/Stackable.js"
import JRev from "../JsonRevivr.js"
import things	from "../../www/game/shared/items/newthings.js"



export default class Pls	extends PathObj
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

	s( pl )	{ this.o[pl.name]	=pl }


	
	jrev	=new JRev().add([
		{
			key :"cl" , fromJSON :()=> null
		},
		Hands
	] )


	constructor( game )
	{
		super()

		this.game	=game

		this.jrev.add([
			{
				key :"" , fromJSON :(val)=> new Pl( val, game )
			}
			, Stack.newRevObj(this.jrev)
		] )
	}
}


///////////////////////////////////////////////////////////////////////////////


Pls.prototype. init	=async function()
{
	if( ! fs.ensuredir( this.conf.dir ))
	{
		return false
	}
	return true
}


/** Appropriately changes map obj properties. */

Pls.prototype. read	=async function( pllocs )
{
	var proms	=[]

	const maps	=this.game.maps

	var loc

	for(const pln in pllocs )
	{
		loc	=pllocs[pln]

		proms.push((async()=>
		{
			var pl	=await this.readpl( pln )

			if( ! pl )
			{
				delete maps.loc2map(loc).obj.g(loc).pl
			}
			else
			{
				pl.loc.set( loc )

				maps.loc2map(loc).obj.g(loc).pl	=pl

				this.o[pln]	=pl
			}
		})())
	}
	await Promise.all(proms)
}


/** Just reads and revives json */

Pls.prototype. readpl	=async function( name )
{
	var game	=this.game

	var pa	=this.conf.dir+name+'.json'

	var pl	=await fs.readjson( pa, this.jrev.fn )
				
	if( ! pl)
	{
		console.error( "Error reading player: "+pln )

		return false
	}
	return pl
}


/*
Pls.prototype. fillmissing	=async function()
{
	var names	=await fs.readdir( this.conf.dir )

	for(var name of names )
	{
		if( ! name.endsWith(".json") )
		{
			continue
		}
		name	=name.slice( 0 ,-5 )

		console.log( "test555: "+name )

		if( this.g(name) )
		{
			return
		}
		var pl	=await this.readpl( name )

		if( ! pl )	continue

		console.log( "Joining missing player: "+name )

		this.s( pl )
	}
}*/



Pls.prototype. rem	=function()
{
	return this.conf.max
}



Pls.prototype. new	=function( plmsg )
{
	console.log( `Creating new player: ${plmsg.name}` )

	const g=this.game

	const map	=g.maps.ground

	var pl	=new Pl( plmsg, g )

	// add starter items
	{
		pl.inv.belt	=new things.cnts.Belt()
	
		pl.inv.belt.inv.multi	=new things.stacks.Multi()

		pl.cl.send( "plcl_setitem" ,[[ "seedbag" ,3 ], seeds ])

		pl.inv.seedbags[3].add( )

		

		pl.addsbag( new things.bags.Seedbag() ).add( new things.stacks.CucumberSeed( null ,15 ) )
	}
	var spawns	=map.obj.o.spawns

	// var loc	=spawns[0].c()

	pl.loc.set( spawns[0] )

	map.findfirstplloc( pl.loc )

	this.s( pl )

	map.obj.s(pl.loc).pl	=pl

	pl.save( this.conf.dir )		
	
	// add start dewds
	{
		let idewd =0

		map.fore(( loc )=>
		{
			if( ! map.getshade( loc ) && map.canplmov( loc ))
			{
				map.setblock( loc ,new items.Dewd() )

				// g.con.online("additem "+JSON.stringify({loc, o:{ dewd :null }}))

				idewd ++

				if( idewd >= 3)	return true
			}
		},
		null, spawns[0] )
	}
	g.srv?.sendplvis( pl ,"newpl" ,[ pl ])

	return pl
}



Pls.prototype. save	=async function()
{
	var proms	=[]

	for(var name in this.o)
	{
		proms.push( this.o[name].save( this.conf.dir ) )
	}
	return await Promise.allSettled(proms)
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


///////////////////////////////////////////////////////////////////////////////



Pls.prototype. getobj	=function( n )
{
	return this.g( n )
}


///////////////////////////////////////////////////////////////////////////////


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