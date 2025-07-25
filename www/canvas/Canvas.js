import V	from '../game/shared/Vec.js'
import Loc	from '../game/shared/Loc.js'
import Col	from '../game/shared/Color.js'
// import Mov from './Mov.js'
import Touch	from './Touch.js'
import Menu	from './Actions.js'

var rad60	=Math.PI/3

export default class Can
{
	html

	imgs()	{return this.html.imgs }

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
		,
		dsq	:function(){return this._dsq.setxy((this.r>>1)*3, this.h2) }
		,
		_dsq	:new V()
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

	v	=new V()	//just utility buffers for ease of garbage collection
	v2	=new V()
	v3	=new V()


	constructor( html, el )
	{
		this.html	=html

		this.el	=el

		this.ctx	=el.getContext('2d' ,{ alpha :false })

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
	
	if( can.time )	return
	
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
			fun	:()=>{ can.zoom(2) }
		}
		,
		{
			name	:'zoomout'
			,
			symb	:'-'
			,
			fun	:()=>{ can.zoom(0.5) }
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
	this.animate	=false
}



Can.prototype. zoom	=function( x )
{
	this.units.calc( this.units.r * x )

	var cntr	=this.gpos()

	this.size2.div( x )

	this.setpos(cntr)
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

	var { maps, pl }	=can

	// var{ r, h }	=can.units

	can.clear()

	// can.drawgrid()

	if( maps )
	{
		maps.gr.draw(can)

		if( pl.loc.h === 0 )	can.drawclpl()
		
		maps.tr.draw(can, pl)
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
		this.drawbargui( 0, this.pl.water, '#2211ff' )

		this.drawbargui( 1, this.pl.heat, '#fc2200' )
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
		let deltasq	=can.v3.set(tch.pos).subv(tch.last)

		let dest	=can.v.set(deltasq).tohexc(can).addv(pl.dest)

		let destloc	=can.v2.set(dest).roundh()
		
		tch.last.set(tch.pos)

		if( pl.gmap().canplmov( destloc, pl ) )
		{
			pl.dest.setv( dest )
		}
	}

	pl.step()

	can.setpos(pl.pos)

	if( can.animate )
	{
		window.requestAnimationFrame( this.frame. bind(this))
	}
}



/**  */

Can.prototype. clicked	=function( possqel )
{
	var can	=this

	if(can.menu)
	{
		can.menu.del()
	}
	else
	{
		let pl	=can.pl

		let ploc	=pl.loc

		let menu	=new Menu()

		menu.setpos( possqel, ploc )

		let loc	=menu.loc

		if( loc.eq(ploc) )
		{
			menu.addopt(
				
				"equipment"
				,
				()=>
				{
					this.html.inv.show()
				}
			)
		}
		else if( loc.disth( ploc) === 1 )
		{
			let map	=pl.gmap()

			if( map.climbable( loc ))
			{
				menu.addopt( "climb", ()=> can.pl.climb(loc) )
			}
			if( pl.hands.o.cucumber_seeds && map.plantable?.( loc ))
			{
				menu.addopt( "plant cucumbers", ()=> console.log("planted") )
			}
			let o	=map.obj.g(loc)

			if( o )
			{
				if( o.dewd )
				{
					menu.addopt( "rotate right" ,()=>
					{
						can.cl().srv.send_actonobj( loc, "dewd", "rot", [1] )
					})
					menu.addopt( "rotate left" ,()=>
					{
						can.cl().srv.send_actonobj( loc, "dewd", "rot", [-1] )
					})
				}
			}

			switch(loc.h)
			{
				case 0 :

					// map	=can.maps.gr

					
			}
		}
		menu.show()

		if( menu.ready )	can.menu	=menu
	}
}




Can.prototype. trnsfrm	=function()
{
	var crn	=this._crn

	crn.set( this.crn ).tosqc( this)

	this.ctx.setTransform(1,0,0,1,
		-crn.x, -crn.y)

	var maps	=this.maps

	if(maps)
	{
		maps.tr.ctx.setTransform(1,0,0,1,
			-crn.x, -crn.y)
	}
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
	ctx.globalAlpha	=1
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


///////////////////////////////////////////////////////////////////////////////



Can.prototype. drawbargui	=function( i, val,  col )
{
var can	=this

	var ctx	=this.ctx
	
	var margin	=10

	var size	=new V(20, 100)
	
	var c	=can.crn.c().tosqc(can).add( margin*(i+1) + size.x*i, margin )

	var empty	=1 - val

	ctx.fillStyle	=col
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



Can.prototype. resize	=function()
{
	var newsizesq	=new V( document.documentElement.clientWidth ,
						document.documentElement.clientHeight )

	var newsize2h	=newsizesq.c().half().tohexc(this)

	this.crn.addv( this.size2 ).subv( newsize2h )

	this.size2.set( newsize2h )

	var el	=this.el

	el.width	=newsizesq.x

	el.height	=newsizesq.y

	var maps	=this.maps

	if( maps )
	{
		maps.tr.can.width	=el.width
		maps.tr.can.height	=el.height
	}

	this.trnsfrm()


}



/** fun( loc, can ) 
 * Don't change loc in fun! */

Can.prototype. forcell	=function( fun )
{
	/*
	var crn	=this.crn.c().roundh().add(-1,0)

	var vh	=new V().set(crn)

	var vsq	=vh.c().tosqc(this)

	// this.drawdbug( crn.c().add(2,0).tosqc(this) )

	var dsq	=this.units.dsq()

	var el	=this.el

	var vsqmax	=dsq.c().mul(3).addv(vsq).add( el.width, el.height )

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

			vh.y	-=Number( !(j&1) )
			/*
			if( !(j&1) )	// Can be branchless optimised
			{
				vh.y--
			}*
		}
	}*/

	var crn	=this.crn.c().add(-1,0).roundh()

	var maxcrn	=this.size2.c().mul(2).add(2,1).todoffs()

	var v	=new V()

	for(var x =0;x<= maxcrn.x ;x++)
	{
		for(var y =0;y<= maxcrn.y ;y++)
		{
			fun( v.setxy(x,y).toaxial().addv(crn), this )
		}
	}
}


/** v is changed */

Can.prototype. isvis	=function( v )
{
	// var crn	=this.crn.c().add(-1,0)

	v.subv( this.crn ).add(1,0).todoffs()

	var maxcrn	=this.size2.c().mul(2).add(1,0).todoffs()

	return v.x >= 0 && v.x <= maxcrn.x && v.y>=0 && v.y<=maxcrn.y
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



/** @arg {Vec} c	- in global pixels!*/

Can.prototype. fillhex	=function( c, col="#888888" )
{
	var ctx	=this.ctx
	var r	=this.units.r,	h	=this.units.h2>>1

	var f	=Math.floor
	var ce	=Math.ceil
	var d	=Math.round

	ctx.beginPath()
	ctx.moveTo(f( c.x-(r>>1) ),f( c.y-h-1 ))
	ctx.lineTo(ce( c.x+(r>>1) ),f( c.y-h-1 ))
	ctx.lineTo(ce( c.x+r ),d( c.y ))
	ctx.lineTo(ce( c.x+(r>>1) ),ce( c.y+h ))
	ctx.lineTo(f( c.x-(r>>1) ),ce( c.y+h ))
	ctx.lineTo(f( c.x-r ),d( c.y ))
	ctx.closePath()
	ctx.fillStyle	=col
	ctx.fill()
}



Can.prototype. drawimg	=function( loc, img, size =1, vbuf )
{
	var{ r, h2 }	=this.units

	vbuf.set(loc).tosqc(this).sub(r*size, (h2>>1)*size)

	this.ctx.drawImage( img, vbuf.x,vbuf.y, (r<<1)*size, h2*size )
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
		ctx.lineWidth	=1
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


///////////////////////////////////////////////////////////////////////////////


/** Canvas related pixels to map location.
 * Changes parameter loc vector */

Can.prototype. cansq2maph	=function( locsq )
{
	locsq.tohexc( this ).addv( this.crn ).roundh()

	locsq.h	=this.pl.loc.h

	return locsq
}