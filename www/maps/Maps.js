import Ground	from './Ground.js'
import Trees	from './Trees.js'




export default class M
{
	cl

	ground	=new Ground()

	gr	=this.ground

	trees	=new Trees()

	tr	=this.trees



	constructor( cl )
	{
		this.cl	=cl
	}
}


///////////////////////////////////////////////////////////////////////////////



M.prototype. ready	=function()
{
	return this.gr.ready() && this.tr.ready()
}




M.prototype. setbuf	=function( buf )
{
	var code	=Ground.getcode( buf )

	switch( code )
	{
		case 1 :
		case 2 :

			this.gr.setbuf( buf, code )
		break
		case 3 :

			this.tr.setbuf( buf, code )
	}

}