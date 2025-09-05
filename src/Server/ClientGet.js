// import NS from '../../www/game/shared/NSpace.js'

// import ClS from './ClientSend.js'

import Loc from '../../www/game/shared/Loc.js'



/*********************************************************************
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "on_" PREFIX
 * ******************************************************************

export default class ClG extends ClS
{

}*/


var get	={}


///////////////////////////////////////////////////////////////////////////////



get. mov	=function( loca )
{
	var loc	=new Loc().seta( loca )
	
	var{ pl }	=this

	var map	=pl.map()

	if( ! map.canplmov( loc, pl ))
	{
		this.send("movrej", loc )

		return
	}
	var{loc: curloc }	=pl

	if( curloc.eq( loc ))
	{
		this.send_error( "Already there." )
		
		return
	}
	curloc.forlineh( loc, (loc2)=>
	{
		loc.set(loc2)

		return true
	})
	pl.mov( loc )
}

/** Relay WRTC message between clients through the server.
 * @arg	o
 * @arg	o.name	- name of the receiving player
 * @arg {Object}	o.msg
 */

get. wrtc	=function( o )
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

get. dig	=function( o )
{
	var tool	=o

	this.game().dig( tool )
}


/** @arg o.dir	- true is up
 * @arg o.loc	- pl loc */

get. climb	=function( o )
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


/** [ from[gpath], itemid, num, to[gpath] ] */

get. movitem	=function([ from, itemid, len, to ])
{
	var{ game }	=this

	from	=game.parsePath( from )

	to	=game.parsePath( to )

	this.pl.movitem( from, itemid, len, to )
}


/** { loc, objkey, act, params } */

get. actonobj	=function( o )
{
	var loc	=o.loc

	var map	=this.srv.game.maps.loc2map( loc )

	var obj	=map?.obj.g(loc)?.[o.objkey]

	if( obj )	this.pl.actonobj( loc, obj, o.act, o.params, o.objkey )
}


///////////////////////////////////////////////////////////////////////////////



export default get

/*
for(var funn in ClG.prototype)
{
	ClG.prototype["on_"+funn]	=ClG.prototype[funn]

	delete ClG.prototype[funn]
}*/