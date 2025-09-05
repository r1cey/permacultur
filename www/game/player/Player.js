import PlSh from '../shared/player/Player.js'
import PlVSh from '../shared/player/PlVis.js'
import Hands from './Hands.js'
import PCl from '../PeerCl.js'
import Loc from '../shared/Loc.js'

const ClPl =(c) => class extends c
{
	lcl

	gmap (){return this.lcl.maps.loc2map( this.loc ) }

	pos	=new Loc()

	dest	=new Loc()

	hands	=new Hands()

	srv()	{return this.lcl.srv }

	constructor( msg, lcl )
	{
		super( msg )

		this.lcl	=lcl

		this.dest.set( this.loc )

		this.pos.set( this.loc )
	}

	
	/*setloc()
	{
		this.loc.set(this.dest).roundh()
	}*/


	step( dt )
	{
		var pl	=this

		var newpos	=new Loc()

		var newloc	=new Loc()

		var dv	=this.dest.c().subv(this.pos)

		if( dv.zero() )
		{
			return false
		}
		else if(dv.disth() < 0.1 )
		{
			newpos.set(this.dest)
		}
		else
		{
			let mul	=0.22

			let map	=this.lcl.maps.gr

			switch( map.getwaterlvl( pl.loc ) )
			{
				case 1:
					mul	=0.17
				break;
				case 2:
				case 3:
					mul	=0.08
			}

			if( pl.water <= 0 )	mul=0.08

			newpos.set(this.pos).addv(dv.mul( mul ))
		}
		
		newloc.set( newpos ).roundh()

		if( ! this.loc.eq( newloc ) )
		{
			if( this.onmov( newloc ) )
			{
				this.pos.set( newpos )

				this.loc.set( newloc )
			}
		}
		else	this.pos.set( newpos )
	}


	onmov()	{return true }
}



class PlVis extends ClPl( PlVSh )
{
	onmov( newloc )
	{
		if( ! this.lcl.pl.sees( newloc ))
		{
			delete this.lcl.vispls[this.name]
		}
		
		return true

		/*var clpl	=this.lcl.pl

		if( ! (clpl.sees(this.loc) || clpl.sees(this.dest)) )
		{
			delete this.lcl.vispls[this.name]
		}*/
	}
}

PlVis.prototype. newcl	=function()
{
	this.cl	=new PCl(this)
}




export default class Player extends ClPl( PlSh )
{
	/** Is tile move acknowledged from server? */
	ismovack	=true

	static Vis	=PlVis


	
}


///////////////////////////////////////////////////////////////////////////////



Player.prototype. attachhtmlinv	=function( htmlinv )
{
	htmlinv.pl	=this

	this.hands.attachhtmlinv( htmlinv )

	for(var invn in this.inv )
	{
		switch( invn )
		{
			case "belt" :

				this.inv[invn].attachhtmlinv( htmlinv )
			break
			case "seedbag" :
		
				for(var bag of this.inv[invn] )
				{
					bag.attachhtmlinv( htmlinv )
				}
			break
		}
	}
}


///////////////////////////////////////////////////////////////////////////////



Player.prototype. onmov	=function( newloc )
{
	if( this.ismovack )
	{
		this.ismovack	=false

		this.lcl.srv.send("mov", newloc )

		return true
	}
	return false
}



Player.prototype. rejmov	=function()
{
	this.dest.set( this.loc )	//TODO: fix this!

	this.ismovack	=true
}



Player.prototype. climb	=function( loc )
{
	this.srv().send.climb( this.loc.h ?false:true , this.loc )
/*
	var pl	=this

	var{ tr }	=this.lcl.maps

	var loc2	=tr.findclosestbr( loc )*/
}

/*Player.prototype. moved	=function( dir )
{
	var pl	=this

	var loc	=pl.loc
	
	var vispls, name, pl2
	
	pl.lcl.srv.s.mov( loc )

	vispls	=pl.lcl.vispls
	
	for(name in vispls)
	{
		pl2	=vispls[name]

		if( ! pl.sees( pl2.loc ))
		{
			delete vispls[pl2.name]
		}
	}
}*/