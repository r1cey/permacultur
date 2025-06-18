import ShMap	from "../shared/maps/Map.js"

import Loc from "../shared/Loc.js"



export default class Map extends ShMap
{
	maps	// might not be necessary
			// maps might have canvas element instead






	// static Msg	=Base // ?


	/** Get two points which make a line, an X value of point on that line,
	 * and return the Y value of that point */

	static calcy( x1, y1, x2, y2, x )
	{
		var m	=(y2-y1)/(x2-x1)

		return m*x + y1 - m*x1
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Shift map in certain direction, add data
 * from cells array for revealed cells
 * @arg {Number}	dir	- direction
 * @arg {Array}	arrs	-for each buffer an array of codes
 * @arg {Array} objs	-empty cells are empty
 * @arg {Function}	parse	- parsing function to call on each object added
 */

Map.prototype. shift	=function( dir, board )
{
	var map	=this

	// map.setloc(map.getloc().addv( Loc.dirvh[dir] ))

	var diropp	=Loc.roth(dir, Loc.dirvh.length>>1)

	var r	=this._r
	
	var coropp	=this.corner(diropp)

	var v	=new Loc()
	
	var vnext	=new Loc()

	for(var i, j, side =-1; side <= 1; side += 2 )
	{
		for(j=0;  j < r+1; j++)
		{
			if( j===0 && side>0 )	continue

			v.set( coropp.c().steph(Loc.roth(dir, side), j) )

			vnext.set( v.c().neighh(dir) )

			delete this.obj.o[v.tovstr()]

			for(i=0; i < (r<<1)-j; i++)
			{
				var ic	=this.ic( v )
				var ic2	=this.ic( vnext )

				this.bin.setcell( ic, this.bin.getcell( ic2 ) )

				if( this.bin2 )
				{
					this.bin2.setcell( ic, this.bin2.getcell( ic2 ) )
				}
				v.neighh(dir)

				vnext.neighh(dir)
			}
		}
	}
	map.setloc(map.getloc().addv( Loc.dirvh[dir] ))

	var boic	=0	//board index cell

	map.fordiredge(( v )=>
	{
		this.bin.setcell( this.ic(v), board.bin.getcell( boic ) )

		if( board.obj[boic] )	this.obj.o[v.tovstr()]	=board.obj[boic]

		boic ++
	}
	, dir )
}