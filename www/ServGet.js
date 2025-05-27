import Loc from './shared/Loc.js'

import Pl from './Player.js'

import Maps	from './maps/Maps.js'



export default class SG
{
	deenc	=new Deencap(this)
}



/** Buffer to gather all binary data needed for coherent update 
 * @prop {Deencap.Instance[]} times	- array where each index is timecode
*/

class Deencap	// map shift buffer
{
	srv

	times	=[]

	

	constructor(srv)
	{
		this.srv	=srv
	}
}

Deencap.Instance	=class
{
	bufarr	=[]

	o
}


///////////////////////////////////////////////////////////////////////////////


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "on_" PREFIXES 
 * ***/


/** Player with [name] doesn't exist and needs to be created. */

SG.prototype. createpl	=async function( name )
{
	this.cl.html.delpage('login')

	var pg	=await this.cl.html.loadp('createpl')
	
	pg.start( name, this.send.newplayer. bind(this))
}


///////////////////////////////////////////////////////////////////////////////



/** This is your player. */

SG.prototype. setpl	=function( plarr )
{
	// debugger

	this.cl.setpl( plarr )
}



/** This is what you see.
 * @arg {Object} o
 * @arg o.timecode	- used to join with binary buffers
 * @arg o.loc
 * @arg o.r
 * @arg {Object} o.cells
 * @arg	{Array} o.cells.gr	-all cells in order, empty cells are empty members
 * @arg {Array} o.cells.tr
 */

SG.prototype. setmap	=function( msg )
{
	this.deenc.onobj( msg )
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
	// this.cl().pl.water	=lvl
}



/** Your player moved here. New information added.
 * @arg {Object}	msg
 * @arg 			msg.timecode	- used to sync with buffer updates
 * @arg				msg.loc	- new location
 * @arg 			msg.delta	- direction of movement
 * @arg 			msg.r	- radius of visible map
 * @arg {Object} 	msg.cells
 * @arg {Array}		msg.cells.gr	- cells in order, empty cells are empty entries
 * @arg {Array} 	msg.cells.tr
 */

SG.prototype. clplmov	=function( msg )
{
	this.deenc.onobj( msg )
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


///////////////////////////////////////////////////////////////////////////////


/** Is called for all websocket messages arriving */

SG.prototype. msg	=function( ev )
{	
	var msg	=ev.data

	console.log( 'Recvd: '+msg)

	var cl	=this.cl

	// debugger

	if(msg instanceof ArrayBuffer)
	{
		this.get.msgbuf( msg )
	}
	else if(typeof msg === 'string')
	{
		msg	=JSON.parse(ev.data)

		let prop

		for(prop in msg)
		{
			this.g[prop]?.( msg[prop] )
		}
		// console.log( `Server Msg: not found! ${prop}`)
	}
}


///////////////////////////////////////////////////////////////////////////////



Deencap.prototype. onbuf	=function( buf )
{
	var Map	=Maps.Ground

	var code	=Map.codefrombuf( buf )

	var time	=Map.timefromcode( code )

	var deenc_inst	=this.getdeencinst( time )

	var id	=Map.idfromcode( code ) - 1

	deenc_inst.bufarr[id]	=buf

	this.ready( time )

	/*let movcode	=code>>8

	if(movcode)
	{
		cl.maps.shift( msg, movcode )
	}
	else
	{
		cl.setbuf( msg, code )
	}*/
}



Deencap.prototype. onobj	=function( o )
{
	var deenc_inst	=this.getdeencinst( o.timecode )

	deenc_inst.o	=o

	this.ready( o.timecode )
}


/** Never call directly. Is checked by .ready() method */

Deencap.prototype. onready	=function( timecode )
{
	var inst	=this.times[timecode]

	if( "delta" in inst.o )
	{
		this.srv.onmapshift( inst )
	}
	else
	{
		this.srv.onnewmap( inst )
	}
}


/*
Msb.prototype. addbuf	=function( buf, code, movcode )
{
	var ms	=this

	// debugger

	var Map	=ms.srv.cl.maps.gr.constructor

	code	??=Map.codefrombuf( buf )

	movcode	??=code>>8

	var timecode	=code & 255

	if( ! ms.timecode )
	{
		ms.timecode	=timecode
	}

	if( ms.timecode !== timecode )	return
	
	var head	=Map.Bufs[0].newheadarr( buf )

	var ibuf	=movcode<3 ? movcode-1 : movcode-3

	var imap	=movcode<3 ? 0 : 1

	this.bufs[imap][ibuf]	=buf
	
	this.ifready()
}




Msb.prototype. ifready	=function()
{
	var maps	=this.srv.cl.maps

	// debugger

	var { bufs, o }	=this

	maps.fore(( map )=>
	{
		var h	=map.getloc().h

		var len	=map.constructor.Msg.Bufs.length

		for(var i=0; i<len; i++)
		{
			if( ! bufs[h][i] )	return
		}
	})

	if( ! o )	return

	/** Enter checks for information in buffer here *

	var pl	=this.srv.cl.pl

	var loc	=Loc.seta(o.loc)

	if( ! pl.loc.eq( loc ) )
	{
		console.log( `RECEIVED WRONG LOCATION!!!`)

		pl.dest.set(loc)
	}
	if( pl.vision !== o.r )
	{
		console.log(`VISION CHANGED UNEXPECTEDLY! Might be lag. Deal with it.`)

		pl.vision	=o.r
	}

	var arrs	=[]

	for(var im=0; im<bufs.length; im++)
	{
		arrs[im]	=[]

		var map	=im ? maps.tr : maps.gr

		for(var ib=0; ib<bufs[im].length; ib++)
		{
			arrs[im][ib]	=new map.bufs[ib].constructor.Arr(
				
				bufs[im][ib], 12, (o.r<<1)+1
			)
		}
	}

	maps.shift( arrs, o.cells, Loc.dirv2dirh(Loc.seta(o.delta)) )

	this.timecode	=0

	this.bufs[0].length	=0
	this.bufs[1].length	=0
	
	this.o	=null
}*/

///////////////////////////////////////////////////////////////////////////////


/** @todo Should add actual data checks. To see that everything matches. */

Deencap.prototype. ready	=function( timecode )
{
	var inst	=this.times[timecode]

	if( ! inst.o ) return false

	for(var i =0,len= Maps.maxid()-1 ;i<len;i++)
	{
		if( ! inst.bufarr[i] )	return false
	}

	this.onready( timecode )
}


///////////////////////////////////////////////////////////////////////////////



Deencap.prototype. getdeencinst	=function( timecode )
{
	var inst	=this.times[timecode]

	if( ! inst )
	{
		inst	=this.times[timecode]	=new Deencap.Instance()
	}

	return inst
}


///////////////////////////////////////////////////////////////////////////////



for(var funn in SG.prototype)
{
	SG.prototype["on_"+funn]	=SG.prototype[funn]

	delete SG.prototype[funn]
}