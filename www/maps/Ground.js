import newShGr	from "../shared/maps/newGround.js"
import Map	from './Map.js'

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"




export default class Gr extends newShGr( Map )
{
}


///////////////////////////////////////////////////////////////////////////////



Gr.prototype. draw	=function( can )
{
	let vsq	=new V()

	let h	=can.pl?.pos.h	|| 0

	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		vsq.set(loc).tosqc(can)

		this.drawhex( can, loc, h, vsq )
	})
}


///////////////////////////////////////////////////////////////////////////////



Gr.prototype. drawhex	=function( can, loc, plh, vsq, ic )
{
	var map	=this

	vsq	??=new V().set(loc).tosqc(can)

	ic	??=map.i(loc)

	var h	=can.units.h2>>1

	if( can.showslopes )
	{
		var dir
		
		var arrw	=can.units.r*0.40
		
		var arrh	=can.units.h2*0.21

		var arrcol	="#ffffff"
	}

	var ctx	=can.ctx

	ctx.globalAlpha	=1

	var col	=new Col()

	var max

	var lvl	=map.getsoilhumi( ic )

	if( lvl >= 0 )
	{
		col.sethsl( 57, 16, 42)	// 2, 47, 10

		max	=Gr.maxhum()

		col.add( lvl*(-55)/max, lvl*(31)/max, lvl*(-32)/max )

		can.fillhex( vsq, col.str() )

		if( can.showlvls )
		{
			can.ctx.fillStyle="#FFFFFF"

			can.ctx.fillText( lvl, vsq.x, vsq.y )
		}

		if( map.isvegi( ic ))
		{
			switch( map.getvegti( ic ) )
			{
				case Gr.e.veg.apple:

					map.drawstem( can, loc, vsq, ic, col )
			}
		}
	}
	else if( lvl =map.gwateri(ic) )
	{
		col.sethsl( 179, 34, 45 )	// 269, 45, 10

		max	=Gr.maxwater()-1

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
}




Gr.prototype. drawstem	=function( can, loc, vsq, ic, col )
{
	var map	=this

	vsq	??=new V().set(loc).tosqc(can)

	ic	??=map.i(loc)

	var lvl	=map.getveglvli(ic)

	var max	=Gr.maxveglvl()

	var h	=can.units.h2>>1
	
	// col.sethsl( 112, 44, 61 )	//46, 34, 34

	// col.add( lvl*(-66)/max, lvl*(-10)/max, lvl*(-27)/max )

	Gr.treecol( lvl, col )

	var r	=lvl<3	?(lvl*h)>>3	:Gr.calcy( 3,h>>1,max,h,lvl ) //h*(lvl+max-6)/(2*max-6)

	can.fillcirc( vsq.x, vsq.y, r,
		
		col.str(), "#000000" )

	if( can.showtrlvls )
	{
		can.ctx.fillStyle="#FFFFFF"

		can.ctx.fillText( lvl, vsq.x, vsq.y )
	}
}


///////////////////////////////////////////////////////////////////////////////




Gr.treecol	=function( lvl, col )
{
	if( lvl < 1 )
	{
		col.sethsl( 112, 44, 61 )
	}
	else if( lvl === 1)
	{
		col.sethsl( 100, 32, 40 )
	}
	else if( lvl === 2 )
	{
		col.sethsl( 90, 52, 32 )
	}
	else
	{
		let max	=Gr.maxveglvl()

		let cy	=Gr.calcy

		// col.sethsl( 52, 69, 25 )//18°, 92%, 16%

		col.sethsl(cy(3,52,max,18,lvl),cy(3,69,max,92,lvl),cy(3,25,max,16,lvl))
	}
}