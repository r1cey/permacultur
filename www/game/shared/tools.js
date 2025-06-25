import Loc	from "./Loc.js"


var t	={}



t.Dewd	=class
{
	dir	=5


	constructor( dewd )
	{
		Object.assign( this, dewd )
	}


	rot( dir )
	{
		this.dir	=Loc.roth( this.dir, dir )
	}


	draw( can, loc, vbuf )
	{
		var ctx	=can.ctx

		ctx.save()

		vbuf.set(loc).tosqc(can)

		ctx.translate( vbuf.x, vbuf.y )

		ctx.rotate( -Loc.rad60 * (this.dir+1) )

		ctx.translate( -vbuf.x, -vbuf.y )
	
		can.drawimg( loc, can.imgs().o.dewd, vbuf )

		ctx.restore()
	}
}


t.newSeedbag	=function( Inv )
{
	class SB extends Inv
	{

	}

	return SB
}


export default t