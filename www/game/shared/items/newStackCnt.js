import newStackable from "./newStackable.js";

export default function( Stack )
{
	class SC	extends( Stack || newStackable() )
	{
		/**@static
		@var Cnt	*/

		static suffix	="_vc"


		constructor( ...args )
		{
			super( ...args )
		}

		isstcnt()	{return this }

		gCnt()	{return this.constructor.Cnt }

		newcnt()
		{
			return new this.gCnt().setuniq()
		}
	}


	SC.prototype. canadditem	=function( nav ,_i ,item ,len )
	{
		return Number(
			
			( ! nav.dad(_i).isloc() || nav.exdad( _i, "isempty" )) &&

			this.gCnt().canadditem( nav ,_i ,item ,len )
		)
	}

	return SC
}