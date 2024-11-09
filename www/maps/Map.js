var Map	=( Base ) => class extends Base
{
	maps	// might not be necessary
			// maps might have canvas element instead






	static Msg	=Base

	static calcy( x1, y1, x2, y2, x )
	{
		var m	=(y2-y1)/(x2-x1)

		return m*x + y1 - m*x1
	}
}

export default Map