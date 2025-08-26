import Cl	from './Client.js'

export default class Cls
{
	srv

	o	={}



	g( n )	{return this.o[n] }

	s( n, cl )	{ this.o[n] =cl }



	constructor( srv )
	{
		this.srv	=srv
	}
}


///////////////////////////////////////////////////////////////////////////////



Cls.prototype. new	=function( ws, pl )
{
	var cl	=new Cl( ws, pl, this.srv )

	this.o[pl.name]	=cl

	return cl
}



Cls.prototype. del	=function(n)
{
	delete this.o[n]
}