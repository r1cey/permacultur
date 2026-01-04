import newSlot from "./newInvSlot.js"

import newCnt from "./newContainer.js"


export default function( Cnt =newCnt() ,newSlot =newSlot )
{
	class Rcpt	extends newSlot( Cnt )
	{
	}



	Rcpt.prototype. canadditem	=function( nav, _i ,item ,len )
	{
		var lenallow	=this.constructor.canadditem( nav ,_i ,item ,len )

		var curlen	=this.inv[item.gkey()]?.len

		if( curlen )	lenallow	-= curlen

		return lenallow
	}
	

	Rcpt. canadditem	=function( nav ,_i ,item ,len )
	{
		var lenallow	=Math.min( this.allowed[item.gkey()] ,len )

		if( ! lenallow )	return 0

		return Math.min( lenallow ,Cnt.canadditem( nav ,_i ,item ,len ))
	}


	Rcpt. newallow	=function( stcks ,cnts )
	{
		var allowed	=Object.assign( {} ,stcks )

		// Object.assign( allowed  )

		for(var k in cnts )
		{
			allowed[k]	=cnts[k]

			allowed[k+this.Stack.suffix]	=cnts[k]
		}
		return allowed
	}


	return Rcpt
}