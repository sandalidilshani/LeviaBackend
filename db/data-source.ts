import { DataSource, DataSourceOptions } from "typeorm";
import { config } from 'dotenv';
import { Plazeruser } from "src/plazeruser/entities/plazeruser.entity";
import { LeaveRequest } from "src/leaverequest/entities/leaverequest.entity";
import { Leavetype } from "src/leavetype/entities/leavetype.entity";
import { UserLeave } from "src/userleave/entities/userleave.entity";

config();

const localDataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [Plazeruser, LeaveRequest, Leavetype, UserLeave],
    subscribers: [],
    migrations: [],
};

const neonDataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.NEON_DB_HOST,
    port: Number(process.env.NEON_DB_PORT),
    username: process.env.NEON_DB_USERNAME,
    password: process.env.NEON_DB_PASSWORD,
    database: process.env.NEON_DB_DATABASE,
    synchronize: true,
    logging: true,
    ssl:true,
    entities: [Plazeruser, LeaveRequest, Leavetype, UserLeave],
    subscribers: [],
    migrations: [],
};

const localDataSource = new DataSource(localDataSourceOptions);
const neonDataSource = new DataSource(neonDataSourceOptions);

export { localDataSource, neonDataSource };
