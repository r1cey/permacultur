import V from './shared/Vec.js'

export default class Mov
{
	xp	=new V(0,0)

	y	=new V(0,0)

	yd	=new V(0,0)

	k1	=0
	k2	=0
	k3	=0

	constructor( f, z, r, x0)
	{
		var foo	=2 * Math.PI * f

		this.k1	=z / (Math.PI * f)

		this.k2	=1 / ((2 * Math.PI * f) * (2 * Math.PI * f))

		this.k3	=r * z / foo

		// this.reset(x0)
	}
}

Mov.prototype. reset	=function( x0 )
{
	this.xp.set(x0)

	this.y.set(x0)

	this.yd.setxy(0,0)
}

Mov.prototype. update 	=function( t, x )
{
	var xp	=this.xp
	var y	=this.y,	yd	=this.yd

	var xd	=V.set(x).subv(xp).div(t)

	xp.set(x)

	y.addv(V.set(yd).mul(t))

	yd.addv(V.set(xd).mul(this.k3).addv(x).subv(y)
		.subv(V.set(yd).mul(this.k1)).div(this.k2).mul(t))

	return yd
}