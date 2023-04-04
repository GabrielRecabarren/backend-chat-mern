import { Application, json, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import Logger from 'bunyan';
import { config } from '@configs/configEnvs';
import { logger } from '@configs/configLogs';
const log: Logger = logger.createLogger('server');

export class ChatServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    //Comportamientos del Server
    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
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
    private async startServer(app: Application): Promise<void> {
        try {
            const htttpServer: http.Server = new http.Server(app);
            this.startHttpServer(htttpServer);
        } catch (error) {
            log.error(error);
        }
    }
    //Hanilitar la escucha del servidor
    private startHttpServer(httpServer: http.Server): void {
        log.info(`Server has started with process ${process.pid}`);
        const PORT = Number(config.SERVER_PORT);
        httpServer.listen(PORT, () => {
            log.info(`server running at ${PORT}`);
        });
    }
}
