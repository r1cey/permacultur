import Loc from "../../www/game/shared/Loc.js"
import V from "../../www/game/shared/Vec.js"
import branches from "./branches.js"

import { WM } from "../../www/game/shared/utils.js"


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


Tr.prototype. findbr	=function( dir )
{
	for(var br of this.brs )
	{
		if( br.dir === dir )	return br
	}
	return null
}



///////////////////////////////////////////////////////////////////////////////


export class umbrtr	extends Tr
{
	static Br	=branches.umbrtr


	/** @todo consider movings brs to Map and look for neighbors through it */
	grow()
	{
		var brs	=this.brs

		var loc	=this.loc

		var dirsw	=new WM([0,1,2,3,4,5], [5,4,3,4,5,6])

		var min	=Number.MAX_SAFE_INTEGER

		var v	=new Loc()

		for(var i=0,len= brs.length ;i<len;i++)
		{
			min	=Math.min ( brs[i].size, min )

			//if neighboring cells are empty,
			//  penalise growth near existing branches
			for(var j =-1 ;j <= 1 ;j += 2)
			{
				var newdir	=V.roth( brs[i].dir, j )

				if( this.map.getfloorty( v.set(loc).neighh( newdir ))

					=== "none" )	dirsw.m.set( newdir, 0.1 )
			}
		}
		min	=len>=6	? min	: 0

		for(i=0;i<len;i++)
		{
			var w	=dirsw.m.get(brs[i].dir)

			var d	=brs[i].size - min

			dirsw.m.set( brs[i].dir, d===0 ? w :

				d===1 ? 27*(w-2)-w :

					d===2 ? Math.max(0, 27*(w-5)-w) : 0 )
		}
		var map	=this.map

		var grew	=false
		do{
			var dir	=dirsw.pickrnd()

			var floort	=map.getfloorty( v.set(loc).neighh(dir) )

			if( floort === "branch" && map.getbrdir(v) === dir )
			{
				// using this.loc for this can be risky but should work considering
				// grow doesn't change vector
				grew	=this.findbr( dir ).grow( map, v )
			}
			else if( floort === "none" )
			{
				map.set_("branch", v, dir )

				map.set_("newleaves", v, true )
			
				grew	=brs.unshift( new this.constructor.Br(dir) )
			}
		}
		while( dirsw.m.size && !grew )

		return grew
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