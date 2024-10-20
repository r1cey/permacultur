import PlMsg from '../www/shared/Player.js'

import Loc from './Loc.js'

import * as fs	from './fs.js'

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


export default class Player extends PlMsg.O	//SrvPl( PlMsg )
{	
	cl

	map

	game()	{return this.map.game }

	srv()	{return this.game().server }

	get fs()	{return this.map.game.files }

	constructor( msg, map )
	{
		super(msg)

		this.map	=map
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

	var pla	=this.newmsg()

	await fs.savejson( pa, pla )
}


/**  */

Player.prototype. conncl	=function( cl )
{
	this.cl	=cl

	cl.send.setpl()

	cl.send.map()

	this.map.game.srv?.send.plconn( this )
}



Player.prototype. clclosed	=function()
{
	this.game().srv?.cls.del( this.name )

	this.cl	=null

	this.game().srv?.send.plconn( this )
}


///////////////////////////////////////////////////////////////////////////////


/** //!!!newloc will be modified!!! */

Player.prototype. mov	=function( newloc )
{
	var pl	=this

	if( pl.loc.eq( newloc )) return

	pl.loc.forlineh( newloc, (loc)=>
	{
		newloc.set(loc)

		return true
	})

	this.srv()?.send.plmov( this, newloc )

	var map	=this.map
	
	map.deloprop( this.loc, "pl" )

	pl.loc.set(newloc)

	map.scello(newloc).pl	=this

	map.fore(( loc )=>
	{
		if( map.gwater(loc) )
		{
			pl.setwater( 1 )

			return true
		}
	}
	,1 ,pl.loc )

	// console.log(`Player ${this.pl.name} moved to ${this.pl.loc.p()}.`)
}


Player.prototype. cl_send	=function( msg )
{
	this.cl.send( JSON.stringify(msg) )
}


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
	PlMsg.O.prototype. setwater.call(this, lvl )

	this.cl?.send.json({ water: this.water })
}
Player.prototype. subwater	=function( lvl )
{
	PlMsg.O.prototype. subwater.call(this, lvl )

	this.cl?.send.json({ water: this.water })
}



Player.prototype. climb	=function( dir, loc )
{
	var pl	=this

	var tr	=this.game().maps.tr

	var brloc	=tr.closestbr( loc, pl.loc )

	if( ! brloc )	return

	pl.loc.set( brloc )
}