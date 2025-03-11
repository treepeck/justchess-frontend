import {
	useState,
	useContext,
	createContext,
} from "react"
import { Outlet } from "react-router-dom"

type EngineConfCtx = {
	threads: number,
	hashSize: number,
	difficulty: number,
	setThreads: React.Dispatch<React.SetStateAction<number>>,
	setHashSize: React.Dispatch<React.SetStateAction<number>>,
	setDifficulty: React.Dispatch<React.SetStateAction<number>>,
}

const EngineConfContext = createContext<EngineConfCtx>({
	threads: 1, hashSize: 32, difficulty: 10,
	setThreads: () => { }, setHashSize: () => { }, setDifficulty: () => { },
})

export default function EngineConfProvider() {
	const [_threads, _setThreads] = useState<number>(1)
	const [_hashSize, _setHashSize] = useState<number>(32)
	const [_difficulty, _setDifficulty] = useState<number>(10)

	return (
		<EngineConfContext.Provider value={{
			threads: _threads, hashSize: _hashSize,
			difficulty: _difficulty, setThreads: _setThreads,
			setHashSize: _setHashSize, setDifficulty: _setDifficulty
		}}>
			<Outlet />
		</EngineConfContext.Provider>
	)
}

export function useEngineConf() { return useContext(EngineConfContext) }