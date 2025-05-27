import newShTrees	from '../../www/shared/maps/newTreesMap.js'
import Map	from './Map.js'

import Loc from  '../../www/shared/Loc.js'
import V from  '../../www/shared/Vec.js'

import Gr	from './Ground.js'


///////////////////////////////////////////////////////////////////////////////


var ShTrees	=newShTrees(Map)

export default class T extends ShTrees
{
	static name	='trees'
}




class Br extends ShTrees.Br
{

}


///////////////////////////////////////////////////////////////////////////////



T.prototype. gen	=function( gr )
{
	this.newbufs( gr._r, 0, new Loc(0,0,1) )

	this.gentrees( gr )
}




T.prototype. gentrees	=function( gr )
{
	var trs	=[]

	var lvl	=Gr.maxveglvl()

	while( lvl >= 3 )
	{
		gr.fore(( loc )=>
		{
			if( gr.getvegty(loc) === Gr.e.veg.apple && gr.getveglvl(loc) >= lvl )
			{
				this.growtree( loc, 5 )
			}
		})

		trs.length	=0

		lvl --
	}
}


/** @arg [ic]
 * @arg [lvl] */

T.prototype. gentree	=function( loc, gr, ic, lvl )
{
	ic	??= this.ic(loc)

	lvl	??=gr.getveglvl_i( ic )

	var type	=gr.getvegty_i( ic )

	var brs	=[]

	for(var i =3; i <= lvl; i++ )
	{
		if( ! this.growtree( loc, type, brs, ic ))
		{
			break
		}
	}
}



/** Maybe it's worth it to reuse loc in all functions inside??
 * @arg [ic]
 * @return if grew or not */

T.prototype. growtree	=function( loc, type, brs, ic )
{
	var m	=this

	ic	??=m.ic(loc)

	{
		let t	=m.getfloorty_i( ic )
	
		if( t === "none" )
		{
			m.set_ic_("floorty", ic, loc, "trunk" )

			return true
		}
		else if( t !== "trunk" )
		{
			return false
		}
	}

	var v	=new Loc()

	var dir

	if( ! brs )
	{
		brs	=[]

		for(dir=0; dir<6; dir++)
		{
			if( m.isnextbr( v.set(loc).neighh(dir), dir ))
			{
				brs.push(new Br( dir ).scan( m, v ))
			}
		}
		
		brs.sort(( b1, b2 )=> b1.size-b2.size )
	}

	if( ! brs.length )
	{
		return newbranch( brs )
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
	



	function newbranch( brs )
	{
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


///////////////////////////////////////////////////////////////////////////////


/** Unneeded */

T.prototype. closestbr	=function( loc, ploc )
{
	var map	=this

	var brloc	=new Loc()

	// using brloc to save on garbage collection
	var dir =V.dirv2dirh( brloc.set(ploc).subv(loc) )

	if( br(dir,0) )	return brloc

	for(var i=1; i<=2; i++)
	{
		if( br(dir,-i) )	return brloc
		if( br(dir,i) )	return brloc
	}
	if( br(dir,3) )	return brloc

	return



	function br( dir, rot )
	{
		dir	=V.roth(dir,rot)

		brloc.set(loc).neighh(dir)

		if( map.nextbranch( brloc, dir ))	return true
	}
}


///////////////////////////////////////////////////////////////////////////////


/** vec is changed
 * vec points to root
 * The algorithm of growth maintains relative size of each brand
 * @return if grew or not 
*/

Br.prototype. grow	=function( map, v )
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


///////////////////////////////////////////////////////////////////////////////



function rnd( n )
{
	return Math.floor(Math.random()*n )
}




function rnds( set, fun )
{
	var r

	while(set.length)
	{
		var i	=rnd(set.length)

		if( r =fun(set[i]) )	return r

		set.splice( i, 1 )
	}
}



function plusmin()
{
	return ( Math.round(Math.random()) << 1 ) - 1
}