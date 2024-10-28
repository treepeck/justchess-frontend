/**
 * Creates a new position from the provided indexes.
 * @param {number} i 
 * @param {number} j 
 * @returns {string}
 */
export default function posFromInd(i, j) {
  let file = ""
  switch (j) {
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
  return `${file}${8 - i + 1}`
}