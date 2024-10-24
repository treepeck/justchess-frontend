/**
 * Represents a position on a Board.
 */
export default class Position {
  /** @type {number} */
  file
  /** @type {number} */
  rank

  /**
   * Creates a new Position.
   * @param {number} file 
   * @param {number} rank 
   */
  constructor(file, rank) {
    this.file = file
    this.rank = rank
  }

  /** @returns {boolean} */
  isInBoard() {
    return this.file >= 1 && this.file <= 8 &&
      this.rank >= 1 && this.rank <= 8
  }

  /**
   * @param {Position} other 
   * @returns {boolean}
   */
  isEqual(other) {
    return this.file === other.file && this.rank === other.rank
  }

  /** @returns {string} */
  toString() {
    let file = ""
    switch (this.file) {
      case 1:
        file = "a"
        break
      case 2:
        file = "b"
        break
      case 3:
        file = "c"
        break
      case 4:
        file = "d"
        break
      case 5:
        file = "e"
        break
      case 6:
        file = "f"
        break
      case 7:
        file = "g"
        break
      case 8:
        file = "h"
        break
    }
    return `${file}${this.rank}`
  }
}

/**
 * Creates a new position from the provided indexes.
 * @param {number} i 
 * @param {number} j 
 * @returns {Position}
 */
export function posFromInd(i, j) {
  return new Position(j, 8 - i)
}

/**
 * Parses position from the provided string.
 * @param {string} posStr
 * @returns {Position}
 */
export function posFromStr(posStr) {
  const [file, rank] = posStr.split("")
  switch (file) {
    case "a":
      return new Position(1, Number.parseInt(rank, 10))
    case "b":
      return new Position(2, Number.parseInt(rank, 10))
    case "c":
      return new Position(3, Number.parseInt(rank, 10))
    case "d":
      return new Position(4, Number.parseInt(rank, 10))
    case "e":
      return new Position(5, Number.parseInt(rank, 10))
    case "f":
      return new Position(6, Number.parseInt(rank, 10))
    case "g":
      return new Position(7, Number.parseInt(rank, 10))
    case "h":
      return new Position(8, Number.parseInt(rank, 10))
  }
  return new Position(0, 0)
}
