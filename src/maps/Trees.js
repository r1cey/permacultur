import Loc from "../../www/game/shared/Loc.js"
import V from "../../www/game/shared/Vec.js"
import branches from "./branches.js"

import { WM } from "./tools.js"


///////////////////////////////////////////////////////////////////////////////



class Tr
{
	map

	loc	=new Loc()

	brs	=[]


	/** brs (branches[]) are given in case we grow the tree all at once.
	 * Saves on rescanning them.
	 * WAIT! Doesn't make sense to put in constructor. Was before in "grow"
	 * function. Refactor later */

	constructor( map, loc )
	{
		Object.assign( this,{ map })

		this.loc.set(loc)

		var v	=new Loc()

		// this.brs	=[]

		var Br	=this.constructor.Br

		for(var dir=0; dir<6; dir++)
		{
			if( map.isnextbr( v.set(loc).neighh(dir), dir ))
			{
				this.brs.push(new Br( dir ).scan( map, v ))
			}
		}
		this.brs.sort(( b1, b2 )=> b1.size-b2.size )
	}
}



///////////////////////////////////////////////////////////////////////////////


export class umbrtr	extends Tr
{
	static Br	=branches.umbrtr


	grow()
	{
		var brs	=this.brs

		var brsw	=new WM()

		for(var i=0,len= brs.length ;i<len;i++)
		{
			brsw.m.set( i, 2 )
		}
		brsw.m.set( -1, 1 )

		var grew	=false
		do
		{
			var bri	=brsw.pickrnd()

			if( bri >= 0 )
			{
				// using this.loc for this can be risky but should work considering
				// grow doesn't change vector
				grew	=brs[bri].grow( this.map, this.loc.c().neighh( brs[bri].dir )) 
			}
			else
			{
				grew	=this.newbr()
			}
		}
		while( brsw.m.size && ! grew )

		return grew
	}


	newbr()
	{
		var brs	=this.brs

		if( brs.length === 6 )	return false

		var dirsws	=[new WM([0,1,2,3,4,5], [5,4,3,4,5,6]), 0]
		//soft removes adjacent directions to already existing branches
		dirsws[1]	=new WM( dirsws[0].m )

		for(var i=0; i<brs.length; i++ )// remove dirs
		{
			var dir	=brs[i].dir

			dirsws[1].m.delete ( dir )
	
			for(var j =-1 ; j <= 1; j++)
			{
				dirsws[0].m.delete( V.roth( dir, j ) )
			}
		}
		var v	=new Loc()

		for(var dirsw of dirsws )
		{
			while( dirsw.m.size )
			{
				var dir	=dirsw.pickrnd()

				if( this.map.getfloorty(v.set(this.loc).neighh(dir)) === "none" )
				{
					this.map.set_("branch", v, dir )
			
					brs.unshift( new this.constructor.Br(dir) )
			
					return true
				}
			}
		}
		return false
	}
}


///////////////////////////////////////////////////////////////////////////////


export class apple	extends Tr
{
	static Br	=branches.apple


	grow()
	{
		var brs	=this.brs

		if( ! brs.length )
		{
			return tree.newbranch()
		}
		else if( brs.length === 1 )
		{
			if( brs[0].size > 1 )
			{
				return newbranch( brs )
			}
			else
			{
				return brs[0].grow( m, v.set(loc) )
			}
		}
		else
		{
			if( brs.length === 2 )
			{
				if( brs[0].size > 1 )
				{
					return newbranch( brs )
				}
			}

			for(var i=brs.length-1; i>0; i--)
			{
				if( brs[i].size > brs[i-1].size+1 )
				{
					return brs[i-1].grow( m, v.set(loc) )
				}
			}

			return brs[brs.length-1].grow( m, v.set(loc))
		}
	}


	newbranch()
	{
		var v	=vbuf
		
		var softdirs	=new Set([0,1,2,3,4,5])
	
		var dir
	
		for(var i=0; i<brs.length; i++ )
		{
			dir	=brs[i].dir
	
			if( m.isnextbr( v.set(loc).neighh(dir), dir ))	//this check is redundant
			{
				for(var j =-1 ; j <= 1; j++)
				{
					softdirs.delete( V.roth( dir, j ) )
				}
			}
		}
	
		dir	=-1
	
		for(var soft=1; soft >= 0 ; soft--)
		{
			if( (dir =scan([0,4,5],soft)) >= 0 )	break
	
			if( (dir =scan([1,3],soft)) >= 0 )	break
	
			if( (dir =scan([2],soft)) >= 0 )	break
		}
	
		if( dir >= 0 )
		{
			m.set_("branch", v.set(loc).neighh(dir), dir )
	
			brs.push( new Br(dir) )
	
			return true
		}
		else
		{
			return false
		}
	
	
	
		function scan( dirs, soft )
		{
			while( dirs.length )
			{
				var i	=rnd(dirs.length)
	
				if( (soft ?softdirs.has(dirs[i]) :1) &&
				
					m.getfloorty(v.set(loc).neighh(dirs[i])) === "none" )
				{
					return dirs[i]
				}
	
				dirs.splice(i, 1)
			}
	
			return -1
		}
	}
}