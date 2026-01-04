import Jable from "../Jsonable.js"

// import newPathable from "../newPathable.js"


export default class It	extends Jable
{
	static key	="item"

	/**@static
	@var vol */
	
	/** A unit is 125 cubic mm which is a sunflower seed */
	static mm3perunit	=125



	vol()	{return this.constructor.vol }
}