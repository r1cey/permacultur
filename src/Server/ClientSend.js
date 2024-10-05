import NS from '../../www/shared/NSpace.js'

import Loc from '../../www/shared/Loc.js'

export default class Send extends NS
{
	
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. setpl	=function()
{
	this.send.json({ setpl: this.pl.newmsg() })
}



Send.prototype. map	=function()
{
	var pl	=this.pl

	var map	=pl.map.game.maps.gr.slice( pl.loc, pl.vision )

	for(var i=0; i<map.bufs.length; i++)
	{
		this.send.binary( map.bufs[i].buf )
	}

	map	=pl.map.game.maps.tr.slice( pl.loc, pl.vision )

	for(i=0; i<map.bufs.length; i++)
	{
		this.send.binary( map.bufs[i].buf )
	}

	this.send.json(
		{
			setmap:
			{
				o: map.o, loc: map.getloc(), r: pl.vision
			}
		},( key, val )=>
		{
			switch(key)
			{
				case 'pl' :

					if( this.pl === val )
					{
						return 0
					}
					else
					{
						return val.newmsgvis()
					}
			}
			
			return val
		})
}


//////////////////////////////////////////////////////////////////////////////



Send.prototype. mapcode	=function( loc, ...codes )
{
	this.send.json({mapcode:{ loc, codes }})
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. clplmov	=function( newloc )
{
	var pl	=this.pl

	var o	=
	{
		loc	:newloc
		,
		delta	:newloc.c().subv( pl.loc )
		,
		r	:pl.vision
		,
		cells	:[]
	}

	var cell, cello

	this.pl.map.fordiredge(( loc, map )=>
	{
		if( ! map.inside(loc) )
		{
			o.cells.push(0)

			return
		}

		cell	=[]


		for(var i=0; i<map.bufs.length; i++)
		{
			cell[i]	=map.gcellc( i, loc )
		}

		cello	=map.gcello( loc )

		if( cello )
		{
			var msgcello	={}
		
			for(var prop in cello )
			{
				switch( prop )
				{
					case 'pl' :

						msgcello[prop]	=cello[prop].newmsgvis()
					break;
					default:

						msgcello[prop]	=cello[prop]
				}
			}

			cell[map.bufs.length]	=msgcello
		}

		o.cells.push( cell )
	}
	, Loc.dirv2dirh( o.delta ), o.r, o.loc )

	this.s.json({ clplmov: o })
}


/** New player born. */

Send.prototype. newpl	=function( pl2 )
{
	this.send_json({ newpl: pl2.newmsgvis() })
}


/** Different player connected */

Send.prototype.plconn	=function( pl2 )
{
	this.send_json({ plconn: { name: pl2.name, cl: pl2.cl ? 1 : 0 }})
}


///////////////////////////////////////////////////////////////////////////////


Send.prototype. json	=function( o, replcr )
{
	this.ws.send( JSON.stringify( o, replcr ) )
}

Send.prototype. binary	=function( buf )
{
	this.ws.send( buf, {binary: true})
}

/*Send.prototype. createpl	=function( name )
{
	this.json({ createpl: name })
}

Send.prototype. units	=function( clid, pln )
{
	var pls	=this.s.g.pls

	var pl	=pls[pln]

	var o	=
	{
		pls	:[]
	}
	
	this.s.g.forseenpls( pln, ( pl2n )=>
	{
		o.pls.push( pls[pl2n].newmsgvis( pl2n ) )
	})
	
	this.json( clid, {units: o})
}

Send.prototype. water	=function()
{
	this.send.json({ water: this.pl.water })
}*/



/** Player object should have old location still. */

Send.prototype. plmov	=function( clid, pl2n, newloc, seen, pl2 )
{
	var pl	=this.cl.pl

	var o	={ loc: newloc.newarr() }

	seen ?
		o.name	=pl2n	:
		o.pl	=pl2.newmsgvis(pl2n)

	this.json(clid, { plmov: o })
}

Send.prototype. wrtc	=function( o )
{
	this.json({ wrtc: o })
}
