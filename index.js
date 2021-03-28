#!/usr/bin/env node

/*
  # dá permissão de execução para o arquivo index.js
  chmod +x index.js

  # dentro da pasta do projeto, para disponibilizar o pacote como shell-chat
  npm link

  # dentro da pasta do projeto, para remover o pacote shell-chat
  npm unlink @marcospca/shell-chat-client

  # para logar no npm via cli
  npm login

  # para publicar o pacote no npm
  npm publish --access public

  # pacote disponivel
  npm i -g @marcospca/shell-chat-client

  # para remover o pacote do npm é só ir dentro da pasta do projeto
  npm unpublish --force
*/

/*
shell-chat --username marcospca --room room01

node index.js --username marcospca --room room01 --hostUri localhost
*/

import Events from 'events'
import TerminalController from './src/terminal-controller.js'
import CliConfig from './src/cli-config.js'
import SocketClient from './src/socket.js'
import EventManager from './src/event-manager.js'

const [nodePath, filePath, ...commands] = process.argv
const config = CliConfig.parseArguments(commands)

const componentEmitter = new Events()
const socketClient = new SocketClient(config)
await socketClient.initialize()

const eventManager = new EventManager({ componentEmitter, socketClient })
const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
  roomId: config.room,
  userName: config.username
}
eventManager.joinRoomAndWaitForMessages(data)


const controller = new TerminalController()
await controller.initializeTable(componentEmitter)
