
const request = require('supertest');
const app = require('../..');
const { clearDatabase } = require('../../db.connection');

const req= request(app)

describe("user routes:",()=>{
    let mockUser
    beforeAll(()=>{
        mockUser={name:"Ali",email:"asd@asd.com",password:"1234"}
    })
    afterAll(async()=>{
      await  clearDatabase()
    })
    it("get req(/user): should get users=[]",async () => {
       let res=await req.get("/user")

       expect(res.status).toBe(200)
       expect(res.body.data).toHaveSize(0)
    })
    it("post req(/user/signup): should add user successfully",async()=>{
        
      let res= await req.post("/user/signup").send(mockUser)

      expect(res.status).toBe(201)
      expect(res.body.data.email).toEqual(mockUser.email)
      mockUser._id= res.body.data._id
    })
    it("post req(/user/login): should not login invalid user",async()=>{
        let res= await req.post("/user/login").send({email:mockUser.email,password:"xxx"})

        expect(res.status).toBe(401)
        expect(res.body.message).toContain("Invalid email or password")
    })
    it("post req(/user/login): should login user successfully",async () => {
        let res= await req.post("/user/login").send(mockUser)
        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
    })
    it("get req(/user/id): should get the just added user by id",async () => {
        let res= await req.get("/user/"+mockUser._id)
        expect(res.status).toBe(200)
        expect(res.body.data._id).toBe(mockUser._id)
    })
})