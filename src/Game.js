import Maps from './maps/Maps.js'
import Srv from './Server/Server.js'
// import Files from './Files.js'
// import firstl from './firstl.js'
// import Errors from './Errors.js'
import Players from './Pls.js'
import Loc	from './Loc.js'
// import fs from './fs.js'
// import Map from './Map.js'
// import Player from './Player.js'
// import Actions from './Acts.js'
// import fs from 'fs/promises'
// import { constrainedMemory } from 'process'



Function.prototype. c	=function(...args)
{
	this.name.split('_').forEach((n)=>
	{

	})
}


// GLBLU


/** SERVER WORRIES ABOUT THE CLIENT WHICH MADE THE ACTION.
 * THE GAME ITSELF UPDATES THE OTHER CLIENTS!
 */


export default class G
{
	conf	=
	{
		pa	:'./conf.js'
	}

	maps	=new Maps( this)

	min15int

	secint

	pls	=new Players( this)
	
	srv	=new Srv( this)

	server	=this.srv


	constructor( confpa )
	{
		// this.start(confpa)
	}
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. start	=async function( confpa )
{
	var g=this

	// var fs	=this.files

	if( confpa )
	{
		try{
			var conf	=await readjson( confpa )

			if( conf.maps )
			{
				let conf	=conf.maps
				
				if( conf.dir )	g.maps.dir	=conf.dir

				if( conf.size )	g.maps.size	=conf.size
			}
		}
		catch(e)
		{
			console.error("Couldn't read conf file: "+confpa )
		}
	}

	await this.maps.start()

	// g.min15int	=setInterval(g.min15.bind(g), 15*60*1000)

	// this.secint	=setInterval( this.sec.bind(this), 1000*60/80)

	this.server.start()

	console.log(`Game had started!`)
}


////////////////////////////////////////////////////////////////



G.prototype. save	=function()
{
	this.maps.save()

	this.pls.save()
}



///////////////////////////////////////////////////////////////////////////////



G.prototype. rempls	=async function()
{
	return this.conf.pls.max - (await this.files.readdir( this.conf.pls.dir )) 
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. sec	=function()
{
	var map	=this

	var x, ic, v	=new Loc()

	this.maps.gr.fore(( loc )=>
	{
		ic	=map.i(loc)

		if( x =map.gwateri( ic ))
		{
			v.set(loc)

			map.flowcell( v )

			// if no place for water to flow

			if( v.eq(loc) || Loc.rotopph(map.getdir( v )) === map.gdiri(ic) )
			{
				x	=map.forring(( loc )=>
					{
						if( map.gwater( loc ) + 1 < x )
						{
							return loc
						}
					}
					,1 ,v )

				if( x )
				{
					map.addwater( x )

					map.dryi( ic, loc )
				}
			}
			else
			{
				if( map.gwater( v ) < x )
				{
					map.addwater( v )

					map.dryi( ic, loc )
				}
			}
		}
	})
}


G.prototype. min15	=function()
{
	var g	=this

	var map	=g.maps.gr

	map.fore(( loc )=>
	{
		var o	=map.o_g(loc)

		var c	=map.arr_g(loc)

		var pl	=o?.pl

		if( pl )
		{
			if(pl.cl)
			{
				pl.subwater( 0.0208 )
			}
			else
			{
				pl.subwater( 0.007 )
			}
		}
	}
	, true)
}

/*


/** THIS FUNCTION SAVES STATE AND CRASHES!! *

Game.prototype. err	=function( code )
{
	console.error( 'SAVE STATE - TODO! '+code )
}



Game.prototype. stop	=async function()
{
	var g	=this

	clearInterval(this.min15int)

	this.files.savemaps( this.maps )

	// await g.pls.save()
	
	g.srv.stop()
}

Game.prototype. min15	=function()
{
	var g	=this

/*
	g.maps.forcell(( loc, map )=>
	{
		var o	=map.o_g(loc)

		var c	=map.arr_g(loc)

		var pl	=o?.pl

		if( pl )
		{
			if(pl.cl)
			{
				pl.subwater( 0.0208 )
			}
			else
			{
				pl.subwater( 0.007 )
			}
		}
	}
	, true)
	*
}


Game.prototype. findpl	=function( name )
{
	var maps	=this.maps

	var loc

	for(var mapn in maps)
	{
		var map	=maps[mapn]

		loc	=map.fore(( v )=>
		{
			if( map.o_g(v)?.pl.name === name )
			{
				return new Loc().set(v)
			}
		})

		if(loc)	return loc
	}
}


Game.prototype. getpl	=function( {name, loc} )
{
	var pl	=this.map.o_g(loc)?.pl

	if(!pl)
	{
		pl	=this.findpl( name )
	}

	if(!pl)	this.err( 6418 )

	return pl
}



Game.prototype. plsees	=function( cl, loc )
{
	return cl.loc.disth(loc) <= this.getpl(cl).vision
}


Game.prototype. connpl	=function( cl )
{
	var pl	=this.getpl( cl )

	pl.cl	=cl

	for(var cl2 of this.srv.cls)
	{
		if( cl2 === cl )	continue

		if( this.plsees( cl.loc, loc ))
		{
			cl.send({ connpl : loc.newarr() })
		}
	}

	return pl
}
Game.prototype. disconpl	=function( loc )
{
	var pl	=this.getpl(loc)
	
	pl.cl	=0

	for(var cl of this.srv.cls)
	{
		if( cl.loc.eq( loc ))	continue

		if( this.plsees( cl.loc, loc ))
		{
			cl.send({ disconpl : loc.newarr() })
		}
	}

	return pl
}


/** !!!newloc will be modified!!! *

Game.prototype. movpl	=function( pln, newloc )
{
	var game	=this

	var srv	=game.srv

	var pls	=game.pls

	var pl	=pls[pln]

	var loc	=pl.loc

	if( pl.loc.eq( newloc )) return

	loc.forlineh( newloc, (v)=>
	{
		newloc.set(v)

		return true
	})
	
	var pl2, seesoldloc

	var cls	=game.srv.cls
	
	for(var i=0, len=cls.length; i<len; i++)
	{
		pl2	=pls[cls[i].pln]

		if( ! pl2 || pl2 === pl )	continue
		
		seesoldloc	=pl2.sees(loc)

		if( pl2.sees(newloc) || seesoldloc)
		{
			srv.s.plmov( i, pln, newloc, seesoldloc , pl )
		}
	}

	var dv	=newloc.c().subv(loc)

	pl.loc.set(newloc)

	if( pl.cl )	srv.s.clplmov( pl.cl-1, V.dirv2dirh( dv ) )


	game.map.fore( ( v ) =>
	{
		if( game.map.water(v) )
		{
			pl.setwater( 1 )

			return true
		}
	}
	, 1, pl.loc )
}




class Acts
{
	g

	constructor(game)
	{
		this.g	=game
	}
}

/** @arg o
 * @arg o.name
 *

Acts.prototype. login	=function( clid, o )
{
	console.log(`Login attempt: ${o.name}`)

	var game	=this.g

	var srv	=game.srv

	var name	=o.name

	var errs	=game.errs

	var pl	=game.pls[name]

	if( pl )
	{
		if(pl.cl)
		{
			let err	=4013

			console.log(errs[err])

			srv.clclose( clid, err, errs[err])

			return
		}
		else
		{
			console.log(`Login successful.`)

			srv.succlogin( clid, name, false )
		}
	}
	else if( srv.plscreated[name] )
	{
		let err	=811

		console.log(errs[err])

		srv.clclose( clid, err, errs[err])

		return
	}
	else
	{
		if(game.ismaxpls())
		{
			let err	=8
			
			srv.clclose( clid, err, errs[err])

			console.log(errs[err])
		}
		else if( game.ismaxips(cl.ip) )
		{
			let err	=9

			console.log( errs[err], cl.ip )

			srv.clclose( clid, err, errs[err])
		}
		else
		{
			console.log(`Requesting for new player.`)

			srv.plscreated[name]	=true

			srv.s.createpl( clid, name )
		}
	}
}*/