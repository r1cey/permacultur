import JRev	from "./shared/JsonRevivr.js"

import Pl from "./player/Player.js"
import Item from "./items/Item.js"
import Hands from "./player/Hands.js"
import its from "./items/items.js"

export default class extends JRev
{
	constructor()
	{
		super()

		for(var itk in its )	this.add([ its[itk] ])

		this.add([ Hands, Item.newRevObj(this) ])
	}
}