import Loc from './shared/Loc.js'

// import Pl from './Player.js'

import Maps	from './maps/Maps.js'


/*
export default class SG
{
	
}*/

var on	={}


///////////////////////////////////////////////////////////////////////////////


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "on_" PREFIXES 
 * 
 * ALSO, FRIENDLY REMINDER THAT ALL MESSAGES WILL COME AFTER JSON REVIVER!
 * ***/


/** Player with [name] doesn't exist and needs to be created. */

on. createpl	=async function( name )
{
	this.cl.html.delpage('login')

	var pg	=await this.cl.html.loadp('createpl')
	
	pg.start( name, this.sendjson. bind(this) )
}


///////////////////////////////////////////////////////////////////////////////



/** This is your player. */

on. setclpl	=function( plmsg )
{
	// debugger

	console.log(plmsg)

	this.cl.setpl( plmsg )
}



/** This is what you see.
 * @arg msg
 * @arg o.loc
 * @arg o.r
 * @arg {obj} o.obj	-{gr, tr}
 */

on. setmap	=function( obj, loca, r )
{
	this.buf.addobj( obj, new Loc().seta(loca), r )
}


/**	This are the units that you see. 
 * @arg o
 * @arg	o.r
 * @arg {PlVis[]} o.pls
 *

on. units	=function( o )
{
	for(var i=0;i<o.pls.length; i++)
	{
		this.cl().genevispl(o.pls[i], true )
	}
}*/


///////////////////////////////////////////////////////////////////////////////



on. clpl_setitem	=function([ key, item ])
{
	item	? this.cl.pl.inv[key] =this.jsonparse(item,key) : delete this.cl.pl.inv[key]

	/**@todo: now update GUI */
}


/**@todo Validate everything. */

on. clpl_setitem	=function([ path, item, key ])
{
	var cnt	=this.cl

	for(var id of path )
	{
		cnt	=cnt.getinv( id )
	}
	cnt.setitem( item && this.jsonparse( item,key ))
}


/** Received a map changing method
 * @param o 
 * @arg o.mapid
 * @arg o.act	-method name
 * @arg o.loc
 * @arg {array}	o.vals */

on. mapset_	=function( mapid, loca, act, vals )
{
	var map	=this.cl.maps.fromid( mapid )

	var loc	=new Loc().seta(loca)

	if( map !== this.cl.maps.loc2map( loc ))
	{
		console.error("srv.on_mapset_", act, loc, vals )
	}
	map["set"+act]( loc, ...vals )
}


/** @arg {*} obj	- the added object is under their key
 * 		for automatic json parsing */

on. map_additem	=function([ loc, key, obj ])
{
	loc	=new Loc(loc)

	this.cl.maps.loc2map(loc).obj.s(loc)[key]	=this.jsonparse(obj,key)
}


///////////////////////////////////////////////////////////////////////////////


/** This is your new water level. */

on. plwater	=function( lvl )
{
	this.cl.pl.water	=lvl
}



on. plheat	=function( lvl )
{
	// console.log(lvl)

	this.cl.pl.heat	=lvl
}



/** Your player moved here. New information added.
 * @arg {Object}	msg
 * @arg				msg.loc	- new location
 * @arg 			msg.r	- radius of visible map
 * @arg 			msg.dir	- direction of movement
 * @arg {Object} 	msg.obj
 * @arg {Array}		msg.obj.gr	- cells in order, empty cells are empty entries
 * @arg {Array} 	msg.obj.tr
 */

on. clplmov	=function( obj, loca, r, dir )
{
	this.buf.addobj( obj ,new Loc().seta(loca) ,r ,dir )
}


/** { loc } */

on. movrej	=function( msg )
{
	this.cl.pl.rejmov()
}


/** A visible player moved.
 * If it was seen before, only need name.
 * Otherwise get info on new player.
 * @arg	o
 * @arg	{PlVis}	[o.pl]	- must have old location
 * @arg	o.loc
 * @arg [o.name]
*/

on. plmov	=function( o )
{
	var vispls	=this.srv.cl.vispls

	var plvis

	if(o.name)
	{
		plvis	=vispls[o.name]

		if( ! plvis )
		{
			this.con().log( 'ERROR [5469]')
			return
		}
	}
	else if(o.pl)
	{
		plvis	=this.cl().newvispl( o.pl )
	}
	else
	{
		this.con().log('ERROR [5470]')
		return
	}

	plvis.dest.seta(o.loc)
}

