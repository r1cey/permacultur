export function newBox( Cnt )
{
	class Box extends Cnt
	{
		static boxvol	=boxvol ?? 8000	//10cm^3


		isbox()	{return this }


		gboxvol()	{return this.constructor.boxvol }


		remvol()	{return this.constructor.boxvol - this.itemvol() }


		canadditem( nav, _i , item ,len )
		{
			return Math.min(
				
				Math.floor( this.remvol() / item.vol() ),

				len ,

				Cnt.canadditem( nav, _i ,item ,len )
			)
		}
	}


	return Box
}