import Loc from "../../www/game/shared/Loc.js"
import branches from "./branches.js"


///////////////////////////////////////////////////////////////////////////////



class Tr
{
	map

	loc

	brs	=[]


	/** brs (branches[]) are given in case we grow the tree all at once.
	 * Saves on rescanning them.
	 * WAIT! Doesn't make sense to put in constructor. Was before in "grow"
	 * function. Refactor later */

	constructor( map, loc )
	{
		Object.assign( this,{ map, loc })

		var v	=new Loc()

		this.brs	=[]

		for(var dir=0; dir<6; dir++)
		{
			if( map.isnextbr( v.set(loc).neighh(dir), dir ))
			{
				this.brs.push(new Br( dir ).scan( v ))
			}
		}
		this.brs.sort(( b1, b2 )=> b1.size-b2.size )
	}
}



///////////////////////////////////////////////////////////////////////////////


export class umbrtr	extends Tr
{
	static Br	=Branch.umbrtr
}


///////////////////////////////////////////////////////////////////////////////


export class apple	extends Tr
{
	
}