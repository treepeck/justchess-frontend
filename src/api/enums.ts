export enum GameResult {
  Checkmate = 0,
  Resignation = 1,
  Timeout = 2,
  Stalemate = 3,
  InsufficientMaterial = 4,
  FiftyMoves = 5,
  Repetition = 6,
  Agreement = 7
}

export enum GameStatus {
  Aborted = 0,
  Waiting = 1,
  Leave = 2,
  Continues = 3,
  Over = 4,
}

export enum MoveType {
  Basic = 1,
  PawnForward = 2,
  Defend = 3,
  LongCastling = 4,
  ShortCastling = 5,
  EnPassant = 6,
  Promotion = 7,
}