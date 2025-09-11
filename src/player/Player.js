import PlMsg from '../../www/game/shared/player/Player.js'
import Hands from '../../www/game/shared/player/Hands.js'

import V from '../../www/game/shared/Vec.js'
import Loc from '../Loc.js'

import * as fs	from '../fs.js'

// import items from '../items.js'

// import newjsontrans from "../../www/game/shared/JsonRevivr.js"


// var jsontr	=newjsontrans()

/*
const SrvPl	=(c) => class extends c
{
	constructor()
	{
		super()

		// delete this.loc
	}

	setwater( lvl )
	{
		PlMsg.prototype.setwater. call(this, lvl )
	}
	subwater( lvl )
	{
		PlMsg.prototype.subwater. call(this, lvl )
	}
}



class PlSlp extends SrvPl( PlMsg.Vis )
{
	// water	=0.5

	constructor(o, json)
	{
		super()

		delete this.cl

		if(o)	this.set(o, json)
	}
}*/


export default class Player extends PlMsg	//SrvPl( PlMsg )
{	
	game

	// hands	=new Hands()

	map()	{return this.game.maps.loc2map( this.loc )}

	srv

	// static game


	constructor( pl, game )
	{
		super( pl )

		this.game	=game

		this.srv	=game.server
	}

	/*static Slp	=PlSlp

	static _msg	=new PlMsg()

	constructor( o, json, game, map )
	{
		super()

		Object.assign(this,{ game, map })

		if(o)	this.set(o, json )
	}*/
}



///////////////////////////////////////////////////////////////////////////////



Player.prototype. save	=async function( dir )
{
	var pa	=dir+this.name+'.json'

	await fs.savejson( pa, this )
}


/**  */

Player.prototype. conncl	=function( cl )
{
	this.cl	=cl

	cl.send("setpl")

	cl.send("setmap")

	this.game.srv?.send_plconn( this )
}



Player.prototype. clclosed	=function()
{
	this.srv?.cls.del( this.name )

	this.cl	=null

	this.srv?.send.plconn( this )
}


///////////////////////////////////////////////////////////////////////////////


/** //!!!newloc will be modified!!! */

Player.prototype. mov	=function( loc )
{
	var pl	=this

	var{loc: curloc }	=pl

	var map	=pl.map()
	
	map.obj.del( curloc, "pl" )

	// var dir	=Loc.dirv2dirh(loc.subv(newloc).neg())

	var oldloc	=new Loc().set(curloc)

	curloc.set( loc )

	map.obj.set(loc).pl	=this

	this.srv?.send_plmov( this, oldloc )

	if( loc.h === 0 )
	{
		map	=pl.game.maps.gr

		map.fore(( loc )=>
		{
			if( map.iswater(loc) )
			{
				/**@todo reinstate later */
				// pl.setwater( 1 )

				return true
			}
		}
		,1 ,curloc )
	}
	// console.log(`Player ${this.pl.name} moved to ${this.pl.loc.p()}.`)
}



/** I can presend location of tree to not look for it every time
 * @arg hdir	- true is up */

Player.prototype. climb	=function( hdir )
{
	/*var pl	=this

	var{ loc }	=pl

	var dest	=new Loc().set(loc)
	
	dest.h	=hdir	? 1	: 0

	var destmap	=pl.game.maps.loc2map( dest )

	if( ! destmap.canplmov( dest ))
	{
		pl.cl?.send.error( "Can't climb there" )

		return
	}

	var map	=pl.map()
	
	var tloc	=new Loc()

	for(var dir=0;dir<6;dir++)
	{
		if( map.climbable( tloc.set(loc).neighh(dir) ))
		{
			break
		}
	}
	if( dir === 6 )
	{
		pl.cl.send.error( `No tree to climb` )

		return
	}

	map.deloprop( loc, "pl" )

	loc.h	=dest.h

	destmap.scello(loc).pl	=pl

	pl.srv?.send_plclimb( pl, hdir )*/
}


