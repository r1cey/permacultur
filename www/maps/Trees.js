import ShTr	from "../shared/maps/Trees.js"
import Map	from './Map.js'
import Gr from "./Ground.js"

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"




const TrBase	=Map( ShTr )




export default class Tr extends TrBase
{
	can	=new OffscreenCanvas(0,0)
	
	ctx	=this.can.getContext('2d')

	_path	=new Path2D()	//used to draw branches
}


Tr.Bufs	=TrBase.Bufs.slice()

Tr.Bufs.push(Tr.newBuf( 1,
	[
		{ size	:[ Math.log( Gr.maxveglvl()+1 ) / Math.log( 2 ) ]},
		{ lvs	:[ 1 ]}
	],
	true ))

Tr.setbufp()


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. setbuf	=function( buf, code )
{
	TrBase.prototype.setbuf.call( this, buf, code )

	var map	=this

	if( ! map.bufs[0] )	// ??? change 0 ?
	{
		return
	}

	var i	=Tr.Bufs.length - 1

	map.bufs[i]	=new (Tr.Bufs[i])().new( map.cellsl() )

	map.setloc( map.getloc() )

	var v	=new V()

	map.fore(( loc )=>
	{
		var ic	=map.i(loc)
		
		var brt	=map.getbranchti(ic)

		if( brt === Tr.e.branch.stem || brt === Tr.e.branch.b )
		{
			map.paintleaves( loc, v )

			if( brt === Tr.e.branch.b )
			{
				map.endbranchcalc( loc, v )
			}
		}
	})

	return map
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. draw	=function( can, pl )
{
	var map	=this

	let { v, v2 }	=can

	let plh	=pl?.pos.h	|| 0

	var brminw	=0.2	//out of units.h

	var col	=new Col()

	var maxbrlvl	=Gr.maxveglvl()/3

	var units	=can.units

	var ctx	=can.ctx

	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		if( map.getleaves( loc ))
		{
			drawleaves( loc )
		}
	})

	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		var ic	=map.i( loc )

		// vsq.set(loc).tosqc( can )

		switch( map.getbranchti( ic ))
		{
			case Tr.e.branch.stem :

				can.maps.gr.drawstem( can, loc, null, ic, col )
			break;
			case Tr.e.branch.b :

				drawbranch( loc, ic )
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
			drawleaves( loc, 1 )
		}
	})

	// can.ctx.drawImage( map.can.transferToImageBitmap(), can._crn.x,can._crn.y)



	function drawbranch( loc, ic )
	{
		var odir	=map.getbranchdi( ic )

		// var ctx	=map.ctx

		var ctx	=can.ctx

		ctx.globalAlpha	=plh === map.getloc().h	? 1	: 0.3


		var lvl	=map.getbrsizei(ic)

		// if(lvl===1)	debugger

		var dir	=V.rotopph(odir)

		var r	=V.sin60*0.3333	//units.r*3=>units.h

		ctx.beginPath()

		var path	=new Path2D()

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
			return	lvl<1 ? 0	: Tr.calcy( 1,brminw, maxbrlvl,0.5, lvl) //h*(4*lvl+max-5)/(5*max-5)
		}
	}



	function drawleaves( loc, trans )
	{
		var { r, h2 }	=units

		v.set(loc).tosqc(can).sub(r, h2>>1)

		ctx.globalAlpha	=plh === map.getloc().h && ! trans	? 1	: 0.1

		ctx.drawImage( can.imgs().o.leaves5, v.x,v.y, r<<1, h2 )

		// debugger
	}
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. setbrsize	=function( loc, size )
{
	this.setbprop( this.i(loc), 'size', 0, size )
}




Tr.prototype. getbrsize	=function( loc )
{
	return this.getbrsizei(this.i(loc))
}
Tr.prototype. getbrsizei	=function( ic )
{
	return this.getbprop( ic, "size", 0 )
}




Tr.prototype. setleaves	=function( loc, val )
{
	this.setleavesi( this.i(loc), val )
}
Tr.prototype. setleavesi	=function( ic, val )
{
	this.setbprop(ic, "lvs", 0, val )
}




Tr.prototype. getleaves	=function( loc )
{
	return this.getleavesi( this.i(loc) )
}
Tr.prototype. getleavesi	=function( ic )
{
	return this.getbprop( ic, "lvs", 0 )
}




Tr.prototype. shift	=function( dir, ...args )
{
	TrBase.prototype.shift.call( this, dir, ...args )

	var map	=this

	var v	=new V()

	var brts	=Tr.e.branch

	map.fordiredge(( loc )=>
	{
		var ic	=map.i(loc)
		
		var brt	=map.getbranchti( ic )

		switch( brt )
		{
			case brts.none :

				for(var dir=0; dir<6; dir++)
				{
					if( ! map.inside( v.set(loc).neighh(dir) ))	continue

					switch( map.getbranchti( v ))
					{
						case brts.stem :
						case brts.b :

							map.setleavesi( ic, 1 )

							break
					}
				}
			break
			case brts.stem :
			case brts.b :

				map.paintleaves( loc, v )

				if( brt !== brts.b )	break

				if( map.getbrsizei(ic) )	break

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
			var ic	=this.i(v)

			// if( this.getbranchti( ic ) === Tr.e.branch.none )
			{
				this.setleavesi( ic , 1 )
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
		if( map.nextbranch( v.set(loc).neighh(dir), dir ))
		{
			return false
		}
	}

	v.set( loc )

	var size	=1

	do
	{
		map.setbrsize( v, size )

		v.neighh( V.rotopph( map.getbranchd( v )))

		if( ! map.inside(v) ) break

		if( map.getbrancht( v ) !== Tr.e.branch.b )	break

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

		if( map.nextbranchi( ic, dir ))
		{
			var size2	=map.getbrsizei( ic ) || map.calcbrsizes( loc )

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