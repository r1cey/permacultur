import V from './shared/Vec.js'

class Opt
{
	act

	txt

	el

	constructor( act, txt )
	{
		this.act	=act

		this.txt	=txt
	}
}

export default class M
{
	static can

	static cl()	{ return this.constructor.can.html.cl }

	static opts	={}

	pos	=new V()

	opts	=[]

	el	=document.createElement('acts')

	
	constructor()
	{
	}
}

M.prototype. addopt	=function( act )
{
	var menu	=this

	var opt	=this.constructor.opts[act]

	var el	=document.createElement('button')

	el.textContent	=opt.txt

	el.onclick	=menu.click. bind(menu, act )

	menu.opts.push([ opt, el ])

	menu.el.appendChild(el)
}

/** @arg	pos	- position in pixels */

M.prototype. show	=function( pos )
{
	var{ el }	=this

	el.style.left	=`${Math.floor(this.pos.x)}px`
	el.style.top	=`${Math.floor(this.pos.y)}px`

	this.constructor.can.el.parentElement.appendChild( el )
}

M.prototype. del	=function()
{
	this.el.remove()

	delete this.constructor.can.menu
}

M.prototype. mov	=function( d )
{
	var style	=this.el.style

	style.left	=`${parseInt(style.left)-d.x}px`
	style.top	=`${parseInt(style.top)-d.y}px`
}

M.prototype. click	=function( act, ev )
{
	this.constructor.cl.srv.s.act( act, this.pos.roundh() )

	this.constructor.can.delmenu()
}

function self()
{
	var opts	=[['dig','Dig!']]

	for(var act of opts)
	{
		M.opts[act[0]]	=new Opt( ...act )
	}
}self()