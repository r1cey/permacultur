// import NS from '../../www/shared/NSpace.js'

import ClS from './ClientSend.js'

import Loc from '../../www/shared/Loc.js'



/*********************************************************************
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "on_" PREFIX
 * ******************************************************************/

export default class ClG extends ClS
{

}



/** @arg o
 * @arg o.loc
 */

ClG.prototype. mov	=function( o )
{
	// var loc	=Loc.fromJSON( o.loc )
	
	// if( loc )	
		this.pl.mov( o.loc )
}

/** Relay WRTC message between clients through the server.
 * @arg	o
 * @arg	o.name	- name of the receiving player
 * @arg {Object}	o.msg
 */

ClG.prototype. wrtc	=function( o )
{
	var cl2	=this.game().pls[o.name].cl

	if( !cl2 )	return

	let cl	=this.cl

	if( o.msg.offer )
	{
		if( cl2.rtcstate[cl.pl.name] === 1 )	return

		cl.rtcstate[cl2.pl.name]	=1

		cl2.rtcstate[cl.pl.name]	=2
	}

	o.name	=this.cl.pl.name

	cl2.s.wrtc( o )
}

ClG.prototype. dig	=function( o )
{
	var tool	=o

	this.game().dig( tool )
}


/** @arg o.dir	- true is up
 * @arg o.loc	- pl loc */

ClG.prototype. climb	=function( o )
{
	var pl	=this.pl

	var ploc	=pl.loc,	loca	=o.loc

	if( ploc.x !== loca[0] || ploc.y !== loca[1] )
	{
		console.error("climb: wrong pl loc given: "+pl.name )

		//send error to player

		return
	}

	pl.climb( o.dir )
}


///////////////////////////////////////////////////////////////////////////////


for(var funn in ClG.prototype)
{
	ClG.prototype["on_"+funn]	=ClG.prototype[funn]

	delete ClG.prototype[funn]
}