// Creates a new position from the provided indexes.
export default function posFromInd(i: number, j: number) {
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

export function posFromString(str: string) {
  let f
  switch (str.charAt(0)) {
    case "a":
      f = 1
      break
    case "b":
      f = 2
      break
    case "c":
      f = 3
      break
    case "d":
      f = 4
      break
    case "e":
      f = 5
      break
    case "f":
      f = 6
      break
    case "g":
      f = 7
      break
    case "h":
      f = 8
      break
  }
  return { file: f, rank: Number.parseInt(str.charAt(1)) }
}