// import './utils.js'

import Client from "./Client.js"

window.cl	=new Client()

cl.srv.url	='ws://212.68.153.116:8043'

cl.start()

cl.html.can.drawgrid()

// cl.html.menu.setopts( { symb :"a" } )

// cl.html.menu.show()