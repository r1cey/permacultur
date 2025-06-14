import Loc from "../Loc.js"

import Col from '../Color.js'


/** Class for visible players. Has limited information. */

export default class PlVis
{
	name

	r	= 0.62

	col	=new Col(0, 100, 50)
	
	loc	=new Loc(0,0,0)	//when this is derived on client, it can become a getter function

	cl	=0

	sleep	=0

	hands	=new Hands(this)
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