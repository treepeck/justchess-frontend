import {
	useState,
	useContext,
	useEffect,
	createContext,
} from "react"
import _WebSocket from "../ws/ws"
import { Outlet } from "react-router-dom"
import Message from "../ws/msg"
import { useTheme } from "./Theme"

type ConnectionCtx = {
	socket: _WebSocket | null,
	messageQueue: Message[],
	setMessageQueue: Function,
}

const ConnectionContext = createContext<ConnectionCtx>({
	socket: null, messageQueue: [], setMessageQueue: () => { },
})

export default function ConnectionProvider() {
	const [socket, setSocket] = useState<_WebSocket | null>(null)
	// Stores all incomming messages, so they can be processed by provider consumers.
	// After processing the message, consumer should delete the message from the queue. 
	const [messageQueue, setMessageQueue] = useState<Message[]>([])
	const [isConnected, setIsConnected] = useState<boolean>(false)

	const { theme } = useTheme()

	useEffect(() => {
		const s = new _WebSocket()

		// Recieve and store the messages from the server.
		s.socket.onmessage = (data) => {
			const msg = new Message(new Uint8Array(data.data))
			setMessageQueue(prev => [...prev, msg])
		}

		s.socket.onclose = () => {
			setIsConnected(false)
		}

		s.socket.onopen = () => {
			setSocket(s)
			setIsConnected(true)
		}

		return () => s.close()
	}, [])

	return (
		<ConnectionContext.Provider value={{
			socket: socket,
			messageQueue: messageQueue,
			setMessageQueue: setMessageQueue,
		}}>
			{isConnected ? (
				<Outlet />
			) : <div className="main-container" data-theme={theme}>
				Connection with the server was lost.
				If the problem persists after reloading the page,
				please try again later.
			</div>
			}
		</ConnectionContext.Provider>
	)
}

export function useConnection() { return useContext(ConnectionContext) } 