import Loc from './shared/Loc.js'

import Pl from './Player.js'

import NS from './shared/NSpace.js'

import ShMaps	from './shared/maps/Maps.js'


export default class Get extends NS
{
	msb	=new Msb()



	constructor( srv )
	{
		super(srv)

		this.msb.srv	=srv
	}
}




class Msb	// map shift buffer
{
	srv

	timecode	=0

	bufs	=[[],[]]

	o
}


///////////////////////////////////////////////////////////////////////////////


/** Player with [name] doesn't exist and needs to be created. */

Get.prototype. createpl	=async function( name )
{
	this.cl.html.delpage('login')

	var pg	=await this.cl.html.loadp('createpl')
	
	pg.start( name, this.s_newplayer. bind(this))
}


///////////////////////////////////////////////////////////////////////////////



/** This is your player. */

Get.prototype. setpl	=function( plarr )
{
	// debugger

	this.cl.setpl( plarr )
}



/** This is what you see. */

Get.prototype. setmap	=function(mapmsg)
{
	// debugger	
}



/** Parse all binary data */

Get.prototype. msgbuf	=function( buf )
{
	// debugger

	var Map	=this.cl.maps.gr.constructor

	var code	=Map.getcode( buf )

	var movcode	=code>>8	// binary when player moves is received with code offset

	if( movcode )
	{
		this.get.msb.addbuf( buf, code, movcode )
	}
	else
	{
		this.cl.setbuf( buf, code )
	}
}



/**	This are the units that you see. 
 * @arg o
 * @arg	o.r
 * @arg {PlVis[]} o.pls
 */

Get.prototype. units	=function( o )
{
	for(var i=0;i<o.pls.length; i++)
	{
		this.cl().genevispl(o.pls[i], true )
	}
}


///////////////////////////////////////////////////////////////////////////////


/**
 * @param o 
 * @arg o.bcode
 * @arg o.loc
 * @arg o.ccode
 */

Get.prototype. mapcode	=function( o )
{
	var maps	=this.cl.maps

	var loc	=Loc.seta( o.loc )

	var map, bi

	var bc	=o.bcode

	if( bc < 3 )
	{
		map	=maps.gr

		bi	=bc - 1
	}
	else
	{
		map	=maps.tr
			
		bi	=bc - 3
	}

	map.setcellc( bi, loc, o.ccode )
}


///////////////////////////////////////////////////////////////////////////////


/** This is your new water level. */

Get.prototype. water	=function( lvl )
{
	// this.cl().pl.water	=lvl
}



/** Your player moved here. New information added.
 * @arg o
 * @arg o.timecode	- used to sync with buffer updates
 * @arg	o.loc	- new location
 * @arg o.delta	- direction of movement
 * @arg o.r	- radius of visible map
 * @arg {Array}	o.cells	- [[gr objs,,,,],[tr objs,,,,,]] in order, empty cells are empty
 */

Get.prototype. clplmov	=function( o )
{
	var msb	=this.g.msb

	var { timecode }	=o

	if( ! msb.timecode )
	{
		msb.timecode	=timecode
	}

	if( msb.timecode !== timecode )	return

	msb.o	=o

	msb.ifready()
}



/** A visible player moved.
 * If it was seen before, only need name.
 * Otherwise get info on new player.
 * @arg	o
 * @arg	{PlVis}	[o.pl]	- must have old location
 * @arg	o.loc
 * @arg [o.name]
*/

Get.prototype. plmov	=function( o )
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

Get.prototype. plconn	=function( o )
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

Get.prototype. newpl	=function( pl2visa )
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

Get.prototype. wrtc	=async function( o )
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


///////////////////////////////////////////////////////////////////////////////


/** Is called for all websocket messages arriving */

Get.prototype. msg	=function( ev )
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



Msb.prototype. addbuf	=function( buf, code, movcode )
{
	var ms	=this

	// debugger

	var Map	=ms.srv.cl.maps.gr.constructor

	code	??=Map.getcode( buf )

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

	/** Enter checks for information in buffer here */

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
}