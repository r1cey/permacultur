class Opt
{
	name

	symb

	el

	fun



	constructor( o )
	{
		for(var p in this)
		{
			if( ! this[p]?.call )
			{
				this[p]	=o[p]
			}
		}
	}
}




export default class M
{
	html

	el

	elsel

	selsymb	="≡"

	opts	=[]



	constructor(html)
	{
		this.html	=html

		this.el	=document.getElementsByTagName('menu')[0]

		var elsel	=this.el.getElementsByTagName('sel')[0]

		elsel.onpointerdown	=this.ondown.bind(this)

		this.elsel	=elsel
	}
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. setopts	=function(opts)
{
	this.opts.length	=0

	var dist	=200

	var angl	=0.18

	for(var i=0; i<opts.length; i++)
	{
		var opt	=new Opt(opts[i])

		var el	=document.createElement('option')

		el.style.left	=`${Math.sin( angl ) * dist}px`
		el.style.bottom	=`${ Math.cos( angl ) * dist }px`

		el.style.display	='none'

		el.textContent	=opt.symb

		opt.el	=el

		this.opts.push( opt )

		this.el.appendChild( el )

		angl	+=0.54
	}
}




M.prototype. show	=function()
{
	this.el.style.display	="block"
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. ondown	=function( ev )
{
	this.elsel.textContent	=""

	for(var opt of this.opts )
	{
		opt.el.style.display	="block"
	}
	
	var el	=window

	el.onpointerup	=this.onup.bind(this)
	el.onpointercancel	=this.onup.bind(this)

	el.onpointermove	=this.onmove. bind(this)

	return this.stopslct( ev )
}


M.prototype. onup	=function( ev )
{
	var el	=window

	el.onpointerup	=null
	el.onpointercancel	=null

	el.onpointermove	=null

	if( this.optsel )
	{
		this.optsel.fun?.()

		this.optsel	=null
	}

	for(var opt of this.opts )
	{
		opt.el.style.display	="none"

		opt.unselect()
	}

	el	=this.elsel

	el.style.bottom	=""
	el.style.left	=""

	this.elsel.textContent	=this.selsymb
}


M.prototype. onmove	=function( ev )
{
	var el	=this.elsel

	var style	=window.getComputedStyle(el)

	el.style.left	=`${parseInt(style.left)+ev.movementX}px`
	el.style.bottom	=`${parseInt(style.bottom)-ev.movementY}px`

	var optsel	=this.getoptsel()

	if( this.optsel && (!optsel || optsel !== this.optsel) )
	{
		this.optsel.unselect()

		this.optsel	=null
	}
	if( optsel && ! this.optsel )
	{
		optsel.select()

		this.optsel	=optsel
	}

	return this.stopslct(ev)
}


///////////////////////////////////////////////////////////////////////////////


M.prototype. stopslct	=function( ev )
{
	if(ev.stopPropagation) ev.stopPropagation();
    if(ev.preventDefault) ev.preventDefault();
    ev.cancelBubble=true;
    ev.returnValue=false;
    return false;
}



M.prototype. getoptsel	=function()
{
	for(var opt of this.opts )
	{
		var stsel	=window.getComputedStyle( this.elsel )

		var stopt	=window.getComputedStyle( opt.el )

		var psel	=[ parseInt(stsel.left), parseInt(stsel.bottom),
				parseInt(stsel.width), parseInt(stsel.height) ]

		var popt	=[ parseInt(stopt.left), parseInt(stopt.bottom) ]

		if( popt[0] > psel[0] && popt[0] < psel[0] + (psel[2]/2) &&
			popt[1] > psel[1] && popt[1] < psel[1] + (psel[3]/2) )
		{
			return opt
		}
	}

	return null
}


///////////////////////////////////////////////////////////////////////////////



Opt.prototype. select	=function()
{
	this.el.style.textShadow	="0px 0px 10px #ff7acc"
}
Opt.prototype. unselect	=function()
{
	this.el.style.textShadow	=""
}