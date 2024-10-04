import Maps	from '../../www/shared/maps/Maps.js'
import Map	from './Map.js'

import Loc from  '../../www/shared/Loc.js'
import V from  '../../www/shared/Vec.js'


///////////////////////////////////////////////////////////////////////////////



export default class T extends Map(Maps.Tree)
{
	static name	='trees'
}




class Br
{
	dir

	size	=1

	brs	=[]



	constructor( dir )
	{
		this.dir	=dir
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Maybe it's worth it to reuse loc in all functions inside??
 * @return true if no place to grow further
 */

T.prototype. growtree	=function( loc, type, brs, ic )
{
	var m	=this

	ic	??=m.i(loc)

	if( ! m.getbranchti( ic ) === 1 )
	{
		m.setbranchti( ic, 1, loc )

		return
	}

	var v	=new V()

	var dir

	if( ! brs )
	{
		brs	=[]

		for(dir=0; dir<6; dir++)
		{
			if( nextbranch( v.set(loc).neighh(dir), dir ))
			{
				brs.push(new Br( dir ).scan( v ))
			}
		}
	}

	if( ! brs.length )
	{
		dir	=newbranch()

		if( !dir )	return true

		m.setbranch( v.set(loc).neighh(dir) , 2 , dir )

		brs[0]	=new Br(dir)

		return
	}
	else if( brs.length === 1 )
	{
		if( brs[0].size > 1 )
		{
			switch( brs[0].dir )
			{
				case 5:

					dir	=V.roth( brs[0].dir, plusmin() * 2 )
				break
				case 4:

					dir	=0
				break;
				case 0:

					dir	=4
			}

			m.setbranch( v.set(loc).neighh(dir), 2, dir )
		}
		else
		{
			brs[0].grow( m, v.set(loc) )
		}

		return
	}
	else
	{
		brs.sort(( b1, b2 )=> b1.size-b2.size )

		if( brs.length === 2 )
		{
			if( brs[0].size > 1 )
			{
				dir =V.roth( brs[0].dir, 2 )

				if( dir === brs[1].dir )	dir	=V.roth( dir, 2 )

				m.setbranch( v.set(loc).neighh( dir ), 2, dir )

				return
			}
		}

		for(var i=brs.length-1; i>0; i--)
		{
			if( brs[i].size > brs[i-1].size+1 )
			{
				brs[i-1].grow( m, v.set(loc) )

				return
			}
		}

		brs[brs.length-1].grow( m, v.set(loc))
	}
	


	function newbranch( brs )
	{
		if( ! brs.length )
		{
			var dirs	=[0,4,5]

			var dir	=rnds( dirs ,( dir )=>
			{
				if( m.getbrancht(v.set(loc).neighh(dir)) === 0 )
				{
					return dir
				}
			})

			if( dir )	return dir

			dirs	=[1,3]

			dir =rnds( dirs ,( dir )=>
			{
				if( m.getbrancht(v.set(loc).neighh(dir)) === 0 )
				{
					return dir
				}
			})

			if( dir )	return dir

			if( m.getbrancht(v.set(loc).neighh(2)) === 0 )
			{
				return dir
			}

			return
		}
		else if( brs.length === 1 )
		{
			
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. gentree	=function( loc, gr, ic )
{
	ic	??= this.i(loc)

	var lvl	=gr.getveglvli( ic )

	var type	=gr.getvegti( ic )

	var brs	=[]

	for(var i =4; i <= lvl; i++ )
	{
		if( this.growtree( loc, type, brs, ic ))
		{
			break
		}
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

	this.game?.server?.send.mapcode( loc, 0, this.bufs[0].cells[ic] )
}




T.prototype. setbranchdi	=function( ic, dir, loc )
{
	this.bufs[0].setprop( ic, 0, 1, dir )

	this.game?.server?.send.mapcode( loc, 0, this.bufs[0].cells[ic] )
}


///////////////////////////////////////////////////////////////////////////////


/** loc is changed through calculation */

Br.prototype. calc	=function( loc, dir )
{
	this.dir	=dir
}


/** vec is changed 
 * @return true if didn't manage to grow 
*/

Br.prototype. grow	=function( map, v )
{
	var { dir, size, brs }	=this

	var dir2

	v.neighh( dir )

	if( ! brs.length )
	{
		dir2	=this.findnew( map, v )

		if( dir2 < 0 )
		{
			return true
		}
		else
		{
			map.setbranch( v.neighh(dir2), 2, dir2 )
		}
	}
	else if( size === 3 )
	{
		dir2	=this.findnew( map, v )

		if( dir2 < 0 )
		{
			return brs[0].grow( map, v )
		}
		else
		{
			map.setbranch( v.neighh(dir2), 2, dir2 )
		}
	}
	else if( brs.length === 1 )
	{
		return brs[0].grow( map, v )
	}
	else
	{
		brs.sort(( b1, b2 )=> b1.size-b2.size )

		if( brs[1].size > brs[0].size+1 )
		{
			return brs[0].grow( map, v )
		}
		else
		{
			return brs[1].grow( map, v )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////


/** Returns loc to original value */

Br.prototype. findnew	=function( map, loc )
{
	var { dir }	=this

	var dirs	=[V.roth(dir, -1), dir, V.roth(dir, 1)]

	while( dirs.length )
	{
		var i	=rnd( dirs.length )

		loc.neighh( dirs[i] )

		if( map.getbrancht( v ) === 0 )
		{
			loc.neighh( V.rotopph( dirs[i] ))

			return dirs[i]
		}

		loc.neighh( V.rotopph( dirs[i] ))

		dirs.splice( i, 1 )
	}

	return -1
}




Br.prototype. sort	=function()
{
	this.brs.sort(( b1, b2 )=> b1.size-b2.size )
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