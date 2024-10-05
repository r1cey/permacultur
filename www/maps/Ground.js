import Maps	from "../shared/maps/Maps.js"

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"




export default class Gr extends Maps.Gr
{

}


///////////////////////////////////////////////////////////////////////////////



Gr.prototype. draw	=function( can )
{
	var map	=this

	var vsq	=new V()

	var lvl

	if( can.showslopes )
	{
		var dir
		
		var arrw	=can.units.r*0.40
		
		var arrh	=can.units.h2*0.21

		var arrcol	="#ffffff"
	}

	var col	=new Col()

	var max, ic

	can.forcell(( loc )=>
	{
		if( ! map.inside(loc) )	return

		vsq.set(loc).tosqc(can)

		ic	=map.i(loc)

		lvl	=map.getsoilhumi( ic )

		if( lvl >= 0 )
		{
			col.sethsl( 57, 16, 42)	// 2, 47, 10

			max	=map.maxhum()

			col.add( lvl*(-55)/max, lvl*(31)/max, lvl*(-32)/max )

			can.fillhex( vsq, col.str() )

			if( can.showlvls )
			{
				can.ctx.fillStyle="#FFFFFF"

				can.ctx.fillText( lvl, vsq.x, vsq.y )
			}

			if( map.isfloori( ic ))
			{
			}
			else
			{
				if( lvl =map.getvegti( ic ))
				{
					switch( lvl )
					{
						case 5:

							lvl	=map.getveglvli(ic)

							col.sethsl( 112, 44, 61 )	//46, 34, 34

							max	=map.maxveglvl()

							col.add( lvl*(-66)/max, lvl*(-10)/max, lvl*(-27)/max )

							can.fillcirc( vsq.x, vsq.y,

								lvl * (can.units.h2>>1) / max,
								
								col.str(), "#000000" )
					}
				}
			}
		}
		else if( lvl =map.gwateri(ic) )
		{
			col.sethsl( 179, 34, 45 )	// 269, 45, 10

			max	=map.maxwater()-1

			lvl--

			col.add( lvl*90/max, lvl*11/max, lvl*(-35)/max )

			can.fillhex( vsq, col.str() )

			if( can.showlvls )
			{
				can.ctx.fillStyle="#FFFFFF"

				can.ctx.fillText( lvl, vsq.x, vsq.y )
			}
		}

		if( can.showslopes )
		{
			dir	=map.getdir( loc )

			if( dir < 6 )
			{
				vsq.set(loc).steph( dir, 0.32 ).tosqc(can)

				can.ctx.globalAlpha	=0.1

				can.drawarrow( vsq, arrw, arrh, dir, arrcol )

				vsq.set(loc).steph( dir, -0.05 ).tosqc(can)

				can.drawarrow( vsq, arrw, arrh, dir, arrcol )

				can.ctx.globalAlpha	=1
			}
		}
	})
}