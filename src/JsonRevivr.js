import JRev	from "../www/game/shared/JsonRevivr.js"

// import Pl from "./player/Player.js"
// import Item from "../www/game/shared/items/Item.js"
// import Hands from "../www/game/shared/player/Hands.js"
import its from "../www/game/shared/items/items.js"

export default class extends JRev
{
	constructor()
	{
		super()

		for(var itk in its )	this.add([ its[itk] ])

		// this.add([ Pl, Hands, Item.newRev(this) ])
	}
}