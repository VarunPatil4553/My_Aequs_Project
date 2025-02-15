import {expect} from 'chai';
import mongoose from 'mongoose';
import Employee from '../src/Model/Employee';
import Task from '../src/Model/Task';
import app from '../src/index';
import  Request  from 'supertest';
import dotenv from 'dotenv';
dotenv.config();



describe('Admin',()=>{
    before((done)=>{
        mongoose.connect(process.env.MONGO_URI!).then(()=>{
            console.log('Connected to database');
            done();
        }    
        ).catch((err)=>{
            console.log(err);
        });
    });

    after((done)=>{
        mongoose.connection.close();
        done();
    });

    beforeEach((done)=>{
        Employee.deleteMany({}).then(()=>{
            console.log('Employee collection is empty');
        }).catch((err)=>{
            console.log(err);
        });
    });

    beforeEach((done)=>{
        Task.deleteMany({}).then(()=>{
            console.log('Task collection is empty');
        }).catch((err)=>{
            console.log(err);
        });
        done();
    });

    describe('GET /admin/profile/:id',()=>{
        it('admin login',(done)=>{
            Request(app).post('/admin/login').send({
                email:'admin@gmail.com',
                password:'admin'
            }).then((res)=>{
                expect(res.status).to.equal(200);
                done();
            }).catch((err)=>{
                console.log(err);
            });
        })
    });
});
  

