import { WebSocketServer, WebSocket } from "ws"
// import * as fs from './Files.js'
// import Col from '../www/shared/Color.js'
// import Vec from '../www/shared/Vec.js'
// import Player from './Player.js'
import Cls from "./Clients.js"
import ServSend from './ServSend.js'

import * as json from "../../www/shared/json.js"



export default class Server extends ServSend
{
	game

	conf	=
	{
		port	:8043
		,
		maxcls	:1000
	}

	wss

	cls	=new Cls(this)

	// g	=new Get(this)

	// send	=new Send(this)

	constructor( game, port )
	{
		super()

		this.game	=game

		// this.start(port)
	}
}


///////////////////////////////////////////////////////////////////////////////



Server.prototype. start	=async function( port )
{	
	if( port )	this.conf.port	=port

	var srv	=this
	
	srv.wss	=new WebSocketServer({ port:this.conf.port/*, clientTracking: true */})
	
	srv.wss.on( 'connection', srv.onconn. bind(srv))
	
	console.log(`WS server started on ${this.conf.port} port...`)
}


///////////////////////////////////////////////////////////////////////////////



Server.prototype. onconn	=function( ws, req )
{
	var ip	=req.socket.remoteAddress

	console.log( `Client connected from ${ip}`)

	var g	=this.game

/*	if(this.wss.clients.size > this.conf.maxcls)
	{
		console.error( 'Too many clients!')

		ws.close( 4808 )

		return
	}*/

	ws.on( 'message', this.onlogin. bind(this, ws, ip ))

	ws.on( 'error', console.log )

	ws.on( 'close', ( code, reason )=>
	{
		console.log(`Client ${ip} disconnected: code-${code}, reason-${reason}.`)
	})
}


///////////////////////////////////////////////////////////////////////////////


/** @arg o
 * @arg o.name
 * @arg [o.pl]
 */

Server.prototype. onlogin	=async function( ws, ip, data, isbin )
{
	var str	=data.toString()

	console.log( `Login attempt from ${ip}: ${str}`)

	try
	{
		var plmsg	=JSON.parse( str, json.newrevivr() )
	}
	catch(err)
	{
		return
	}

	var name	=plmsg.name

	if(	this.cls.o[name] )
	{
		ws.close( 4123, 'Player already connected!' )

		return
	}

	var pl	=this.game.pls.o[name]

	if( pl )
	{
		this.cls.new( ws, pl )
	}
	else if( this.game.pls.left() <= 0 )
	{
		console.log("Too many players in the game :(")

		ws.close( 4124, "Too many players in the game :(")
	}
	else if( plmsg.col  )
	{
		this.cls.new( ws, this.game.pls.new( plmsg ) )
	}
	else
	{
		console.log( `No ${name} player found. Create new.`)

		ws.send( `{"createpl":"${name}"}` )
	}
}


///////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////////



/*Server.prototype. clclose	=function( cl )
{
	var pl	=this.game.disconpl( cl.loc )

	var i	=this.getcli( pl.name )

	this.cls.splice( i, 1 )

	return pl
}*/


///////////////////////////////////////////////////////////////////////////////


