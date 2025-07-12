import Can from "./canvas/Canvas.js"

import SG from "./game/shared/maps/Supergrid.js"
import V from "./game/shared/Vec.js"



var can	=new Can(null, document.getElementById("can"))

can.zoom(0.33)

can.drawgrid()

// draw( 3 )

window.draw	=draw


function draw( r )
{
	window.sg	=new SG( 30, r )

	var vsq	=new V()

	var v	=new V()


	can.forcell(( loc )=>
	{
		sg.trans( v.set(loc) )

		var col	=[v.x, v.y, v.z()]

		col	=col.map(( val )=> Math.abs(val*64)%256 )

		// can.ctx.fillStyle =

		vsq.set(loc).tosqc(can)
		
		can.fillhex( vsq, `rgb(${col.join(" ")})` )

		// can.ctx.fillStyle	="#888888"

		// can.ctx.fillText( v, vsq.x, vsq.y )
	})
}