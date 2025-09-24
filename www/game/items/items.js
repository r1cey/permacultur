import sh_its	from "../shared/items/items.js"
import Hold from "../Holder.js"
import Item from "./Item.js"
import Bag	from "./Box.js"

import{ mixin }	from "../shared/utils.js"



var its	={}

Object.assign( its, sh_its )



its.Belt	=mixin( sh_its.Belt ,Item ,Hold ,class
{
	attachhtmlinv( htmlinv_dad )
	{
		this.htmlinv	=htmlinv.addbelt( this )

		for(var itemn in this.o )
		{
			this.htmlobj.additem( itemn, this.o[itemn] )
		}
	}
} )



its.Seedbag	=mixin([ sh_its.Seedbag, Bag ],class
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



its.Dewd	=mixin( sh_its.Dewd ,Item ,class
{
	rot( dir )
	{
		this.dir	=dir
	}
} )



export default its