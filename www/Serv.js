// import Msg from './shared/Msg.js'

import SrvS from './ServSend.js'

import Map from './shared/maps/Ground.js'

export default class Serv extends SrvS
{
	cl

	con()	{ return this.cl.html.con }

	url	="ws://127.0.0.1:8043"

	ws

	send	=new Send(this)

	s	=this.send

	get	=new Get(this)

	g	=this.get

	constructor(client)
	{
		super()

		this.cl	=client
	}
}

// var Server	=Serv

Serv.prototype. test	=function()
{

}

/** @arg	o	- whatever goes to s.login() */

Serv.prototype. login	=function( o )
{
	try
	{
		this.ws	=new WebSocket(this.url)
	}
	catch(err)
	{
		this.con().write(`WebSocket error: ${err}`)
		return
	}

	let ws	=this.ws

	ws.binaryType	="arraybuffer"

	ws.onerror	=(ev)=>
	{
		this.con().write(`WebSocket error! ${ev.code}`)

		this.cl.html.ps.login?.reset()
	}

	ws.onopen	=this.s.login.bind( this, o )

	ws.onmessage	=this.onmsg. bind(this)

	ws.onclose	=(ev)=>
	{
		// console.log(`Connection closed:`,ev)

		this.cl.html.con.write
			(`Connection closed: ${ev.code} ${ev.reason}`)
		
		this.cl.html.ps.login?.reset()
	}
}


///////////////////////////////////////////////////////////////////////////////


Serv.prototype. onmsg	=function( ev )
{	
	let msg	=ev.data

	console.log( 'Recvd: '+msg)

	var cl	=this.cl

	// debugger

	if(msg instanceof ArrayBuffer)
	{
		// debugger

		let code	=Map.codefrombuf( msg )

		if( Map.timefromcode( code ))
		{
			
		}

		this.deenc.onbuf( msg )
	}
	else if(typeof msg === 'string')
	{
		msg	=JSON.parse(ev.data)

		let prop

		for(prop in msg)
		{
			this["on_"+prop]?.( msg[prop] )
		}
		// console.log( `Server Msg: not found! ${prop}`)
	}
}


///////////////////////////////////////////////////////////////////////////////



Serv.prototype. onfullbuf	=function( bufarr, code )
{
	var dir	=Map.dirfromcode( code )

	if(dir)
	{

	}
}