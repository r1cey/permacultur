import JRev	from "../www/game/shared/JsonRevivr.js"

import it from "../www/game/shared/items/items.js"

export default class extends JRev
{
	constructor()
	{
		super()

		this.add([ it.Dewd, it.Belt, it.Seedbag ])
	}
}