/*
  Mocha unit tests for the jwt-bch-api.js library.
*/

const assert = require('chai').assert

const JwtLib = require('../../src/jwt-bch-lib')
const uut = new JwtLib()

describe('#jwt-bch-lib.js', () => {
  describe('#register', () => {
    it('should log in', async () => {
      // Log into the Auth server.
      await uut.register()

      const userData = uut.userData
      // console.log(`userData: ${JSON.stringify(userData, null, 2)}`)

      // Verify the hasRegistered flag gets set.
      assert.property(userData, 'hasRegistered')
      assert.equal(userData.hasRegistered, true)

      // Ensure the user data has been populated.
      assert.property(userData, 'apiLevel')
      assert.property(userData, 'rateLimit')
      assert.property(userData, 'userId')
      assert.property(userData, 'userEmail')
      assert.property(userData, 'bchAddr')
      assert.property(userData, 'accessToken')
      assert.property(userData, 'apiToken')
    })
  })

  describe('#getApiToken', () => {
    it('should get a new free-tier API token', async () => {
      const result = await uut.getApiToken(0)

      assert.property(result, 'apiToken')
      assert.isString(result.apiToken)

      assert.property(result, 'apiLevel')
      assert.equal(result.apiLevel, 0)
    })

    it('should throw a 402 error for paid-tier and no balance', async () => {
      try {
        await uut.getApiToken(10)
      } catch (err) {
        // console.log('err.response: ', err.response)

        assert.equal(err.response.status, 402)
        assert.include(err.response.data, 'Not enough credit')
      }
    })
  })

  describe('#validateApiToken', () => {
    it('should validate API Token', async () => {
      const result = await uut.validateApiToken()

      assert.property(result, 'isValid')
      assert.equal(result.isValid, true)

      assert.property(result, 'apiLevel')
      assert.equal(result.apiLevel, 10)
    })
  })

  describe('#updateCredit', () => {
    it('should check for balance', async () => {
      const result = await uut.updateCredit()
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.equal(result, 0)
    })
  })
})
