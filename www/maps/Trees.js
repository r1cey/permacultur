import Maps	from "../shared/maps/Maps.js"

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"




export default class Tr extends Maps.Tree
{

}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. drawhex	=function( can, loc, plh, vsq, ic )
{
	var map	=this

	vsq	??=new V().set(loc).tosqc(can)

	ic	??=map.i(loc)

	var alpha	=plh === map.getloc().h	? 1	: 0.22

	switch( map.getbranchti( ic ))
	{
		case 2 :

			map.drawbr( can, map.getbranchdi(ic), vsq, alpha )

			if( can.showbrlvls )
			{
				can.ctx.fillStyle="#FFFFFF"
		
				can.ctx.fillText( map.getbranchdi(ic), vsq.x, vsq.y )
			}
	}
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. drawbr	=function( can, dir, vsq, al )
{
	var { h2 }	=can.units

	var vsrc	=new V(  )

	switch( dir )
	{
		case 0 :

			vsrc.setxy( -V.sin60*h2, -h2>>1 )
		break;
		case 1 :

			vsrc.setxy( -V.sin60*h2, h2>>1 )
		break;
		case 2 :

			vsrc.setxy( 0, h2 )
		break;
		case 3 :

			vsrc.setxy( V.sin60*h2, h2>>1 )
		break;
		case 4 :

			vsrc.setxy( V.sin60*h2, -h2>>1 )
		break;
		case 5 :

			vsrc.setxy( 0, -h2 )
		break;
	}

	vsrc.addv( vsq )

	var ctx	=can.ctx

	ctx.lineWidth	=2
	ctx.globalAlpha	=al
	ctx.strokeStyle	="#fff"

	ctx.beginPath()
	ctx.moveTo( vsrc.x, vsrc.y )
	ctx.lineTo( vsq.x, vsq.y )
	ctx.stroke()
}