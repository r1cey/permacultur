export default function( Base )
{
	class Hold	extends Base
	{
		inv	={}

		///////////////////////////////////////////////////////////////////////
		

		isempty(){ for(var k in this.inv) return true; return false }


		itemvol()
		{
			var vol	=0

			var{ inv }	=this

			for(var k in inv )	vol += inv[k].calcvol()

			return vol
		}
	}


	return Hold
}