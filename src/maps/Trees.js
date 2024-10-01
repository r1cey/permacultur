import Maps	from '../../www/shared/maps/Maps.js'
import Map	from './Map.js'

import Loc from  '../../www/shared/Loc.js'
import Vec from  '../../www/shared/Vec.js'

export default class T extends Map(Maps.Tree)
{
	static name	='trees'
}


///////////////////////////////////////////////////////////////////////////////


/** Maybe it's worth it to reuse loc in all functions inside?? */

T.prototype. growtree	=function( loc, type, ic )
{
	var m	=this

	ic	??=m.i(loc)

	if( ! m.isstemi( ic ))
	{
		m.setbranchi( ic, 1, loc )

		return
	}

	var dir

	var v	=new Loc()

	for(dir=0; dir<6; dir++)
	{
		if( m.getbranch( v.set(loc).neighh(dir) ) === 2 )
		{
			break
		}
	}

	if( dir >= 6 )
	{
		dir	=Math.floor(Math.random() * 6 )

		m.setbranch( v.set(loc).neighh(dir), 2 )

		return
	}

	Loc.dirv2dirh( v.subv( loc ))


	var dirs	=[0,1,2,3,4,5]

	while( dirs.length )
	{
		var i	=Math.floor(Math.random() * dirs.length )

		v.set( loc )

		v.neighh(dirs[i])

		if( m.getbranch(v) === 2 )
		{
			growbranch.call( m, v, dirs[i] )

			return
		}

		dirs.splice( i, 1 )
	}





	function growbranch( loc, dir )
	{
		var m	=this

		var dirs	=[Loc.roth(dir, -1), dir, Loc.roth(dir, 1)]

		while( dirs.length )
		{
			var i	=Math.floor(Math.random() * dirs.length )

			loc.neighh( dirs[i] )

			if( m.getbranch( v ) === 2 )
			{
				growbranch.call( m, loc, dir )

				return
			}

			loc.neighh( Loc.rotopph( dirs[i] ))

			dirs.splice( i, 1 )
		}

		m.setbranch( loc.neighh( Loc.roth( dir, Math.floor(Math.random()*3) - 1 )), 2 )
	}
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. gentree	=function( loc, gr, ic )
{
	while( this.growtree( loc, gr, ic ) ) {}
}


///////////////////////////////////////////////////////////////////////////////



T.prototype. setbranch	=function( loc, type )
{
	this.setbranchi(this.i(loc), type, loc )
}


T.prototype. setbranchi	=function( ic, type, loc )
{
	this.bufs[0].setprop( ic, 0, 0, type )

	this.game?.server?.send.mapcode( loc, 0, this.bufs[0].cells[ic] )
}