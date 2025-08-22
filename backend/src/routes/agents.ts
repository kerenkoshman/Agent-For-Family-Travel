import { Router, Request, Response } from 'express';
import { SmolAgent, TripPlanningRequest, AgentContext } from '../services/agents';
import { authenticateToken, requireAuth } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @route   POST /api/agents/plan-trip
 * @desc    Plan a complete family trip using SmolAgent
 * @access  Private
 */
router.post('/plan-trip', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || 'test-user-123';
    
    // Extract trip planning request from body
    const tripRequest: TripPlanningRequest = {
      userId,
      familyProfile: req.body.familyProfile,
      tripPreferences: {
        destination: req.body.destination,
        budget: req.body.budget || 5000,
        dates: {
          start: new Date(req.body.startDate),
          end: new Date(req.body.endDate),
        },
        tripType: req.body.tripType || 'family',
        accommodationType: req.body.accommodationType || 'hotel',
        transportation: req.body.transportation || 'flight',
      },
      constraints: req.body.constraints,
    };

    logger.info('Trip planning request received', {
      userId,
      destination: tripRequest.tripPreferences.destination,
      budget: tripRequest.tripPreferences.budget,
    });

    // Create agent context
    const context: AgentContext = {
      userId,
      familyProfile: tripRequest.familyProfile,
      tripPreferences: tripRequest.tripPreferences,
      budget: tripRequest.tripPreferences.budget,
      dates: tripRequest.tripPreferences.dates,
      destination: tripRequest.tripPreferences.destination || undefined,
    };

    // Create and execute SmolAgent
    const smolAgent = new SmolAgent(context);
    const result = await smolAgent.execute();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: 'Trip planning failed',
      });
    }

    logger.info('Trip planning completed successfully', {
      userId,
      totalCost: result.data?.summary.totalCost,
      destination: result.data?.summary.destination,
    });

    res.json({
      success: true,
      data: result.data,
      message: 'Trip planned successfully',
    });

  } catch (error) {
    logger.error('Error in trip planning:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while planning the trip',
    });
  }
});

/**
 * @route   GET /api/agents/status
 * @desc    Get agent status and progress
 * @access  Private
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const userId = (req.query as any)['userId'] || 'test-user-123';
    
    // Create a sample context for status check
    const context: AgentContext = {
      userId,
    };

    const smolAgent = new SmolAgent(context);
    const progress = smolAgent.getProgress();

    res.json({
      success: true,
      data: {
        overall: progress.overall,
        agents: progress.agents,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error('Error getting agent status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while getting agent status',
    });
  }
});

/**
 * @route   POST /api/agents/test
 * @desc    Test individual agents
 * @access  Private
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || 'test-user-123';
    const { agentType } = req.body;

    const context: AgentContext = {
      userId,
      budget: 5000,
      dates: {
        start: new Date('2024-06-15'),
        end: new Date('2024-06-22'),
      },
      destination: 'Walt Disney World Resort, Orlando',
    };

    let result;
    let agentName;

    switch (agentType) {
      case 'planner':
        const { PlannerAgent } = await import('../services/agents');
        const plannerAgent = new PlannerAgent(context);
        result = await plannerAgent.execute();
        agentName = 'Planner Agent';
        break;

      case 'booking':
        const { BookingAgent } = await import('../services/agents');
        const bookingAgent = new BookingAgent(context);
        result = await bookingAgent.execute();
        agentName = 'Booking Agent';
        break;

      case 'scheduler':
        const { SchedulerAgent } = await import('../services/agents');
        const schedulerAgent = new SchedulerAgent(context);
        result = await schedulerAgent.execute();
        agentName = 'Scheduler Agent';
        break;

      case 'ui':
        const { UIAgent } = await import('../services/agents');
        const uiAgent = new UIAgent(context);
        result = await uiAgent.execute();
        agentName = 'UI Agent';
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid agent type',
          message: 'Supported agent types: planner, booking, scheduler, ui',
        });
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: `${agentName} test failed`,
      });
    }

    logger.info(`${agentName} test completed successfully`, {
      userId,
      agentType,
      processingTime: result.metadata?.processingTime,
    });

    res.json({
      success: true,
      data: result.data,
      message: `${agentName} test completed successfully`,
    });

  } catch (error) {
    logger.error('Error testing agent:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred while testing the agent',
    });
  }
});

export { router as agentsRouter };
