export class CorsUtils {
    isAllowedOrigin(event: any): boolean {
        const config = useRuntimeConfig();
        const allowedOrigins = config.nodeEnv === 'development' ? 'localhost' : 'explorer.kritisi.xyz';
        const url = getRequestURL(event);
        const origin = url.origin;
        return origin?.includes(allowedOrigins);
    }
}