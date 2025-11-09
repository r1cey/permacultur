import newstacks	from "./newstacks.js"
import newcnts	from "./newcnts.js"
import newblocks	from "./newblocks.js"
import newbags	from "./newbags.js"


export default function newthings( Stack ,Cnt ,Bag ,Block )
{
	var o	=
	{
		stacks	:newstacks(Stack)
		,
		cnts	:newcnts(Cnt)
		,
		blocks: newblocks( Block )
		,
		bags: newbags( Bag )
		,
		foreach	:function( fn )
		{
			for(var k in this.stacks )	fn( this.stacks[k] )

			for(var k in this.cnts )	fn( this.cnts[k] )

			for(var k in this.blocks )	fn( this.blocks[k] )

			for(var k in this.bags )	fn( this.bags[k] )

			//for(var k in this.)	fn( this.[k] )
		}
	}
	return o
}