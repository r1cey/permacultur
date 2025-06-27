import P from '../Page.js'
import V from "../../game/shared/Vec.js"


export default class Inv extends P
{
	pl

	box

	hands	=new Hands(this)

	seedbag	=[]

	cl()	{return this.html.cl }


	constructor()
	{
		super(...arguments)
		
		this.box	=this.html.screen
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



Inv.prototype. addseedbag	=function()
{
	var sb	=new Seedbag(this)

	this.seedbag.push(sb)

	return sb
}


///////////////////////////////////////////////////////////////////////////////



class InvObj
{
	inv

	el


	additem	//func

	remitem	//func


	constructor( inv, el )
	{
		this.inv	=inv

		this.el	=el
	}
}


///////////////////////////////////////////////////////////////////////////////



class Hands	extends InvObj
{
	constructor( inv )
	{
		super( inv, inv.el.getElementsByTagName("hands")[0] )
	}
}


///////////////////////////////////////////////////////////////////////////////



class Seedbag	extends InvObj
{
	constructor( inv )
	{
		super( inv, document.createElement( "SEEDBAG" ))

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
				let menu	=this.inv.html.contextmenu.newev(ev,)

				menu.addopt( "plant", ()=>
				{
					this.inv.pl.movitem(  this, itemn,  )

					this.inv.hide()

					this.inv.html.can.addonclick((loc, can)=>
					{
						console.log("plant", loc)
					})
				})
			}

	}
	this.el.appendChild(el)
}