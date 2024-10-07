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
 * Creates a new Position from the provided indexes.
 * @param {number} i 
 * @param {number} j 
 * @returns {Position}
 */
export function posFromInd(i, j) {
  return new Position(j, 8 - i)
}
