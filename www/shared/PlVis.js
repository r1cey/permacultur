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


PlVis.prototype. fromJSON	=function( pla )
{
	for(var prop in pla )
	{
		if( this[prop]?.fromJSON )
		{
			this[prop].fromJSON( pla[prop] )
		}
		else
		{
			this[prop]	=pla[prop]
		}
	}

	return this
}