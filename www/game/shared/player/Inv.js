export default class Inv
{
	o	={}


	constructor( inv )
	{
		this.o	=inv?.o || this.o
	}
}


Inv.prototype. additem	=function( itemn, item )
{
	this.o[itemn]	=item
}


Inv.prototype. remitem	=function( itemn )
{
	delete this.o[itemn]
}