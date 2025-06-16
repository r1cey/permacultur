import * as json from "../../www/game/shared/json.js"

import Pl from "../Player.js"

json.add(
	{
		game	:
		{
			rep :()=> undefined
		},
		pl	:
		{
			rev :( val )=> new Pl( val )
		}
	})


export * from "json"

