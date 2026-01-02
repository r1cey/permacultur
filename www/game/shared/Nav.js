export default class Nav
{
	a


	constructor( arr )
	{
		this.a	=arr
	}


	last()	{return this.a.at(-1) }

	dad( i )	{return this.a[i-1] }

	dadl()	{return this.a.at(-2) }

	ex( i ,fn ,args)
	{
		this.a[i][fn]( this ,i ,args )
	}

	exdad( i ,fn ,args ){	this.ex( i-1 ,fn ,args )}

	exl( fn ,args ){	this.ex( this.a.length-1 ,fn ,args )}

	exdadl( fn, args ){	this.ex( this.a.length-2 ,fn ,args )}
}