import Maps	from '../../www/shared/maps/Maps.js'
import Map	from './Map.js'

import Loc from  '../../www/shared/Loc.js'
import V from  '../../www/shared/Vec.js'


///////////////////////////////////////////////////////////////////////////////



export default class T extends Map(Maps.Tree)
{
	static name	='trees'
}




class Br extends Maps.Tree.Br
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

	var lvl	=gr.maxveglvl()

	while( lvl >= 3 )
	{
		gr.fore(( loc )=>
		{
			if( gr.getvegt(loc) === 5 && gr.getveglvl(loc) >= lvl )
			{
				this.growtree( loc, 5 )
			}
		})

		trs.length	=0

		lvl --
	}
}




T.prototype. gentree	=function( loc, gr, ic )
{
	ic	??= this.i(loc)

	var lvl	=gr.getveglvli( ic )

	var type	=gr.getvegti( ic )

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
 * @return if grew or not
 */

T.prototype. growtree	=function( loc, type, brs, ic )
{
	var m	=this

	ic	??=m.i(loc)

	{
		let t	=m.getbranchti( ic )
	
		if( t > 1 )
		{
			return false
		}
		else if( ! t )
		{
			m.setbranchti( ic, 1, loc )

			return true
		}
	}

	var v	=new Loc()

	var dir

	if( ! brs )
	{
		brs	=[]

		for(dir=0; dir<6; dir++)
		{
			if( m.nextbranch( v.set(loc).neighh(dir), dir ))
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

			if( m.nextbranch( v.set(loc).neighh(dir), dir ))	//this check is redundant
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
			m.setbranch( v.set(loc).neighh(dir), 2, dir )

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
				
					m.getbrancht(v.set(loc).neighh(dirs[i])) === 0 )
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



T.prototype. setbranch	=function( loc, type, dir )
{
	this.setbranchi(this.i(loc), type, dir, loc )
}




T.prototype. setbrancht	=function( loc, type )
{
	this.setbranchti(this.i(loc), type, loc )
}




T.prototype. setbranchd	=function( loc, dir )
{
	this.setbranchdi(this.i(loc), dir, loc )
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. setbranchi	=function( ic, type, dir, loc )
{
	this.setbranchti( ic, type, loc )

	this.setbranchdi( ic, dir, loc )
}




T.prototype. setbranchti	=function( ic, type, loc )
{
	this.bufs[0].setprop( ic, 0, 0, type )

	this.game?.server?.send.mapcode( 3, loc, this.bufs[0].cells[ic] )
}




T.prototype. setbranchdi	=function( ic, dir, loc )
{
	this.bufs[0].setprop( ic, 0, 1, dir )

	this.game?.server?.send.mapcode( 3, loc, this.bufs[0].cells[ic] )
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
		try
		{
			grew	=brs[0].grow( map, v )
		}
		catch
		{
			console.log(2)
		}
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
		map.setbranch( v.neighh(dir), 2, dir )

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
	
			if( map.getbrancht( v ) === 0 )
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