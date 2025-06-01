import Loc from "./Loc.js"

import Col from './Color.js'


/** Class for visible players. Has limited information. */

export default class PlVis
{
	name

	r	= 0.62

	col	=new Col(0, 100, 50)
	
	loc	=new Loc(0,0,0)	//when this is derived on client, it can become a getter function

	cl	=0

	sleep	=0
}



PlVis.prototype. fromJSON	=function( plmsg )
{
	for(var key in plmsg )
	{
		if( this[key]?.fromJSON )
		{
			this[key].fromJSON( plmsg[key] )
		}
		else if( key in this )
		{
			this[key]	=plmsg[key]
		}
	}

	return this
}