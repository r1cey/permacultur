import V from '../../www/shared/Vec.js'
import Get from './ClientGet.js'
import Send from './ClientSend.js'

export default class Client
{
	ws

	pl

	get	=new Get(this)

	g	=this.get

	send	=new Send( this)

	s	=this.send

	srv

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

		ws.on( 'message', this.g.msg. bind(this))

		ws.on('close', this.closed. bind(this))
	}
}


///////////////////////////////////////////////////////////////////////////////



Client.prototype. closed	=function( code, reason, wsclosed =false )
{
	console.log( `Client ${this.pl.name} disconnected: code=${code}, reason=${reason}.` )

	this.pl.clclosed()

	for(var cl2 of this.rtcstate)
	{
		cl2.rtcstate.delete(this)
	}
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