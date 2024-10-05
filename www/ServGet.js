import Loc from './shared/Loc.js'

import Pl from './Player.js'

import NS from './shared/NSpace.js'


export default class Get extends NS
{
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
 * @arg o.bufc
 * @arg o.loc
 * @arg o.code
 */

Get.prototype. mapcode	=function( o )
{
	var cl	=this.cl

	var loc	=Loc.seta( o.loc )

	var c	=o.code

	switch( o.bufc )
	{
		case 1 :

			cl.gr.setcellc( 0, loc, o.code )
		break;
		case 2 :

			cl.gr.setcellc( 1, loc, o.code )
		break;
		case 3 :
			cl.trees.setcellc( 0, loc, o.code )
	}
}


///////////////////////////////////////////////////////////////////////////////


/** This is your new water level. */

Get.prototype. water	=function( lvl )
{
	// this.cl().pl.water	=lvl
}



/** Your player moved here. New information added.
 * @arg o
 * @arg	o.loc	- new location
 * @arg o.delta	- direction of movement
 * @arg o.r	- radius of visible map
 * @arg {Array}	o.cells	- if cell is outside of scope,
 * 		it'll be 0.
 * 		Otherwise it's an array of at least bufs.length size
 * 		Array of codes from the buffers.
 * 		If there're also objects on that cell,
 * 		additional object member is attached at the end of array
 */

Get.prototype. clplmov	=function( o )
{
	var pl	=this.cl.pl

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

	var map	=this.cl.maps.gr

	map.shift( Loc.dirv2dirh(Loc.seta(o.delta)), o.cells, ( o )=>
	{
		for( p in o )
		{
			switch( p )
			{
				case 'pl' :

					o[p]	=new Pl.Vis( o[p], this.cl )
			}
		}

		return o
	})
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