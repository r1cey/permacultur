import ShBr	from "../../www/game/shared/maps/Branch.js"

import V from "../../www/game/shared/Vec.js"

import { pickrnd, rnd } from "./tools.js"


var br	={}


///////////////////////////////////////////////////////////////////////////////



br.umbrtr	=class extends Br
{
	grow( map, v )
	{
		var Br	=this.constructor

		var{ dir, size, brs }	=this

		var grew	=false

		if( size < 5 )
		{
			let dirs	=[ V.roth(dir,-1), dir, V.roth(dir,1) ]

			let chance	=[ 1, 9, 1 ]

			let dirnew
			do{
				dirnew	=pickrnd( dirs, chance )

				if( map.getfloorty( v.neighh( dirnew )) === "none" )
				{
					grew	=this.newbranch( map, v, dirnew )
				}
				else if( map.isnextbr( v, dirnew ))
				{
					grew	=this.findbr( dirnew ).grow( map, v )
				}
				v.neighh( V.rotopph(dir) )
			}
			while( dirs.length && ! grew )
		}
		else
		{
			let brs2	=brs.slice()

			let chance	=[1,1,1]

			let br
			do{
				br	=pickrnd( brs2, chance )

				grew	=br.grow( map, v.neighh( br.dir ))

				v.neighh( V.rotopph( br.dir ))
			}
			while( brs2.length && ! grew )
		}
		if( grew )
		{
			this.size ++
		}
		return grew
	}
}


br.apple	=class extends ShBr
{
	grow( map, v )
	{
		var { dir, size, brs }	=this

		var dir2

		var grew	=false
		
		v.neighh( dir )

		if( ! brs.length )
		{
			dir2	=findnew()

			if( dir2 < 0 )
			{
				return false
			}
			else
			{
				grew	=newbranch( dir2 )
			}
		}
		else if( size === 3 )
		{
			dir2	=findnew()

			if( dir2 < 0 )
			{
				grew	=brs[0].grow( map, v )
			}
			else
			{
				grew	=newbranch( dir2 )
			}
		}
		else if( brs.length === 1 )
		{
			grew	=brs[0].grow( map, v )
		}
		else
		{
			if( brs[1].size > brs[0].size+1 )
			{
				grew	=brs[0].grow( map, v )
			}
			else
			{
				grew	=brs[1].grow( map, v )
			}
		}

		if( grew )
		{
			this.size ++
		}

		return grew




		function newbranch( dir )
		{
			map.set_("branch", v.neighh(dir), dir )

			brs.unshift( new Br( dir ))

			return true
		}


		/* v is changed back */

		function findnew()
		{
			var dirs	=[V.roth(dir, -1), dir, V.roth(dir, 1)]
		
			while( dirs.length )
			{
				var i	=rnd( dirs.length )
		
				v.neighh( dirs[i] )
		
				if( map.getfloorty( v ) === "none" )
				{
					v.neighh( V.rotopph( dirs[i] ))
		
					return dirs[i]
				}
		
				v.neighh( V.rotopph( dirs[i] ))
		
				dirs.splice( i, 1 )
			}
		
			return -1
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



class Br extends ShBr
{
	/** @method grow( map, v )
	 * vec is changed in apple,
	 * vec points to root for apple and to branch in umbrtr
	 * The algorithm of growth maintains relative size of each branch in apple
	 * @return if grew or not */
}


/** @arg v -points to new location already */

Br.prototype. newbranch	=function( map, v, dir )
{
	map.set_("branch", v, dir )

	this.brs.unshift( new this.constructor( dir ))

	return true
}


Br.prototype. findbr	=function( dir )
{
	for(var i=0,len= this.brs.length ;i<len;i++)
	{
		if( this.brs[i].dir === dir )	return this.brs[i]
	}
	console.error( "Br.findbr "+dir )
}


///////////////////////////////////////////////////////////////////////////////



function countemptyneigh( map, v )
{
	var n	=0

	for(var dir=0; dir<6; dir++)
	{
		if( map.getfloorty(v.neighh(dir)) === "none" )	n ++

		v.neighh( V.rotopph( dir ))
	}
	return n
}


