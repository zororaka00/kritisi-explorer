export class CorsUtils {
    isAllowedOrigin(event: any): boolean {
        const config = useRuntimeConfig();
        const allowedOrigins = config.nodeEnv === 'development' ? 'localhost' : 'explorer.kritisi.xyz';
        const origin = event.node.req.headers.origin || event.node.req.headers.host;
        return origin?.includes(allowedOrigins);
    }
}