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

		for(var it in its )	this.add([ it ])

		this.add([ Hands, Item.newRev(this) ])
	}
}