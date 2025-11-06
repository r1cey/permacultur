import Block	from "./Block.js"
import Item from "./Item.js"
import Cont	from "./Container.js"
import Box	from "./Box.js"
import Loc	from "../Loc.js"
import{ rnd }	from "../utils.js"



/** Anything that can be held in a hand */

var t	={}


///////////////////////////////////////////////////////////////////////////////



t.Dewd	=class extends Block
{
	dir

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


	activate( )
	{
		var cello	=map.obj.g(loc)

		var item	=cello.drop[this.gkey()]

		var actitem	=item.take()

		delete cello.drop[this.gkey()]

		/** @todo push remaining items out of cell */

		actitem.active	=true

		cello.block	=actitem
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
		/**@prop has seedbag ids. They all must have id even if empty */
		seedbags	:{}
	}


	additem( item ,len )
	{
		var belt	=Cont.prototype.additem. call(this, item )

		len	??=item.num

		var inv	=belt.inv

		var addedlen

		switch( item.constructor.key )
		{
			case "multi" :

				if( inv.multi )	return 0

				addedlen	=1

				inv.multi	=item.take( addedlen )
			break
			default :

				addedlen	=0
		}
		return addedlen
	}


	calcvol()
	{
		var vol	=0

		for(var ik in this.inv )
		{
			if( ik === "seedbags" )
			{
				for(var sbid in this.inv[ik] )	vol	+= this.inv[ik][sbid].calcvol()
			}
			else	vol	+= this.inv[ik].calcvol()
		}
		return vol
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