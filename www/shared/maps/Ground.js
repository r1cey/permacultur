import Map from './Map.js'
import Loc from '../Loc.js'


export default class G extends Map
{
	static Bufs	=
	[
		Map.newBuf
		(
			1, 4,
			[
				{ waHuRo	:[ 2, 4 ]},	// water/humid/rock:4	humid:16
				{ mineral	:[ 5, 4 ]},	// mineral:32	num:16
				{ planFlo	:[ 1, 7, 5 ]},	// plants/floor:2	plants:128	stage:32
				{ walls	:[ 2, 2 ]}	// walls:4	color:4
			]
		),
		Map.newBuf
		(
			2, 2,
			[
				{ dir	:[ 3 ]}
			]
		)
	]

	/******/

	constructor( r, c, loc )
	{
		super()

		if( r || c )	this.newbufs( r, c, loc )
	}
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. nemptycell	=function( loc )
{
	return this.nemptycelli( this.i(loc) )
}
G.prototype. nemptycelli	=function( ic )
{
	return Boolean( this.bufs[0].cells[ic] )
}




G.prototype. climbable	=function( loc )
{
	var ic	=this.i(loc)

	return this.getvegti(ic) === 5 && this.getveglvli(ic) > 3
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. gdir	=function( loc )
{
	return this.gdiri(this.i(loc))
}

G.prototype. getdir	=G.prototype. gdir




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
	return this.bufs[0].gprop( ic, 2, 1 )
}

G.prototype. getveglvl	=function( loc )
{
	return	this.getveglvli( this.i(loc) )
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. gdiri	=function( ic )
{
	return this.bufs[1].gprop( ic, 0, 0 ) 
}
G.prototype. getdiri	=G.prototype. gdiri




G.prototype. issoil	=function( loc )
{
	return this.issoili( this.i(loc) )
}
G.prototype. issoili	=function( i )
{
	return this.bufs[0].gprop( i, 0, 0 ) === 2
}




G.prototype. getsoilhumi	=function(i)
{
	if( this.bufs[0].gprop( i, 0, 0 ) === 2 )
	{
		return this.bufs[0].gprop( i, 0, 1 )
	}

	return -1
}




G.prototype. gwateri	=function( ic )
{
	if( this.bufs[0].gprop( ic, 0, 0 )=== 3 )
	{
		return this.bufs[0].gprop( ic, 0, 1 ) + 1
	}

	return 0
}

G.prototype. getwateri	=G.prototype.gwateri




G.prototype. isfloori	=function( ic )
{
	return this.bufs[0].gprop( ic, 2, 0 )
}




G.prototype. getvegi	=function( ic )
{
	return { lvl	:this.getveglvli(ic)
		,
		type	:this.getvegti(ic) }
}




G.prototype. getveglvli	=function( ic )
{
	return this.bufs[0].gprop( ic, 2, 2 )
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




G.prototype. maxwater	=function()
{
	return ( this.maxhum()>>1 ) + 1
}

G.prototype. maxwat		=G.prototype.maxwater




G.prototype. maxhum	=function()
{
	return ( 1 << this.bufs[0].constructor.bmap[0][1] ) - 1
}




G.prototype. maxveglvl	=function()
{
	return ( 1 << this.bufs[0].constructor.bmap[2][2] ) - 1
}



G.maxveglvl	=function()
{
	return ( 1 << this.Bufs[0].bmap[2][2] ) - 1
}