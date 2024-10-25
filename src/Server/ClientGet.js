import NS from '../../www/shared/NSpace.js'

import Loc from '../../www/shared/Loc.js'

export default class Get extends NS
{

}


///////////////////////////////////////////////////////////////////////////////

/** @arg o
 * @arg o.dir
 */

Get.prototype. mov	=function( o )
{
	// if( !o.loc || !V.testarr( o.loc ) )	return

	this.pl.mov( new Loc().seta(o.loc) )
}

/** Relay WRTC message between clients through the server.
 * @arg	o
 * @arg	o.name	- name of the receiving player
 * @arg {Object}	o.msg
 */

Get.prototype. wrtc	=function( o )
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

Get.prototype. dig	=function( o )
{
	var tool	=o

	this.game().dig( tool )
}


/** @arg o.dir	- true is up
 * @arg o.loc	- pl loc */

Get.prototype. climb	=function( o )
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



Get.prototype. msg	=function( data, isbin )
{
	console.log(`${this.pl.name}: WS msg: ${data.toString()}`)

	var msg	=JSON.parse( data.toString() )/* ,( key, val )=>
	{
		if( key.startsWith( "loc" ))	return new Loc().seta(val)

		return val
	})*/

	for(var prop in msg )
	{
		var fun	=this.get[prop]

		if( fun )	fun( msg[prop] )
	}
	// console.error( `Client Msg: not found: ${prop}`)
}