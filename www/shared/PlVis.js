import Loc from "./Loc.js"

import Col from './Color.js'


/** Class for visible players. Has limited information. */

export default class PlVis
{
	name

	r	= 0.62

	col	=new Col(0, 100, 50)
	
	loc	=new Loc(0,0,0)	//(not sure if true anymore) when this is derived, it can become a getter function

	cl	=0

	sleep	=0
}