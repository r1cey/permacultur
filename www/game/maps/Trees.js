import newShTrM	from "../shared/maps/newTreesMap.js"
import Map	from './Map.js'
import newBinM from "../shared/maps/newBinMap.js"
import Gr from "./Ground.js"

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"



const TrBase	=newShTrM( Map )


var bmap	=
[
	{
		name	:"size"
		,
		bits	:Gr.Bin.bmap.plfl.plant.lvl.bits
	},
	{
		name	:"lvs"	// leaves
		,
		bits	:1
	}
]


export default class Tr extends TrBase
{
	/** Additional binary map for faster client drawing. */
	bin2

	can	=new OffscreenCanvas(0,0)
	
	ctx	=this.can.getContext('2d')

	static Bincl	=newBinM( 0, bmap )

	static maxbrlvl	=Gr.maxveglvl()/3
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. setbin	=function( bin )
{
	var map	=this

	TrBase.prototype.setbin. call(this, bin )

	this.bin2	=new Tr.Bincl( this._r, bin.cellsl, this.getloc() )

	var v	=new V()

	map.fore(( loc )=>
	{
		this.updatefloorty( loc, v )
	})
	return map
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. draw	=function( can, pl )
{
	var map	=this

	let plh	=pl?.pos.h	|| 0

	var col	=new Col()

	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		if( map.getleaves( loc ))
		{
			map.drawleaves( can, loc, 0, plh )
		}
	})
	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		var ic	=map.ic( loc )

		// vsq.set(loc).tosqc( can )

		switch( map.getfloorty_i( ic ))
		{
			case "trunk" :

				can.maps.gr.drawstem( can, loc, null, ic, col )
			break;
			case "branch" :

				map.drawbranch( can, loc, plh, ic, col )
			break;
		}
	})
	if( plh === 1 )
	{
		can.drawclpl()
	}
	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		if( map.getleaves( loc ))
		{
			map.drawleaves( can, loc, 1, plh )
		}
	})
	// can.ctx.drawImage( map.can.transferToImageBitmap(), can._crn.x,can._crn.y)
}


///////////////////////////////////////////////////////////////////////////////


/** @todo check if loc is inside */

