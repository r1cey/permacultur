import newContainer from "../../www/game/shared/items/newContainer.js"

import{ IdPool }	from "../../www/game/shared/utils.js"



export default class Cnt	extends newContainer()
{
	static idpool	=new IdPool()



	setuniq()	{ this.id	=Cnt.idpool.new() ;return this }
}
