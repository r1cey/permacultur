import its	from "../shared/items/items.js"
import Hold from "../Holder.js"
import Item from "./Item.js"
import Bag	from "./Box.js"

import{ mixin }	from "../shared/utils.js"


its.Belt	=mixin([ its.Belt, Item, Hold ],class
{
	attachhtmlinv( htmlinv )
	{
		this.htmlobj	=htmlinv.addbelt( this )

		for(var itemn in this.o )
		{
			this.htmlobj.additem( itemn, this.o[itemn] )
		}
	}
} )



its.Seedbag	=mixin([ its.Seedbag, Bag ],class
{
	attachhtmlinv( htmlinv )
	{
		this.htmlobj	=htmlinv.addseedbag( this )

		for(var itemn in this.o )
		{
			this.htmlobj.additem( itemn, this.o[itemn] )
		}
	}
} )



export default its