#!/bin/bash

PWD=$(pwd)
cd $PWD

VERTXCP=""
for i in $PWD/lib/*.jar
do
  VERTXCP="$VERTXCP:$i"
done
export VERTXCP

# vertx run VoteServer.groovy -cp $VERTXCP >> systemout_`date +\%Y\%m\%d`.log 2>&1
vertx run VoteServer.groovy -cp $VERTXCP

