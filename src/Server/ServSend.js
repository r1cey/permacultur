// import NS from '../../www/game/shared/NSpace.js'

import Loc from "../../www/game/shared/Loc.js"


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***


export default class SSe
{
}*/


var out	={}


///////////////////////////////////////////////////////////////////////////////



out. mapaddobj	=function( map, loc, o )
{
	for(var n in this.cls.o )
	{
		var cl	=this.cls.o[n]

		if( cl.pl.sees( loc ))
		{
			cl.send("map_additem" ,map ,loc ,item )
		}
	}
}

/** @arg {string} act 
 * @arg {array} vals */

out. mapset_	=function( map, act, loc, vals )
{
	for(var n in this.cls.o )
	{
		var cl	=this.cls.o[n]

		if( cl.pl.sees( loc ))
		{
			cl.send("mapset_", map, act, loc, vals )
		}
	}
}



out. mapobjset	=function( map, loc, key )
{
	for(var n in this.cls.o )
	{
		var cl	=this.cls.o[n]

		if( cl.pl.sees( loc ))
		{
			cl.send_mapobjset( map, loc, key )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



out. newpl	=function( pl )
{
	for(var n in this.cls.o )
	{
		if(this.cls.o[n].pl.seespl( pl ))
		{
			this.cls.o[n].send("newpl", pl )
		}
	}
}



out. plconn	=function( pl )
{
	for(var n in this.cls.o)
	{
		if( this.cls.o[n].pl.seespl( pl ))
		{
			this.cls.o[n].send.plconn( pl )
		}
	}
}



out. plmov	=function( pl, oldloc )
{
	var newloc	=pl.loc

	var delta	=new Loc().set(newloc).subv(oldloc)

	if( pl.cl && ! delta.h )	pl.cl.send("clplmov", delta )

	for(var n in this.cls.o )
	{
		var pl2	=this.cls.o[n].pl

		if( pl === pl2 )	continue

		var seesoldloc	=pl2.sees(oldloc)

		if( pl2.sees(newloc) || seesoldloc)
		{
			pl2.cl.send("plmov", pl, delta, seesoldloc )
		}
	}
}




out. plclimb	=function( pl, dir )
{
	if( pl.cl )	pl.cl.s.clplclimb( dir )

	for(var n in this.cls.o )
	{
		var pl2	=this.cls.o[n].pl

		if( pl === pl2 )	continue

		if( pl2.sees(pl.loc) )
		{
			pl2.cl.s_plclimb( pl, dir )
		}
	}
}


out. rotobj	=function( pl, loc, dir, obj )
{
	for(var n in this.cls.o )
	{
		var pl2	=this.cls.o[n].pl

		if( pl2.sees(loc) )
		{
			pl2.cl.sendjson(["rotobj" ,[ pl.name ,loc ,dir ,obj.constructor.key ]])
		}
	}
}



out. movobj	=function( )
{
	
}


out. plactonobj	=function( pl, loc, objkey, act, params )
{
	for(var n in this.cls.o )
	{
		if( this.cls.o[n].pl.sees( loc ))
		{
			this.cls.o[n].send_actonobj( loc, objkey, act, params )
		}
	}
}



SSe.prototype. setplitem	=function( pl ,item )
{
	// var itemk	=item.constructor.key

	pl.cl?.send("setclplitem" ,item )

	for(var n in this.cls.o )
	{
		var pl2	=this.cls.o[n].pl

		if( pl === pl2 )	continue

		if( pl2.sees(pl.loc) )
		{
			pl2.cl.send("setplitem" ,pl.name ,pl.loc ,item )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



export default out


/*
for(var funn in SSe.prototype)
{
	SSe.prototype["send_"+funn]	=SSe.prototype[funn]

	SSe.prototype["s_"+funn]	=SSe.prototype[funn]

	delete SSe.prototype[funn]
}*/