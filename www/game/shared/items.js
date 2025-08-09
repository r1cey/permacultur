import Loc	from "./Loc.js"
import { rnd }	from "./utils.js"

var t	={}


t.Item	=class
{
	num	=1

	spoil	=0

	/** A unit is 125 cubic mm which is a sunflower seed */
	static vol	=1


	constructor( obj, num )
	{
		Object.assign( this, obj )

		num	!= null	? this.num	=num	: 0
	}


	calcvol()
	{
		return this.constructor.vol * this.num
	}
}


///////////////////////////////////////////////////////////////////////////////


t.Dewd	=class extends t.Item
{
	dir

	static vol	=500000


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


t.newBelt	=function( Box )
{
	return class extends Box
	{
		static vol	=Math.floor(100*200*70/125)

		static boxvol	=2**31
	}
}


t.newSeedbag	=function( Box )
{
	return class extends Box
	{
		static vol	=Math.floor(40*25*20/125)

		static boxvol	=Math.floor(55*45*45/125)
	}
}

///////////////////////////////////////////////////////////////////////////////


export default t