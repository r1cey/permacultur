import NS from './shared/NSpace.js'

export default class Send extends NS
{
}


Send.prototype. login	=function( o )
{
	this.s.json( o )
}

Send.prototype. newplayer	=function( o )
{
	this.s.json( o )
}

Send.prototype. mov	=function( loc )
{
	this.s.json({ mov: { loc: loc.newarr() } })
}

Send.prototype. wrtc	=function( o )
{
	this.send_json({ wrtc: o })
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