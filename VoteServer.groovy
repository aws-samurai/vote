/*
 * Copyright 2011-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

def eb = vertx.eventBus
def jdbcAddress = "voteAddr"
def insertVote = "insertVote"
def displayVote = "viewStar"

container.with {
  def jdbcConfig = [
  address : jdbcAddress,
  driver : "com.mysql.jdbc.Driver",
  url : "jdbc:mysql://localhost:3306/dev_vote?characterEncoding=UTF-8&characterSetResults=UTF-8&autoReconnect=true&autoReconnectForPools=true",
  username : "samurai",
  password : "samurai",
  "c3p0.idleConnectionTestPeriod" : 120,
  "c3p0.preferredTestQuery" : "SELECT 1",
  minpool  : 5,
  maxpool  : 20,
  acquire  : 5
  ]
  deployModule("com.bloidonia~mod-jdbc-persistor~2.0.1", jdbcConfig, 1 ) { asyncResult ->
	if( asyncResult.succeeded() ) {
	  logger.info "jdbc-persistor ready."
	} else {
	  logger.info "jdbc-persistor Failed to deploy ${asyncResult.cause()}"
	}
  }
}


/** Table Insert */
eb.registerHandler(insertVote) { message ->
  def insert = [action: 'insert',
  stmt : "INSERT INTO `vote` (`pk`, `questionId`, `userName`, `area`, `price`, `createDate`) VALUES (NULL, ?, ?, ?, ?, NOW())",
  values: [
	message.body["questionId"],
	message.body["userName"],
	message.body["area"],
	message.body["price"]
  ]]
  eb.send(jdbcAddress, insert) { reply ->
	if (reply.body.status != 'ok') { 
	  println 'jdbc error:' + reply.body
	}
	message.reply reply.body()
  }
}




/** WebSocket vote */
eb.registerHandler("vote") { message -> 
  def insert = [
		  questionId: message.body.q,
		  userName: message.body.userName,
		  area: message.body.area,
		  price: message.body.price
  ]
  eb.send(insertVote, insert) { reply ->
	println 'insert:' + reply.body
  }

  def json = new groovy.json.JsonBuilder()
  json {
	userName "@${message.body.userName}"
	price "${message.body.price}"
  }
  eb.send('viewVote', json.toString()) { reply ->
	println 'to Viewer :' reply.body
	message.reply reply.body
  }
}
eb.registerHandler("star") { message -> 
  eb.send('viewStar', '') { reply ->
	println 'viewStar:' + reply.body
  }
}


def server = vertx.createHttpServer()

server.requestHandler { req ->
  def file = req.uri == "/" ? "vote.html" : req.uri
  req.response.sendFile "web/$file"
}

vertx.createSockJSServer(server).bridge(prefix: '/eventbus', [[:]], [[:]])

server.listen(8080)
println "SockJSServer startup."