/*

Server. json	=function( data, ip )
{
	var str	=data.toString()

	console.log(`${ip}: ${str}`)

	return JSON.parse( str, function( key, value )
		{
			switch(key)
			{
				case 'col':

					return new Col().seta( value )
				break;
				case 'loc':

					return new Vec().seta( value )
				break;
			}
			return value
		})
}



Server.prototype. stop	=function()
{
	console.log(`Server shut down.`)

	for(var cl of this.wss.clients )
	{
		cl.close( 4801 )
	}
	
	this.wss.close()
}

Server.prototype. remcls	=function()
{
	return this.conf.maxpls - this.wss.clients.size
}

Server.prototype. getcli	=function( name )
{
	var glb	=this.game

	for(var i=0; i<this.cls.length; i++ )
	{
		if( glb.getpl(cl.loc).name === name )
		{
			return i
		}
	}
}

Server.prototype. getcl	=function( name )
{
	return this.cls[this.getcli(name) ]
}


Server.prototype. ismaxips	=function( ip )
{
	return this.ips[ip] >= this.conf.maxips
}
Server.prototype. addip	=function( ip )
{
	var ips	=this.ips

	ips[ip]	??= 0

	ips[ip] ++
}
Server.prototype. delip	=function( ip )
{
	var ips	=this.ips

	ips[ip] --

	if( ips[ip] <= 0 )	delete ips[ip]
}
/*
	var errs	=srv.g.errs

	let connid	=srv.cls.length

	if( connid >= srv.conf.maxcls )
	{
		let err	=808

		ws.close(err, errs[err])
		
		console.log( errs[err], srv.conf.maxcls )
		
		return
	}

	let ip	=req.socket.remoteAddress

	if( srv.ismaxips( ip ) )
	{
		let err	=809

		ws.close(err, errs[err])

		console.log(errs[err], ip)

		return
	}
	
	srv.addip( ip )

	srv.cls.push(new Client(ws, connid, ip , this))

	console.log( `New client added at ${connid} id.`)
}
*/
/*
Server.prototype. delcl	=function( id )
{
	var srv	=this

	var{ cls }	=srv

	var cl	=cls[id]

	var cllast	=cls.pop()

	if( cllast !== cl )
	{
		cls[id]	=cllast

		cllast.setevs(srv, id)
	}

	srv.delip( cl.ip )
}

Server.prototype. clclose	=function( id, code, reason )
{
	var srv	=this
	
	var cl	=srv.cls[id]

	cl.ws.removeAllListeners( 'close' )

	srv.delcl( id )

	if( code != 8001 )
	{
		if( code < 4000)	code += 4000 

		cl.ws.close(code, reason)
	}

	if( cl.pln )
	{
		let pln	=cl.pln

		let pl	=srv.g.pls[pln]

		pl.cl	=0

		srv.forseencls( pln, (cl2id)=>
		{
			srv.s.plconn( cl2id, pln, false )
		})

		let pl2n, cl2

		for( pl2n in cl.rtcstate )
		{
			cl2	=srv.cls[srv.g.pls[pl2n].cl-1]

			if( !cl2 )	console.error(`Player ${pl2n} should have a client!`)

			delete cl2.rtcstate[cl.pln]
		}
	}
}

Server.prototype. onmsg	=function( clid, data, isbin )
{
	var str	=data.toString()

	console.log(`${this.idstr(clid)}: WS msg: ${str}`)

	var msg	=JSON.parse( str )

	var acts	=this.g.acts

	for(var prop in msg )
	{
		if( acts[prop] )
		{
			acts[prop]( clid.pln, this.g.pls.g[clid.plid], msg[prop] )

			return
		}
	}
	console.error( `Action not found!!!`)
}

Server.prototype. forseencls	=function( pln )
{
	var pls	=this.g.pls

	var pl	=pls[pln]

	var pl2

	this.forcls(( cl2id, cl2 )=>
	{
		pl2	=pls[cl2.pln]

		if( pl2.seespl( pl ) )
		{
			fun( cl2id, pl2, pln, pl )
		}
	})
}
*
Server.prototype. succlogin	=function( pl, ws, ip )
{
	var cl	=this.cls[clid]

	var pl	=this.g.pls[pln]

	pl.cl	=clid+1
	
	cl.pln	=pln



	pl.cl	=ws

	ws.removeAllListeners( 'msg' )
	ws.removeAllListeners( 'close' )
	ws.on('msg', )

	g.srv_send_setpl( pl )

	g.pl_cl_setpl(pl)
	
	pl.cl_setpl()

	pl.cl_map()

	pl.cl_units()



	this.game.maps.forseen( pl.loc, (pl ))

	this.forseencls(( cl2id )=>
	{
		if( isnew )	this.s.newpl( cl2id, pln, pl )

		else	this.s.plconn( cl2id, pln, true )
	})
}
/*
Server.prototype. plmoving	=function( pln, newloc, pl )
{
	var srv	=this

	var pl2

	srv.fore(( pl2n, pl2 )=>
	{
		if( pl === pl2 )	return

		seesoldloc	=pl2.sees(pl.loc)

		if( pl2.sees(newloc) || seesoldloc)
		{
			srv.s.plmov( pl2n, pln, newloc, seesoldloc , pl )
		}
	}
	, true)
}
*/


///////////////////////////////////////////////////////////////////////////////