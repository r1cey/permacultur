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
				valsa	:["none", "trunk", "reg", "platform"]
			},
			{
				name	:"dir"
				,
				bits	:3
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

		static Br	=Br
	}



	Tr.prototype. nextbranch	=function( loc, dir )
	{
		if( this.inside( loc ))
		{
			return this.nextbranchi( this.i(loc), dir )
		}
	}




	Tr.prototype. getbranch	=function( loc )
	{
		
	}



	Tr.prototype. getbrancht	=function( loc )
	{
		return this.getbranchti( this.i(loc) )
	}




	Tr.prototype. getbranchd	=function( loc )
	{
		return this.getbranchdi( this.i(loc) )
	}


	///////////////////////////////////////////////////////////////////////////////




	/** Might not be necessary. When using ic for checking this? */

	Tr.prototype. nextbranchi	=function( ic, dir )
	{
		return this.getbranchti(ic)===T.e.branch.b && this.getbranchdi(ic)===dir
	}




	Tr.prototype. getbranchti	=function( ic )
	{
		return this.getbprop( ic, "branch", 0 )
	}




	Tr.prototype. getbranchdi	=function( ic )
	{
		return this.getbprop( ic, "branch", 1 )
	}

	///////////////////////////////////////////////////////////////////////////////


	return Tr
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


/** loc is not changed through calculation */

Br.prototype. scan	=function( map, v )
{
	var { dir, brs }	=this

	var dirs	=[V.roth(dir, -1), dir, V.roth(dir, 1)]

	for(var i=0; i<dirs.length; i++)
	{
		if( map.nextbranch( v.neighh(dirs[i]), dirs[i] ))
		{
			brs.push( new this.constructor( dirs[i] ).scan( map, v ))

			this.size	+=brs[brs.length-1].size
		}

		v.neighh( V.rotopph( dirs[i]) )
	}

	brs.sort(( b1, b2 )=> b1.size-b2.size )

	return this
}


///////////////////////////////////////////////////////////////////////////////




Br.prototype. sort	=function()
{
	this.brs.sort(( b1, b2 )=> b1.size-b2.size )
}