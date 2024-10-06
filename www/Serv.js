// import Msg from './shared/Msg.js'
import Get from './ServGet.js'
import Send from './ServSend.js'
import Map from './shared/maps/Ground.js'

export default class Serv
{
	cl

	con()	{ return this.cl.html.con }

	url	='ws://212.68.153.116:8043'
	// url	='ws://127.0.0.1:8043'

	ws

	send	=new Send(this)

	s	=this.send

	get	=new Get(this)

	g	=this.get

	constructor(client)
	{
		this.cl	=client
	}
}

var Server	=Serv

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

	// alert('b')

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

	// console.log( 'Recvd: '+msg)

	// debugger

	if(msg instanceof ArrayBuffer)
	{
		// debugger

		this.cl.setbuf( msg )
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