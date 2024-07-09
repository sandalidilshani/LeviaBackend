import { DataSource, DataSourceOptions } from "typeorm";
import {config} from 'dotenv';
import { Plazeruser } from "src/plazeruser/entities/plazeruser.entity";
import { LeaveRequest } from "src/leaverequest/entities/leaverequest.entity";
import { Leavetype } from "src/leavetype/entities/leavetype.entity";
import { UserLeave } from "src/userleave/entities/userleave.entity";

config()
export const dataSourceOptions:DataSourceOptions={
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Plazeruser,LeaveRequest,Leavetype,UserLeave],
    subscribers: [],
    migrations: [],
    
}
const dataSource=new DataSource(dataSourceOptions)

export default dataSource;
