import Jable from "../Jsonable.js"



export default class Item	extends Jable
{
	num	=1

	spoil	=0

	/** A unit is 125 cubic mm which is a sunflower seed */
	static vol	=1

	// acts	={}

	static key	="item"


	constructor( obj, num )
	{
		super()
		
		this.set( obj )
		// Object.assign( this, obj )

		if( num	!= null )	this.num	=num
	}


	/** @returns new obj or this. */
	take( l =1 )
	{
		var out

		if( l < this.num )
		{
			out	=new this.constructor( this ,l )

			this.num	-= l
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
		return ( this.num	-=l ) <= 0
	}

	

	calcvol()
	{
		return this.constructor.vol * this.num
	}


	toJSON( key )
	{
		return key===Item.key ? {key:this.constructor.key, obj:this} : this
	}


	static newRevObj( jrev )
	{
		return {

			key	:this.key
			,
			fromJSON	:( meta )=>	jrev.fn( meta.key, meta.obj )
		}
	}
}