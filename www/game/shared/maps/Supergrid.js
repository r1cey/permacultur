import newBinMap from "./newBinMap.js";
import BitM from "./BitMap.js";
import Loc from "../Loc.js";
import V	from "../Vec.js";


export default class SG extends newBinMap( 0,0, BitM )
{
	r

	sin

	cos

	dh2


	/** @arg mapr	-radius of the original map
	 * @arg hexr */

	constructor( mapr, hexr, loc =new Loc() )
	{
		super( SG.calcradius( mapr, hexr), 0, loc )

		this.r	=hexr

		var h2	=V.super.h2( hexr )

		this.sin	=V.super.sin( hexr, h2 )

		this.cos	=Math.sqrt( 1 - this.sin*this.sin )

		this.dh2	=1 / h2
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Transforms loc */

SG.prototype. tosuper	=function( loc )
{
	return loc.tosuper(0, this.sin, this.cos, this.dh2 )
}



SG.prototype. is	=function( loc )
{
	return this.getval( this.ic(loc) )
}



SG.prototype. setx	=function( loc, x )
{
	this.setval( this.ic(loc), x )
}


///////////////////////////////////////////////////////////////////////////////


/** @arg r	-the radius of new superhex (>0) */

SG.calcradius	=function( mapr, r )
{
	var n	=r

	var newmapr	=0

	var gendist	=[ SG.wave( r+1 ,(r<<1)+1 , r+1 ,1 ),
		
			SG.wave( r+1 ,(r<<1)+1 , r<<1 ,-1 ) ]

	var odd	=true

	while( n < mapr )
	{
		n	+= gendist[Number(!odd)].next().value

		odd	=!odd

		newmapr ++
	}
	return newmapr
}


///////////////////////////////////////////////////////////////////////////////


/** @arg d	-delta +1/-1 */

SG.wave	=function *( min, max, start, d )
{
	var i	=start

	while(true)
	{
		while( i >= min )
		{
			yield i

			d	=i>=max	?-1	:d

			i	+= d
		}
		i	=min

		d	=1
	}
}