import NS from '../../www/shared/NSpace.js'


export default class S extends NS
{
}


///////////////////////////////////////////////////////////////////////////////



S.prototype. mapcode	=function( bcode, loc, ccode )
{
	var cl

	for(var n in this.cls.o )
	{
		cl	=this.cls.o[n]

		if( cl.pl.sees( loc ))
		{
			cl.send.mapcode( bcode, loc, ccode )
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



S.prototype. newpl	=function( pl )
{
	for(var n in this.cls.o )
	{
		if(this.cls.o[n].pl.seespl( pl ))
		{
			this.cls.o[n].send.newpl( pl )
		}
	}
}



S.prototype. plconn	=function( pl )
{
	for(var n in this.cls.o)
	{
		if( this.cls.o[n].pl.seespl( pl ))
		{
			this.cls.o[n].send.plconn( pl )
		}
	}
}



S.prototype. plmov	=function( pl, newloc )
{
	if( pl.cl )	pl.cl.s.clplmov( newloc )

	for(var n in this.cls.o )
	{
		var pl2	=this.cls.o[n].pl

		if( pl === pl2 )	continue

		var seesoldloc	=pl2.sees(pl.loc)

		if( pl2.sees(newloc) || seesoldloc)
		{
			pl2.cl.s.plmov( pl, newloc, seesoldloc )
		}
	}
}