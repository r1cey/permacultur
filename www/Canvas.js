import V	from './shared/Vec.js'
import Loc	from './shared/Loc.js'
import Col	from './shared/Color.js'
// import Mov from './Mov.js'
import Touch	from './Touch.js'
import Menu	from './Actions.js'

var rad60	=Math.PI/3

export default class Can
{
	html

	cl()	{return this.html.cl }

	el

	w2()	{return this.el.width>>1 }
	h2()	{return this.el.height>>1 }

	ctx

	units	=
	{
		r	:40	// side of hex
		,
		h2	:70	// calc cache	// distance from one center to next
		,
		dh2	:1/70	// calc cache	// 1/h2
		,
		calc	:function(r)
		{
			this.r	=r
			this.h2	=r * V.sin60 * 2
			this.dh2	=1 / this.h2
		}
	}

	crn	=new V(0,0)	// top left corner in hex

	size2	=new V(0,0)	// vector from top left corner to center in hex

	_crn	=new V()	//just cache for corner in pixels

	pl

	maps

	time	=0

	animate	=false

	showslopes	=false

	touch	=new Touch(this)

	acts

	showlvls	=false



	constructor( html, el )
	{
		this.html	=html

		this.el	=el

		this.ctx	=el.getContext('2d')

		this.units.calc(40)

		this.resize()

		this.setpos(new V(0,0))

		Menu.can	=this
	}
}



///////////////////////////////////////////////////////////////////////////////



Can.prototype. start	=function()
{
	var can	=this

	// var el	=can.el
	
	if(can.time)	return
	
	var html	=can.html

	html.delpage( 'login' )
	html.delpage( 'createpl' )

	html.menu.setopts(
	[
		{
			name	:'zoomin'
			,
			symb	:'+'
			,
			fun	:()=>{ can.zoom(1.5) }
		}
		,
		{
			name	:'zoomout'
			,
			symb	:'-'
			,
			fun	:()=>{ can.zoom(0.75) }
		}
	])

	html.menu.show()

	if(can.pl)
	{
		this.el.onpointerdown	=this.touch.ondown. bind(this.touch)
	}

	this.time	=performance.now()

	can.animate	=true

	window.requestAnimationFrame(this.frame. bind(this))
}



Can.prototype. stop	=function()
{
	can.animate	=false
}



Can.prototype. zoom	=function( x )
{
	var cntr	=this.gpos()

	this.size2.div( x )

	this.setpos(cntr)

	this.units.calc( this.units.r * x )
}


///////////////////////////////////////////////////////////////////////////////



Can.prototype. clear	=function()
{
	this.ctx.clearRect( this._crn.x, this._crn.y,
			this.el.width, this.el.height )
}




Can.prototype. setpos	=function( pos )
{
	this.crn.set( pos ).subv( this.size2 )

	this.trnsfrm()
}


Can.prototype. gpos	=function()
{
	return this.crn.c().addv( this.size2 )
}




Can.prototype. draw	=function( dt )
{
	var can	=this

	// var { map, pl }	=can

	// var{ r, h }	=can.units

	can.clear()

	// can.drawgrid()

	if( can.maps )
	{
		can.maps.gr.draw( can )
	
		can.maps.trees.draw( can )
	}
	
	{
		let vispls	=this.cl().vispls
		
		let plvis

		for(let name in vispls  )
		{
			plvis	=vispls[name]

			plvis.step( dt )

			can.drawpl( plvis )
		}
	}
	if( can.pl )
	{
		can.drawclpl()

		can.drawwatergui()
/*
		if( can.menu )
		{
			can.drawmenu()
		}*/
	}
}


///////////////////////////////////////////////////////////////////////////////



Can.prototype. frame	=function(now)
{
	var can	=this

	var dt	=now - this.time

	var pl	=can.pl

	var tch	=can.touch

	this.time	=now

	this.draw( dt )

	this.html.fps.set(Math.floor(1000/dt))

	if(tch.on)
	{
		let dest	=tch.pos.c().subv(tch.last).tohexc(can).addv(pl.dest)

		tch.last.set(tch.pos)

		if( can.maps.gr.nemptycell( dest.c().roundh() ))
		{
			pl.dest.set( dest )
		}
	}

	pl.step()

	can.setpos(pl.pos)

	if( can.animate )
	{
		window.requestAnimationFrame( this.frame. bind(this))
	}
}



/** !!!Don't modify tpos!!! */

