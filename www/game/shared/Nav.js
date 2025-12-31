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
}