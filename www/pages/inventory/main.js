import P from '../Page.js'


export default class Inv extends P
{
	cont


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