module Main where

import Prelude
import Effect (Effect)
import Effect.Console (log)
import Effect.Random

main :: Effect Unit
main = do
  n <- random
  log "random number:"
  log (show n)

