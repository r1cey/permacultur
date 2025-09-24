import Item from "./Item.js"
import Cont	from "./Container.js"
import Box	from "./Box.js"
import Loc	from "../Loc.js"
import{ rnd }	from "../utils.js"



/** Anything that can be held in a hand */

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


	sim_rot( ddir )
	{
		return Loc.roth( this.dir, ddir )
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


t.Belt	=class extends Cont
{
	static vol	=Math.floor(15*15*10/125)

	static key	="belt"

	inv	=
	{
		seedbags	:{}
	}


	additem( item )
	{
		var inv	=this.inv

		switch( item.constructor.key )
		{
			case "multi" :

				if( inv.multi )	return false

				inv.multi	=item
			break
			default :

				return false
		}
		return true
	}
}


t.Seedbag	=class extends Box
{
	static vol	=Math.floor(40*25*20/125)
 
	static boxvol	=Math.floor(55*45*45/125)

	static key	="seedbag"
}



t.Multi	=class extends Item
{
	static key	="multi"
}


t.CucumberSeed	=class extends Item
{
	static vol	=1

	static key	="cucumber_seeds"
}

///////////////////////////////////////////////////////////////////////////////


export default t