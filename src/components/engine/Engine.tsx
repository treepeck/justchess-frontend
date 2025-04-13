import _WebSocket from "../../ws/ws"
import { useEffect, useState } from "react"
import { fromUCI, LegalMove } from "../../game/move"
import { useEngineConf } from "../../context/EngineConf"

type EngineProps = {
	socket: _WebSocket,
	engine: React.RefObject<Worker | null>,
	currentFEN: string,
	legalMoves: LegalMove[],
	isTurn: boolean,
}

export default function Engine({ socket, engine, currentFEN, legalMoves, isTurn }: EngineProps) {
	const { threads, hashSize, difficulty } = useEngineConf()
	// The engine cannot generate moves until it finished configuration.
	const [isReady, setIsReady] = useState<boolean>(false)

	const [bestMove, setBestMove] = useState<string>("")

	useEffect(() => {
		engine.current = new Worker("/engine/stockfish-nnue-16.js")

		engine.current.onmessage = handleMessage

		engine.current.postMessage("uci")

		return () => engine.current?.terminate()
	}, [])

	useEffect(() => {
		if (isTurn && isReady) {
			engine.current!.postMessage(`position fen ${currentFEN}`)
			window.setTimeout(() => {
				engine.current!.postMessage(`go depth ${difficulty}`)
			}, 3000)
		}
	}, [isTurn, isReady])

	useEffect(() => {
		const move = fromUCI(bestMove, legalMoves)
		if (move) {
			socket.sendMakeMove(move)
		}
	}, [bestMove, legalMoves])

	function handleMessage(msg: MessageEvent) {
		const tokens = msg.data.split(" ")
		if (tokens.length < 1) { return }

		switch (tokens[0]) {
			// First of all, configure the engine with the specified parameters.
			case "uciok":
				engine.current?.postMessage(`setoption name Threads value ${threads}`)
				engine.current?.postMessage(`setoption name Hash value ${hashSize}`)
				engine.current?.postMessage("setoption name MultiPV value 1")
				engine.current?.postMessage("setoption name UCI_LimitStrength value true")
				engine.current?.postMessage("setoption name UCI_Elo value 2000")
				engine.current?.postMessage("isready")
				break

			// Secondly, after engine finishes configuring, start a new game. 
			case "readyok":
				engine.current?.postMessage("ucinewgame")
				setIsReady(true)
				break

			// Finally, process best moves found by engine.
			case "bestmove":
				const uci = tokens[1]
				setBestMove(uci)
				break
		}
	}

	return <div className="engine-worker"></div>
}