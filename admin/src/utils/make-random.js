/*
  Generate random string/characters
  https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
*/
export function makeRandom(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength))

  return result
}
