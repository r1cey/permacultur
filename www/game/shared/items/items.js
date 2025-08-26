import Item from "./Item.js"
import Box	from "./Box.js"
import Loc	from "../Loc.js"
import{ rnd }	from "../utils.js"



var t	={}


///////////////////////////////////////////////////////////////////////////////



t.Dewd	=class extends Item
{
	dir

	active	=false

	static vol	=500000

	static key	="dewd"


	constructor( dewd )
	{
		super( dewd )

		this.dir	??=rnd(6)
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
	
		can.drawimg( loc, can.imgs().o.dewd, 1, vbuf )

		ctx.restore()
	}
}


t.Belt	=class
{
	static key	="belt"
}


t.Seedbag	=class extends Box
{
	static vol	=Math.floor(40*25*20/125)

	static boxvol	=Math.floor(55*45*45/125)

	static key	="seedbag"
}


t.CucumberSeed	=class extends Item
{
	static key	="cucumber_seeds"
}

///////////////////////////////////////////////////////////////////////////////


export default t