export default function newstacks( Stack )
{
	var o	={}


	///////////////////////////////////////////////////////////////////////////


	o.Multi	=class extends Stack
	{
		static area	=4

		static height	=4.5

		// static vol	=15*15*30

		static key	="multi"
	}


	o.CucumberSeed	=class extends Stack
	{
		static area	=6

		static height	=0.15

		static key	="cucumber_seeds"
	}

	///////////////////////////////////////////////////////////////////////////


	return o
}
