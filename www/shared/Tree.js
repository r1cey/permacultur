import Map from './Map.js'

export default class T extends Map
{
	branchs	//16bit array

	floor	//8bit array

	timing	//16bit array

	////

	branch_bmap	=	//bit map
	[
		[ 5 ]	// typetree:32
		[ 2, 2 ]	// trunk/branch/rope:4	branch:4
		[ 6 ]	// plant:64
	]
}