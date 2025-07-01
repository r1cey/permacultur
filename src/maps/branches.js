import ShBr	from "../../www/game/shared/maps/Branch.js"



var br	={}


///////////////////////////////////////////////////////////////////////////////



br.umbrtr	=class extends Br
{
	grow( map, v )
	{
		var{ dir, size, brs }	=this

		var dirnew

		var grew	=false

		v.neighh( dir )

		if( ! brs.length )
		{
			if( map.getfloorty( v ) === "none" )
			{
				grew	=this.newbranch( map, v, dir )
			}
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
	 * vec is changed
	 * vec points to root (why?)
	 * The algorithm of growth maintains relative size of each branch
	 * @return if grew or not */
}


/** @returns -(-1) if didn't find new place for a branch */

Br.findnew	=function( map, v, dir )
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


/** @arg v -is changed */

Br.prototype. newbranch	=function( map, v, dir )
{
	map.set_("branch", v.neighh(dir), dir )

	this.brs.unshift( new this.constructor( dir ))

	return true
}


///////////////////////////////////////////////////////////////////////////////



function rnd( n )
{
	return Math.floor(Math.random()*n )
}