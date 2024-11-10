export default class Player {
  id: string
  time: number
  isConnected: boolean

  constructor(id: string, time: number, ic: boolean) {
    this.id = id
    this.time = time
    this.isConnected = ic
  }
}