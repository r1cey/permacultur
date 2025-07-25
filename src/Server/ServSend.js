// import NS from '../../www/game/shared/NSpace.js'

import Loc from "../../www/game/shared/Loc.js"


/********
 * ALL OF THE PROTOTYPE METHODS WILL RECEIVE "s_" and "send_" PREFIXES 
 * ***/


export default class SSe
{
}


///////////////////////////////////////////////////////////////////////////////



SSe.prototype. mapaddobj	=function( map, loc, o )
{
	for(var n in this.cls.o )
	{
		var cl	=this.cls.o[n]

		if( cl.pl.sees( loc ))
		{
			cl.send_mapaddobj( map, loc, o )
		}
	}
}

/** @arg {string} act 
 * @arg {array} vals */

SSe.prototype. mapset_	=function( map, act, loc, vals )
{
	for(var n in this.cls.o )
	{
		var cl	=this.cls.o[n]

		if( cl.pl.sees( loc ))
		{
			cl.send_mapset_( map, act, loc, vals )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



SSe.prototype. newpl	=function( pl )
{
	for(var n in this.cls.o )
	{
		if(this.cls.o[n].pl.seespl( pl ))
		{
			this.cls.o[n].send_newpl( pl )
		}
	}
}



SSe.prototype. plconn	=function( pl )
{
	for(var n in this.cls.o)
	{
		if( this.cls.o[n].pl.seespl( pl ))
		{
			this.cls.o[n].send.plconn( pl )
		}
	}
}



SSe.prototype. plmov	=function( pl, oldloc )
{
	var newloc	=pl.loc

	var delta	=Loc.set(newloc).subv(oldloc)

	if( pl.cl && ! delta.h )	pl.cl.s_clplmov( delta )

	for(var n in this.cls.o )
	{
		var pl2	=this.cls.o[n].pl

		if( pl === pl2 )	continue

		var seesoldloc	=pl2.sees(oldloc)

		if( pl2.sees(newloc) || seesoldloc)
		{
			pl2.cl.s_plmov( pl, delta, seesoldloc )
		}
	}
}




SSe.prototype. plclimb	=function( pl, dir )
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


SSe.prototype. plactonobj	=function( pl, loc, objkey, act, params )
{
	for(var n in this.cls.o )
	{
		if( this.cls.o[n].pl.sees( loc ))
		{
			this.cls.o[n].send_actonobj( loc, objkey, act, params )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



for(var funn in SSe.prototype)
{
	SSe.prototype["send_"+funn]	=SSe.prototype[funn]

	SSe.prototype["s_"+funn]	=SSe.prototype[funn]

	delete SSe.prototype[funn]
}