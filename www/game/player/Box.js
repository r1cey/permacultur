import ShBox	from "../shared/player/Box.js"



export default class Box extends ShBox
{
	htmlbox
}


Box.prototype. additem	=function( itemn, item )
{
	ShInv.prototype.additem. call(this, itemn, item )

	this.htmlbox?.additem( itemn, item )
}


Box.prototype. delitem	=function( itemn )
{
	ShInv.prototype.delitem. call(this, itemn )

	this.htmlbox?.delitem( itemn )
}

/*
Box.prototype. attachhtmlinv	=function( htmlinv )
{
	this.htmlobj	=htmlinv.addseedbag( this )

	for(var itemn in this.o )
	{
		this.htmlobj.additem( itemn, this.o[itemn] )
	}
}*/