Can.prototype. clicked	=function( possqel )
{
	var can	=this
/*
	// console.log(tpos.toString())

	if(can.menu)
	{
		can.menu.del()
	}
	else
	{
		let posh	=possqel.c().tohexc(can).addv(can.crn).roundh()

		if( posh.disth( can.pl.loc) === 1 )
		{
			let menu	=new Menu()

			// menu.pos.set( possqel ).tohexc(can).addv(can.crn)

			menu.pos.set( possqel )

			menu.addopt("dig")

			menu.show()

			can.menu	=menu
		}
	}*/
}




Can.prototype. trnsfrm	=function()
{
	this._crn.set( this.crn ).tosqc( this)

	this.ctx.setTransform(1,0,0,1,
		-this._crn.x, -this._crn.y)
}


///////////////////////////////////////////////////////////////////////////////



Can.prototype. drawgrid	=function()
{
	var { ctx, units:u }	=this

	var v	=new V()

	var hr	=u.r>>1,	h	=u.h2>>1

	this.forcell( (function(vh)
	{
		v	=vh.c().tosqc(this)

		ctx.lineWidth	=1
		ctx.strokeStyle	='grey'
		this.drawl( v.x-u.r, v.y, v.x-hr, v.y-h )
		this.drawl( v.x-hr, v.y-h, v.x+hr, v.y-h )
		this.drawl( v.x+hr, v.y-h, v.x+u.r, v.y )

	}).bind(this))
/*
	var u	=this.units

	var crncell	=this.getcrncell().tosqc(this)

	var rd2	=this.units.r >> 1

	var h	=this.units.h2 >> 1

	for(var x =crncell.x ; x < crncell.x+this.el.width ; x +=this.units.r*3 )
	{
		for(var y=crncell.y ; y < crncell.y+this.el.height+u.h2 ; y += this.units.h2 )
		{
			ctx.lineWidth	=1
			ctx.strokeStyle	='grey'
			this.drawl( x-rd2, y-h, x+rd2, y-h)			
			// console.log( x, y )
			this.drawl( x+rd2, y-h, x+u.r, y )
			this.drawl( x+u.r, y, x+rd2, y+h )
			ctx.strokeStyle	='#6666FF'
			this.drawl( x+u.r, y, x+(u.r<<1), y )
			this.drawl( x+(u.r<<1), y, x+(u.r<<1)+rd2, y-h )
			this.drawl( x+(u.r<<1), y, x+(u.r<<1)+rd2, y+h )
		}
	}*/
}




Can.prototype. drawmap	=function()
{
	var can	=this

	var map	=this.map

	var vsq	=new V()

	var lvl

	if( this.showslopes )
	{
		var dir
		
		var arrw	=this.units.r*0.40
		
		var arrh	=this.units.h2*0.21

		var arrcol	="#ffffff"
	}

	var col	=new Col()

	var max, ic

	this.forcell(( loc )=>
	{
		if( ! map.inside(loc) )	return

		vsq.set(loc).tosqc(can)

		ic	=map.i(loc)

		lvl	=map.getsoilhumi( ic )

		if( lvl >= 0 )
		{
			col.sethsl( 57, 16, 42)	// 2, 47, 10

			max	=map.maxhum()

			col.add( lvl*(-55)/max, lvl*(31)/max, lvl*(-32)/max )

			can.fillhex( vsq, col.str() )

			if( can.showlvls )
			{
				can.ctx.fillStyle="#FFFFFF"

				can.ctx.fillText( lvl, vsq.x, vsq.y )
			}

			if( map.isfloori( ic ))
			{
			}
			else
			{
				if( lvl =map.getvegti( ic ))
				{
					switch( lvl )
					{
						case 5:

							lvl	=map.getveglvli(ic)

							col.sethsl( 112, 44, 61 )	//46, 34, 34

							max	=map.maxveglvl()

							col.add( lvl*(-66)/max, lvl*(-10)/max, lvl*(-27)/max )

							can.fillcirc( vsq.x, vsq.y,

								lvl * (can.units.h2>>1) / max,
								
								col.str(), "#000000" )
					}
				}
			}
		}
		else if( lvl =map.gwateri(ic) )
		{
			col.sethsl( 179, 34, 45 )	// 269, 45, 10

			max	=map.maxwater()-1

			lvl--

			col.add( lvl*90/max, lvl*11/max, lvl*(-35)/max )

			can.fillhex( vsq, col.str() )

			if( can.showlvls )
			{
				can.ctx.fillStyle="#FFFFFF"

				can.ctx.fillText( lvl, vsq.x, vsq.y )
			}
		}

		if( can.showslopes )
		{
			dir	=map.getdir( loc )

			if( dir < 6 )
			{
				vsq.set(loc).steph( dir, 0.32 ).tosqc(can)

				can.ctx.globalAlpha	=0.1

				can.drawarrow( vsq, arrw, arrh, dir, arrcol )

				vsq.set(loc).steph( dir, -0.05 ).tosqc(can)

				can.drawarrow( vsq, arrw, arrh, dir, arrcol )

				can.ctx.globalAlpha	=1
			}
		}
	})
	/*
	var crn	=this.getcrncell()

	for(var x=crn.x; x < ; x)

	var can	=this

	var w2	=this.w2(),	h2	=this.h2()

	var{ map, ctx, _pos }	=can

	var{ r, h }	=can.units

	var c	=new V()

	map.fore( function( v )
	{
		c.set(v).tosqc(can)

		if(c.x-r > _pos.x+w2 && c.y-r > _pos.y+h2)
		{
			return true
		}

		if(map.gwater(v))
		{
			ctx.beginPath()
			ctx.moveTo( c.x-(r>>1), c.y-h )
			ctx.lineTo( c.x+(r>>1), c.y-h )
			ctx.lineTo( c.x+r, c.y )
			ctx.lineTo( c.x+(r>>1), c.y+h )
			ctx.lineTo( c.x-(r>>1), c.y+h )
			ctx.lineTo( c.x-r, c.y )
			ctx.closePath()
			ctx.fillStyle	="#2211FF"
			ctx.fill()
		}
	})*/
}




