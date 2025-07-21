import newShGr	from '../../www/game/shared/maps/newGroundMap.js'
import Map	from './Map.js'
import SG	from "../../www/game/shared/maps/Supergrid.js"

import Loc from  '../../www/game/shared/Loc.js'
import Vec from  '../../www/game/shared/Vec.js'

import { rnd } from "../../www/game/shared/utils.js"


var ShGr	=newShGr(Map)

export default class G extends ShGr
{
	static name	='ground'


	constructor( game, trees )
	{
		super( game )

		this.trees	=trees
	}
}


///////////////////////////////////////////////////////////////////////////////



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
	this.dry_i( this.ic(loc), loc )
}
G.prototype. dry_i	=function( ic, loc )
{
	var lvl	=this.getsoilhum_i( ic )
	
	if( lvl > 0 )
	{
		this.set_ic_( "soilhum", ic, loc, -- lvl )
	}
}


G.prototype. wet	=function( loc )
{
	this.wet_i( this.ic(loc), loc )
}
G.prototype. wet_i	=function( ic, loc )
{
	if( this.getwsr_i(ic) === "soil" )
	{
		let lvl	=this.getsoilhum_i( ic )

		if( lvl < G.maxhum() )
		{
			this.set_ic_( "soilhum", ic, loc, ++ lvl )
		}
	}
}



G.prototype. grow	=function( loc, ic, type, lvl )
{
	ic	??=this.ic(loc)

	if( ! type )
	{
		if( this.getplfl_i( ic) !== "plant" )	return

		type	=this.getvegty_i( ic)

		if( type === "none" )	return
	}
	lvl	??=this.getveglvl_i( ic )

	if( lvl >= G.maxveglvl() )	return

	this.set_ic_( "veglvl", ic, loc, ++ lvl )

	loc.h	=this.trees.getloc().h

	this.trees.growtree( loc, type )
}


///////////////////////////////////////////////////////////////////////////////


/** Generate new procedural map */

G.prototype. gendesert	=function( r, maxc )
{
	this.build( r, maxc, new Loc(0,0,0) )

	this.allsoil()

	this.genumbrtrees(new Loc(0,0,0))

	this.gencacti()
}


G.prototype. genriver	=function( r, maxc )
{
	var gr	=this

	var trees	=this.trees
	
	gr.build( r, maxc, new Loc(0,0,0) )

	trees.build( r, maxc, new Loc( 0, 0, 1 ))

	this.allsoil()

	// this.randomdir()

	// this.randomwater()

	this.makeriver( 1, 3 )

	this.makeriver( 4, 3 )

	this.makeriver( 3, 2 )

	this.makeriver( 0, 1 )

	var lvl

	var ic

	var loctr	=trees.getloc().clone()

	gr.fore(( loc )=>
	{
		ic	=gr.ic(loc)

		switch( gr.getwsr_i( ic ))
		{
			case "water" :
		
				gr.genwaterdepth( loc, ic )
			break
			case "soil" :
		
				lvl	=gr.genhum( loc, ic )

				lvl	=gr.gentree( loc, lvl, ic )

				if( lvl >= 0 )	trees.gentree( loctr.setv(loc), gr, ic, lvl )
		}
	})
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. grow	=function( loc )
{
	var ic	=this.ic( loc )

	if( this.getplfl_i( ic) !== "plant" )	return

	var type	=this.getvegty_i( ic)

	if( type === "none" )	return

	this.set_ic_( "veglvl", ic, loc, this.getveglvl_i( ic) )

	loc.h	=this.trees.getloc().h

	this.trees.growtree( loc, type )
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. allsoil	=function()
{
	// var maxhum	=G.maxhum()

	this.fore(( loc )=>
	{
		this.set_("soil", loc, 0)//Math.floor(Math.random()*maxhum) )
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
			m.set_("water", loc, 1 )
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
				if( m.issoil( loc ) )
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
		if( m.issoil( locd ) || r >= G.maxwater() )
		{
			lvl	=r

			return true
		}
	}
	,m._r ,loc )

	m.set_ic_("water", ic, loc, lvl )
}


/** @arg [ic] */

G.prototype. genhum	=function( loc, ic )
{
	var m	=this

	ic	??=m.ic(loc)

	var lvl	=0

	var max	=G.maxhum()

	m.fore(( locd, r )=>
	{
		if( m.iswater( locd ) || ((r-1)>>1) >= max )
		{
			lvl	=max - ((r-1)>>1)

			return true
		}
	}
	,m._r, loc )

	m.set_ic_("soil", ic, loc, lvl )

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
				if( this.getvegty( loc2 ) === "apple" )
				{
					return true
				}
			}
			,2 ,loc ))
		{
			lvl	=Math.floor(Math.random()*( G.maxveglvl() + 1 ))

			this.set_ic_("veg", ic, loc, "apple", lvl )

			return lvl
		}
	}

	return -1
}


/** Used by desert mode. Adds the trees as spawn points. */

G.prototype. genumbrtrees	=function()
{
	var minr	=30

	var trsize	={ min :13, range :5 }

	var r	=this._r >> 1

	var sg	=new SG( r, minr, this.getloc() )

	var trn	=Math.ceil(this.bin.cellsl / G.Bin.r2cells( minr * 5 ))	//trees count

	var loc	=this.getloc().c()

	var loct	=new Loc()	// tile location

	this.obj.o.spawns	=[]

	main: for(var i =0;i< trn ;i++)
	{
		var j	=0

		do{
			loc.randh( r )

			sg.trans( loct.set(loc) )

			if( ++ j > 40)	break main;
		}
		while( sg.is( loct ))

		sg.setx( loct, 1 )

		this.obj.o.spawns.push( loc.c() )
		
		this.genumbrtree( loc, trsize.min + rnd(trsize.range) )
	}
}



G.prototype. gencacti	=function()
{
	var sg	=new SG( this._r, 10, this.getloc() )

	var loc	=this.getloc().c()

	var loct	=new Loc()	// tile location

	var j	=0

	sg.fore(( loct )=>
	{
		
	})

	///// TODO: just go through each supergrid and plant a cactus there

	main: while(1)
	{
		do{
			loc.randh( this._r )

			sg.trans( loct.set(loc) )

			if( ++ j > 40)	break main;
		}
		while( sg.is( loct ) || ! this.plantable(loc) )

		sg.setx( loct, 1 )

		this.gensanpedro( loc, 2 + rnd(15) )
	}
}


G.prototype. genumbrtree	=function( loc, size )
{
	var ic	=this.ic(loc)

	if( !( this.plantable_i( ic ) && this.canplmov(loc) ))	return false

	var time	=rnd( G.maxvegtime() )
	
	this.setveg_i( ic, "umbrtr", size, time )

	return true
}



G.prototype. gensanpedro	=function( loc, size )
{
	var ic	=this.ic(loc)

	if( !( this.plantable_i( ic ) && this.canplmov(loc) ))	return false

	var time	=rnd( G.maxvegtime() )
	
	this.setveg_i( ic, "sandpedro", size, time )

	return true
}



/*
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
}*/



/*
G.prototype. randomwater	=function( len )
{
	len	=len ?? (this.cellsl() >> 4)

	let p	=new Loc()

	for(let i=0; i<len; i++)
	{
		p.randh( this._r )

		this.setwater( p, 1 )
	}
}*/


///////////////////////////////////////////////////////////////////////////////





/*G.prototype. setdir	=function( loc, dir )
{
	this.bufs[1].setprop( this.i(loc), 0, 0, dir)
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
}*/



