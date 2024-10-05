import PlSh from './shared/Player.js'
import PCl from './PeerCl.js'
import Loc from './shared/Loc.js'

const ClPl =(c) => class extends c
{
	lcl

	pos	=new Loc()

	dest	=new Loc()

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

		var oldloc	=this.loc.c()

		var dv	=this.dest.c().subv(this.pos)

		if( dv.zero() )
		{
			return false
		}
		else if(dv.disth() < 0.1 )
		{
			this.pos.set(this.dest)
		}
		else
		{
			let mul	=0.22

			let map	=this.lcl.maps.gr

			switch( map.gwater( pl.loc ) )
			{
				case 1:
					mul	=0.17
				break;
				case 2:
				case 3:
					mul	=0.08
			}

			if( pl.water <= 0 )	mul=0.08

			this.pos.addv(dv.mul( mul ))
		}
		this.loc.set( this.pos ).roundh()

		// console.log(this.pos, this.loc, oldloc)

		if( this.loc.eq( oldloc ) )
		{
			return false
		}
		
		return true
	}
}



class PlVis extends ClPl( PlSh.VisO )
{
	step( dt )
	{
		if( super.step( dt ))
		{
			if( ! this.lcl.pl.sees( this.loc ))
			{
				delete this.lcl.vispls[this.name]
			}
		}
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




export default class Player extends ClPl( PlSh.O )
{
	static Vis	=PlVis


	step( dt )
	{
		if( super.step( dt ))
		{
			this.lcl.srv.s.mov( this.loc )

			// pl.moved( V.dirv2dirh( oldloc.neg().addv(pl.loc) ) )
		}
	}
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
