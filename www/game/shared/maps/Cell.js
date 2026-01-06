import newPath from "../newPathable.js"



export default newPath( class Cell
{
	v

	map



	constructor( map ,v )
	{
		this.v	=v

		this.map	=map
	}


	iscell()	{return this }


	/**@todo error handling */

	msg2navo( afrom ,i ,ato )
	{
		ato.push( this.map.obj.g(this.v)?.item )
	}
})