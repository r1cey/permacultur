import Can from "./canvas/Canvas.js"

import SG from "./game/shared/maps/Supergrid.js"
import V from "./game/shared/Vec.js"



var can	=new Can(null, document.getElementById("can"))

can.zoom(0.33)

can.drawgrid()

var vsq	=new V()

var v	=new V()

// draw( 3 )

window.draw	=draw_tosuper

window.draw2	=draw_tosub


function draw_tosub( r, col )
{
	window.sg	=new SG( 80, r )

	sg.fore(( loc )=>
	{
		sg.tosub( v.set(loc) )

		if( can.isvis( v.c() ))
		{
			vsq.set(v).tosqc(can)

			can.fillhex( vsq, col )
		}
	})
}


function draw_tosuper( r )
{
	window.sg	=new SG( 30, r )

	can.forcell(( loc )=>
	{
		// console.log( can.isvis( loc.c() ))

		sg.tosuper( v.set(loc) )

		var col	=[v.x, v.y, v.z()]

		col	=col.map(( val )=> Math.abs(val*64)%256 )

		// can.ctx.fillStyle =

		vsq.set(loc).tosqc(can)
		
		can.fillhex( vsq, `rgb(${col.join(" ")})` )

		// can.ctx.fillStyle	="#888888"

		// can.ctx.fillText( v, vsq.x, vsq.y )
	})
}