import Maps	from "../shared/maps/Maps.js"
import Map	from './Map.js'
import Gr from "./Ground.js"

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"




const TrBase	=Map( Maps.Tree )




export default class Tr extends TrBase
{
	can	=new OffscreenCanvas(0,0)
	
	ctx	=this.can.getContext('2d')

	_path	=new Path2D()	//used to draw branches

	constructor()
	{
		super()

		var Clss	=this.constructor

		Clss.Bufs	=Clss.Bufs.slice()

		Clss.Bufs.push(Clss.newBuf( 213, 1,
		[
			{ size	:[ Maps.Gr.Bufs[0].bmap[2][2] ]}
			,
			{ lvs	:[ 1 ]}
		]))
	}
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. setbuf	=function( buf, code )
{
	Maps.Tree.prototype.setbuf.call( this, buf, code )

	var map	=this

	if( ! map.bufs[0] )
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

		if( brt === 1 || brt === 2 )
		{
			map.paintleaves( loc, v )

			if( brt === 2 )
			{
				map.endbranchcalc( loc, v )
			}
		}
	})

	return map
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. draw	=function( can )
{
	var map	=this

	let { v, v2 }	=can

	let plh	=can.pl?.pos.h	|| 0

	var brminw	=0.2	//out of units.h

	var col	=new Col()

	var maxbrlvl	=Maps.Gr.maxveglvl()/3

	var units	=can.units

	var ctx	=can.ctx

	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		var ic	=map.i(loc)

		// vsq.set(loc).tosqc( can )

		switch( map.getbranchti( ic ))
		{
			case 1 :

				drawleaves( loc )

			break;
			case 2 :

				drawbranch( loc, ic )

			break;
			default :

				if( map.getleavesi( ic ))
				{
					drawleaves( loc )
				}

		}
	})

	// can.ctx.drawImage( map.can.transferToImageBitmap(), can._crn.x,can._crn.y)



	function drawbranch( loc, ic )
	{
		var dir	=map.getbranchdi( ic )

		// var ctx	=map.ctx

		var ctx	=can.ctx

		drawleaves( loc )

		ctx.globalAlpha	=plh === map.getloc().h	? 1	: 0.3


		var lvl	=map.getbrsizei(ic)

		dir	=V.rotopph(dir)

		var r	=V.sin60*0.3333	//units.r*3=>units.h

		ctx.beginPath()

		var path	=new Path2D()

		v.set( loc ).addv(
			
			v2.set( V.dirvhrot(dir,1) ).addv( V.dirvhrot(dir,2) ).mul( w(lvl-1)*r )
		
		).tosqc( can )

		var ox	=v.x,	oy	=v.y

		path.moveTo( v.x, v.y )

		v.set( loc ).addv(
			
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



	function drawleaves( loc )
	{
		var { r, h2 }	=units

		v.set(loc).tosqc(can).sub(r, h2>>1)

		ctx.globalAlpha	=plh === map.getloc().h	? 1	: 0.1

		ctx.drawImage( can.imgs().o.leaves5, v.x,v.y, r<<1, h2 )

		// debugger
	}
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. setbrsize	=function( loc, size )
{
	this.bufs[1].setprop(this.i(loc), 0,0, size )
}




Tr.prototype. getbrsize	=function( loc )
{
	return this.getbrsizei(this.i(loc))
}
Tr.prototype. getbrsizei	=function( ic )
{
	return this.bufs[1].gprop( ic, 0, 0 )
}




Tr.prototype. setleaves	=function( loc, val )
{
	this.setleavesi( this.i(loc), val )
}
Tr.prototype. setleavesi	=function( ic, val )
{
	this.bufs[1].setprop(ic, 1,0, val )
}




Tr.prototype. getleavesi	=function( ic, val )
{
	return this.bufs[1].gprop( ic, 1,0 )
}




Tr.prototype. shift	=function( dir, ...args )
{
	TrBase.prototype.shift.call( this, dir, ...args )

	var map	=this

	var v	=new V()

	map.fordiredge(( loc )=>
	{
		var ic	=map.i(loc)
		
		var brt	=map.getbranchti( ic )

		switch( brt )
		{
			case 0 :

				for(var dir=0; dir<6; dir++)
				{
					if( ! map.inside( v.set(loc).neighh(dir) ))	continue

					switch( map.getbranchti( v ))
					{
						case 1 :
						case 2 :

							map.setleavesi( ic, 1 )

							break
					}
				}
			break
			case 1 :
			case 2 :

				map.paintleaves( loc, v )

				if( brt !== 2 )	break

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
	for(var dir=0; dir<6; dir++)
	{
		if( this.inside( v.set(loc).neighh(dir) ))
		{
			var ic	=this.i(v)

			if( this.getbranchti( ic )===0 )
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

		if( map.getbrancht( v ) !== 2 )	break

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