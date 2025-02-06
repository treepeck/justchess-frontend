import {
	useState,
	useContext,
	useEffect,
	createContext,
} from "react"
import _WebSocket from "../ws/ws"
import { Outlet } from "react-router-dom"

type ConnectionCtx = {
	socket: _WebSocket | null,
}

const ConnectionContext = createContext<ConnectionCtx>({ socket: null })

export default function ConnectionProvider() {
	const [socket, setSocket] = useState<_WebSocket | null>(null)
	const [isConnected, setIsConnected] = useState<boolean>(false)

	useEffect(() => {
		const s = new _WebSocket()

		s.socket.onclose = () => {
			console.log("Connection closed.")
			setIsConnected(false)
		}

		s.socket.onopen = () => {
			console.log("Connection opened")
			setSocket(s)
			setIsConnected(true)
		}

		return () => s.close()
	}, [])

	return (
		<ConnectionContext.Provider value={{
			socket: socket
		}}>
			{isConnected ? (
				<Outlet />
			) : <div>
				Connection with the server was lost.
				If the problem persists after reloading the page,
				please try again later.
			</div>
			}
		</ConnectionContext.Provider>
	)
}

export function useConnection() { return useContext(ConnectionContext) } 