Player.prototype. actonobj	=function( path, act, params )
{
	if( obj[act]( ...params ) )

		this.srv?.send_plactonobj( this, loc, objkey, act, params )
}


Player.prototype. additem	=function( item, len )
{
	var addl	=PlMsg.prototype.additem. call(this, item, len )

	addl	? this.cl.send_clpladditem( ) : 0
}


/** From/To root is either a player or map location.
 * from|to{ loc, pln, boxes[str] } */

Player.prototype. movitem	=function( from, itemid, len, to )
{
	/** @TODO !!! : check that to and from are viable */

	var{ game }	=this

	var fromcnt	=game

	for(var key of from )
	{
		fromcnt	=fromcnt.getinv( key )
	}
	var tocnt	=game

	for(var key of to )
	{
		tocnt	=tocnt.getinv( key )
	}

	PlMsg.prototype.movitem. call(this, fromcnt, itemid, len, tocnt )
		
//		frombox, fromdadbox, itemn, len, boxi, tobox, todadbox )




	
	var cntfrom	=new Holder()
	
	from.pln ? cntfrom.frompl( game.pls.g(from.pln), from.boxes ) :

		cntfrom.loc2map( game.maps, from.loc, from.boxes )

	PlMsg.prototype.movitem. call(this, cntfrom, itemn, len, boxi, cntto )



	/** How many items can destination accept? */

	if( to.pln )
	{

	}

	if( from.pln )
	{
		let pl	=game.pls.g(from.pln)

		// if( ! from.boxes.length )
	}
	var frombox	=from.pln ? game.pls.g(from.pln) : game.maps.objfromloc(from.loc)

	if( ! frombox )
	{
		console.error(`ERR! pl.movobj{pln:${from.pln},loc:${from.loc}}`)

		return
	}
	var fromdadbox

	for(var boxn of from.boxes )
	{
		fromdadbox	=frombox

		frombox	=frombox[boxn]
	}
	var tobox	=to.pln ? game.pls.g(to.pln) : game.maps.objfromloc(to.loc)

	var todadbox

	for(var boxn of to.boxes )
	{
		todadbox	=tobox

		tobox	=tobox[boxn]
	}
	PlMsg.prototype.movitem. call(this,
		
		frombox, fromdadbox, itemn, len, boxi, tobox, todadbox )
}


/*Player.prototype. cl_send	=function( msg )
{
	this.cl.send( JSON.stringify(msg) )
}*/


/** Supply the object dict of players to search in! */


Player.prototype. forseenpls	=function( pls, fun )
{
	for(var n in pls)
	{
		if( pls[n].seespl( this ))	fun( this, pls[n] )
	}
}
/*
Player.prototype. forisseencls	=function( fun )
{
	var pl	=this

	pl.game.srv.forcls(( cl2 )=>
	{
		if( cl2.pl.seespl(pl) )	fun( cl2, pl )
	})
}
*/
/*
Player.prototype. disconn	=function()
{
	var pl	=this

	pl.cl	=0

	pl.forisseencls(( cl2 )=>
	{
		cl2.s.plconn( pl.name, false )
	})
}
*/


Player.prototype. setwater	=function( lvl )
{
	var oldlvl	=this.water

	lvl	=PlMsg.prototype. setwater.call(this, lvl )

	oldlvl !== lvl && this.cl && this.cl.sendjson({ plwater: lvl })
}


Player.prototype. setheat	=function( lvl )
{
	var oldlvl	=this.heat

	lvl	=PlMsg.prototype. setheat.call(this, lvl )

	oldlvl !== lvl && this.cl && this.cl.sendjson({ plheat: lvl })
}


///////////////////////////////////////////////////////////////////////////////


/*
Player. fromJSON	=function( val )
{
	var{ game }	=this

	var pl	=PlMsg.fromJSON. call(this, val, game )

	game.pls.s( pl )

	return pl
}

/*Player. replacer	=function( key, val )
{
	switch( key )
	{
		case "cl" :	return val ? 1 : 0
		break
		case "game" :	return undefined
		break
		default:	return val
	}
}*/