Can.prototype. drawclpl	=function()
{
	var can	=this

	var ctx	=can.ctx

	// let r	=can.units.r
	
	var pl	=this.pl
	
	var	pos	=pl.pos.c().tosqc(can)

	ctx.fillStyle	=pl.col.str()
	ctx.beginPath()
	ctx.arc( pos.x, pos.y, pl.r*can.units.r, 0, 2*Math.PI)
	ctx.fill()

	if( can.maps?.gr )// drawreach
	{
		can.maps.gr.forring(( loc )=>
		{
			pos.set(loc).tosqc(can)

			ctx.globalAlpha	=0.1

			can.fillhex( pos, "#F6F0FF" )

			ctx.globalAlpha	=1
		}
		, 1, pl.loc )
	}
}




Can.prototype. drawpl	=function( pl )
{
	var can	=this

	var	pos	=pl.pos.c().tosqc(can)

	var ctx	=can.ctx

	ctx.fillStyle	=pl.col.str()
	ctx.beginPath()
	ctx.arc( pos.x, pos.y, pl.r*r, 0, 2*Math.PI)
	ctx.fill()

	if(pl.cl)
	{
		ctx.strokeStyle	=pl.col.c().inv().str()
		ctx.lineWidth	=3
		ctx.beginPath()
		ctx.arc( pos.x, pos.y, pl.r*r, 0, 2*Math.PI)
		ctx.stroke()
	}
}




Can.prototype. drawwatergui	=function()
{
	var can	=this

	var ctx	=this.ctx
	
	var margin	=10

	var c	=can.crn.c().tosqc(can).add(margin,margin)
	
	var size	=new V(20, 100)

	var empty	=1 - this.pl.water

	ctx.fillStyle	='#2211ff'
	ctx.lineWidth	=1

	ctx.beginPath()
	ctx.moveTo( c.x, c.y+size.y*empty)
	ctx.lineTo( c.x, c.y+size.y)
	ctx.lineTo( c.x+size.x, c.y+size.y)
	ctx.lineTo( c.x+size.x, c.y+size.y*empty)
	ctx.closePath()

	ctx.fill()

	ctx.strokeStyle	='#aa9988'

	ctx.beginPath()
	ctx.moveTo( c.x, c.y )
	ctx.lineTo( c.x, c.y+size.y )
	ctx.lineTo( c.x+size.x, c.y+size.y )
	ctx.lineTo( c.x+size.x, c.y )
	ctx.closePath()

	ctx.stroke()
}


///////////////////////////////////////////////////////////////////////////////




Can.prototype. resize	=function()
{
	var newsizesq	=new V( document.documentElement.clientWidth ,
						document.documentElement.clientHeight )

	var newsize2h	=newsizesq.c().half().tohexc(this)

	this.crn.addv( this.size2 ).subv( newsize2h )

	this.size2.set( newsize2h )

	this.el.width	=newsizesq.x

	this.el.height	=newsizesq.y

	this.trnsfrm()
}



