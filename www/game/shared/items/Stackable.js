import Jable from "../Jsonable.js"



export default class Stack	extends Jable
{
	len	=1

	spoil	=0

	/** A unit is 125 cubic mm which is a sunflower seed */
	static vol	=1

	// acts	={}

	// static key	="item"


	constructor( len )
	{
		super()
		
		if( len	)	this.len	=len
	}


	/**	Doesn't reduce the num of this item. 
	 * @returns new obj or this. */
	take( l =1 )
	{
		var out

		if( l < this.len )
		{
			out	=new this.constructor( this ,l )

			// this.num	-= l
		}
		else
		{
			out	=this
		}
		return 	out
	}


	/**@returns true if object remains empty */
	del( l )
	{
		return ( this.len	-=l ) <= 0
	}

	

	calcvol()
	{
		return this.constructor.vol * this.len
	}

/*
	toJSON( key )
	{
		switch( key )
		{
			case Stack.key :

				return[ this.constructor.key, this ]
		}
		return this
	}



	static newRevObj( jrev )
	{
		return {

			key	:Stack.key
			,
			fromJSON	:( meta )=>	jrev.revivr( meta[0], meta[1] )
		}
	}*/
}