import { logger } from '../../utils/logger';

export interface AgentContext {
  userId: string;
  familyProfile?: any;
  tripPreferences?: any;
  budget?: number;
  dates?: {
    start: Date;
    end: Date;
  };
  destination?: string | undefined;
}

export interface AgentResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    source: string;
    confidence?: number;
  };
}

export abstract class BaseAgent {
  protected name: string;
  protected context: AgentContext;

  constructor(name: string, context: AgentContext) {
    this.name = name;
    this.context = context;
  }

  /**
   * Main execution method that all agents must implement
   */
  abstract execute(): Promise<AgentResult>;

  /**
   * Validate the agent context
   */
  protected validateContext(): boolean {
    if (!this.context.userId) {
      logger.error(`[${this.name}] Missing userId in context`);
      return false;
    }
    return true;
  }

  /**
   * Log agent execution
   */
  protected logExecution(action: string, details?: any): void {
    logger.info(`[${this.name}] ${action}`, {
      userId: this.context.userId,
      details,
    });
  }

  /**
   * Handle errors consistently across agents
   */
  protected handleError(error: Error, operation: string): AgentResult {
    logger.error(`[${this.name}] Error during ${operation}:`, error);
    return {
      success: false,
      error: error.message,
      metadata: {
        processingTime: 0,
        source: this.name,
      },
    };
  }

  /**
   * Create a successful result
   */
  protected createSuccessResult<T>(data: T, metadata?: any): AgentResult<T> {
    return {
      success: true,
      data,
      metadata: {
        processingTime: 0,
        source: this.name,
        ...metadata,
      },
    };
  }

  /**
   * Get agent status
   */
  public getStatus(): { name: string; context: AgentContext } {
    return {
      name: this.name,
      context: this.context,
    };
  }
}
