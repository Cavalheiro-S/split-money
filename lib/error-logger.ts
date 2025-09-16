interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'ui' | 'api' | 'auth' | 'data' | 'network' | 'unknown';
}

interface ErrorLoggerConfig {
  enableConsoleLog: boolean;
  enableRemoteLogging: boolean;
  remoteEndpoint?: string;
  enableUserTracking: boolean;
  enableSessionTracking: boolean;
}

class ErrorLogger {
  private config: ErrorLoggerConfig;
  private sessionId: string;
  private userId?: string;

  constructor(config: ErrorLoggerConfig = {
    enableConsoleLog: true,
    enableRemoteLogging: false,
    enableUserTracking: false,
    enableSessionTracking: true,
  }) {
    this.config = config;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private createErrorLog(
    error: Error,
    errorInfo?: React.ErrorInfo,
    category: ErrorLog['category'] = 'unknown',
    severity: ErrorLog['severity'] = 'medium'
  ): ErrorLog {
    return {
      message: error.message,
      stack: error.stack || undefined,
      componentStack: errorInfo?.componentStack || undefined,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userId: this.config.enableUserTracking ? this.userId : undefined,
      sessionId: this.config.enableSessionTracking ? this.sessionId : undefined,
      severity,
      category,
    };
  }

  private logToConsole(errorLog: ErrorLog) {
    if (!this.config.enableConsoleLog) return;

    const logMethod = errorLog.severity === 'critical' ? 'error' : 'warn';
    
    console.group(`🚨 Error Logger - ${errorLog.severity.toUpperCase()}`);
    console[logMethod]('Message:', errorLog.message);
    console[logMethod]('Category:', errorLog.category);
    console[logMethod]('Timestamp:', errorLog.timestamp);
    console[logMethod]('URL:', errorLog.url);
    
    if (errorLog.stack) {
      console[logMethod]('Stack:', errorLog.stack);
    }
    
    if (errorLog.componentStack) {
      console[logMethod]('Component Stack:', errorLog.componentStack);
    }
    
    if (errorLog.userId) {
      console[logMethod]('User ID:', errorLog.userId);
    }
    
    console.groupEnd();
  }

  private async logToRemote(errorLog: ErrorLog) {
    if (!this.config.enableRemoteLogging || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (remoteError) {
      console.error('Failed to send error to remote logging service:', remoteError);
    }
  }

  async logError(
    error: Error,
    errorInfo?: React.ErrorInfo,
    category: ErrorLog['category'] = 'unknown',
    severity: ErrorLog['severity'] = 'medium'
  ) {
    const errorLog = this.createErrorLog(error, errorInfo, category, severity);
    
    this.logToConsole(errorLog);
    await this.logToRemote(errorLog);
  }

  // Métodos específicos para diferentes tipos de erro
  async logUIError(error: Error, errorInfo?: React.ErrorInfo) {
    await this.logError(error, errorInfo, 'ui', 'medium');
  }

  async logAPIError(error: Error, endpoint?: string) {
    const enhancedError = new Error(`${error.message}${endpoint ? ` (Endpoint: ${endpoint})` : ''}`);
    enhancedError.stack = error.stack;
    await this.logError(enhancedError, undefined, 'api', 'high');
  }

  async logAuthError(error: Error) {
    await this.logError(error, undefined, 'auth', 'high');
  }

  async logDataError(error: Error, operation?: string) {
    const enhancedError = new Error(`${error.message}${operation ? ` (Operation: ${operation})` : ''}`);
    enhancedError.stack = error.stack;
    await this.logError(enhancedError, undefined, 'data', 'high');
  }

  async logNetworkError(error: Error, url?: string) {
    const enhancedError = new Error(`${error.message}${url ? ` (URL: ${url})` : ''}`);
    enhancedError.stack = error.stack;
    await this.logError(enhancedError, undefined, 'network', 'medium');
  }

  async logCriticalError(error: Error, errorInfo?: React.ErrorInfo) {
    await this.logError(error, errorInfo, 'unknown', 'critical');
  }
}

// Instância singleton
export const errorLogger = new ErrorLogger({
  enableConsoleLog: process.env.NODE_ENV === 'development',
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  enableUserTracking: true,
  enableSessionTracking: true,
  // Configure seu endpoint de logging aqui
  // remoteEndpoint: 'https://your-logging-service.com/api/errors',
});

// Hook para usar em componentes React
export const useErrorLogger = () => {
  return {
    logUIError: errorLogger.logUIError.bind(errorLogger),
    logAPIError: errorLogger.logAPIError.bind(errorLogger),
    logAuthError: errorLogger.logAuthError.bind(errorLogger),
    logDataError: errorLogger.logDataError.bind(errorLogger),
    logNetworkError: errorLogger.logNetworkError.bind(errorLogger),
    logCriticalError: errorLogger.logCriticalError.bind(errorLogger),
    setUserId: errorLogger.setUserId.bind(errorLogger),
  };
};
