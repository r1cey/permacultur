import ShInv	from "../shared/player/Inv.js"



export default class Inv extends ShInv
{
	htmlobj
}


Inv.prototype. additem	=function( itemn, item )
{
	ShInv.prototype.additem. call(this, itemn, item )

	this.htmlobj.additem( itemn, item )
}


Inv.prototype. remitem	=function( itemn )
{
	ShInv.prototype.remitem. call(this, itemn )

	this.htmlobj.remitem( itemn )
}

/*
Inv.prototype. attachhtmlinv	=function( htmlinv )
{
	this.htmlobj	=htmlinv.addseedbag( this )

	for(var itemn in this.o )
	{
		this.htmlobj.additem( itemn, this.o[itemn] )
	}
}*/