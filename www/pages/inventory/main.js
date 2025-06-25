import P from '../Page.js'
import V from "../../game/shared/Vec.js"


export default class Inv extends P
{
	box

	context

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

			el.onclick	=( ev )=>
			{
				let menu	=this.inv.html.contextmenu.newev(ev,)

				menu.addopt( "plant", ()=>
				{
					this.inv.cl().pl.movitem( , itemn, )

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