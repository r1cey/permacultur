import SrvS from './ServSend.js'

import Gr from './maps/Ground.js'
import Tr from './maps/Trees.js'
import * as json from './shared/json.js'
import Pl from "./Player.js"
import Loc from "./shared/Loc.js"



export default class Serv extends SrvS
{
	cl

	con()	{ return this.cl.html.con }

	url	="ws://127.0.0.1:8043"

	ws

	rev	//reviver

	buf	=new Buf(this)


	constructor(client)
	{
		super()

		this.cl	=client

		var rules	=json.newrules(
			{
				pl	:
				{
					rev :( val )=> typeof val==="string" ? client.pl : new Pl(val,client)
				}
			}
		)

		this.rev	=json.newrevivr( rules )
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



Serv.prototype. sendjson	=function( o, replcr )
{
	this.ws.send(JSON.stringify( o, replcr ))
}



Serv.prototype. onmsg	=function( ev )
{	
	let msg	=ev.data

	console.log( 'Recvd: '+msg)

	var cl	=this.cl

	if(msg instanceof ArrayBuffer)
	{
		// debugger

		let code	=Gr.Bin.getcode( msg )

		switch( code )
		{
			case Gr.Bin.code :

			case Gr.MapShiftBo.Bin.code :
		
				this.buf.addbinbuf( msg, code )
		}
	}
	else if(typeof msg === 'string')
	{
		msg	=JSON.parse(ev.data, this.rev )

		let key

		for(key in msg)
		{
			this["on_"+key]?.( msg[key] )
		}
		// console.error( `srv.onmsg: not found! ${key}`)
	}
}


///////////////////////////////////////////////////////////////////////////////



class Buf
{
	a	=[]
}



Buf.prototype. addbinbuf	=function( bbuf, code )
{
	var id	=Gr.Bin.getid( bbuf )

	for(var Class of [Gr, Tr] )
	{
		if( Class.Bin.id === id )	break
	}

	var Bins	=[ Class.Bin, Class.MapShiftBo.Bin ]

	for(var Bin of Bins )
	{
		if( Bin.code === code )	break
	}

	var bin	=new Bin(bbuf)

	var loc	=bin.getloc(new Loc())

	var r	=bin.get("r")

	var dir	=code === Bins[1].code ? bin.get("dir") : -1

	for(var i=0,len= this.a.length ;i<len;i++)
	{
		var buf	=this.a[i]

		if( loc.eq(buf.loc) && r === buf.r && dir === buf.dir )
		{
			buf[Class.name]	=bin

			return this.iscomplete( i, buf )
		}
	}

	this.a.push({ loc, r, dir, [Class.name] : bin })
}



Buf.prototype. iscomplete	=function( i, buf )
{
	if( buf.Gr && buf.Tr )
	{
		if( buf.dir >= 0 )
		{
			this.srv.cl.maps.shift( buf )
		}
		else
		{
			this.cl.setmaps( buf.Gr, , buf.Tr )
		}

		this.a.splice( i, 1 )
	}
}