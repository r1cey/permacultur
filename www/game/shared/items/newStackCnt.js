import newStackable from "./newStackable.js";

export default function( Cnt ,Stack )
{
	class St	extends( Stack || newStackable() )
	{
		static Cnt	=Cnt


		constructor( ...args )
		{
			super( ...args )
		}

		isstckcnt()	{return this }

		isstck()	{return this }

		iscnt()	{return null }

		gCnt()	{return this.constructor.Cnt }

		newcnt()
		{
			return new this.gCnt().setuniq()
		}
	}

	return St
}