import Html	from './Html.js'
import Serv	from './Serv.js'
import Player	from './Player.js'
import PCl	from './PeerCl.js'
import Maps	from './maps/Maps.js'
import V	from './shared/Vec.js'



export default class Client
{
	V	=V

	html	=new Html(this)

	con()	{ return this.html.con }

	srv	=new Serv(this)

	pl

	maps	=new Maps(this)

	vispls	={}

	peercls	={}

	stream
}





Client.prototype. start	=async function()
{
	var p	=await this.html.loadp('login')

	p.start(this.srv.send_login. bind(this.srv))


	this.stream	=await navigator.mediaDevices.getUserMedia({audio:true})

	// debugger
}



Client.prototype. createpl	=async function( name )
{
	this.html.login.el.className='login'

	var pg	=await this.html.loadp('createpl')
	
	pg.start( name, this.srv.s_newplayer. bind(this.srv))
}


///////////////////////////////////////////////////////////////////////////////



Client.prototype. setpl	=function( plmsg )
{
	this.html.delpage('createpl')

	this.pl	=new Player( plmsg ,this)

	var can	=this.html.can

	can.pl	=this.pl

	can.setpos(can.pl.pos)

	can.draw()

	if( can.maps )	can.start()
}




Client.prototype. setmaps	=function( grbin, grobj, trbin, trobj )
{
	var maps	=this.maps

	// debugger

	maps.setbuf( buf, code )

	if( maps.ready() )
	{
		let can	=this.html.can

		can.maps	=maps

		maps.tr.can.width	=can.el.width

		maps.tr.can.height	=can.el.height

		if( can.pl )	can.start()
	}
}



Client.prototype. genevispl	=function( plvisa )
{
	var cl	=this

	var plvis	=new Player.Vis(plvisa, true, this )

	var name	=plvis.name
	
	if( plvis.cl )
	{
		cl.genepcl( name, true, plvis )
	}
	else if( cl.peercls[name] )
	{
		this.con().log( "Weird bug! [9872]" )
	}

	cl.vispls[name]	=plvis

	return plvis
}

Client.prototype. genepcl	=function( name, toconn=false, pl=null )
{
	var cl	=this

	pl	??=cl.vispls[name]

	var pcls	=cl.peercls

	var pcl	=pcls[name]

	if( ! pcl )
	{
		pcl	=new PCl( name, toconn, cl )

		pcls[name]	=pcl
	}

	pcl.pl	=pl

	if(pl)
	{
		pl.cl	=pcl
	}

	return pcl
}

Client.prototype. delpcl	=function( name )
{
	var cl	=this

	var pcls	=cl.peercls

	var pcl	=pcls[name]

	var pl	=cl.vispls[name]

	if(pl)	pl.cl	=0

	if( !pcl )
	{
		this.con().log( `Peer client [${name}] already deleted!`)

		return
	}

	pcl.close()

	delete pcls[name]
}