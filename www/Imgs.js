export default class I
{
	html

	o	={}


	constructor(html)
	{
		this.html	=html

		var dir	='./imgs/'

		var fns	=
		[
			'leaves5.png' ,
			"sand3.png"
		]

		for(var fn of fns )
		{
			var img	=new Image()

			img.src	=dir+fn

			this.o[fn.slice(0,fn.lastIndexOf('.'))]	=img
		}
	}
}