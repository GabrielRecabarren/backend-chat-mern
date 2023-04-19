import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import Logger from 'bunyan';
import { Server } from 'socket.io';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import HTTP_STATUS from 'http-status-codes';
const log: Logger = logger.createLogger('server');
import { IErrorResponse } from '@helpers/errors/errorResponse.interface';
import { CustomError } from '../shared/globals/helpers/errors/customError';


export class ChatServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    //Comportamientos del Server
    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }
    //Seguridad (cookies, helmet, hpp cors)
    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
                maxAge: 24 * 7 * 3600000, //24d días
                secure: config.NODE_ENV !== 'development'
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: config.CLIENT_URL, // '*': si quisiera habilitar mi server a cualquier cliente
                optionsSuccessStatus: 200,
                credentials: true, //para que las credenciales puedan propagarse con seguridad. Obligatorio en produccion.
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            })
        );
    }
    //Definiciones estandares del servidor
    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ extended: true, limit: '50mb' }));
    }
    private globalErrorHandler(app: Application): void {
        app.all('*', (req: Request, res: Response) => {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: ` ${req.originalUrl} not found` });
        });

        app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            log.error(error);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            next();
        });
    }
    private async startServer(app: Application): Promise<void> {
        try {
            const htttpServer: http.Server = new http.Server(app);
            const socketIO: Server = await this.createSocketIO(htttpServer);
            this.startHttpServer(htttpServer);
            this.socketIOConection(socketIO);
        } catch (error) {
            log.error(error);
        }
    }
    //Habilitar la escucha del servidor
    private startHttpServer(httpServer: http.Server): void {
        log.info(`Server has started with process ${process.pid}`);
        const PORT = Number(config.SERVER_PORT);
        httpServer.listen(PORT, () => {
            log.info(`server running at ${PORT}`);
        });
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer,{
            cors:{
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST' , 'PUT', 'DELETE', 'OPTIONS ']
            }
        });
        const pubClient = createClient({ url: config.REDIS_HOST});
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        return io;
    }

    private socketIOConection(io:Server){
        console.log(io);
        log.info('SocketIO Connections OK');
    }
}
