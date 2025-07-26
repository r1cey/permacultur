import tools	from "./shared/tools.js"
import Inv	from "./player/Inv.js"


tools.Belt	=class extends tools.newBelt( Inv )
{
	
}



tools.Seedbag	=class extends tools.newSeedbag( Inv )
{
	attachhtmlinv( htmlinv )
	{
		this.htmlobj	=htmlinv.addseedbag( this )

		for(var itemn in this.o )
		{
			this.htmlobj.additem( itemn, this.o[itemn] )
		}
	}
}


export default tools