import tools	from "./shared/tools.js"


tools.Seedbag	=class extends tools.Seedbag
{
	htmlsb


	/*constructor( obj, htmlinv )
	{
		super( obj )

		this.htmlinv	=htmlinv
	}*/


	attachhtml( htmlinv )
	{
		this.htmlsb	=htmlinv.addseedbag()

		for(var itemn in this.o )
		{
			this.htmlsb.add( itemn, this.o[itemn] )
		}
	}
}


export default tools