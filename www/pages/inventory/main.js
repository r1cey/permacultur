import P from '../Page.js'
import V from "../../game/shared/Vec.js"


export default class Inv extends P
{
	pl

	box

	hands

	seedbag	=[]

	cl()	{return this.html.cl }


	constructor( html, el, css, pl )
	{
		super( html, el, css )
		
		this.box	=this.html.screen

		this.hands	=new Hands(this, pl.hands )

		pl.attachhtmlinv( this )
	}
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. show	=function()
{
	this.box.appendChild( this.el )

	this.html.can.el.addEventListener("click", this.hide. bind(this),{ once :true})
}



Inv.prototype. hide	=function()
{
	// this.context.hide()

	this.box.removeChild( this.el )
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. addseedbag	=function( plobj )
{
	var sb	=new Seedbag(this, plobj )

	this.seedbag.push(sb)

	return sb
}


///////////////////////////////////////////////////////////////////////////////



class InvObj
{
	inv

	el

	plobj


	//additem	//func

	//remitem	//func


	constructor( inv, el, plobj )
	{
		this.inv	=inv

		this.el	=el

		this.plobj	=plobj
	}
}


///////////////////////////////////////////////////////////////////////////////



class Hands	extends InvObj
{
	constructor( inv, plobj )
	{
		super( inv, inv.el.getElementsByTagName("hands")[0], plobj )
	}
}


///////////////////////////////////////////////////////////////////////////////



class Seedbag	extends InvObj
{
	constructor( inv, plobj )
	{
		super( inv, document.createElement( "SEEDBAG" ), plobj )

		this.inv.el.appendChild( this.el )
	}
}



Seedbag.prototype. additem	=function( itemn, item )
{
	var el	=document.createElement( "ITEM" )

	switch( itemn )
	{
		case "cucumber_seeds" :

			el.className	=itemn

			el.onclick	=( ev )=>
			{
				let acts	=this.inv.html.contextmenu.newev( ev )

				acts.addopt( "plant", ()=>
				{
					this.inv.pl.movitem( this.plobj , itemn, this.inv.pl.hands )

					this.inv.hide()
				})

				acts.show()
			}

	}
	this.el.appendChild(el)
}