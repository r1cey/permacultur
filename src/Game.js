import Maps from './maps/Maps.js'
import Srv from './Server/Server.js'
// import Errors from './Errors.js'
import Players from './Pls.js'
import Loc	from './Loc.js'
import Pl from './Player.js'
// import { constrainedMemory } from 'process'
import Con from "./Console.js"
import * as tools from "../www/game/shared/tools.js"



Function.prototype. c	=function(...args)
{
	this.name.split('_').forEach((n)=>
	{

	})
}


var jsonkeys	=
{
	game	:
	{
		rep :()=> undefined
	},
	pl	:
	{
		rev :( val )=> new Pl( val )
	}
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

	intervals	=
	{
		min15 :0, sec :0
	}

	pls	=new Players( this)
	
	srv	=new Srv( this)

	server	=this.srv

	con	=new Con(this)


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



G.prototype. stop	=async function()
{
	var g	=this

	for(var key in this.intervals )
		clearInterval(this.intervals[key])

	g.srv.stop()

	await g.save()

	process.exit()
}


////////////////////////////////////////////////////////////////



G.prototype. save	=async function()
{
	var proms	=
	[
		this.maps.save()
		,
		this.pls.save()
	]
	return await Promise.allSettled( proms )
}



G.prototype. additem	=function( itemn, h, x, y )
{
	var loc	=new Loc(x,y,h)

	var item

	var map	=this.maps.fromloc( loc )

	switch( itemn )
	{
		case "dewd"	:

			item	=new tools.Dewd()
			
			map.obj.set(loc).dewd	=item
	}
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


///////////////////////////////////////////////////////////////////////////////



G.prototype. addobj	=function( loc, name )
{

}

/*


/** THIS FUNCTION SAVES STATE AND CRASHES!! *

Game.prototype. err	=function( code )
{
	console.error( 'SAVE STATE - TODO! '+code )
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