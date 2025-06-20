import P from '../Page.js'


export default class Inv extends P
{
	cont

	seedbag	=[]


	constructor()
	{
		super(...arguments)
		
		this.cont	=this.html.screen
	}
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. show	=function()
{
	this.cont.appendChild( this.el )

	this.html.can.el.addEventListener("click", this.hide. bind(this),{ once :true})
}



Inv.prototype. hide	=function()
{
	this.cont.removeChild( this.el )
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. addseedbag	=function()
{
	var sb	=new Seedbag(this)

	this.seedbag.push(sb)

	return sb
}


///////////////////////////////////////////////////////////////////////////////



class Seedbag
{
	inv

	el


	constructor( inv )
	{
		this.inv	=inv

		this.el	=document.createElement( "SEEDBAG" )

		this.inv.el.appendChild( this.el )
	}
}



Seedbag.prototype. add	=function( itemn, item )
{
	var el	=document.createElement( "ITEM" )

	switch( itemn )
	{
		case "cucumber_seeds" :

			el.className	=itemn

	}
	this.el.appendChild(el)
}