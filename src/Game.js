import PathO	from '../www/game/shared/PathObj.js'
import Maps	from './maps/Maps.js'
import Srv from './Server/Server.js'
// import Errors from './Errors.js'
import Players from './player/Pls.js'
import Loc	from './Loc.js'
import Pl from './player/Player.js'
// import { constrainedMemory } from 'process'
import Con from "./Console.js"
// import Admin from "./Admin.js"



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


export default class G extends PathO
{
	conf	=
	{
		pa	:'./conf.js'
	}

	maps	=new Maps( this)

	time	=
	{
		sec	:{ int	:0, i :0 }
		,
		min15	:{ int	:0, i :0 }
		,
		hour	:{ int	:0, i :0 }
	}

	pls	=new Players( this)

	mode	=null

	// admin	=new Admin( this )
	
	srv	=new Srv( this)

	server	=this.srv

	con	=new Con(this)


	constructor( confpa )
	{
		super()
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

	if( ! await this.maps.start() )
	{
		return false
	}
	await this.pls.fillmissing()

	g.time.hour.int	=setInterval( g.hour.bind(g), 60*1000*60*1.5 )

	g.time.min15.int	=setInterval(g.min15.bind(g), 12*60*1000)

	g.time.sec.int	=setInterval( this.sec.bind(this), 1000*60/73)

	this.server.start()

	console.log(`Game had started!`)

	return true
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


///////////////////////////////////////////////////////////////////////////////



G.prototype. rempls	=async function()
{
	return this.conf.pls.max - (await this.files.readdir( this.conf.pls.dir )) 
}



G.prototype. path2obj	=function( path )
{
	var obj	=this

	for(var n of path )
	{
		obj	=obj.getobj(n)

		if( ! obj )	return
	}
	return obj
}



G.prototype. path2loc	=function( path )
{
	switch( this.getobj(path[0]) )
	{
		case this.pls :

			return this.pls.getobj( path[1] ).loc
		break
		case this.maps :

			return new Loc().seta( path[1] )
	}
}


///////////////////////////////////////////////////////////////////////////////



G.prototype. sec	=function()
{
	var gr	=this.maps.gr

	//var x, ic, v	=new Loc()

	gr.fore(( loc )=>
	{
		var ic	=gr.ic(loc)

		var o	=gr.obj.g(loc)

		if( o )
		{
			if( o.pl )
			{
				let pl	=o.pl

				pl.addheat( gr.getshade_i(ic) ? -0.01 : 0.01 )
			}
		}
	/*
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
		}*/
	})
}


G.prototype. min15	=function()
{
	var g	=this

	var gr	=g.maps.gr

	var tr	=g.maps.tr

	var itime	=g.time.min15.i

	// DRY

	gr.fore(( loc )=>
	{
		var ic	=gr.ic(loc)

		switch( gr.getwsr_i( ic ))
		{
			case "soil" :

				let lvl	=gr.getsoilhum_i( ic )

				if( lvl > 0 && lvl < 4 && ! gr.getshade_i( ic ) )
				{
					gr.dry_i( ic, loc )
				}
		}
	})
	// HUMIDIFY

	gr.fore(( loc )=>
	{
		// var ic	=gr.ic(loc)

		var o	=gr.obj.g(loc)

		if( o )
		{
			if( o.pl )
			{
				let pl	=o.pl

				if(pl.cl)
				{
					pl.subwater( 0.0208 )
				}
				else
				{
					pl.subwater( 0.007 )
				}
			}
			if( o.dewd )
			{
				let driploc	=new Loc(loc).neighh( o.dewd.dir )

				gr.wet( driploc )
			}
		}
	})
	// GROW		@TODO move growth checks to tree class

	gr.fore(( loc )=>
	{	
		var ic	=gr.ic(loc)

		switch( gr.getplfl_i( ic ))
		{
			case "plant" :

				let vegty	=gr.getvegty_i( ic )

				if( vegty === "none" )	break

				let time	=gr.getvegtime_i( ic )

				if( time === itime )
				{
					let veglvl	=gr.getveglvl_i( ic )

					if( vegty === "umbrtr")
					{
						if( veglvl <= 7 )
						{
							let humlvl	=gr.getsoilhum_i( ic )

							if( humlvl > 0 )	gr.grow( loc, ic, vegty, veglvl )
						}
						else if( veglvl <= 25 )
						{
							gr.grow( loc, ic, vegty, veglvl )
						}
						else
						{
							let humlvl	=gr.getsoilhum_i( ic )

							if( humlvl > 1 )	gr.grow( loc, ic, vegty, veglvl )
						}
					}
				}
		}
	})
	g.time.min15.i	=itime < gr.constructor.maxvegtime()-1 ? ++itime : 0
}



G.prototype. hour	=function()
{
	var g	=this

	var gr	=g.maps.gr

	var tr	=g.maps.tr

	gr.fore(( loc )=>
	{
		var ic	=gr.ic(loc)

		switch( gr.getwsr_i( ic ))
		{
			case "soil" :

				let lvl	=gr.getsoilhum_i( ic )

				if( lvl > 0 && lvl < 4 && gr.getshade_i( ic ) )
				{
					gr.dry_i( ic, loc )
				}
				
		}
	})
}


///////////////////////////////////////////////////////////////////////////////


/**@arg	id	-[ loc, pln ] */

G.prototype. getobj	=function( n )
{
	switch( n )
	{
		case "map" :

			return this.maps
		break
		case "pl" :

			return this.pls
		break
	}
}


G.prototype. toJSON	=function()
{
	return undefined
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