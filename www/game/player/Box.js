import ShBox	from "../shared/items/Box.js"



export default class Box extends ShBox
{
	htmlbox
}


/** This needs to return the same as shared class */

Box.prototype. additem	=function( itemn, item, num )
{
	var moved	=ShBox.prototype.additem. call(this, itemn, item, num )

	return moved &&	this.htmlbox?.additem( itemn, item, moved )
}


Box.prototype. delitem	=function( itemn, num )
{
	ShBox.prototype.delitem. call(this, itemn, num )

	this.htmlbox?.delitem( itemn, num )
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