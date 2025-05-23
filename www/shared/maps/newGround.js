import Bin from "./newBin.js"
import Board from "./newBoard.js"
import Map from './Map.js'

import Loc from '../Loc.js'


var bmap	=
[
	{
		name	:"wsr"
		,
		subd	:
		[
			{
				name	:"ty"
				,
				bits	:2
				,
				vals	:["empty", "rock", "soil", "water"]
			},
			{
				name	:"lvl"
				,
				bits	:4
			}
		]
	},
	{
		name	:"mine"
		,
		subd	:
		[
			{ name: "n", bits	:4 },
			{ name: "p", bits	:4 },
			{ name: "k", bits	:4 },
			{ name: "ca", bits	:4 },
			{ name: "mg", bits	:4 },
			{ name: "na", bits	:4 },
			{ name: "fe", bits	:4 },
			{ name: "cu", bits	:4 },
			/*	S ?	Cl ? Zn	Mn */
		]
	},
	{
		name	:"plfl"
		,
		subd	:
		[
			{
				name	:"ty"
				,
				bits	:1
				,
				vals	:["plant", "floor"]
			},
			{
				condsubd	:
				{
					"plant"	:
					[
						{
							name	:"ty"
							,
							bits	:7
							,
							vals	:[,,,,"apple"]
						},
						{
							name	:"lvl"
							,
							bits	:5
						}
					]
				}
			}
		]
	},
	{
		name	:"walls"
		,
		subd	:
		[
			{
				name	:"dir"
				,
				bits	:2
			},
			{
				name	:"col"
				,
				bits	:3
			}
		]
	}
]


/** @returns {class} */

export default function( Base )
{
	class Gr extends Base
	{
		static Bin	=Base.newBin( 1, bmap )
	}


	///////////////////////////////////////////////////////////////////////////



	Gr.prototype. nemptycell_i	=function( ic )
	{
		return Boolean( this.bin.getval( ic, ["wsr","ty"] ) )
	}


	
	Gr.maxwater	=function()
	{
		return ( this.maxhum() >> 1 ) + 1
	}

	Gr.maxwat		=Gr.maxwater



	Gr.maxhum	=function()
	{
		return this.Bin.getmaxval( ["wsr", "lvl"] )
	}



	Gr.maxveglvl	=function()
	{
		return this.Bin.getmaxval( ["plfl", "plant", "lvl"] )
	}


	///////////////////////////////////////////////////////////////////////////


	return Gr
}


/*
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

	static ibfromp	={}

	static enum	={}	/** definitions for bmap values taken from "def" variable *

	static e	=G.enum

	
}


G.setbufp()


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
	return Boolean( this.bufs[G.ibfromp.wsr].cells[ic] )
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

	// return this.bufs[G.ibfromp.plfl].gprop( ic, "plfl", 1 )
}

G.prototype. getveglvl	=function( loc )
{
	return	this.getveglvli( this.i(loc) )
}


///////////////////////////////////////////////////////////////////////////////




G.prototype. getsoilhumi	=function(i)
{
	var ib	=G.ibfromp.wsr

	var ibmap	=G.Bufs[ib].bmapo.wsr

	if( this.bufs[ib].testprop( i, ibmap, 0, "soil" ))
	{
		return this.bufs[ib].getprop( i, ibmap, 1 )
	}

	return -1
}




G.prototype. gwateri	=function( ic )
{
	var ib	=G.ibfromp.wsr

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




*/

//////////////////////////////////////////////////////////