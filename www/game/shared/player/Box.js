export default class Box
{
	o	={}


	constructor( inv )
	{
		this.o	=inv?.o || this.o
	}
}


Box.prototype. additem	=function( itemn, item )
{
	this.o[itemn]	=item
}


Box.prototype. delitem	=function( itemn )
{
	delete this.o[itemn]
}