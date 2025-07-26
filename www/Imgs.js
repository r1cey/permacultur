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
			"sand3.png" ,
			"dewd.png",
			"cactus.png"
		]
		var shadows	=
		{
			"leaves5" :1
		}
		for(var fn of fns )
		{
			let img	=new Image()

			let name	=fn.slice(0,fn.lastIndexOf('.'))	//@TODO: fix "let"?
				// name is used in onload

			if( shadows[name] )
			{
				img.onload	=()=>
				{
					var can	=document.createElement("canvas")

					var ctx	=can.getContext("2d")

					can.width	=img.width

					can.height	=img.height

					ctx.drawImage( img, 0,0 )

					var imgdata	=ctx.getImageData( 0,0, img.width, img.height )
					
					var arr	=imgdata.data

					for(var i =0 ;i< arr.length ;i +=4 )
					{
						arr[i]	=arr[i+1]	=arr[i+2]	=0
					}
					ctx.putImageData( imgdata, 0,0 )

					this.o[name+"_sh"]	=can
				}
			}
			img.src	=dir+fn

			this.o[name]	=img
		}
	}
}