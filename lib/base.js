const fetch = require('node-fetch')

const GET_WITH_COOKIE = ({ path, cookie }) => {
  let opts ={
    headers: { cookie }
  }

  return new Promise((resolve, reject) => {
    let url = `${ path }`
    console.log(`GET ${url}`)
    console.log(cookie)
    fetch(url, opts)
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })
  })
}

const POST_WITH_COOKIE = ({ path, cookie, formdata }) => {
  return new Promise((resolve, reject) => {
    let url = `${ path }`
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        cookie,
      },
      body: formdata
    })
      .then(res => res.json())
      .then(data => resolve(data))
  })
}

 module.exports = {
  GET_WITH_COOKIE, POST_WITH_COOKIE
}