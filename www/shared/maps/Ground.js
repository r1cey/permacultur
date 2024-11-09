import Map from './Map.js'
import Loc from '../Loc.js'


var def	=
{
	wsr	:["empty","rock","soil","water"]
	,
	plfl	: ["plant","floor"]
	,
	veg:
	[
		,,,,"apple"
	]
}


export default class G extends Map
{
	static Bufs	=
	[
		Map.newBuf
		(
			4,
			[
				{ wsr	:
					[
						[ 2, def.wsr ],
						  4
					]
				},	// water/soil/rock:4	humid:16
				{ plfl	:
					[
						[ 1, def.plfl ],
						  7,
						  5
					]
				},	// plants/floor:2	plants:128	stage:32
				{ walls	:[ 2, 11 ]}	// walls:4	color:4
			]
		),
		Map.newBuf
		(
			4,
			[
				{ n	:[ 4 ]},
				{ p	:[ 4 ]},
				{ k	:[ 4 ]},
				{ ca	:[ 4 ]},
				{ mg	:[ 4 ]},
				{ na	:[ 4 ]},
				{ fe	:[ 4 ]},
				{ cu	:[ 4 ]}
			]
		),
		Map.newBuf
		(
			2,
			[
				{ dir	:[ 3 ]}
			]
		)
	]

	static enum	={}	/** definitions for bmap values taken from "def" variable */

	static e	=G.enum

	/*	Minerals

		S ?
		Cl ?
		Zn
		Mn

	/******/
}


///////////////////////////////////////////////////////////////////////////////


for(var n in def)
{
	G.enum[n]	={}

	for(var i =0;i< def[n].length ;i++)
	{
		G.enum[n][def[n][i]]	=i
	}
}


///////////////////////////////////////////////////////////////////////////////




G.prototype. isplmov	=function( dest )
{
	var ic	=this.i(dest)

	return this.nemptycelli(ic) && Map.prototype.isplmov.call(this, dest) &&
	
		! ( this.getvegti(ic) === G.enum.veg.apple && this.getveglvli(ic) > 1 )
}




G.prototype. nemptycell	=function( loc )
{
	return this.nemptycelli( this.i(loc) )
}
G.prototype. nemptycelli	=function( ic )
{
	return Boolean( this.bufs[G.bufp.wsr].cells[ic] )
}




G.prototype. climbable	=function( loc )
{
	var ic	=this.i(loc)

	return this.getvegti(ic) === G.e.veg.apple && this.getveglvli(ic) > 3
}


///////////////////////////////////////////////////////////////////////////////




G.prototype. getsoilhum	=function(loc)
{
	return this.getsoilhumi(this.i( loc ))
}




G.prototype. gwater	=function( loc )
{
	return this.gwateri( this.i(loc) )
}

G.prototype. getwater	=G.prototype.gwater




G.prototype. getveg	=function( loc )
{
	return this.getvegi( this.i(loc) )
}


G.prototype. getvegt	=function( loc )
{
	return this.getvegti( this.i(loc) )
}
G.prototype. getvegti	=function( ic )
{
	return this.getbprop( ic, "plfl", 1 )

	// return this.bufs[G.bufp.plfl].gprop( ic, "plfl", 1 )
}

G.prototype. getveglvl	=function( loc )
{
	return	this.getveglvli( this.i(loc) )
}


///////////////////////////////////////////////////////////////////////////////




G.prototype. getsoilhumi	=function(i)
{
	var ib	=this.bufp( "wsr" )

	var ibmap	=G.Bufs[ib].bmapo.wsr

	if( this.bufs[ib].testprop( i, ibmap, 0, "soil" ))
	{
		return this.bufs[ib].getprop( i, ibmap, 1 )
	}

	return -1
}




G.prototype. gwateri	=function( ic )
{
	var ib	=this.bufp( "wsr" )

	var ibmap	=G.Bufs[ib].bmapo.wsr

	if( this.bufs[ib].testprop( ic, ibmap, 0, "water" ))
	{
		return this.bufs[ib].getprop( ic, ibmap, 1 ) + 1
	}

	return 0
}

G.prototype. getwateri	=G.prototype.gwateri




G.prototype. isvegi	=function( ic )
{
	return this.testbprop( ic, "plfl", 0, "plant")
}




G.prototype. getvegi	=function( ic )
{
	return { lvl	:this.getveglvli(ic)
		,
		type	:this.getvegti(ic) }
}




G.prototype. getveglvli	=function( ic )
{
	return this.getbprop( ic, "plfl", 2 )
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. flowcell	=function( loc )
{
	var dir	=this.getdir( loc )

	if( dir !== 6 )
	{
		loc.neighh( dir )
	}
}




G.maxwater	=function()
{
	return ( this.maxhum() >> 1 ) + 1
}

G.maxwat		=G.maxwater





G.maxhum	=function()
{
	return this.getmaxbval( "wsr", 1 )
}



G.maxveglvl	=function()
{
	return this.getmaxbval( "plfl", 2 )
}