Tr.prototype. setfloorty	=function( loc, type )
{
	TrBase.prototype.setfloorty. call(this, loc, type )

	this.updatefloorty( loc ,new V(), type )
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. updatefloorty	=function( loc, vbuf, type )
{
	type	??=this.getfloorty( loc )
		
	switch( type )
	{
		case "branch" :

			this.endbranchcalc( loc, vbuf )

		case "trunk" :

			this.paintleaves( loc, vbuf )
	}
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. setbrsize	=function( loc, size )
{
	this.setbrsize_i( this.ic(loc), size )
}
Tr.prototype. setbrsize_i	=function( ic, size )
{
	this.bin2.setval( ic, Tr.Bincl.bmap.size, size )
}




Tr.prototype. getbrsize	=function( loc )
{
	return this.getbrsize_i(this.ic(loc))
}
Tr.prototype. getbrsize_i	=function( ic )
{
	return this.bin2.getval( ic, Tr.Bincl.bmap.size )
}




Tr.prototype. setleaves	=function( loc, val )
{
	this.setleaves_i( this.ic(loc), val )
}
Tr.prototype. setleaves_i	=function( ic, val )
{
	this.bin2.setval( ic, Tr.Bincl.bmap.lvs, val )
}




Tr.prototype. getleaves	=function( loc )
{
	return this.getleaves_i( this.ic(loc) )
}
Tr.prototype. getleaves_i	=function( ic )
{
	return this.bin2.getval( ic, Tr.Bincl.bmap.lvs )
}




Tr.prototype. shift	=function( dir, ...args )
{
	TrBase.prototype.shift.call( this, dir, ...args )

	var map	=this

	var v	=new V()

	map.fordiredge(( loc )=>
	{
		var ic	=map.ic(loc)
		
		switch( map.getfloorty_i( ic ) )
		{
			case "none" :

				for(var dir=0; dir<6; dir++)
				{
					if( ! map.inside( v.set(loc).neighh(dir) ))	continue

					switch( map.getfloorty( v ))
					{
						case "trunk" :
						case "branch" :

							map.setleaves_i( ic, 1 )

							break
					}
				}
			break
			case "trunk" :

				map.paintleaves( loc, v )
			break
			case "branch" :

				map.paintleaves( loc, v )

				if( map.getbrsize_i(ic) )	break

				if( ! map.endbranchcalc( loc, v ))
				{
					map.calcbrsizes( v.set(loc) )
				}
			break		
		}
	}
	, dir )
}



///////////////////////////////////////////////////////////////////////////////



/** Just paint around. Don't check source v. 
 * v is just empty Vec */

Tr.prototype. paintleaves	=function( loc, v )
{
	this.setleaves( loc , 1 )

	for(var dir=0; dir<6; dir++)
	{
		if( this.inside( v.set(loc).neighh(dir) ))
		{
			var ic	=this.ic(v)

			// if( this.getbranchti( ic ) === Tr.e.branch.none )
			{
				this.setleaves_i( ic , 1 )
			}
		}
	}
}



/** v is just empty Vec */

Tr.prototype. endbranchcalc	=function( loc, v )
{
	var map	=this

	for(var dir=0; dir<6; dir++ )
	{
		if( map.isnextbr( v.set(loc).neighh(dir), dir ))
		{
			return false
		}
	}

	v.set( loc )

	var size	=1

	do
	{
		map.setbrsize( v, size )

		v.neighh( V.rotopph( map.getbrdir( v )))

		if( ! map.inside(v) ) break

		if( map.getfloorty( v ) !== "branch" )	break

		size ++

		if( map.getbrsize( v ) >= size )	break
	}
	while(true)

	return true
}



/** Is used by map.shift()
 * loc is returned back */

Tr.prototype. calcbrsizes	=function( loc )
{
	var map	=this

	var size	=1

	for(var dir=0; dir<6; dir++)
	{
		if( ! map.inside( loc.neighh(dir) ))	continue

		var ic	=map.i( loc )

		if( map.isnextbr_i( ic, dir ))
		{
			var size2	=map.getbrsize_i( ic ) || map.calcbrsizes( loc )

			if( size2 >= size )
			{
				size	=size2 + 1
			}
		}

		loc.neighh( V.rotopph( dir ))
	}

	map.setbrsize( loc, size )

	return size
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. drawbranch	=function( can, loc, plh, ic, colbuf )
{
	var map	=this

	var odir	=map.getbrdir_i( ic )

	// var ctx	=map.ctx

	ctx.globalAlpha	=plh === map.getloc().h	? 1	: 0.3

	var lvl	=map.getbrsize_i(ic)

	// if(lvl===1)	debugger

	var dir	=V.rotopph(odir)

	var r	=V.sin60*0.3333	//units.r*3=>units.h

	ctx.beginPath()

	var path	=new Path2D()

	var{ v, v2, ctx }	=can

	if( lvl === 1 )
	{
		v.set( V.dirvh[odir] ).mul(0.5).addv( loc )
	}
	else
	{
		v.set(loc)
	}

	v.addv(
		
		v2.set( V.dirvhrot(dir,1) ).addv( V.dirvhrot(dir,2) ).mul( w(lvl-1)*r )
	
	).tosqc( can )

	var ox	=v.x,	oy	=v.y

	path.moveTo( v.x, v.y )

	if( lvl === 1 )
	{
		v.set( V.dirvh[odir] ).mul(0.5).addv( loc )
	}
	else
	{
		v.set(loc)
	}

	v.addv(
		
		v2.set( V.dirvhrot(dir,-1) ).addv( V.dirvhrot(dir,-2) ).mul( w(lvl-1)*r )
	
	).tosqc( can )

	path.lineTo( v.x, v.y )

	ctx.moveTo( v.x, v.y )

	v.set( loc ).neighh(dir).addv(
		
		v2.set( V.dirvhrot(dir,-1) ).addv( V.dirvhrot(dir,-2) ).mul( w(lvl)*r )
	
	).tosqc( can )

	path.lineTo( v.x, v.y )

	ctx.lineTo( v.x, v.y )

	v.set( loc ).neighh(dir).addv(
		
		v2.set( V.dirvhrot(dir,1) ).addv( V.dirvhrot(dir,2) ).mul( w(lvl)*r )
	
	).tosqc( can )

	path.lineTo( v.x, v.y )

	path.closePath()

	var col	=colbuf

	Gr.treecol( lvl * 3 + 3 , col )
	ctx.fillStyle	=col.str()
	ctx.fill(path)

	ctx.moveTo( v.x, v.y )
	ctx.lineTo( ox, oy )

	ctx.lineWidth	=1
	ctx.strokeStyle	="#000"

	ctx.stroke()



	function w(lvl)
	{
		var brminw	=0.2	//out of units.h

		return	lvl<1 ? 0	: Tr.calcy( 1,brminw, Tr.maxbrlvl,0.5, lvl) //h*(4*lvl+max-5)/(5*max-5)
	}
}


/** @arg trans	-if true is def transparent, plh not needed? */

Tr.prototype. drawleaves	=function( can, loc, trans, plh )
{
	var map	=this

	var{ v, ctx, units }	=can

	var{ r, h2 }	=units

	v.set(loc).tosqc(can).sub(r, h2>>1)

	ctx.globalAlpha	=! trans && plh === map.getloc().h	? 1	: 0.1

	ctx.drawImage( can.imgs().o.leaves5, v.x,v.y, r<<1, h2 )

	// debugger
}