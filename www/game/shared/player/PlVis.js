import Loc from "../Loc.js"
import Col from '../Color.js'

import Hands from "./Hands.js"

// import Holder from "../items/Container.js"
import Jable from "../Jsonable.js"



/** Class for visible players. Has limited information.
 * Also extends Container
*/

export default class PlVis	extends Jable
{
	name

	r	= 0.62

	col	=new Col(0, 100, 50)
	
	loc	=new Loc(0,0,0)	//when this is derived on client, it can become a getter function

	cl	=0

	sleep	=0

	hands	=new Hands()

	inv	=
	{
		seedbags	:{}
	}
}



PlVis.prototype. set	=function( pl )
{
	for(var key in pl )
	{
		if( key in this )
		{
			this[key]	=pl[key]
		}
	}
	return this
}



PlVis.prototype. additem	=function( item ,len )
{
	len	??=item.num

	var key	=item.constructor.key

	var addedlen

	switch( key )
	{
		case "belt" :

			addedlen	=1

			this.inv.belt	=item.take( addedlen )
		break
		case "seedbag" :

			let bags	=this.inv.seedbags

			let bagsl	=0

			for(var bagid in bags )
			{
				bagsl ++
			}
			addedlen	=Math.min( len, 15 - bagsl )

			if( addedlen <= 0 )	return 0

			for(var i =0;i< addedlen ;i++)
			{
				var newitem	=item.take( 1 )

				if( ! newitem.id )	newitem.setuniq()

				bags[newitem.id]	=newitem
			}
		break
		default :

			addedlen	=0
	}
	return addedlen
}