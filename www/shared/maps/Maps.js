export default (o)=>class
{
	ground	=new o.Ground(this)
	
	gr	=this.ground

	trees	=new o.Trees(this)

	tr	=this.trees




	fromloc( loc )
	{
		return loc.h	? this.tr	: this.gr
	}

	fromh( h )
	{
		return h	? this.tr	: this.gr
	}




	ready()
	{
		return this.gr.ready() && this.tr.ready()
	}




	fore( fun )
	{
		fun( this.gr )
		fun( this.tr )
	}




	isplmov( dest )
	{
		return this.fromloc( dest ).isplmov( dest )
	}
}


///////////////////////////////////////////////////////////////////////////////