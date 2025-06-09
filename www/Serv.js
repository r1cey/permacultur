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

	rules

	rev


	constructor(client)
	{
		super()

		this.cl	=client

		this.rules	=json.newrules(
			{
				pl	:
				{
					rev :( val )=> typeof val==="string" ? client.pl : new Pl(val,client)
				}
			}
		)

		this.rev	=json.newrevivr( this.rules )
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

		let BinM	=this.cl.maps.gr.constructor.Bin

		let code	=BinM.getcode( msg )

		if( code === BinM.code )
		{
			this.onmapbin( msg )
		}
		else if( code === 2 )
		{
			this.onmapshiftbin( msg )
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



Serv.prototype. onmapbin	=function( buf )
{
	var mapbuf	=this.mapbuf

	var maps	=this.cl.maps

	var Bins	=[ maps.gr.constructor.Bin, maps.tr.constructor.Bin ]

	var bin

	var id	=Bins[0].getid( buf )

	for(var i =0,len= Bins.length ;i<len;i++)
	{
		if( id === Bins[i].id )
		{
			bin	=new Bins[i]( buf )

			break
		}
	}

	if( i >= len )
	{
		console.error(`srv.onmapbin : wrong id : ${id}`)

		return
	}

	if( mapbuf.add( bin.getloc(new Loc()), bin.get("r") ) )
	{
		mapbuf.bins[i]	=bin

		mapbuf.isready()
	}
}