/** Player changed connection status.
 *@arg	o
 *@arg	o.name
 *@arg	o.cl
 */

on. plconn	=function( o )
{
	var cl	=this.cl()

	var name	=o.name

	if( o.cl )
	{
		cl.genepcl( name, true )
	}
	else
	{
		cl.delpcl( name )
	}
}

/** New player was created. */

on. newpl	=function( pl2visa )
{
	var pl2vis	=new Pl.Vis(pl2visa, true, this.srv.cl )

	this.srv.cl.vispls[plvis.name]	=pl2vis

	this.srv.cl.peercls[plvis.name]	=pl2vis.cl

	return pl2vis	//why??
}

/** Receive WRTC messages from another client through the server.
 * @arg	o
 * @arg	o.name	- name of the sending player
 * @arg o.msg
 * @arg	[o.msg.offer]
 * @arg	[o.msg.answer]
 * @arg	[o.msg.icecandi]
 */

on. wrtc	=async function( o )
{
	var pcl	=this.cl().genepcl( o.name, false )

	var msg	=o.msg

	if( msg.offer )
	{
		var answer	=await pcl.getanswer( msg.offer )

		o.msg	={ answer }

		this.srv.s.wrtc( o )
	}
	else if( msg.answer )
	{
		pcl.onanswer( msg.answer )
	}
	else if( msg.icecandi )
	{
		pcl.onicecandi( msg.icecandi )
	}
}



/** @arg o.newloc
 * @arg o.dir
 */

on. clplclimb	=function( o )
{
	var pl	=this.cl.pl

	var{ loc, pos, dest }	=pl

	var newloc	=o.newloc

	if( loc.x !== newloc[0] || loc.y !== newloc[1] )
	{
		console.log( `Reset pl map` )
	}

	var desth	=o.dir	? 1	: 0

	loc.h	=desth
	dest.h	=desth
	pos.h	=desth
}



on. rotobj	=function( loca ,key ,dir ,pln )
{
	var{ cl }	=this

	var loc		=new Loc().seta(loc)

	/**@todo if item moved, fix it */

	var item	=cl.maps.loc2map(loc).obj.g(loc)[key]

	item.rot( dir )
}


/** { loc, key, act, params } */

on. actonobj	=function( o )
{
	var map	=this.cl.maps.loc2map( o.loc )

	map.obj.g(o.loc)[o.key][o.act]( ... o.params )
}


/**@todo check that item still there. */

on. rotobj	=function( loca ,dir ,key )
{
	var{ cl }	=this

	var loc	=new Loc().seta(loca)

	var item	=cl.maps.getitem( loc ,key )

	if( ! item )
	{
		cl.con().write( `Error on rotobj: ${key}, ${loc}` )

		return
	}
	item.dir	=dir

	cl.html.objchanged( loc, key )
}


///////////////////////////////////////////////////////////////////////////////



export default on


///////////////////////////////////////////////////////////////////////////////


/*
class Mapbuf
{
	srv

	loc

	r

	bins	=[0,0]
	objs	=[0,0]


	constructor( srv )
	{
		this.srv	=srv
	}
}


/** @return {bool} *

Mapbuf.prototype. add	=function( loc, r )
{
	if( this.loc )
	{
		if( ! this.loc.eq(loc) )
		{
			console.error( `Mapbuf.add(${loc},${r})`)

			return false
		}
	}
	else
	{
		this.loc	=loc
	}
	if( this.r )
	{
		if( ! this.r === r )
		{
			console.error( `Mapbuf.add(${loc},${r})`)

			return false
		}
	}
	else
	{
		this.r	=r
	}
	return true
}


Mapbuf.prototype. isready	=function()
{
	for(var val of this.bins )
	{
		if( ! val )	return false
	}
	for(var val of this.objs )
	{
		if( ! val )	return false
	}

	this.srv.cl.setmaps( this.bins[0], this.objs[0],
							this.bins[1], this.objs[1] )

	return true
}


///////////////////////////////////////////////////////////////////////////////



class Mapshbuf extends Mapbuf
{
}


///////////////////////////////////////////////////////////////////////////////



/*for(var funn in get)
{
	get["on_"+funn]	=get[funn]

	delete get[funn]
}*/