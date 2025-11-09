export default function newblocks( Block )
{
	var o	={}

	///////////////////////////////////////////////////////////////////////////////


	o.Dewd	=class extends Block
	{
		dir

		static vol	=500000

		static key	="dewd"


		constructor( dewd )
		{
			super( dewd )

			this.dir	??=rnd(6)
		}


		sim_rot( ddir )
		{
			return Loc.roth( this.dir, ddir )
		}


		activate( )
		{
			var cello	=map.obj.g(loc)

			var item	=cello.drop[this.gkey()]

			var actitem	=item.take()

			delete cello.drop[this.gkey()]

			/** @todo push remaining items out of cell */

			actitem.active	=true

			cello.block	=actitem
		}


		draw( can, loc, vbuf )
		{
			var ctx	=can.ctx

			ctx.save()

			vbuf.set(loc).tosqc(can)

			ctx.translate( vbuf.x, vbuf.y )

			ctx.rotate( -Loc.rad60 * (this.dir+1) )

			ctx.translate( -vbuf.x, -vbuf.y )
		
			can.drawimg( loc, can.imgs().o.dewd, 1, vbuf )

			ctx.restore()
		}
	}

	///////////////////////////////////////////////////////////////////////////////


	return o
}