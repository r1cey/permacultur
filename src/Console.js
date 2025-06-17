import * as rl from "node:readline/promises"


export default class Con
{
	rl	=rl.createInterface({ input :process.stdin, output :process.stdout })

	game


	constructor( game )
	{
		this.game	=game

		this.rl.on( "line", this.online.bind(this))
	}
}



Con.prototype. online	=async function( str )
{
	var arr	=str.split(" ")

	switch(arr[0])
	{
		case "save" :

			this.game.save()
		break
		case "stop" :

			await this.game.stop()

			console.log("stopped")
	}
}



Con.prototype. out	=function( str )
{
	this.rl.write( str )
}