import V from '../../www/shared/Vec.js'

import ClG from './ClientGet.js'


export default class Client extends ClG
{
	ws

	pl

	srv

	timecode	=1

	rtcstate	=new Map()
	// 1:	master
	// 2:	slave
	// BDSM


	constructor(ws, pl, srv )
	{
		Object.assign(this,{ srv, ws, pl })

		if( pl && ws )
		{
			pl.conncl( this )
		}

		ws.removeAllListeners( 'message' )

		ws.on( 'message', this.onmsg. bind(this))

		ws.on('close', this.onclose. bind(this))
	}
}


///////////////////////////////////////////////////////////////////////////////



Client.prototype. onmsg	=function( data, isbin )
{
	console.log(`${this.pl.name}: WS msg: ${data.toString()}`)

	var msg	=JSON.parse( data.toString() )/* ,( key, val )=>
	{
		if( key.startsWith( "loc" ))	return new Loc().seta(val)

		return val
	})*/

	for(var prop in msg )
	{
		this["on_"+prop]?.(msg[prop])
	}
	// console.error( `Client Msg: not found: ${prop}`)
}



Client.prototype. onclose	=function( code, reason /*, wsclosed =false*/ )
{
	var pl	=this.pl

	console.log( `Client ${pl.name} disconnected: code=${code}, reason=${reason}.` )

	this.srv.cls.del( pl.name )

	pl.cl	=null

	this.srv.send_plconn( pl, false )

	for(var cl2 of this.rtcstate)
	{
		cl2.rtcstate.delete(this)
	}
}


///////////////////////////////////////////////////////////////////////////////


Client.prototype. sendjson	=function( o, replcr )
{
	this.ws.send( JSON.stringify( o, replcr ) )
}

Client.prototype. sendbin	=function( buf )
{
	this.ws.send( buf, {binary: true})
}





/*
Client.prototype. onsucclogin	=function( pl, isnew )
{
	var cl	=this

	pl.cl	=cl
	
	cl.pl	=pl
	
	cl.s.setpl( pl )
	
	cl.s.map()
	
	cl.s.units()

	pl.forisseencls(( cl2 )=>
	{
		if( isnew )	cl2.s.newpl( pl )

		else	cl2.s.plconn( pl.name, true )
	})
}
*/