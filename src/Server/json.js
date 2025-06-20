import * as json from "../../www/game/shared/newjsonrules.js"

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

