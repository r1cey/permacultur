import Map from './Map.js'

import V from "../Vec.js"


var bmap	=
[
	{
		name	:"floor"
		,
		subd	:
		[
			{
				name	:"ty"
				,
				bits	:2
				,
				valsa	:["none", "trunk", "branch", "platform"]
			},
			{
				condsubd:
				{
					"branch"	:
					[
						{
							name	:"dir"
							,
							bits	:3
						}
					]
				}
			}
		]
	}
]


/** @returns {class} */

export default function( Base )
{
	class Tr extends Base
	{
		static Bin	=Base.newBin( 2, bmap )
	}


	///////////////////////////////////////////////////////////////////////////////

	

	Tr.prototype. setfloorty_i	=function( ic, type )
	{
		this.bin.setval_str( ic, Tr.Bin.bmap.floor.ty, type )
	}


	Tr.prototype. getfloorty_i	=function( ic )
	{
		return this.bin.getval_str( ic, Tr.Bin.bmap.floor.ty )
	}

	

	Tr.prototype. setbranch_i	=function( ic, dir )
	{
		this.setfloorty_i( ic, "branch" )

		this.setbrdir_i( ic, dir )
	}


	/** Might not be necessary. When using ic for checking this? */

	Tr.prototype. isnextbr_i	=function( ic, dir )
	{
		return this.getfloorty_i(ic)==="branch" && this.getbrdir_i(ic)===dir
	}


	Tr.prototype. setbrdir_i	=function( ic, dir )
	{
		this.bin.setval( ic, Tr.Bin.bmap.floor.branch.dir , dir )
	}

	Tr.prototype. getbrdir_i	=function( ic )
	{
		return this.bin.getval( ic, Tr.Bin.bmap.floor.branch.dir )
	}

	///////////////////////////////////////////////////////////////////////////////


	return Tr
}