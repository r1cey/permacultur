import ShIt	from "../shared/items/Item.js"

import Cl	from "../Client.js"



export default class Item extends ShIt
{
	dad

	static imgmap

	static img



	getcl()
	{
		var obj	=this.dad

		while( !( obj instanceof Cl ) )	obj	=obj.dad
	}



	draw( can, lov, vbuf )
	{
	}



}
