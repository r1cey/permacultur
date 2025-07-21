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
							valsa	:["none","umbrtr","sandpedro",,"apple"]
						},
						{
							name	:"lvl"
							,
							bits	:5	//0-seed,1-tiny,2-walk over,3-difficult walk,
								//4-no walk,no branch, 5-first branch
						},
						{
							name	:"time"
							,
							bits	:7	//12 minutes * 128 = 25.6hours
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



	Gr.prototype. setveg_i	=function( ic, type, lvl =0, time =0 )
	{
		this.bin.setval_str( ic, Gr.Bin.bmap.plfl.ty, "plant" )

		this.bin.setval_str( ic, Gr.Bin.bmap.plfl.plant.ty, type )

		this.setveglvl_i( ic, lvl )

		this.bin.setval( ic, Gr.Bin.bmap.plfl.plant.time, time )
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


	Gr.prototype. getvegtime_i	=function( ic )
	{
		return this.bin.getval( ic, Gr.Bin.bmap.plfl.plant.time )
	}



	Gr.prototype. getshade_i	=function( ic )
	{
		return this.trees.getleafl_i( ic )
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


	Gr.maxvegtime	=function()
	{
		return Gr.Bin.getmaxval( Gr.Bin.bmap.plfl.plant.time )
	}


	///////////////////////////////////////////////////////////////////////////


	return Gr
}



//////////////////////////////////////////////////////////