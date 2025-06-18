import SG from './ServGet.js'


export default class SS extends SG
{
	constructor()
	{
		super()
	}
}


///////////////////////////////////////////////////////////////////////////////


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***/


SS.prototype. login	=function( o )
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

	var ws	=this.ws

	ws.binaryType	="arraybuffer"

	ws.onerror	=(ev)=>
	{
		this.con().write(`WebSocket error! ${ev.code}`)

		this.cl.html.ps.login?.reset()
	}

	ws.onopen	=this.sendjson. bind(this, o )

	ws.onmessage	=this.onmsg. bind(this)

	ws.onclose	=(ev)=>
	{
		// console.log(`Connection closed:`,ev)

		this.cl.html.con.write
			(`Connection closed: ${ev.code} ${ev.reason}`)
		
		this.cl.html.ps.login?.reset()
	}
}




SS.prototype. newplayer	=function( o )
{
	this.sendjson( o )
}


///////////////////////////////////////////////////////////////////////////////



SS.prototype. mov	=function( loc )
{
	this.sendjson({ mov: { loc } })
}



SS.prototype. wrtc	=function( o )
{
	this.sendjson({ wrtc: o })
}




SS.prototype. climb	=function( dir, loc )
{
	this.sendjson({ climb: { loc, dir }})
}




SS.prototype. act	=function( act, o )
{
	this.sendjson({ [act]: o })
}


SS.prototype. actonobj	=function( loc, objkey, act, params )
{
	this.sendjson({actonobj:{ loc, objkey, act, params }})
}



///////////////////////////////////////////////////////////////////////////////


for(var funn in SS.prototype)
{
	SS.prototype["send_"+funn]	=SS.prototype[funn]

	SS.prototype["s_"+funn]	=SS.prototype[funn]

	delete SS.prototype[funn]
}