export default class Es
{
	game

	codes	=
	{
		"5"	:"Player doesn't exist. Make a new one."
		,
		"8"	:"Maximum number of players reached."
		,
		"9"	:"Maximum number of players per IP address reached."
		,
		"11"	:"Player with such email already exists."
		,
		"403"	:"No map file"
		,
		"404"	:"No players folder!"
		,
		"405"	:"Can't find config file."
		,
		"414"	:"Player file corrupted."
		,
		"453"	:"Can't write map file."
		,
		"454"	:"Can't write player file."
		,
		"803"	:"Wrong password for player"
		,
		"808"	:"Maximum number of clients reached."
		,
		"809"	:"Maximum number of clients per IP address reached."
		,
		"811"	:"Player with such name is being created right now. Try again in 10 minutes."
		,
		"4013"	:"Someone else is already connected to this player."
		,
		"4801"	:"Server manually stopped."
		,
		"4802"	:"Client disconnected on their own."
	}

	g(n)	{ return this.o[n] }

	s(n, v)	{ this.o[n]	=v }

	constructor(g)
	{
		this.game	=g
	}
}