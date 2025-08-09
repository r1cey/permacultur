import tools	from "./shared/items.js"
import Box	from "./player/Box.js"


tools.Belt	=class extends tools.newBelt( Box )
{
	attachhtmlinv( htmlinv )
	{
		this.htmlobj	=htmlinv.addbelt( this )

		for(var itemn in this.o )
		{
			this.htmlobj.additem( itemn, this.o[itemn] )
		}
	}
}



tools.Seedbag	=class extends tools.newSeedbag( Box )
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