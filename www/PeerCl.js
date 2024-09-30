export default class PeerCl
{
	lcl

	name

	pl

	peercon

	con()	{ return this.pl.lcl.html.con }

	s()	{ return this.pl.lcl.srv.s }

	constructor(name, toconn=false, lcl )
	{
		this.name	=name

		this.lcl	=lcl

		this.newpeercon( toconn )
	}
}

PeerCl.prototype. newpeercon	=function( toconn=false )
{
	let conf	=
	{
		'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
	}
	var peercon	=new RTCPeerConnection(conf)

	peercon.onicecandidate	=( ev )=>
	{
		if( ev.candidate )
		{
			this.s().wrtc(
			{
				name:	this.name,
				msg:	{icecandi: ev.candidate }
			})
		}
	}

	peercon.onsignalingstatechange	=( ev )=>
	{
		console.log( 'Sig', this.name, peercon.signalingState )
	}
	peercon.onconnectionstatechange	=( ev )=>
	{
		console.log( 'Con', this.name, peercon.connectionState )

		switch( peercon.connectionState )
		{
			case 'connected':

				this.con().write( `Connected to ${this.name}!`)
		}
	}

	peercon.ontrack	=( ev )=>
	{
		// console.log( ev.track, ev.streams )
	}

	if( toconn )
	{
		peercon.onnegotiationneeded	=()=>
		{
			this.sendoffer()
		}
	}

	var stream	=this.lcl.stream

	for(var track of stream.getAudioTracks())
	{
		peercon.addTrack( track, stream )
	}

	this.peercon	=peercon
}

PeerCl.prototype. sendoffer	=async function()
{
	var peercon	=this.peercon

	var offer	=await peercon.createOffer()

	await peercon.setLocalDescription(offer)

	this.s().wrtc({ name: this.name, msg: {offer} })
}

PeerCl.prototype. getanswer	=async function( offer )
{
	var peercon	=this.peercon
	
	await peercon.setRemoteDescription(new RTCSessionDescription( offer ))

	var answer	=await peercon.createAnswer()

	await peercon.setLocalDescription( answer )

	return answer
}

PeerCl.prototype. onanswer	=async function( answer )
{
	var peercon	=this.peercon

	try
	{
		await peercon.setRemoteDescription(new RTCSessionDescription( answer ))
	}
	catch(err)
	{
		console.log(err)
	}
}

PeerCl.prototype. onicecandi	=async function( icecandi )
{
	var peercon	=this.peercon
	
	try
	{
		await peercon.addIceCandidate( icecandi )
	}
	catch (err)
	{
		this.con().write( 'Error adding received ice candidate' )

		console.log(err)
	}
}

PeerCl.prototype. close	=function()
{
	this.peercon.close()
}