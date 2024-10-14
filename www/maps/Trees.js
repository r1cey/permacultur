import Maps	from "../shared/maps/Maps.js"
import Map	from './Map.js'
import Gr from "./Ground.js"

import V	from "../shared/Vec.js"
import Col	from "../shared/Color.js"




const TrBase	=Map( Maps.Tree )




export default class Tr extends TrBase
{
	constructor()
	{
		super()

		var Clss	=this.constructor

		Clss.Bufs	=Clss.Bufs.slice()

		Clss.Bufs.push(Clss.newBuf( 213, 1, [ {size:[Maps.Gr.Bufs[0].bmap[2][2]]} ] ))
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
		if( map.getbrancht( loc ) === 1 )
		{
			map.calcbrsizes( loc, v )
		}
	})

	return map
}


///////////////////////////////////////////////////////////////////////////////



Tr.prototype. draw	=function( can )
{
	var map	=this

	let v	=new V(), v2	=new V()

	let plh	=can.pl?.pos.h	|| 0

	var brminw	=0.2	//out of units.h

	var col	=new Col()

	var maxbrlvl	=Maps.Gr.maxveglvl()/3

	can.forcell(( loc )=>
	{
		if( ! this.inside(loc) )	return

		var ic	=map.i(loc)

		// vsq.set(loc).tosqc( can )

		switch( map.getbranchti( ic ))
		{
			case 2 :

				drawbranch( loc, plh, v, ic )
		}
	})



	function drawbranch( loc, plh, v, ic )
	{
		var dir	=map.getbranchdi( ic )

		var ctx	=can.ctx

		var al	=plh === map.getloc().h	? 1	: 0.22

		ctx.lineWidth	=1
		ctx.globalAlpha	=1//al
		ctx.strokeStyle	="#000"

		var lvl	=map.getbrsizei(ic)

		// var rlvl	=rootlvl( v.set(loc) )

		Gr.treecol( lvl*3+3, col )

		ctx.fillStyle	=col.str()

		ctx.beginPath()

		dir	=V.rotopph(dir)

		var h2	=can.units.h2<<1	// I can optimise by removing division

		var r	=V.sin60*0.3333	//units.r*3=>units.h

		v.set( loc ).addv(
			
			v2.set( V.dirvhrot(dir,1) ).addv( V.dirvhrot(dir,2) ).mul( w(lvl-1)*r )
		
		).tosqc( can )

		ctx.moveTo( v.x, v.y )

		v.set( loc ).addv(
			
			v2.set( V.dirvhrot(dir,-1) ).addv( V.dirvhrot(dir,-2) ).mul( w(lvl-1)*r )
		
		).tosqc( can )

		ctx.lineTo( v.x, v.y )

		v.set( loc ).neighh(dir).addv(
			
			v2.set( V.dirvhrot(dir,-1) ).addv( V.dirvhrot(dir,-2) ).mul( w(lvl)*r )
		
		).tosqc( can )

		ctx.lineTo( v.x, v.y )

		v.set( loc ).neighh(dir).addv(
			
			v2.set( V.dirvhrot(dir,1) ).addv( V.dirvhrot(dir,2) ).mul( w(lvl)*r )
		
		).tosqc( can )

		ctx.lineTo( v.x, v.y )

		ctx.closePath()
		ctx.fill()



		function w(lvl)
		{
			return	lvl<1 ? 0	: Tr.calcy( 1,brminw, maxbrlvl,0.5, lvl) //h*(4*lvl+max-5)/(5*max-5)
		}




		/** v is changed 
		 * Currently not used */

		function rootlvl( v )
		{
			var t	=map.getbrancht(v)
			
			if( t === 1 )
			{
				return can.maps.gr.getveglvl( v )
			}

			else if( ! map.inside(v) || t !== 2)
			{
				return 5
			}

			var dir	=map.getbranchd( v )

			return rootlvl( v.neighh(V.rotopph(dir)) )
		}
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




Tr.prototype. shift	=function( dir, ...args )
{
	TrBase.prototype.shift.call( this, dir, ...args )

	var map	=this

	var v	=new V()

	map.fordiredge(( loc )=>
	{
		if( map.getbrancht( loc ) === 1 )
		{
			map.calcbrsizes( loc, v )
		}
	}
	, dir )
}



///////////////////////////////////////////////////////////////////////////////



Tr.prototype. getbrsizei	=function( ic )
{
	return this.bufs[1].gprop( ic, 0, 0 )
}




Tr.prototype. drawbr	=function( can, dir, vsq, al )
{
	var { h2 }	=can.units

	var vsrc	=new V(  )

	switch( dir )
	{
		case 0 :

			vsrc.setxy( -V.sin60*h2, -h2>>1 )
		break;
		case 1 :

			vsrc.setxy( -V.sin60*h2, h2>>1 )
		break;
		case 2 :

			vsrc.setxy( 0, h2 )
		break;
		case 3 :

			vsrc.setxy( V.sin60*h2, h2>>1 )
		break;
		case 4 :

			vsrc.setxy( V.sin60*h2, -h2>>1 )
		break;
		case 5 :

			vsrc.setxy( 0, -h2 )
		break;
	}

	vsrc.addv( vsq )

	var ctx	=can.ctx

	ctx.lineWidth	=2
	ctx.globalAlpha	=al
	ctx.strokeStyle	="#fff"

	ctx.beginPath()
	ctx.moveTo( vsrc.x, vsrc.y )
	ctx.lineTo( vsq.x, vsq.y )
	ctx.stroke()
}



/** Assumes loc is pointing towards stem */

Tr.prototype. calcbrsizes	=function( loc, v )
{
	var map	=this

	for(var dir=0; dir<6; dir++)
	{
		if( ! map.nextbranch( v.set(loc).neighh(dir), dir ))	continue

		setbrsizes( new Tr.Br(dir).scan(map, v) , v )
	}


	
	/** loc changes */

	function setbrsizes( br, loc )
	{
		map.setbrsize( loc, br.size )

		for(var br2 of br.brs )
		{
			setbrsizes( br2, new V().set(loc).neighh( br2.dir ) )
		}
	}
}