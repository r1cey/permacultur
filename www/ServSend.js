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

	ws.onopen	=this.send.json. bind(this, o )

	ws.onmessage	=this.get.msg. bind(this)

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
	this.s.json( o )
}


///////////////////////////////////////////////////////////////////////////////



SS.prototype. mov	=function( loc )
{
	this.s.json({ mov: { loc: loc.newarr() } })
}



SS.prototype. wrtc	=function( o )
{
	this.send_json({ wrtc: o })
}




SS.prototype. climb	=function( dir, loc )
{
	this.send.json({ climb: { loc, dir }})
}




SS.prototype. act	=function( act, o )
{
	this.send_json({ [act]: o })
}


///////////////////////////////////////////////////////////////////////////////



SS.prototype. json	=function( o )
{
	this.ws.send(JSON.stringify( o ))
}

///////////////////////////////////////////////////////////////////////////////


for(var funn in SS.prototype)
	{
		SS.prototype["send_"+funn]	=SS.prototype[funn]
	
		SS.prototype["s_"+funn]	=SS.prototype[funn]
	
		delete SS.prototype[funn]
	}