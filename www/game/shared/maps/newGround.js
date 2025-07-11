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
				valsa	:["empty", "rock", "soil", "water"]
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
				valsa	:["plant", "floor"]
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
							valsa	:["none","umbrtr",,,"apple"]
						},
						{
							name	:"lvl"
							,
							bits	:5	//0-seed,1-tiny,2-walk over,3-difficult walk,
								//4-no walk,no branch, 5-first branch
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

		static bmap	=this.Bin.bmap
	}


	///////////////////////////////////////////////////////////////////////////


	
	Gr.prototype. climbable	=function( loc )
	{
		var ic	=this.ic(loc)

		return this.getvegty_i(ic) === "apple" && this.getveglvl_i(ic) > 3
	}


	///////////////////////////////////////////////////////////////////////////


	Gr.prototype. nemptycell_i	=function( ic )
	{
		return this.bin.getval( ic, Gr.Bin.bmap.wsr.ty )
	}


	Gr.prototype. plantable_i	=function( ic )
	{
		return this.getwsr_i(ic) === "soil" && this.getplfl_i(ic) === "plant" &&
			this.getvegty_i(ic) === "none"
	}

	
	Gr.prototype. getwsr_i	=function( ic )
	{
		return this.bin.getval_str( ic, Gr.Bin.bmap.wsr.ty )
	}
	Gr.prototype. setwsr_i	=function( ic, str )
	{
		this.bin.setval_str( ic, Gr.Bin.bmap.wsr.ty, str )
	}


	Gr.prototype. setsoil_i	=function( ic, lvl )
	{
		this.setwsr_i( ic, "soil" )

		this.setsoilhum_i( ic, lvl )
	}


	Gr.prototype. issoil_i	=function( ic )
	{
		return this.bin.getval_str( ic, Gr.Bin.bmap.wsr.ty ) === "soil"
	}

	
	Gr.prototype. getsoilhum_i	=function(ic)
	{
		return this.bin.getval( ic, Gr.Bin.bmap.wsr.lvl )
	}
	Gr.prototype. setsoilhum_i	=function(ic, lvl )
	{
		this.bin.setval( ic, Gr.Bin.bmap.wsr.lvl, lvl )
	}



	Gr.prototype. setwater_i	=function( ic, lvl )
	{
		this.bin.setval_str( ic, Gr.Bin.bmap.wsr.ty, "water" )

		this.bin.setval( ic, Gr.Bin.bmap.wsr.lvl, lvl - 1 )
	}

	
	Gr.prototype. iswater_i	=function( ic )
	{
		return this.bin.getval_str( ic, Gr.Bin.bmap.wsr.ty ) === "water"
	}


	Gr.prototype. getwaterlvl_i	=function( ic )
	{
		return this.bin.getval( ic, Gr.Bin.bmap.wsr.lvl ) + 1
	}



	Gr.prototype. setveg_i	=function( ic, type, lvl =0 )
	{
		this.bin.setval_str( ic, Gr.Bin.bmap.plfl.ty, "plant" )

		this.bin.setval_str( ic, Gr.Bin.bmap.plfl.plant.ty, type )

		this.setveglvl_i( ic, lvl )
	}


	Gr.prototype. getplfl_i	=function( ic )
	{
		return this.bin.getval_str( ic, Gr.Bin.bmap.plfl.ty )
	}


	Gr.prototype. getvegty_i	=function( ic )
	{
		return this.bin.getval_str( ic, Gr.Bin.bmap.plfl.plant.ty )
	}


	Gr.prototype. getveglvl_i	=function( ic )
	{
		return this.bin.getval( ic, Gr.Bin.bmap.plfl.plant.lvl )
	}

	Gr.prototype. setveglvl_i	=function( ic, lvl )
	{
		this.bin.setval( ic, Gr.Bin.bmap.plfl.plant.lvl, lvl )
	}






	///////////////////////////////////////////////////////////////////////////

	
	Gr.maxwater	=function()
	{
		return ( this.maxhum() >> 1 ) + 1
	}

	Gr.maxwat		=Gr.maxwater



	Gr.maxhum	=function()
	{
		return this.Bin.getmaxval( Gr.Bin.bmap.wsr.lvl )
	}



	Gr.maxveglvl	=function()
	{
		return Gr.Bin.getmaxval( Gr.Bin.bmap.plfl.plant.lvl )
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