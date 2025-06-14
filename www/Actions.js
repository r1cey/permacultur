import Loc from './shared/Loc.js'




class Opt
{
	el

	check



	constructor( str, act, check, parel )
	{
		var el	=document.createElement('button')

		el.textContent	=str
	
		el.onclick	=act

		parel.appendChild( el )
		
		this.el	=el

		this.check	=check
	}
}




export default class M
{
	static can

	static cl()	{ return this.constructor.can.html.cl }

	// static opts	={}

	pos	=new Loc()

	loc	=new Loc()

	opts	=[]

	el

	ready	=false

	// int	=0

	// _pos	=new Loc.Vec()	//pixels relative to screen



	setpos( possqel, ploc )
	{
		var can	=this.constructor.can

		var pos	=this.pos

		pos.set( possqel )

		// pos.set( possqel ).tohexc( can ).addv( can.crn )

		this.loc.set( pos ).tohexc( can ).addv( can.crn ).roundh()
		
		this.loc.h	=ploc.h
	}



	constructor()
	{
	}
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. addopt	=function( str, act, check )
{
	var menu	=this

	this.el	??=document.createElement( "acts" )

	this.opts.push( new Opt( str, ()=>{ act(); menu.del() }, check, this.el ))
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. show	=function()
{
	if( ! this.opts.length )	return

	let{ el }	=this

	var can	=this.constructor.can

	// _pos.set(this.pos).tosqc( can )

	this.setelpos()

	can.el.parentElement.appendChild( el )

	this.ready	=true

	// this.int	=window.setInterval( this.check.bind(this), 821 )	//73bpm
}




M.prototype. del	=function()
{
	this.el.remove()

	this.constructor.can.menu	=null
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. setelpos	=function()
{
	var style	=this.el.style

	var pos	=this.pos

	style.left	=`${Math.floor(pos.x)}px`
	style.top	=`${Math.floor(pos.y)}px`
}




M.prototype. mov	=function( d )
{
	this.pos.addv(d)

	this.setelpos()
}




M.prototype. check	=function()
{
	var{ opts }	=this

	for(var opt of opts)
	{
		opt.enable( opt.check() )
	}
}


M.prototype. click	=function( act, ev )
{
	this.constructor.cl.srv.s.act( act, this.pos.roundh() )

	this.constructor.can.delmenu()
}


///////////////////////////////////////////////////////////////////////////////



Opt.prototype. enable	=function( bool )
{
	this.el.disabled	=!bool
}


