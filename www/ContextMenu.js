import V	from "./game/shared/Vec.js"


export default class CM
{
	html

	el	=document.createElement("ACTIONS")

	pos	=new V()

	opts	=[]


	del()
	{
		document.body.removeChild( this.el )

		this.html.screen.removeEventListener( "click", this.delbound )

		this.opts.length	=0

		this.el.textContent = '';
	}
	delbound	=this.del.bind(this)


	constructor( html )
	{
		this.html	=html
	}
}


///////////////////////////////////////////////////////////////////////////////



CM.prototype. newev	=function( ev )
{
	return this.new( this.pos.setev( ev ) )
}



CM.prototype. new	=function( pos )
{
	this.pos.set( pos )

	return this
}



CM.prototype. addopt	=function( str, act )
{
	this.opts.push( new Opt( str, ()=>{ act(); this.del() }, this.el ))

	return this
}



CM.prototype. show	=function()
{
	if( ! this.opts.length )	return

	// _pos.set(this.pos).tosqc( can )

	this.setelpos()

	document.body.appendChild( this.el )

	setTimeout(()=>{ this.html.screen.addEventListener( "click", this.delbound )})

	// this.int	=window.setInterval( this.check.bind(this), 821 )	//73bpm
}


///////////////////////////////////////////////////////////////////////////////



CM.prototype. setelpos	=function()
{
	var style	=this.el.style

	var pos	=this.pos

	style.left	=`${Math.floor(pos.x)}px`
	style.top	=`${Math.floor(pos.y)}px`
}


///////////////////////////////////////////////////////////////////////////////


class Opt
{
	el


	constructor( str, act, parel )
	{
		var el	=document.createElement('button')

		el.textContent	=str
	
		el.onclick	=act

		parel.appendChild( el )
		
		this.el	=el
	}
}