export default class Inv
{
	box	=document.createElement( "INV" )


	constructor()
	{
	}
}


///////////////////////////////////////////////////////////////////////////////



Inv.prototype. show	=function()
{
	document.body.appendChild( this.box )
}


Inv.prototype. hide	=function()
{
	document.body.removeChild( this.box )
}