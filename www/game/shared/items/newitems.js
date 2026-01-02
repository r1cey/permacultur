import newstacks	from "./newstacks.js"
import newcnts	from "./newcnts.js"
import newblocks	from "./newblocks.js"
import newbags	from "./newbags.js"


export default function newthings( Stack ,Cnt ,Bag ,Block )
{
	var o	=
	{
		foreach	:function( fn )
		{
			for(var k in this.stacks )	fn( this.stacks[k] )

			for(var k in this.cnts )	fn( this.cnts[k] )

			for(var k in this.blocks )	fn( this.blocks[k] )

			for(var k in this.bags )	fn( this.bags[k] )

			//for(var k in this.)	fn( this.[k] )
		},
		keys	:{}
	}

	newBag( class
	{
		static vol	=Math.floor(40*25*20/125)
	
		static boxvol	=Math.floor(55*45*45/125)

		static key	="seedbag"
	}


	o.foreach(( Clss )=>
	{
		o.keys[Clss.key]	=Clss
	})
	return o
}