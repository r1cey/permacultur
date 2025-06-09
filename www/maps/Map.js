import ShMap	from "../shared/maps/Map.js"



export default class Map extends ShMap
{
	maps	// might not be necessary
			// maps might have canvas element instead






	// static Msg	=Base // ?


	/** Get two points which make a line, an X value of point on that line,
	 * and return the Y value of that point */

	static calcy( x1, y1, x2, y2, x )
	{
		var m	=(y2-y1)/(x2-x1)

		return m*x + y1 - m*x1
	}
}

