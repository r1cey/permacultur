import newShGr	from '../../www/shared/maps/newGroundMap.js'
import Map	from './Map.js'

import Loc from  '../../www/shared/Loc.js'
import Vec from  '../../www/shared/Vec.js'

export default class G extends newShGr(Map)
{
	static name	='ground'

	trees
}


///////////////////////////////////////////////////////////////////////////////


/** Generate new procedural map */

G.prototype. gen	=function( r, maxc, trees )
{
	var gr	=this
	
	trees.build( r, maxc, new Loc( 0, 0, 1 ))

	gr.build( r, maxc, new Loc(0,0,0) )

	this.allsoil()

	// this.randomdir()

	// this.randomwater()

	this.makeriver( 1, 3 )

	this.makeriver( 4, 3 )

	this.makeriver( 3, 2 )

	this.makeriver( 0, 1 )

	var lvl

	var ic

	gr.fore(( loc )=>
	{
		ic	=gr.i(loc)

		if( gr.iswater_i( ic ) )
		{	
			gr.genwaterdepth( loc, ic )
		}
		else if( gr.issoil_i( ic ) )
		{
			lvl	=gr.genhum( loc, ic )

			gr.gentree( loc, lvl, ic )

			trees.gentree( loc, gr, ic )
		}
	})
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. rain	=function()
{
	this.fore(( loc )=>
	{
		this.addwater( loc )
	})
}




G.prototype. addwater	=function( loc )
{
	this.addwateri( this.i( loc ), loc )
}



G.prototype. dry	=function( loc )
{
	this.dryi( this.i(loc), loc )
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. allsoil	=function()
{
	// var maxhum	=G.maxhum()

	this.fore(( loc )=>
	{
		this.setsoil( loc, 0)//Math.floor(Math.random()*maxhum) )
	})
}




G.prototype. makeriver	=function( maindir =1 , w =0 )
{
	var m	=this

	var vn	=new Loc(0,0,0)

	var v	=new Loc()

	var end	=false

	var buf	=new Loc()

	var forstar	= w===3	? forstar3	: w===2	? forstar2	: m.forring.bind(m)

	while(true)
	{
		forstar(( loc )=>
		{
			m.setwater( loc, 1 )
		}
		,w ,vn, buf )

		v.set(vn)

		var dirs	=[0,1,2,3,4,5]

		while( true )
		{
			var i	=Math.floor(Math.random()*dirs.length)

			vn.neighh( dirs[i] )

			if( ! m.inside( vn ))
			{
				return
			}
			
			if( checkifsoil( m, w, vn, buf ))
			{
				break
			}

			if( dirs.length - 1 )
			{
				dirs.splice( i, 1 )

				vn.set( v )

				continue
			}

			do
			{
				vn.neighh( maindir )

				if( ! m.inside( vn ))
				{
					return
				}
			}
			while( ! checkifsoil( m, w, vn, buf ))

			break
		}
	}


	function checkifsoil( m, w, vn, buf )
	{
		return forstar(( loc )=>
			{
				if( m.issoil_i( m.ic(loc) ) )
				{
					return true
				}
			}
			,w ,vn, buf )
	}


	function forstar2	( fun, r, c, v )
	{
		v	? v.set(c)	: v =c.clone()

		v.steph( 4, 2 )

		for(var dir=0; dir<6; dir++)
		{
			if( fun(v) )	return v

			v.neighh( Vec.roth( dir, -1) )
			
			if( fun(v) )	return v

			v.neighh( dir )

			if( fun(v) )	return v

			v.neighh( Vec.roth( dir, 1) )
		}
	}

	function forstar3	( fun, r, c, v )
	{
		v	? v.set(c)	: v =c.clone()

		v.steph( 4, 3 )

		for(var dir=0; dir<6; dir++)
		{
			if( fun(v) )	return v

			v.neighh( dir )

			if( fun(v) )	return v

			v.neighh( Vec.roth( dir, -1) )

			if( fun(v) )	return v

			v.neighh( Vec.roth( dir, 1) )

			if( fun(v) )	return v

			v.neighh( dir )
		}
	}
}




/*G.prototype. makeriver	=function( maindir =1 , w =0 )
{
	var m	=this

	var vn	=new Loc(0,0)

	var v	=new Loc()

	var end	=false

	while(true)
	{
		m.forring(( loc )=>
		{
			m.setwater( loc, 1 )
		}
		,w ,vn )

		v.set(vn)

		var dirs	=[0,1,2,3,4,5]

		while( true )
		{
			var i	=Math.floor(Math.random()*dirs.length)

			vn.neighh( dirs[i] )

			if( ! m.inside( vn ))
			{
				return
			}
			
			if( checkifsoil( m, w, vn ))
			{
				break
			}

			if( dirs.length - 1 )
			{
				dirs.splice( i, 1 )

				vn.set( v )

				continue
			}

			do
			{
				vn.neighh( maindir )

				if( ! m.inside( vn ))
				{
					return
				}
			}
			while( ! checkifsoil( m, w, vn ))

			break
		}
	}


	function checkifsoil( m, w, vn )
	{
		return m.forring(( loc )=>
			{
				if( m.getsoilhum( loc ) >= 0 )
				{
					return true
				}
			}
			,w ,vn )
	}
}*/


/** @arg [ic] */

G.prototype. genwaterdepth	=function( loc, ic )
{
	var m	=this

	ic	??=m.ic(loc)

	var lvl

	m.fore(( locd, r )=>
	{
		if( m.issoil_i( m.ic(locd) ) || r >= G.maxwater() )
		{
			lvl	=r

			return true
		}
	}
	,m._r ,loc )

	m.setwater_i( ic, lvl, loc )
}


/** @arg [ic] */

G.prototype. genhum	=function( loc, ic )
{
	var m	=this

	ic	??=m.i(loc)

	var lvl	=0

	var max	=G.maxhum()

	m.fore(( locd, r )=>
	{
		if( m.iswater_i( m.ic(locd) ) || ((r-1)>>1) >= max )
		{
			lvl	=max - ((r-1)>>1)

			return true
		}
	}
	,m._r, loc )

	m.setsoil_i( ic, lvl, loc )

	return lvl
}


/** @arg [lvl]
 * @arg [ic] */

G.prototype. gentree	=function( loc, lvl, ic )
{
	ic	??=this.ic(loc)

	lvl	??=this.getsoilhum_i(ic)

	// from 1/600 to 45/600

	if( Math.floor(Math.random()*1200) < lvl*6 )
	{
		if( ! this.fore(( loc2 )=>
			{
				if( this.isvegty( loc2 ,[ "apple" ]) )
				{
					return true
				}
			}
			,2 ,loc ))
		{
			lvl	=Math.floor(Math.random()*( G.maxveglvl() + 1 ))

			this.setvegi( ic, G.e.veg.apple, lvl, loc )

			return lvl
		}
	}

	return -1
}




G.prototype. randomdir	=function()
{
	var map	=this

	map.fore(( loc )=>
	{
		map.setdir( loc, Math.floor(Math.random() * 7 ))
	}
	, map._r - 1 )

	var dir, v	=new Loc()

	map.forring(( loc )=>
	{
		do
		{
			dir	=Math.floor(Math.random()*6)
			
			v.set( loc ).neighh( dir )
		}
		while( ! map.inside( v ))

		map.setdir( loc, dir )
	}
	, map._r )
}




G.prototype. randomwater	=function( len )
{
	len	=len ?? (this.cellsl() >> 4)

	let p	=new Loc()

	for(let i=0; i<len; i++)
	{
		p.randh( this._r )

		this.setwater( p, 1 )
	}
}


///////////////////////////////////////////////////////////////////////////////



/*G.prototype. setdir	=function( loc, dir )
{
	this.bufs[1].setprop( this.i(loc), 0, 0, dir)
}*/



G.prototype. setsoil	=function( loc, lvl )
{
	if( lvl < 0 )	lvl	=0

	if( lvl > G.maxhum() )	lvl	=G.maxhum()

	this.setsoil_i(this.ic( loc ), lvl, loc )
}



G.prototype. setsoil_i	=function( ic, lvl, loc )
{
	this.bin.setvalstr( ic, ["wsr","ty"], "soil" )

	this.bin.setval( ic, ["wsr","lvl"], lvl )

	this.game?.server?.send_mapbcell( this, loc, "setsoil", ic )
}




G.prototype. addwateri	=function( ic, loc )
{
	var hum	=this.getsoilhumi( ic )

	var wlvl

	if( hum >= 0)
	{
		if( hum < G.maxhum() )
		{
			this.setsoil_i( ic, hum + 1, loc )
		}
		else
		{
			this.setwateri( ic, 1, loc )
		}
	}
	else if( wlvl =this.gwateri( ic ))
	{
		if( wlvl < G.maxwater() - 1 )
		{
			this.setwateri( ic, wlvl+1, loc )
		}
	}
}




G.prototype. dryi	=function( ic, loc )
{
	var x	=this.getsoilhumi( ic )
	
	if( x > 0 )
	{
		this.setsoil_i( ic, x - 1, loc )
	}
	else if( x =this.gwateri( ic ))
	{
		if( x > 1 )
		{
			this.setwateri( ic, x - 1, loc )
		}
		else
		{
			this.setsoil_i( ic, this.maxhum(), loc )
		}
	}
}




G.prototype. setwater	=function( loc, lvl )
{
	if( lvl < 1 )	lvl	=1

	if( lvl > G.maxwater() )	lvl	=G.maxwater()

	this.setwater_i(this.ic( loc ), lvl , loc )
}




G.prototype. setwater_i	=function( ic, lvl, loc )
{
	this.bin.setvalstr( ic, ["wsr","ty"], "water" )

	this.bin.setval( ic, ["wsr","lvl"], lvl - 1 )

	this.game?.server?.send_mapbcell( this, loc, "setwater", ic )
}




G.prototype. setveg	=function( loc, type, lvl )
{
	this.setveg_i(this.ic(loc), type, lvl, loc )
}


G.prototype. setveg_i	=function( ic, type, lvl =0, loc )
{
	this.bin.setvalstr( ic, ["plfl","ty"], "plant" )

	this.bin.setval( ic, ["plfl","plant","ty"], type )

	this.bin.setval( ic, ["plfl","plant","lvl"], lvl )

	this.game?.server?.send_mapbcell( this, loc, "setveg", ic )
}