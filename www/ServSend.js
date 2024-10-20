import NS from './shared/NSpace.js'

export default class Send extends NS
{
}


///////////////////////////////////////////////////////////////////////////////



Send.prototype. login	=function( o )
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




Send.prototype. newplayer	=function( o )
{
	this.s.json( o )
}


///////////////////////////////////////////////////////////////////////////////



Send.prototype. mov	=function( loc )
{
	this.s.json({ mov: { loc: loc.newarr() } })
}



Send.prototype. wrtc	=function( o )
{
	this.send_json({ wrtc: o })
}




Send.prototype. climb	=function( dir, loc )
{
	this.send.json({ climb: { loc, dir }})
}




Send.prototype. act	=function( act, o )
{
	this.send_json({ [act]: o })
}


///////////////////////////////////////////////////////////////////////////////



Send.prototype. json	=function( o )
{
	this.ws.send(JSON.stringify( o ))
}