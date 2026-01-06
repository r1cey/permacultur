import newstacks	from "./newstacks.js"
import newcnts	from "./newcnts.js"
import newblocks	from "./newblocks.js"
import newbags	from "./newbags.js"


export default function newitems( Stack ,Rcpt ,Box ,Bag ,Block )
{
	var stacks	=newstacks( Stack )

	var o	={}

	for(var n in stacks )
	{
		o[stacks[n].key]	=stacks[n]
	}

	/*newBag( class
	{
		static vol	=Math.floor(40*25*20/125)
	
		static boxvol	=Math.floor(55*45*45/125)

		static key	="seedbag"
	}*/
	
	return o
}