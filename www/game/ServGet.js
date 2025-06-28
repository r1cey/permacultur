import Loc from './shared/Loc.js'

// import Pl from './Player.js'

import Maps	from './maps/Maps.js'



export default class SG
{
	
}


///////////////////////////////////////////////////////////////////////////////


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "on_" PREFIXES 
 * 
 * ALSO, FRIENDLY REMINDER THAT ALL MESSAGES WILL COME AFTER JSON REVIVER!
 * ***/


/** Player with [name] doesn't exist and needs to be created. */

SG.prototype. createpl	=async function( name )
{
	this.cl.html.delpage('login')

	var pg	=await this.cl.html.loadp('createpl')
	
	pg.start( name, this.send_newplayer. bind(this))
}


///////////////////////////////////////////////////////////////////////////////



/** This is your player. */

SG.prototype. setpl	=function( plmsg )
{
	// debugger

	this.cl.setpl( plmsg )
}



/** This is what you see.
 * @arg msg
 * @arg o.loc
 * @arg o.r
 * @arg {obj} o.obj	-{gr, tr}
 */

SG.prototype. setmap	=function( msg )
{
	this.buf.addobj( msg )
}


/**	This are the units that you see. 
 * @arg o
 * @arg	o.r
 * @arg {PlVis[]} o.pls
 *

SG.prototype. units	=function( o )
{
	for(var i=0;i<o.pls.length; i++)
	{
		this.cl().genevispl(o.pls[i], true )
	}
}*/


///////////////////////////////////////////////////////////////////////////////


/** Received a map changing method
 * @param o 
 * @arg o.mapid
 * @arg o.act	-method name
 * @arg o.loc
 * @arg {array}	o.vals */

SG.prototype. mapset_	=function( o )
{
	var map	=this.cl.maps.fromid( o.mapid )

	var act	=o.act

	var loc	=new Loc( o.loc )

	if( map !== this.cl.maps.fromloc( loc ))
	{
		console.error("srv.on_mapset_", o.act, o.loc, o.vals )
	}

	map["set"+act]( loc, ...o.vals )
}


///////////////////////////////////////////////////////////////////////////////


/** This is your new water level. */

SG.prototype. water	=function( lvl )
{
	this.cl.pl.water	=lvl
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

SG.prototype. clplmov	=function( msg )
{
	this.buf.addobj( msg )
}


/** { loc } */

SG.prototype. movrej	=function( msg )
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

SG.prototype. plmov	=function( o )
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

SG.prototype. plconn	=function( o )
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

SG.prototype. newpl	=function( pl2visa )
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

SG.prototype. wrtc	=async function( o )
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

SG.prototype. clplclimb	=function( o )
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


/** { loc, key, act, params } */

SG.prototype. actonobj	=function( o )
{
	var map	=this.cl.maps.fromloc( o.loc )

	map.obj.g(o.loc)[o.key][o.act]( ... o.params )
}

///////////////////////////////////////////////////////////////////////////////



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


/** @return {bool} */

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



for(var funn in SG.prototype)
{
	SG.prototype["on_"+funn]	=SG.prototype[funn]

	delete SG.prototype[funn]
}