/** fun( loc, can ) */

Can.prototype. forcell	=function( fun )
{
	var crn	=this.crn.c().roundh()

	var vh	=new V().set(crn)

	var vsq	=vh.c().tosqc(this)

	// this.drawdbug( crn.c().add(2,0).tosqc(this) )

	var dsq	=new V( (this.units.r>>1)*3 , this.units.h2 )

	var vsqmax	=vsq.c().add( this.el.width, this.el.height ).addv( dsq )

	var crnsqx	=vsq.x

	for(var i=0 ; vsq.y<vsqmax.y ; i++, vsq.y+=dsq.y )
	{
		vh.y	=crn.y+i

		vh.x	=crn.x

		vsq.x	=crnsqx

		for( var j=0 ; vsq.x<vsqmax.x ; j++, vsq.x+=dsq.x )
		{
			fun(vh, this)		/// { }

			vh.x++

			if( ! (j&1) )
			{
				vh.y--
			}
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



Can.prototype. drawopt	=function( i )
{
	var can	=this

	var{ ctx, menu }	=can

	var pos	=can.tosq( menu.pos.c(). subv(can.posh) )

	ctx.fillText( menu.opts[i], pos.x, pos.y + i*menu.height )
}

Can.prototype. drawmenu	=function()
{
	var can	=this

	for(var i=0, len=can.menu.opts.length; i<len; i++ )
	{
		can.drawopt( i )
	}
}


///////////////////////////////////////////////////////////////////////////////



/** @arg {Vec} c	- in global pixels! */

Can.prototype. fillhex	=function( c, col="#888888" )
{
	var ctx	=this.ctx
	var r	=this.units.r,	h	=this.units.h2>>1

	var d	=Math.round

	ctx.beginPath()
	ctx.moveTo(d( c.x-(r>>1) ),d( c.y-h ))
	ctx.lineTo(d( c.x+(r>>1) ),d( c.y-h ))
	ctx.lineTo(d( c.x+r ),d( c.y ))
	ctx.lineTo(d( c.x+(r>>1) ),d( c.y+h ))
	ctx.lineTo(d( c.x-(r>>1) ),d( c.y+h ))
	ctx.lineTo(d( c.x-r ),d( c.y ))
	ctx.closePath()
	ctx.fillStyle	=col
	ctx.fill()
}



/** @arg v	- in pixels */

Can.prototype. drawarrow	=function( v, w2, h, dir, col="#888888" )
{
	var angl	=rad60 + rad60*dir

	var ctx	=this.ctx

	var h2	=h >> 1

	var cosa	=Math.cos(angl)
	var sina	=Math.sin(angl)

	var r	=Math.round

	// I can optimise rotation

	ctx.beginPath()
	ctx.moveTo(r( v.x ),r( v.y ))
	ctx.lineTo(r( v.x + w2*cosa -(h-h2)*sina ),r( v.y - w2*sina - (h-h2)*cosa ))
	ctx.lineTo(r( v.x + w2*cosa - h*sina ),r( v.y - w2*sina - h*cosa ))
	ctx.lineTo(r( v.x - h2*sina ),r( v.y - h2*cosa ))
	ctx.lineTo(r( v.x - w2*cosa - h*sina ),r( v.y + w2*sina - h*cosa ))
	ctx.lineTo(r( v.x - w2*cosa -(h-h2)*sina ),r( v.y + w2*sina - (h-h2)*cosa ))
	ctx.closePath()
	ctx.fillStyle	=col
	ctx.fill()
}




Can.prototype. fillcirc	=function( x, y, r, col, colstrok )
{
	var ctx	=this.ctx

	ctx.beginPath()
	ctx.arc( Math.floor(x), Math.floor(y), Math.floor(r), 0, 2*Math.PI )
	ctx.fillStyle	=col
	ctx.fill()
	if( colstrok )
	{
		ctx.strokeStyle	=colstrok
		ctx.stroke()
	}
}




Can.prototype. drawl	=function( x1, y1, x2, y2 )
{
	var ctx	=this.ctx

	ctx.beginPath()

	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)

	ctx.stroke()
}




Can.prototype. drawdbug	=function(x, y)
{
	var { ctx }	=this

	ctx.beginPath()
	ctx.strokeStyle	='#aa9988'
	ctx.lineWidth	=2
	ctx.arc( x, y, 10, 0, 6 )
	ctx.stroke()
}