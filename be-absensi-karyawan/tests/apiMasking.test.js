const request = require('supertest')
const app = require('..')  
const server = request(app.server)
const ParseApi = require('../api/helper/parse')

describe ('Hit Movie Detail', () => {
  let movieIdExample = 'tt0080684';
  it('GET /v1/movie/detail?movieId='+movieIdExample+' - should 200', async () => {
    server
      .get(`/v1/movie/detail?movieId=${movieIdExample}`) 
      .expect(200)
      .end((err, res) => { 
        expect(res.status).toEqual(200);   
      }) 
  })

  it('GET /v1/movie/detail - should 400 need moviewId', async () => {
    server
      .get('/v1/movie/detail')
      .expect(400)
      .end((err, res) => {  
        expect(res.status).toEqual(400);  
      }) 
  })
})

describe('Hit Search Movie', () => {
  it('GET v1/movie/search?s=Star%20Wars - should 200', async () => {
    server
      .get('/v1/movie/search?s=Star%20Wars') 
      .expect(200)
      .end((err, res) => { 
        expect(res.status).toEqual(200); 
      }) 
  })
  it('GET /v1/movie/search - should 400 need params s for search', async () => {
    server
      .get('/v1/movie/search')
      .expect(400)
      .end((err, res) => { 
        expect(res.status).toEqual(400);
        expect(res.body.errors.message).toEqual('Bad Request'); 
      })
  })
})

describe ('Test Masking API', () => {
  it('should return body search', async () => {
   let url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=Star%20Wars`

   const result = await ParseApi.get(url)

   expect(result.Response).toEqual('True')
   expect(result).toHaveProperty('Search')
  })

  it('should return error 401: No API key provided', async () => {
    let url = `http://www.omdbapi.com/?s=Star%20Wars`

    const result = await ParseApi.get(url)

    expect(result.statusCode).toEqual(401)
    expect(JSON.parse(result.body)).toHaveProperty('Error')
   })
}) 