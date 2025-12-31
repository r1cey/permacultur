import { WebSocketServer, WebSocket } from "ws"
// import * as fs from './Files.js'
// import Col from '../www/game/shared/Color.js'
// import Vec from '../www/game/shared/Vec.js'
// import Player from './Player.js'
import Cls from "./Clients.js"
import out from './ServSend.js'

import JRev from "../../www/game/shared/JsonRevivr.js"




export default class Server
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

	static out	=out //new ServSend()

	static jrev	=new JRev()


	constructor( game, port )
	{
		// super()

		this.game	=game

		// this.start(port)
	}


	toJSON()	{return undefined }
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



Server.prototype. stop	=function()
{
	console.log(`Server shutting down.`)

	for(var cl of this.wss.clients )
	{
		cl.close( 4801 )
	}
	this.wss.close()
}


///////////////////////////////////////////////////////////////////////////////



Server.prototype. send	=function( fnk ,...args )
{
	Server.out[fnk]. apply(this, args )
}



Server.prototype. sendvis	=function( loc ,fnk ,args )
{
	var dict	=this.cls.o

	for(var n in dict )
	{
		var cl	=dict[n]

		if( cl.pl.sees(loc) )
		{
			cl.send( fnk ,args )
		}
	}
}


Server.prototype. sendplvis	=function( pl ,fnk ,args )
{
	var dict	=this.cls.o

	for(var n in dict )
	{
		var cl	=dict[n]

		if( cl.pl.seespl(pl) )
		{
			cl.send( fnk ,args )
		}
	}
}


Server.prototype. senditemmoved	=function( from ,item ,len ,to ,mover )
{
	var cls	=new Set()

	var dict	=this.cls.o

	for(var n in dict )
	{
		var cl	=dict[n]

		var pl	=cl.pl

		if( pl.seesnavf( from ))	cls.add(cl)

		if( pl.seesnavf( to ))	cls.add( cl )
	}
	for(var cl of cls )
	{
		cl.send("itemmoved" ,[ from ,item ,len ,to ,mover ])
	}
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

	ws.on( 'message', this.onmsg. bind(this, ws, ip ))

	ws.on( 'error', console.log )

	ws.on( 'close', ( code, reason )=>
	{
		console.log(`Client ${ip} disconnected: code-${code}, reason-${reason}.`)
	})
}


///////////////////////////////////////////////////////////////////////////////


/** [ name, newpl ] */

Server.prototype. onmsg	=function( ws, ip, data, isbin )
{
	var str	=data.toString()

	console.log( `Srv msg from ${ip}: ${str}`)

	try
	{
		var plmsg	=JSON.parse( str, this.constructor.jrev.fn )
	}
	catch(err)
	{
		return
	}
	var pln	=plmsg.name

	if(	this.cls.o[pln] )
	{
		ws.close( 4123, 'Player already connected!' )

		return
	}
	var pl	=this.game.pls.o[pln]

	if( pl )
	{
		console.log( "Connecting player: "+pln )

		this.cls.new( ws, pl )
	}
	else if( this.game.pls.rem() <= 0 )
	{
		console.log("Too many players on server :(")

		ws.close( 4124, "Too many players on server :(")
	}
	else if( plmsg.col  )
	{
		this.cls.new( ws, this.game.pls.new( plmsg ) )
	}
	else
	{
		console.log( `No ${pln} player found. Create new.`)

		ws.send( `["createpl", ["${pln}"]]` )
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