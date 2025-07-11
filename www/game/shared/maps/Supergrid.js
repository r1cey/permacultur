import newBinMap from "./newBinMap";
import Loc from "../Loc";


class SG extends newBinMap()
{
	arr


	/** @arg mapr	-radius of the original map
	 * @arg hexr */

	constructor( mapr, hexr, loc )
	{
		super( SG.calcradius( mapr, hexr), 0, loc )
	}
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