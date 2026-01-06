export default class Pls
{
	o	={}

	// arr	=[]

	g( n )	{ return this.o[n] }

	s( pl )	{ this.o[pl.name]	=pl }


	msg2navo( afrom ,i ,ato )	{ ato.push( this.o[afrom[i]] )}
}