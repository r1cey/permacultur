import P from '../Page.js'
import V from "../../game/shared/Vec.js"


export default class Inv extends P
{
	pl

	dadel

	hands

	belt

	seedbag	=[]

	cl()	{return this.html.cl }


	hide()
	{
		try
		{
			this.dadel.removeChild( this.el )
		}
		catch(err) {}

		this.html.can.el.removeEventListener( "click", this.hidebound )
	}
	hidebound	=this.hide.bind(this)


	constructor( html, el, css, pl )
	{
		super( html, el, css )
		
		this.dadel	=this.html.screen

		this.hands	=new Hands(this, pl.hands )

		pl.attachhtmlinv( this )
	}
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. show	=function()
{
	this.dadel.appendChild( this.el )

	this.html.can.el.addEventListener("click", this.hidebound,{ once :true})
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. addbelt	=function( plbox )
{
	this.belt	=new Belt(this, plbox )

	return this.belt
}



Inv.prototype. addseedbag	=function( plbox )
{
	var sb	=new Seedbag(this, plbox )

	this.seedbag.push(sb)

	return sb
}


///////////////////////////////////////////////////////////////////////////////



class HtmlBox
{
	inv

	el

	plbox


	additem( itemn, item, num )	{}


	constructor( inv, el, plbox )
	{
		this.inv	=inv

		this.el	=el

		this.plbox	=plbox
	}



	additem( itemn, num )
	{
		var el	=document.createElement( "ITEM" )

		el.className	=itemn

		el.textContent	=num

		el.onclick	=( ev )=>
		{
			let acts	=this.inv.html.contextmenu.newev( ev )

			acts.addopt( "Use All", ()=>
			{
				let pl	=this.inv.pl

				let from	=this.plbox

				let to	=pl.hands
				
				from !== to ? pl.movitem( from , itemn, num, to ) : 0

				this.inv.hide()
			})
			acts.show()
		}
		this.el.appendChild( el )
	}


	delitem( itemn, num )
	{
		var el	=this.el.querySelector("."+itemn)

		var rem	=el.textContent - num

		rem > 0	? el.textContent =rem	: this.el.removeChild( el )
	}
}


///////////////////////////////////////////////////////////////////////////////



class Hands	extends HtmlBox
{
	constructor( inv, plbox )
	{
		super( inv, inv.el.getElementsByTagName("hands")[0], plbox )
	}
}


///////////////////////////////////////////////////////////////////////////////



class Belt	extends HtmlBox
{
	constructor( inv, plbox )
	{
		super( inv, inv.el.getElementsByTagName("BELT")[0], plbox )
	}
}


///////////////////////////////////////////////////////////////////////////////



class Seedbag	extends HtmlBox
{
	constructor( inv, plbox )
	{
		super( inv, document.createElement( "SEEDBAG" ), plbox )

		this.inv.el.appendChild( this.el )
	}
}